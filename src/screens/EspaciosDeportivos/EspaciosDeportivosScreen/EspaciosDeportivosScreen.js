import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { LoadingModal } from "../../../components/Shared";
import { ListaEspaciosDeportivos } from "../../../components/EspaciosDeportivos";
import { screen, db } from "../../../utils";
import { styles } from "./EspaciosDeportivosScreen.styles";

export function EspaciosDeportivosScreen(props) {
  const { navigation } = props;
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
