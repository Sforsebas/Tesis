import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  reservas: {
    flexDirection: "row",
    margin: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  info: {
    color: "#828282",
    paddingRight: 8,
    marginTop: 3,
  },

  deleteButton: {
    backgroundColor: "#E41B1A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
