import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { EspaciosDeportivosStack } from "./EspacioDeportivoStack";
import { ReservasStack } from "./ReservasStack";
import { ReportesStack } from "./ReportesStack";
import { CuentaStack } from "./CuentaStack";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, screen } from "../utils";

const Tab = createBottomTabNavigator();

export function AppNavigation() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userRef = doc(db, "Usuario", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const { rol } = userDoc.data();
            setRole(rol);
          } else {
            console.log("No se encontró el documento del usuario.");
          }
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      }
    };

    fetchUserRole();
  }, []);

  if (role === null) {
    return null; // Mientras se carga el rol, no mostrar nada
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1B2E51",
        tabBarInactiveTintColor: "#646464",
        tabBarIcon: ({ color, size }) => screenOptions(route, color, size),
      })}
    >
      <Tab.Screen
        name={screen.espaciosdeportivos.tab}
        component={EspaciosDeportivosStack}
        options={{ title: "Espacios Deportivos" }}
      />
      <Tab.Screen
        name={screen.reservas.tab}
        component={ReservasStack}
        options={{ title: "Reservas" }}
      />
      {role !== "usuario" && (
        <Tab.Screen
          name={screen.reportes.tab}
          component={ReportesStack}
          options={{ title: "Reportes" }}
        />
      )}
      <Tab.Screen
        name={screen.cuenta.tab}
        component={CuentaStack}
        options={{ title: "Cuenta" }}
      />
    </Tab.Navigator>
  );
}

function screenOptions(route, color, size) {
  let iconName;

  if (route.name === screen.espaciosdeportivos.tab) {
    iconName = "compass-outline";
  }

  if (route.name === screen.reservas.tab) {
    iconName = "heart-outline";
  }

  if (route.name === screen.reportes.tab) {
    iconName = "star-outline";
  }

  if (route.name === screen.cuenta.tab) {
    iconName = "home-outline";
  }

  return (
    <Icon type="material-community" name={iconName} color={color} size={size} />
  );
}
