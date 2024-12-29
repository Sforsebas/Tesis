import React from "react";
import { View, Text, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const selectedDate = new Date(formValue.date);
        const dayOfWeek = selectedDate.getDay();

        // Validación adicional para evitar sábados y domingos
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "No se pueden agendar reservas en sábado o domingo.",
          });
          return; // No permite continuar con la reserva
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
                const idDoc = uuid();
                const newData = formValue;
                newData.id = idDoc;
                newData.idEspacioDeportivo = route.params.idEspacioDeportivo;
                newData.idUser = auth.currentUser.uid;
                newData.createAt = new Date();

                await setDoc(doc(db, "Reserva", idDoc), newData);
                // Pasamos el mensaje a la pantalla de Espacios Deportivos
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
        console.log(error);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al enviar Reserva",
        });
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
              Toast.show({
                type: "error",
                position: "bottom",
                text1: "No se pueden agendar reservas en sábado o domingo.",
              });
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
