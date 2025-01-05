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

// Función para obtener la fecha y hora combinada de la reserva
const obtenerFechaYHora = (fechaReserva, horaReserva) => {
  const fechaReservaMillis = fechaReserva.seconds * 1000;
  const fecha = new Date(fechaReservaMillis);
  const [hora, minuto] = horaReserva.split(":").map((item) => parseInt(item));

  fecha.setHours(hora, minuto, 0, 0);

  return fecha;
};

// Función para verificar si una reserva no ha pasado más de 15 minutos del día actual.
const esReservaValida = (fechaReserva, horaReserva) => {
  const fechaYHoraReserva = obtenerFechaYHora(fechaReserva, horaReserva);
  const tiempoActual = Date.now();
  const tiempoTranscurrido = tiempoActual - fechaYHoraReserva.getTime();
  return tiempoTranscurrido <= 15 * 60 * 1000; // 15 minutos en milisegundos
};

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

    // Solo obtener reservas del usuario actual
    const q = query(collection(db, "Reserva"), orderBy("createAt", "desc"));

    // Función para actualizar las reservas
    const obtenerReservas = () => {
      onSnapshot(q, (snapshot) => {
        const reservasData = snapshot.docs.filter((doc) => {
          const reserva = doc.data();

          return (
            reserva.idUsuario === currentUser.uid &&
            esReservaValida(reserva.date, reserva.time)
          );
        });

        setReservas(reservasData);
      });
    };

    obtenerReservas();

    //Funcion para actualizar la página cada 1 minuto
    const intervalId = setInterval(obtenerReservas, 60000); // 60000ms = 1 minuto

    return () => clearInterval(intervalId);
  }, [currentUser]);

  // Función para eliminar la reserva
  const eliminarReserva = async (id) => {
    try {
      const reservaRef = doc(db, "Reserva", id);
      await deleteDoc(reservaRef);

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
