import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, screen } from "../../../utils";
import {
  initialValues,
  validationSchema,
} from "./AgregarReservaEspacioDeportivo.data";
import { styles } from "./AgregarReservaEspacioDeportivo.styles";
import { DatePickerComponent } from "../../../components/Shared";

export function AgregarReservaEspacioDeportivo(props) {
  const { route } = props;
  const navigation = useNavigation();

  const [message, setMessage] = useState(""); // Estado para manejar el mensaje

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const selectedDate = new Date(formValue.date);
        const dayOfWeek = selectedDate.getDay();

        // Validación para evitar reservas en sábado o domingo
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setMessage("No se pueden agendar reservas en sábado o domingo.");
          return;
        }

        // Verificar si el usuario ya tiene una reserva para el mismo espacio y el mismo día
        const spaceReservationQuery = query(
          collection(db, "Reserva"),
          where("idUsuario", "==", getAuth().currentUser.uid), // Filtrar por usuario
          where("idEspacioDeportivo", "==", route.params.idEspacioDeportivo), // Filtrar por espacio deportivo
          where("date", "==", formValue.date) // Verificar que sea el mismo día
        );

        const spaceQuerySnapshot = await getDocs(spaceReservationQuery);

        if (!spaceQuerySnapshot.empty) {
          setMessage(
            "Ya has realizado una reserva para este espacio deportivo en esta fecha."
          );
          return;
        }

        // Confirmación antes de proceder con la reserva
        Alert.alert(
          "Confirmar Reserva",
          "¿Estás seguro de que deseas agendar esta reserva?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Confirmar",
              onPress: async () => {
                const auth = getAuth();
                const userId = auth.currentUser ? auth.currentUser.uid : null;

                if (!userId) {
                  setMessage("Usuario no autenticado.");
                  return;
                }

                // Crear un nuevo objeto para la reserva
                const newData = {
                  ...formValue,
                  idEspacioDeportivo: route.params.idEspacioDeportivo,
                  idUsuario: userId, // Asignar directamente el UID del usuario autenticado
                  createAt: new Date(), // Fecha de creación
                };

                // Guardar la reserva en la colección "Reserva"
                const reservaRef = doc(
                  db,
                  "Reserva",
                  `${userId}-${Date.now()}`
                ); // ID único basado en UID y timestamp
                await setDoc(reservaRef, newData);

                // Navegar y pasar el mensaje de éxito
                navigation.navigate(
                  screen.espaciosdeportivos.espaciosdeportivos,
                  {
                    toastMessage: "Reserva agendada con éxito",
                  }
                );
              },
              style: "destructive",
            },
          ],
          { cancelable: true }
        );
      } catch (error) {
        console.error("Error al agendar reserva:", error);
        setMessage("Error al enviar la reserva.");
      }
    },
  });

  return (
    <View style={styles.content}>
      {/* Campo de descripción */}
      <Input
        placeholder="Ingrese una breve descripción de sus pertenencias"
        multiline
        inputContainerStyle={styles.descripcion}
        onChangeText={(text) => formik.setFieldValue("description", text)}
        errorMessage={formik.errors.description}
      />

      {/* Selectores de fecha y hora */}
      <View>
        <DatePickerComponent
          onDateChange={(selectedDate) => {
            const dayOfWeek = selectedDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
              // Mostrar error si es sábado o domingo
              setMessage("No se pueden agendar reservas en sábado o domingo.");
            } else {
              formik.setFieldValue("date", selectedDate);
            }
          }}
          onTimeChange={(selectedTime) =>
            formik.setFieldValue("time", selectedTime)
          }
        />
        {/* Mensajes de error */}
        {formik.errors.date && (
          <Text style={{ color: "red", marginTop: 5 }}>
            {formik.errors.date}
          </Text>
        )}
        {formik.errors.time && (
          <Text style={{ color: "red", marginTop: 5 }}>
            {formik.errors.time}
          </Text>
        )}
      </View>

      {/* Mostrar mensaje de error o éxito */}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {/* Botón de envío */}
      <View>
        <Button
          title="Enviar Reserva"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
        />
      </View>
    </View>
  );
}
