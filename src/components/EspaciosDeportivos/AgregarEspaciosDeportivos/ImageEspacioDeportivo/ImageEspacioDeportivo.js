import React from "react";
import { View } from "react-native";
import { Image } from "react-native-elements";
import { styles } from "./ImageEspacioDeportivo.styles";

export function ImageEspacioDeportivo(props) {
  const { formik } = props;

  const primaryImage = formik.values.images[0];

  return (
    <View style={styles.content}>
      <Image
        source={
          primaryImage
            ? { uri: primaryImage }
            : require("../../../../../assets/img/image-not-found-scaled-1150x647.png")
        }
        style={styles.image}
      />
    </View>
  );
}
