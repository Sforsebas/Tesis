import React from "react";
import { View } from "react-native";
import { Text, Rating } from "react-native-elements";
import { styles } from "./Header.styles";

export function Header(props) {
  const { espaciodeportivo } = props;

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <Text style={styles.name}>{espaciodeportivo.name}</Text>
      </View>
      <Text style={styles.description}>{espaciodeportivo.description}</Text>
    </View>
  );
}
