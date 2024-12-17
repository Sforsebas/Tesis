import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { styles } from "./BtnAgendar.styles";

export function BtnAgendar(props) {
  const { idEspacioDeportivo } = props;

  const [hasLogged, setHasLogged] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });
  }, []);

  const goToLogin = () => {
    navigation.navigate(screen.cuenta.tab, {
      screen: screen.cuenta.login,
    });
  };

  const goToReserva = () => {
    navigation.navigate(
      screen.espaciosdeportivos.agregarReservaEspacioDeportivo,
      {
        idEspacioDeportivo,
      }
    );
  };

  return (
    <View style={styles.content}>
      {hasLogged ? (
        <Button
          title="Reserva un horario"
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#fff",
          }}
          buttonStyle={{
            backgroundColor: "#014898",
          }}
          onPress={goToReserva}
        />
      ) : (
        <Text style={styles.text} onPress={goToLogin}>
          Para reservar es necesario estar logeado{" "}
          <Text style={styles.textClick}>pulsa AQUÍ para iniciar sesión</Text>
        </Text>
      )}
    </View>
  );
}
