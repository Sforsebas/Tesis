import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { LoadingModal } from "../../../components/Shared";
import { ListaEspaciosDeportivos } from "../../../components/EspaciosDeportivos";
import { screen, db } from "../../../utils";
import { styles } from "./EspaciosDeportivosScreen.styles";
import Toast from "react-native-toast-message";

export function EspaciosDeportivosScreen(props) {
  const { navigation, route } = props; // Obtener props incluyendo route
  const [currentUser, setCurrentUser] = useState(null);
  const [espaciosdeportivos, setEspaciosDeportivos] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "Espacio_Deportivo"),
      orderBy("createAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      setEspaciosDeportivos(snapshot.docs);
    });
  }, []);

  useEffect(() => {
    // Verificar si hay un mensaje de Toast en la ruta de parámetros
    if (route.params?.toastMessage) {
      Toast.show({
        type: "success",
        position: "bottom",
        text1: route.params.toastMessage, // Mostrar mensaje pasado desde otra pantalla
      });
    }
  }, [route.params?.toastMessage]); // Ejecutar este efecto cada vez que el parámetro cambie

  const goToAgregarEspacioDeportivo = () => {
    navigation.navigate(screen.espaciosdeportivos.tab, {
      screen: screen.espaciosdeportivos.agregarEspacioDeportivo,
    });
  };

  return (
    <View style={styles.content}>
      {!espaciosdeportivos ? (
        <LoadingModal show text="Cargando" />
      ) : (
        <ListaEspaciosDeportivos espaciosdeportivos={espaciosdeportivos} />
      )}

      {currentUser && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#014898"
          containerStyle={styles.btnContainer}
          onPress={goToAgregarEspacioDeportivo}
        />
      )}
    </View>
  );
}
