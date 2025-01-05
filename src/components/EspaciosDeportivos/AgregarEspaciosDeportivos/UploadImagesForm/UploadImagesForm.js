import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { Icon, Avatar, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { map, filter } from "lodash";
import { LoadingModal } from "../../../Shared";
import { styles } from "./UploadImagesForm.styles";

// Generador manual de UUID
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function UploadImagesForm(props) {
  const { formik } = props;
  const [isLoading, setIsLoading] = useState(false);

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setIsLoading(true);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al abrir la galería:", error);
      setIsLoading(false);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const uniqueId = generateUUID(); // Usar generador manual
      const storageRef = ref(storage, `espaciosdeportivos/${uniqueId}`);

      await uploadBytes(storageRef, blob);
      await updatePhotosEspacioDeportivo(storageRef.fullPath);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setIsLoading(false);
    }
  };

  const updatePhotosEspacioDeportivo = async (imagePath) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);

      const imageUrl = await getDownloadURL(imageRef);

      formik.setFieldValue("images", [...formik.values.images, imageUrl]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener la URL de la imagen:", error);
      setIsLoading(false);
    }
  };

  const removeImage = (img) => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Estás seguro de eliminar esta imagen?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            const result = filter(
              formik.values.images,
              (image) => image !== img
            );
            formik.setFieldValue("images", result);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <ScrollView
        style={styles.viewImage}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Icon
          type="material-community"
          name="camera"
          color="#a7a7a7"
          containerStyle={styles.containerIcon}
          onPress={openGallery}
        />

        {map(formik.values.images, (image) => (
          <Avatar
            key={image}
            source={{ uri: image }}
            containerStyle={styles.imageStyle}
            onPress={() => removeImage(image)}
          />
        ))}
      </ScrollView>

      <Text style={styles.error}>{formik.errors.images}</Text>

      <LoadingModal show={isLoading} text="Subiendo Imagen" />
    </>
  );
}
