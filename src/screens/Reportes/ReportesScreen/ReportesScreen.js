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
import { db } from "../../../utils";
import { styles } from "./ReportesScreen.styles";
import { DatePickerComponent } from "../../../components/Shared";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import * as Sharing from "expo-sharing";
import { getAuth } from "firebase/auth";

// Obtener el correo del usuario autenticado
const obtenerRolDelUsuario = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "Usuario", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data().rol; // Devuelve el rol del usuario
      } else {
        console.log("Usuario no encontrado");
        return null;
      }
    }
  } catch (error) {
    console.error("Error obteniendo el rol del usuario:", error);
  }
};

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

    const reportesConDatos = await Promise.all(
      reportes.map((reporte) => {
        const usuario = usuarios[reporte.idUsuario] || {}; // Usuario relacionado con la reserva
        const espacioNombre =
          espacios[reporte.idEspacioDeportivo] || "Espacio no disponible";

        const fechaFormateada = reporte.date
          ? new Date(reporte.date.seconds * 1000).toLocaleDateString("es-ES")
          : "Fecha no disponible";

        return {
          "Nombre del Usuario": usuario.nombre || "Nombre no disponible",
          Fecha: fechaFormateada,
          Hora: reporte.time || "Hora no disponible",
          "Nombre del Espacio Deportivo": espacioNombre,
          Descripción: reporte.description || "No disponible",
          Género: usuario.genero || "No especificado",
          Rut: usuario.rut || "No disponible",
          "Año de Ingreso": usuario.anoingreso || "No disponible",
          Carrera: usuario.carrera || "No disponible",
          "Correo Electrónico": usuario.email || "Correo no registrado", // Extrae el email del usuario
        };
      })
    );

    const ws = XLSX.utils.json_to_sheet(reportesConDatos, {
      header: [
        "Nombre del Usuario",
        "Fecha",
        "Hora",
        "Nombre del Espacio Deportivo",
        "Descripción",
        "Género",
        "Rut",
        "Año de Ingreso",
        "Carrera",
        "Correo Electrónico",
      ],
    });

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
    correo: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const [reportes, setReportes] = useState([]);
  const [espacios, setEspacios] = useState({});
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(false);
  const [rolUsuario, setRolUsuario] = useState(null);

  // Obtener el rol del usuario
  useEffect(() => {
    const cargarRol = async () => {
      const rol = await obtenerRolDelUsuario();
      setRolUsuario(rol);
    };
    cargarRol();
  }, []);

  const obtenerEspacios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Espacio_Deportivo"));
      const espaciosMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        espaciosMap[doc.id] = data.name;
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
        usuariosMap[data.idUser] = {
          nombre: data.nombre,
          genero: data.genero,
          rut: data.rut,
          anoingreso: data.anoingreso,
          carrera: data.carrera,
          email: data.email,
        };
      });
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

      // Filtrar por correo
      if (filtros.correo) {
        const usuariosFiltrados = Object.keys(usuarios).filter((userId) => {
          const email = usuarios[userId]?.email?.toLowerCase();
          return email && email.includes(filtros.correo.toLowerCase());
        });

        if (usuariosFiltrados.length > 0) {
          condiciones.push(where("idUsuario", "in", usuariosFiltrados));
        } else {
          Alert.alert("No se encontraron usuarios con ese correo");
          return;
        }
      }

      // Filtrar por fechas
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
          placeholder="Correo"
          style={styles.input}
          value={filtros.correo}
          onChangeText={(text) => setFiltros({ ...filtros, correo: text })}
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
              <Text style={styles.info}>
                Correo:{" "}
                {usuarios[item.idUsuario]?.email || "Correo no disponible"}
              </Text>
            </View>
          );
        }}
      />

      {/* Condicionar el botón "Exportar a Excel" */}
      {rolUsuario !== "recepcion" && (
        <TouchableOpacity
          onPress={() => exportToExcel(reportes, espacios, usuarios)}
          style={styles.exportButton}
        >
          <Text style={styles.exportButtonText}>Exportar a Excel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
