import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  image: {
    width: 350, // Aumenta el ancho de la imagen
    height: 230, // Aumenta el alto de la imagen
    resizeMode: "contain",
    marginBottom: 10,
  },
  content: {
    width: "100%",
    paddingHorizontal: 20,
  },
  textRegister: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#1B2E51",
  },
  btnRegister: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
});
