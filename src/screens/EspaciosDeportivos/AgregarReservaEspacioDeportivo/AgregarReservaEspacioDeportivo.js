import React from "react";
import { View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";
import {
  initialValues,
  validationSchema,
} from "./AgregarReservaEspacioDeportivo.data";
import { styles } from "./AgregarReservaEspacioDeportivo.styles";
import { DatePickerComponent } from "../../../components/Shared";

export function AgregarReservaEspacioDeportivo(props) {
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        //REVISAR CURSO YA QUE ÉSTA PARTE SON LOS DATOS QUE TENDRÁ EL FORMULARIO
        const auth = getAuth();
        const idDoc = uuid();
        const newData = formValue;
        newData.id = idDoc;
        newData.idEspacioDeportivo = params.idEspacioDeportivo;
        newData.idUser = auth.currentUser.uid;
        //REVISAR CURSO YA QUE ÉSTA PARTE SON LOS DATOS QUE TENDRÁ EL FORMULARIO
      } catch (error) {
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
