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
        // Confirmación antes de proceder con la reserva
        Alert.alert(
          "Confirmar Reserva",
          "¿Estás seguro de que deseas agendar esta reserva?",
          [
            {
              text: "Cancelar",
              style: "cancel", // Si el usuario presiona "Cancelar", no hace nada
            },
            {
              text: "Confirmar",
              onPress: async () => {
                // Si el usuario confirma, entonces proceder con la reserva
                const auth = getAuth();
                const idDoc = uuid();
                const newData = formValue;
                newData.id = idDoc;
                newData.idEspacioDeportivo = route.params.idEspacioDeportivo;
                newData.idUser = auth.currentUser.uid;
                newData.createAt = new Date();

                // Crear la reserva en la base de datos
                await setDoc(doc(db, "Reserva", idDoc), newData);
                Toast.show({
                  type: "success",
                  position: "bottom",
                  text1: "Reserva agendada con éxito",
                });
                navigation.navigate(
                  screen.espaciosdeportivos.espaciosdeportivos
                );
              },
              style: "destructive", // Usamos un estilo destructivo para resaltar la acción
            },
          ],
          { cancelable: true } // Permite cerrar la alerta si el usuario toca fuera de ella
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
          onDateChange={(selectedDate) =>
            formik.setFieldValue("date", selectedDate)
          }
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
