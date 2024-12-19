import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  btnContainer: {
    marginBottom: 10,
    alignSelf: "center",
  },
  btn: {
    backgroundColor: "#014898",
    borderRadius: 50, // Más redondeado
    height: 40, // Reduce la altura del botón
    minWidth: 150, // Reduce el ancho mínimo del botón
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
    paddingHorizontal: 10, // Ajusta el relleno horizontal
  },
  btnText: {
    color: "white",
    fontSize: 14, // Reduce el tamaño del texto
    textAlign: "center",
  },
  btnSpacing: {
    marginTop: 8, // Espaciado entre botones
  },
  textContainer: {
    maxWidth: 200, // Limita el ancho del texto
    alignItems: "center",
  },
});
