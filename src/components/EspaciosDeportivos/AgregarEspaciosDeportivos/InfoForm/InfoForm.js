import React, { useState } from "react";
import { View } from "react-native";
import { Input } from "react-native-elements";
import { MapForm } from "../MapForm";
import { styles } from "./InfoForm.styles";

export function InfoForm(props) {
  const { formik } = props;

  const [showMap, setshowMap] = useState(false);

  const onOpenCloseMap = () => setshowMap((prevState) => !prevState);

  return (
    <>
      <View style={styles.content}>
        <Input
          placeholder="Nombre del Espacio Deportivo"
          onChangeText={(text) => formik.setFieldValue("name", text)}
          errorMessage={formik.errors.name}
        />
        <Input
          placeholder="Dirección"
          rightIcon={{
            type: "material-community",
            name: "map-marker-radius",
            color: getColorIconMap(formik),
            onPress: onOpenCloseMap,
          }}
          onChangeText={(text) => formik.setFieldValue("address", text)}
          errorMessage={formik.errors.address}
        />
        <Input
          placeholder="Teléfono"
          onChangeText={(text) => formik.setFieldValue("phone", text)}
          errorMessage={formik.errors.phone}
        />
        <Input
          placeholder="Email"
          onChangeText={(text) => formik.setFieldValue("email", text)}
          errorMessage={formik.errors.email}
        />
        <Input
          placeholder="Descripcion del Espacio Deportivo"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChangeText={(text) => formik.setFieldValue("description", text)}
          errorMessage={formik.errors.description}
        />
      </View>
      <MapForm show={showMap} close={onOpenCloseMap} formik={formik} />
    </>
  );
}

const getColorIconMap = (formik) => {
  if (formik.errors.location) return "#ff0000";

  if (formik.values.location) return "#014898";

  return "#c2c2c2";
};
