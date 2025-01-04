import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../utils"; // Ajusta el path según tu estructura
import { styles } from "./ReportesScreen.styles";
import { DatePickerComponent } from "../../../components/Shared"; // Ajusta la ruta según sea necesario
import * as FileSystem from "expo-file-system"; // Usamos FileSystem de Expo
import * as XLSX from "xlsx";
import * as Sharing from "expo-sharing"; // Para compartir archivos

// Función para exportar reportes a Excel
export async function exportToExcel(reportes, espacios, usuarios) {
  try {
    if (!espacios || Object.keys(espacios).length === 0) {
      console.warn("Los espacios no están cargados correctamente.");
      return;
    }
    if (!usuarios || Object.keys(usuarios).length === 0) {
      console.warn("Los usuarios no están cargados correctamente.");
      return;
    }

    const reportesConDatos = reportes.map((reporte) => {
      const usuario = usuarios[reporte.idUsuario] || {};
      const espacioNombre =
        espacios[reporte.idEspacioDeportivo] || "Espacio no disponible";

      const fechaFormateada = reporte.date
        ? new Date(reporte.date.seconds * 1000).toLocaleDateString("es-ES")
        : "Fecha no disponible";

      return {
        nombre: usuario.nombre || "Nombre no disponible",
        date: fechaFormateada,
        time: reporte.time,
        name: espacioNombre,
        description: reporte.description || "No disponible",
        genero: usuario.genero || "No especificado",
        rut: usuario.rut || "No disponible",
        anoingreso: usuario.anoingreso || "No disponible",
        carrera: usuario.carrera || "No disponible",
        email: usuario.email || "Correo no disponible",
      };
    });

    console.log("Datos a exportar:", reportesConDatos);

    const ws = XLSX.utils.json_to_sheet(reportesConDatos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");

    const archivoExcel = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const fileUri = FileSystem.documentDirectory + "reportes.xlsx";
    await FileSystem.writeAsStringAsync(fileUri, archivoExcel, {
      encoding: FileSystem.EncodingType.Base64,
    });

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
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(false);

  const obtenerEspacios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Espacio_Deportivo"));
      const espaciosMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        espaciosMap[doc.id] = data.name;
        console.log(`Espacio ID: ${doc.id}, Nombre: ${data.name}`);
      });
      console.log("Mapa de espacios cargado:", espaciosMap);
      setEspacios(espaciosMap);
    } catch (error) {
      console.error("Error obteniendo los espacios deportivos:", error);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Usuario"));
      const usuariosMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        usuariosMap[data.idUser] = {
          nombre: data.nombre,
          genero: data.genero,
          rut: data.rut,
          anoingreso: data.anoingreso,
          carrera: data.carrera,
          email: data.email || "Correo no disponible",
        };
      });
      console.log("Usuarios obtenidos:", usuariosMap);
      setUsuarios(usuariosMap);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    }
  };

  const buscarReportes = async () => {
    setLoading(true);
    try {
      let reportesQuery = collection(db, "Reserva");
      const condiciones = [];

      if (filtros.descripcion) {
        condiciones.push(where("description", ">=", filtros.descripcion));
        condiciones.push(
          where("description", "<=", filtros.descripcion + "\uf8ff")
        );
      }
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
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    if (Object.keys(usuarios).length > 0) {
      buscarReportes();
    }
  }, [filtros, usuarios]);

  return (
    <View style={styles.container}>
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

      <TouchableOpacity onPress={buscarReportes} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>
          {loading ? "Buscando..." : "Buscar"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const fechaFormateada = item.date
            ? new Date(item.date.seconds * 1000).toLocaleDateString("es-ES")
            : "Fecha no disponible";

          return (
            <View style={styles.resultItem}>
              <Text style={styles.title}>
                Espacio: {espacios[item.idEspacioDeportivo] || "No disponible"}
              </Text>
              <Text style={styles.info}>Fecha: {fechaFormateada}</Text>
              <Text style={styles.info}>
                Descripción: {item.description || "No disponible"}
              </Text>
              <Text style={styles.info}>
                Usuario: {usuarios[item.idUsuario]?.nombre || "No disponible"}
              </Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        onPress={() => exportToExcel(reportes, espacios, usuarios)}
        style={styles.exportButton}
      >
        <Text style={styles.exportButtonText}>Exportar a Excel</Text>
      </TouchableOpacity>
    </View>
  );
}
