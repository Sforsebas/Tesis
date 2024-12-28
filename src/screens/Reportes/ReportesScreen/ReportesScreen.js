import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../utils"; // Ajusta el path según tu estructura
import { styles } from "./ReportesScreen.styles";
import { DatePickerComponent } from "../../../components/Shared"; // Ajusta la ruta según sea necesario

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
        // Buscando texto que contenga la descripción en cualquier parte
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

      // Aplica las condiciones al query
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
        <Text style={styles.filterTitle}>Descripción de la búsqueda</Text>
        <TextInput
          placeholder="Descripción"
          style={styles.input}
          value={filtros.descripcion}
          onChangeText={(text) => setFiltros({ ...filtros, descripcion: text })}
        />

        <Text style={styles.filterTitle}>Fecha de Inicio de Búsqueda</Text>
        {/* Selección de fecha inicio */}
        <DatePickerComponent
          onDateChange={(selectedDate) =>
            setFiltros({ ...filtros, fechaInicio: selectedDate.toISOString() })
          }
          showTimePicker={false} // No es necesario seleccionar la hora
          selectedDate={
            filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date()
          } // Muestra la fecha seleccionada o la fecha actual
        />

        <Text style={styles.filterTitle}>Fecha de Término de Búsqueda</Text>
        {/* Selección de fecha fin */}
        <DatePickerComponent
          onDateChange={(selectedDate) =>
            setFiltros({ ...filtros, fechaFin: selectedDate.toISOString() })
          }
          showTimePicker={false} // No es necesario seleccionar la hora
          selectedDate={
            filtros.fechaFin ? new Date(filtros.fechaFin) : new Date()
          } // Muestra la fecha seleccionada o la fecha actual
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

          // Formatear la fecha para que aparezca en formato Día/Mes/Año
          const fechaFormateada = new Date(
            item.date.seconds * 1000
          ).toLocaleDateString("es-ES", {
            day: "2-digit", // Dos dígitos para el día
            month: "2-digit", // Dos dígitos para el mes
            year: "numeric", // Año con 4 dígitos
          });

          return (
            <View style={styles.resultItem}>
              <Text style={styles.title}>Espacio: {espacioNombre}</Text>
              <Text style={styles.info}>Fecha: {fechaFormateada}</Text>
              <Text style={styles.info}>
                Descripción: {item.description || "Sin descripción"}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
