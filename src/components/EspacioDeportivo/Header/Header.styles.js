import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    margin: 15,
  },
  container: {
    flex: 1, // Permite que el contenedor ocupe todo el espacio disponible
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
  },

  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 20,
    textAlign: "center",
  },
  description: {
    marginTop: 5,
    color: "#828282",
  },
});
