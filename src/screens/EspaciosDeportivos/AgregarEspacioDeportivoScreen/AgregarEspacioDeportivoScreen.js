import React from "react";
import { ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { useFormik } from "formik";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import {
  InfoForm,
  UploadImagesForm,
  ImageEspacioDeportivo,
} from "../../../components/EspaciosDeportivos/AgregarEspaciosDeportivos";
import { db } from "../../../utils";
import {
  initialValues,
  validationSchema,
} from "./AgregarEspacioDeportivoScreen.data";
import { styles } from "./AgregarEspacioDeportivotScreen.styles";

export function AgregarEspacioDeportivoScreen() {
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const newData = formValue;
        newData.id = uuid();
        newData.createAt = new Date();

        const myDB = doc(db, "espaciosdeportivos", newData.id);
        await setDoc(myDB, newData);

        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageEspacioDeportivo formik={formik} />

      <InfoForm formik={formik} />

      <UploadImagesForm formik={formik} />

      <Button
        title="Crear Espacio Deportivo"
        buttonStyle={styles.agregarEspaciosDeportivos}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </ScrollView>
  );
}
