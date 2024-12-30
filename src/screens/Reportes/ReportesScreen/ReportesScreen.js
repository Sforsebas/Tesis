import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Alert,
} from "react-native";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../utils"; // Ajusta el path según tu estructura
import { styles } from "./ReportesScreen.styles";
import { DatePickerComponent } from "../../../components/Shared"; // Ajusta la ruta según sea necesario
import * as FileSystem from "expo-file-system"; // Usamos FileSystem de Expo
import * as XLSX from "xlsx";
import * as Sharing from "expo-sharing"; // Para compartir archivos

export async function exportToExcel(reportes) {
  try {
    // Crear datos de Excel
    const ws = XLSX.utils.json_to_sheet(reportes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");

    // Guardar como base64
    const archivoExcel = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    // Ruta temporal
    const fileUri = FileSystem.documentDirectory + "reportes.xlsx";
    await FileSystem.writeAsStringAsync(fileUri, archivoExcel, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Compartir archivo si es posible
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert(
        "Compartir no disponible",
        "No se puede compartir el archivo en este dispositivo."
      );
    }
  } catch (error) {
    console.error("Error al exportar el archivo Excel:", error);
    Alert.alert("Error", "No se pudo exportar el archivo.");
  }
}

export function ReportesScreen() {
  const [filtros, setFiltros] = useState({
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [reportes, setReportes] = useState([]);
  const [espacios, setEspacios] = useState({});
  const [loading, setLoading] = useState(false);

  // Función para obtener los nombres de los espacios deportivos
  const obtenerEspacios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Espacio_Deportivo"));
      const espaciosMap = {};
      snapshot.forEach((doc) => {
        espaciosMap[doc.id] = doc.data().name;
      });
      setEspacios(espaciosMap);
    } catch (error) {
      console.error("Error obteniendo los espacios deportivos:", error);
    }
  };

  const buscarReportes = async () => {
    setLoading(true);
    try {
      let reportesQuery = collection(db, "Reserva");
      const condiciones = [];

      // Filtra por descripción si está definida
      if (filtros.descripcion) {
        condiciones.push(where("description", ">=", filtros.descripcion));
        condiciones.push(
          where("description", "<=", filtros.descripcion + "\uf8ff")
        );
      }

      // Filtra por rango de fechas
      if (filtros.fechaInicio) {
        condiciones.push(where("date", ">=", new Date(filtros.fechaInicio)));
      }
      if (filtros.fechaFin) {
        condiciones.push(where("date", "<=", new Date(filtros.fechaFin)));
      }

      if (condiciones.length > 0) {
        reportesQuery = query(reportesQuery, ...condiciones);
      }

      const snapshot = await getDocs(reportesQuery);
      const resultados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReportes(resultados);
    } catch (error) {
      console.error("Error buscando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerEspacios();
  }, []);

  useEffect(() => {
    buscarReportes();
  }, [filtros]); // Ejecuta la búsqueda cada vez que los filtros cambien

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filters}>
        <Text style={styles.filterTitle}>
          Ingrese el detalle de la búsqueda
        </Text>
        <TextInput
          placeholder="Descripción"
          style={styles.input}
          value={filtros.descripcion}
          onChangeText={(text) => setFiltros({ ...filtros, descripcion: text })}
        />

        <Text style={styles.filterTitle}>Fecha de Inicio de Búsqueda</Text>
        <DatePickerComponent
          onDateChange={(selectedDate) =>
            setFiltros({ ...filtros, fechaInicio: selectedDate.toISOString() })
          }
          showTimePicker={false}
          selectedDate={
            filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date()
          }
        />

        <Text style={styles.filterTitle}>Fecha de Término de Búsqueda</Text>
        <DatePickerComponent
          onDateChange={(selectedDate) =>
            setFiltros({ ...filtros, fechaFin: selectedDate.toISOString() })
          }
          showTimePicker={false}
          selectedDate={
            filtros.fechaFin ? new Date(filtros.fechaFin) : new Date()
          }
        />
      </View>

      {/* Botón de búsqueda */}
      <TouchableOpacity onPress={buscarReportes} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>
          {loading ? "Buscando..." : "Buscar"}
        </Text>
      </TouchableOpacity>

      {/* Lista de resultados */}
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const espacioNombre =
            espacios[item.idEspacioDeportivo] || "Espacio no disponible";

          const fechaFormateada = new Date(
            item.date.seconds * 1000
          ).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return (
            <View style={styles.resultItem}>
              <Text style={styles.title}>Espacio: {espacioNombre}</Text>
              <Text style={styles.info}>Fecha: {fechaFormateada}</Text>
              <Text style={styles.info}>
                Descripción: {item.description || "No registra pertenencias"}
              </Text>
            </View>
          );
        }}
      />

      {/* Botón para exportar a Excel */}
      <TouchableOpacity
        onPress={() => exportToExcel(reportes)}
        style={styles.exportButton}
      >
        <Text style={styles.exportButtonText}>Exportar a Excel</Text>
      </TouchableOpacity>
    </View>
  );
}
