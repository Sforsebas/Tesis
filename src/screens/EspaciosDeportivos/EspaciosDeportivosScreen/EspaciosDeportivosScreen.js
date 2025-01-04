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
  const { navigation, route } = props;
  const [currentUser, setCurrentUser] = useState(null);
  const [espaciosdeportivos, setEspaciosDeportivos] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Limpieza del listener
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "Espacio_Deportivo"),
      orderBy("createAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEspaciosDeportivos(snapshot.docs);
    });

    return () => unsubscribe(); // Limpieza del snapshot
  }, []);

  // Manejar el toastMessage si existe
  useEffect(() => {
    if (route.params?.toastMessage) {
      Toast.show({
        type: "success",
        position: "bottom",
        text1: route.params.toastMessage,
      });

      // Limpiar el mensaje después de mostrarlo
      navigation.setParams({ toastMessage: null });
    }
  }, [route.params?.toastMessage]);

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

      {/* Componente Toast */}
      <Toast />
    </View>
  );
}
