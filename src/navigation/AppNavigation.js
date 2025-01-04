import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { EspaciosDeportivosStack } from "./EspacioDeportivoStack";
import { ReservasStack } from "./ReservasStack";
import { ReportesStack } from "./ReportesStack";
import { CuentaStack } from "./CuentaStack";
import { screen } from "../utils";

const Tab = createBottomTabNavigator();

export function AppNavigation() {
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
      <Tab.Screen
        name={screen.reportes.tab}
        component={ReportesStack}
        options={{ title: "Reportes" }}
      />
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
