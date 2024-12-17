import React, { useState } from "react";
import { View } from "react-native";
import { Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangePasswordForm.data";
import { styles } from "./ChangePasswordForm.styles";

export function ChangePasswordForm(props) {
  const { onClose } = props;

  const [showPasswordOld, setshowPasswordOld] = useState(false);
  const [showPasswordNew, setshowPasswordNew] = useState(false);
  const [showPasswordNewR, setshowPasswordNewR] = useState(false);

  const onshowPasswordOld = () => setshowPasswordOld((prevState) => !prevState);
  const onshowPasswordNew = () => setshowPasswordNew((prevState) => !prevState);
  const onshowPasswordNewR = () =>
    setshowPasswordNewR((prevState) => !prevState);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const currentUser = getAuth().currentUser;

        const credentials = EmailAuthProvider.credential(
          currentUser.email,
          formValue.password
        );
        reauthenticateWithCredential(currentUser, credentials);

        await updatePassword(currentUser, formValue.newPassword);

        onClose();
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar la contraseña",
        });
      }
    },
  });

  return (
    <View style={styles.content}>
      <Input
        placeholder="Contraseña Actual"
        containerStyle={styles.input}
        secureTextEntry={showPasswordOld ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPasswordOld ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: onshowPasswordOld,
        }}
        onChangeText={(text) => formik.setFieldValue("password", text)}
        errorMessage={formik.errors.password}
      />
      <Input
        placeholder="Nueva Contraseña"
        containerStyle={styles.input}
        secureTextEntry={showPasswordNew ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPasswordNew ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: onshowPasswordNew,
        }}
        onChangeText={(text) => formik.setFieldValue("newPassword", text)}
        errorMessage={formik.errors.newPassword}
      />
      <Input
        placeholder="Repita Nueva Contraseña"
        containerStyle={styles.input}
        secureTextEntry={showPasswordNewR ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPasswordNewR ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: onshowPasswordNewR,
        }}
        onChangeText={(text) =>
          formik.setFieldValue("confirmNewPassword", text)
        }
        errorMessage={formik.errors.confirmNewPassword}
      />
      <Button
        title="Cambiar Contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}
