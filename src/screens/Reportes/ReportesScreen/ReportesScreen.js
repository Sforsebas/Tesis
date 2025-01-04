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
export async function exportToExcel(reportes, espacios) {
  try {
    // Verifica que los espacios estén correctamente cargados
    if (!espacios || Object.keys(espacios).length === 0) {
      console.warn("Los espacios no están cargados correctamente.");
      return;
    }

    // Mapeo de los reportes con el nombre del espacio deportivo desde `espacios`
    const reportesConNombreEspacio = reportes.map((reporte) => {
      // Asegúrate de que idEspacioDeportivo esté presente
      const espacioId = reporte.idEspacioDeportivo;
      const espacioNombre = espacios[espacioId];

      if (!espacioNombre) {
        console.warn(
          `No se encontró el nombre del espacio para el ID ${espacioId}`
        );
      }

      // Verificación y conversión de la fecha si es necesario
      let fechaFormateada = "Fecha no válida";
      if (reporte.date) {
        // Si el valor de 'date' es un Timestamp de Firebase
        const fecha =
          reporte.date instanceof Date
            ? reporte.date
            : new Date(reporte.date.seconds * 1000); // Convertir el Timestamp a Date
        if (!isNaN(fecha)) {
          fechaFormateada = fecha.toLocaleDateString("es-ES"); // Formatear la fecha
        }
      }

      return {
        nombre: reporte.nombre || "Nombre no disponible", // Nombre del usuario
        date: fechaFormateada, // Fecha
        time: reporte.time, // Hora
        name: espacioNombre || "Espacio no disponible", // Nombre del espacio deportivo
        description: reporte.description || "No disponible", // Descripción
      };
    });

    console.log("Datos a exportar:", reportesConNombreEspacio);

    // Crear la hoja de trabajo y el libro
    const ws = XLSX.utils.json_to_sheet(reportesConNombreEspacio);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");

    // Convertir el libro a un archivo Base64
    const archivoExcel = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const fileUri = FileSystem.documentDirectory + "reportes.xlsx";
    await FileSystem.writeAsStringAsync(fileUri, archivoExcel, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Compartir el archivo generado
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

  const obtenerUsuarios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Usuario"));
      const usuariosMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.idUser && data.nombre) {
          usuariosMap[data.idUser] = data.nombre; // Usa idUser como clave
        } else {
          console.warn(
            `El usuario con ID ${doc.id} no tiene idUser o nombre definido`
          );
        }
      });
      console.log("Usuarios obtenidos:", usuariosMap); // Verifica el mapeo
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

      const reportesConNombre = await Promise.all(
        resultados.map(async (reporte) => {
          // Obtener el nombre del espacio deportivo usando idEspacioDeportivo
          const espacioRef = doc(
            db,
            "Espacio_Deportivo",
            reporte.idEspacioDeportivo
          );
          const espacioSnap = await getDoc(espacioRef);
          const espacioData = espacioSnap.data();
          const espacioNombre = espacioData?.name || "Espacio no disponible"; // Nombre del espacio deportivo

          // Obtener el nombre del usuario usando idUsuario
          const usuarioNombre =
            usuarios[reporte.idUsuario] || "Nombre no disponible"; // Nombre del usuario

          // Formatear la fecha de reserva
          const fechaFormateada =
            reporte.date instanceof Date
              ? reporte.date.toLocaleDateString("es-ES")
              : new Date(reporte.date.seconds * 1000).toLocaleDateString(
                  "es-ES"
                ); // Timestamp a fecha

          return {
            nombre: usuarioNombre,
            date: fechaFormateada, // Fecha de la reserva
            time: reporte.time, // Hora de la reserva
            name: espacioNombre, // Nombre del espacio deportivo
            description: reporte.description || "No disponible", // Descripción de la reserva
          };
        })
      );

      setReportes(reportesConNombre);
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
          return (
            <View style={styles.resultItem}>
              <Text style={styles.title}>Espacio: {item.name}</Text>
              <Text style={styles.info}>Fecha: {item.date}</Text>
              <Text style={styles.info}>
                Descripción: {item.description || "No registra pertenencias"}
              </Text>
              <Text style={styles.info}>Usuario: {item.nombre}</Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        onPress={() => exportToExcel(reportes, espacios)} // Asegúrate de pasar 'espacios'
        style={styles.exportButton}
      >
        <Text style={styles.exportButtonText}>Exportar a Excel</Text>
      </TouchableOpacity>
    </View>
  );
}
