import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Button, Icon } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";
import { InfoUser, OpcionesDeCuenta } from "../../../components/Cuenta";
import { LoadingModal } from "../../../components";
import { styles } from "./UserLoggedScreen.styles";

export function UserLoggedScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [_, setReload] = useState(false);

  const onReload = () => setReload((prevState) => !prevState);

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const confirmLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: logout,
          style: "destructive",
        },
      ],
      { cancelable: false } // Evita que la alerta se cierre tocando fuera de ella
    );
  };

  return (
    <View>
      <InfoUser setLoading={setLoading} setLoadingText={setLoadingText} />

      <OpcionesDeCuenta onReload={onReload} />

      <Button
        title="Cerrar Sesión"
        buttonStyle={styles.btnStyles}
        titleStyle={styles.btnTextStyle}
        onPress={confirmLogout}
        icon={
          <Icon
            name="power"
            type="material-community"
            color="#fff"
            style={{ marginRight: 10 }}
          />
        }
      />

      <LoadingModal show={loading} text={loadingText} />
    </View>
  );
}
