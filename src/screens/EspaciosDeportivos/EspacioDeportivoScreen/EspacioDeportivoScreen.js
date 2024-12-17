import React, { useState, useEffect } from "react";
import { ScrollView, Dimensions } from "react-native";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Carousel, Loading, Map } from "../../../components/Shared";
import { Header, Info, BtnAgendar } from "../../../components/EspacioDeportivo";
import { db } from "../../../utils";
import { styles } from "./EspacioDeportivoScreen.styles";

const { width } = Dimensions.get("window");

export function EspacioDeportivoScreen(props) {
  const { route } = props;

  const [espaciodeportivo, setEspacioDeportivo] = useState(null);

  useEffect(() => {
    setEspacioDeportivo(null);
    onSnapshot(doc(db, "espaciosdeportivos", route.params.id), (doc) => {
      setEspacioDeportivo(doc.data());
    });
  }, [route.params.id]);

  if (!espaciodeportivo)
    return <Loading show text="Cargando Espacio Deportivo" />;

  return (
    <ScrollView style={styles.content}>
      <Carousel
        arrayImages={espaciodeportivo.images}
        height={250}
        width={width}
      />
      <Header espaciodeportivo={espaciodeportivo} />
      <Info espaciodeportivo={espaciodeportivo} />
      <BtnAgendar idEspacioDeportivo={espaciodeportivo.id} />
    </ScrollView>
  );
}
