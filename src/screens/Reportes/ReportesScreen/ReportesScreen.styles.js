import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  filters: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  searchButton: {
    backgroundColor: "#014898",
    padding: 10,
    alignItems: "center",
    width: "65%",
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 25,
    elevation: 5, // Para añadir sombra en Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exportButton: {
    backgroundColor: "#28a745", // Verde brillante
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 25,
    width: "65%",
    alignSelf: "center",
    marginTop: 20, // Agregar espacio arriba del botón
    elevation: 5, // Para añadir sombra en Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  exportButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold", // Hace que el texto esté en mayúsculas
  },
  resultItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
  },
});
