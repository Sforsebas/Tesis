import React, { useState } from "react";
import { View } from "react-native";
import { Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import {
  initialValues,
  validationSchema,
} from "./AgregarReservaEspacioDeportivo.data";
import { DatePicker } from "../../../components/Shared"; // Importa tu nuevo componente
import { styles } from "./AgregarReservaEspacioDeportivo.styles";

export function AgregarReservaEspacioDeportivo() {
  const [date, setDate] = useState(new Date());

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      console.log({ ...formValue, date });
    },
  });

  return (
    <View style={styles.content}>
      <View>
        <Input
          placeholder="Ingrese descripción de sus pertenencias"
          multiline
          inputContainerStyle={styles.descripcion}
          onChangeText={(text) => formik.setFieldValue("description", text)}
          errorMessage={formik.errors.description}
        />
        <DatePicker />
        {/* Usa el calendario */}
      </View>
      <Button
        title="Enviar Reserva"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}
