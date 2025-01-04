import React, { useState } from "react";
import { View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { useFormik } from "formik";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { db, screen } from "../../../utils";
import { initialValues, validationSchema } from "./RegisterForm.data";
import { styles } from "./RegisterForm.styles";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        // Crear el usuario en Firebase Authentication
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password
        );

        // Obtener el UID del usuario
        const uid = userCredential.user.uid;

        // Excluir los campos password y repeatPassword del objeto formValue
        const { password, repeatPassword, email, ...userData } = formValue;

        // Guardar los datos del usuario en Firestore, utilizando el UID como ID del documento
        const newData = {
          ...userData,
          idUser: uid, // Asociar el UID como referencia
        };

        await setDoc(doc(db, "Usuario", uid), newData);

        // Mostrar un mensaje de éxito
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Usuario registrado con éxito",
        });

        // Redirigir al usuario a la pantalla de cuenta
        navigation.navigate(screen.cuenta.cuenta);
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al registrarse, inténtelo más tarde",
        });
      }
    },
  });

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  const toggleRepeatPasswordVisibility = () =>
    setShowRepeatPassword((prevState) => !prevState);

  return (
    <View style={styles.content}>
      {/* Campos adicionales */}
      <Input
        placeholder="Nombre completo"
        containerStyle={styles.input}
        rightIcon={<Icon type="material-community" name="account" />}
        onChangeText={(text) => formik.setFieldValue("nombre", text)}
        errorMessage={formik.errors.nombre}
      />
      <Input
        placeholder="RUT (12.345.678-9)"
        containerStyle={styles.input}
        rightIcon={
          <Icon type="material-community" name="card-account-details" />
        }
        onChangeText={(text) => formik.setFieldValue("rut", text)}
        errorMessage={formik.errors.rut}
      />
      <Input
        placeholder="Carrera"
        containerStyle={styles.input}
        rightIcon={<Icon type="material-community" name="school" />}
        onChangeText={(text) => formik.setFieldValue("carrera", text)}
        errorMessage={formik.errors.carrera}
      />
      <Input
        placeholder="Género (Masculino/Femenino/Otro)"
        containerStyle={styles.input}
        rightIcon={<Icon type="material-community" name="gender-male-female" />}
        onChangeText={(text) => formik.setFieldValue("genero", text)}
        errorMessage={formik.errors.genero}
      />
      <Input
        placeholder="Año de Ingreso"
        containerStyle={styles.input}
        keyboardType="numeric"
        rightIcon={<Icon type="material-community" name="calendar" />}
        onChangeText={(text) => formik.setFieldValue("anoingreso", text)}
        errorMessage={formik.errors.anoingreso}
      />

      {/* Campos de correo y contraseña */}
      <Input
        placeholder="Correo Electrónico"
        containerStyle={styles.input}
        rightIcon={<Icon type="material-community" name="at" />}
        onChangeText={(text) => formik.setFieldValue("email", text)}
        errorMessage={formik.errors.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            onPress={togglePasswordVisibility}
          />
        }
        onChangeText={(text) => formik.setFieldValue("password", text)}
        errorMessage={formik.errors.password}
      />
      <Input
        placeholder="Repetir Contraseña"
        containerStyle={styles.input}
        secureTextEntry={!showRepeatPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
            onPress={toggleRepeatPasswordVisibility}
          />
        }
        onChangeText={(text) => formik.setFieldValue("repeatPassword", text)}
        errorMessage={formik.errors.repeatPassword}
      />

      {/* Botón de registro */}
      <Button
        title="Registrar"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}
