import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Alert } from "react-native";
import { Text } from "react-native-elements";
import Toast from "react-native-toast-message"; // Importar Toast
import { useNavigation } from "@react-navigation/native";
import { screen, db } from "../../../utils";
import { styles } from "./ListaReservas.styles";
import { doc, deleteDoc, getDocs, collection } from "firebase/firestore";

export function ListaReservas(props) {
  const { reservas } = props;
  const navigation = useNavigation();
  const [espacios, setEspacios] = useState({}); // Guardaremos los espacios deportivos por ID

  // Función para obtener los nombres de todos los espacios deportivos
  const obtenerEspacios = async () => {
    try {
      const espaciosSnapshot = await getDocs(
        collection(db, "Espacio_Deportivo")
      );
      const espaciosData = {};
      espaciosSnapshot.forEach((doc) => {
        espaciosData[doc.id] = doc.data().name; // Guardamos el nombre del espacio
      });
      setEspacios(espaciosData); // Actualizamos el estado con los nombres de los espacios
    } catch (error) {
      console.error("Error al obtener los espacios deportivos:", error);
    }
  };

  // Cargar los nombres de los espacios deportivos cuando se monta el componente
  useEffect(() => {
    obtenerEspacios();
  }, []);

  const irAReservas = (reservas) => {
    navigation.navigate(screen.reservas.reservas, {
      id: reservas.id,
    });
  };

  const eliminarReserva = (reservaId) => {
    Alert.alert(
      "Eliminar Reserva",
      "¿Estás seguro de que deseas eliminar esta reserva?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => eliminarReservaDeBaseDeDatos(reservaId),
        },
      ],
      { cancelable: true }
    );
  };

  const eliminarReservaDeBaseDeDatos = async (reservaId) => {
    try {
      const reservaRef = doc(db, "Reserva", reservaId);
      await deleteDoc(reservaRef);

      // Mostrar Toast de confirmación
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Reserva eliminada",
        text2: "La reserva ha sido eliminada correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
    }
  };

  return (
    <>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const reserva = item.data ? item.data() : {};
          const espacioId = reserva.idEspacioDeportivo;

          return (
            <TouchableOpacity onPress={() => irAReservas(item)}>
              <View style={styles.reservas}>
                <View>
                  <Text style={styles.name}>
                    {espacios[espacioId]
                      ? `${espacios[espacioId]}`
                      : "Cargando espacio..."}
                  </Text>
                  <Text style={styles.info}>
                    {`Pertenencias: ${
                      reserva.description || "No registra pertenencias"
                    }`}
                  </Text>

                  <Text style={styles.info}>
                    {reserva.date
                      ? reserva.date.toDate().toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Fecha no disponible"}
                  </Text>
                  <Text style={styles.info}>
                    {reserva.time || "Hora no disponible"}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => eliminarReserva(item.id)}>
                  <View style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {/* Componente Toast */}
      <Toast />
    </>
  );
}
