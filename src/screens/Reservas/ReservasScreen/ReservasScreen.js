import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { LoadingModal } from "../../../components/Shared";
import { ListaReservas } from "../../../components/Reservas";
import { screen, db } from "../../../utils";
import { styles } from "./ReservasScreen.styles";

export function ReservasScreen(props) {
  const { navigation } = props;
  const [currentUser, setCurrentUser] = useState(null);
  const [reservas, setReservas] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    console.log("Usuario autenticado:", currentUser.uid); // Depuración: ver el uid del usuario

    // Solo obtener reservas del usuario actual
    const q = query(collection(db, "Reserva"), orderBy("createAt", "desc"));

    onSnapshot(q, (snapshot) => {
      console.log("Datos de reserva:", snapshot.docs); // Depuración: ver todas las reservas

      const reservasData = snapshot.docs.filter((doc) => {
        const reserva = doc.data();
        console.log("Comprobando reserva:", reserva); // Depuración: ver cada reserva
        return reserva.idUsuario === currentUser.uid; // Filtrar solo por idUsuario
      });

      console.log("Reservas filtradas:", reservasData); // Depuración: ver las reservas filtradas
      setReservas(reservasData);
    });
  }, [currentUser]);

  // Función para eliminar la reserva
  const eliminarReserva = async (id) => {
    try {
      // Eliminar el documento de la reserva en Firestore
      const reservaRef = doc(db, "Reserva", id);
      await deleteDoc(reservaRef);

      // Mostrar mensaje de éxito
      Alert.alert(
        "Reserva eliminada",
        "La reserva ha sido eliminada de la base de datos."
      );
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      Alert.alert("Error", "Hubo un problema al eliminar la reserva.");
    }
  };

  return (
    <View style={styles.content}>
      {!reservas ? (
        <LoadingModal show text="Cargando" />
      ) : (
        <ListaReservas
          reservas={reservas}
          onEliminarReserva={eliminarReserva}
        />
      )}
    </View>
  );
}
