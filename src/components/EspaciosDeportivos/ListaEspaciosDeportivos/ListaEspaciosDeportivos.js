import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { styles } from "./ListaEspaciosDeportivos.styles";

export function ListaEspaciosDeportivos(props) {
  const { espaciosdeportivos } = props;
  const navigation = useNavigation();

  const irAlEspacioDeportivo = (espaciosdeportivos) => {
    navigation.navigate(screen.espaciosdeportivos.espaciodeportivo, {
      id: espaciosdeportivos.id,
    });
  };

  return (
    <FlatList
      data={espaciosdeportivos}
      renderItem={(doc) => {
        const espaciosdeportivos = doc.item.data();

        return (
          <TouchableOpacity
            onPress={() => irAlEspacioDeportivo(espaciosdeportivos)}
          >
            <View style={styles.espaciosdeportivos}>
              <Image
                source={{ uri: espaciosdeportivos.images[0] }}
                style={styles.image}
              />
              <View>
                <Text style={styles.name}>{espaciosdeportivos.name}</Text>
                <Text style={styles.info}>{espaciosdeportivos.address}</Text>
                <Text style={styles.info}>
                  {espaciosdeportivos.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
