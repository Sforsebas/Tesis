import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { LoadingModal } from "../../../components/Shared";
import { ListaEspaciosDeportivos } from "../../../components/EspaciosDeportivos";
import { screen, db } from "../../../utils";
import { styles } from "./EspaciosDeportivosScreen.styles";
import Toast from "react-native-toast-message";

export function EspaciosDeportivosScreen(props) {
  const { navigation, route } = props;
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // Estado para el rol del usuario
  const [espaciosdeportivos, setEspaciosDeportivos] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Obtener el rol del usuario
        const userRef = doc(db, "Usuario", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().rol); // Asignar el rol al estado
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
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

      {currentUser &&
        role !== "usuario" && ( // Solo mostrar el botón si no es usuario
          <Icon
            reverse
            type="material-community"
            name="plus"
            color="#014898"
            containerStyle={styles.btnContainer}
            onPress={goToAgregarEspacioDeportivo}
          />
        )}

      <Toast />
    </View>
  );
}
