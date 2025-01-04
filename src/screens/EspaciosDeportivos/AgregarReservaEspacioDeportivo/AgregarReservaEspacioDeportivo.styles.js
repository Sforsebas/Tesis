import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: "space-between",
  },
  descripcion: {
    height: 150,
  },
  btnContainer: {
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#014898",
  },
  message: {
    color: "red", // Puedes cambiar el color según el tipo de mensaje (error o éxito)
    marginTop: 10,
    textAlign: "center",
    fontSize: 16, // Puedes ajustar el tamaño de la fuente
  },
});
