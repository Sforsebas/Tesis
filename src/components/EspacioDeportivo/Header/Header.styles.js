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
    width: "100%", // Asegura que ocupe todo el espacio disponible
    padding: 10,
  },
  name: {
    fontSize: 22, // Aumenta un poco el tamaño de la fuente
    textAlign: "center",
    fontWeight: "bold", // Para darle un toque más prominente
    color: "#333", // Color más oscuro para mejorar la legibilidad
  },
  description: {
    marginTop: 20, // Aumenta el margen superior para más espacio entre el título y la descripción
    color: "#828282", // Mantiene el texto secundario suave
    fontSize: 16,
  },
  // Agregando estilo para tarjetas con bordes redondeados y sombra
  card: {
    backgroundColor: "#FFFFFF", // Fondo blanco para las tarjetas
    padding: 15,
    borderRadius: 15, // Bordes redondeados
    marginVertical: 10,
    shadowColor: "#000", // Sombra sutil para profundidad
    shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Elevación para Android
  },
});
