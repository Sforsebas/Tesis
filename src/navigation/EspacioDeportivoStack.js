import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EspaciosDeportivosScreen } from "../screens/EspaciosDeportivos/EspaciosDeportivosScreen";
import { AgregarEspacioDeportivoScreen } from "../screens/EspaciosDeportivos/AgregarEspacioDeportivoScreen";
import { EspacioDeportivoScreen } from "../screens/EspaciosDeportivos/EspacioDeportivoScreen";
import { AgregarReservaEspacioDeportivo } from "../screens/EspaciosDeportivos/AgregarReservaEspacioDeportivo";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function EspaciosDeportivosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1B2E51",
        },
        headerTintColor: "#FDEBDB",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name={screen.espaciosdeportivos.espaciosdeportivos}
        component={EspaciosDeportivosScreen}
        options={{ title: "Espacios Deportivos" }}
      />
      <Stack.Screen
        name={screen.espaciosdeportivos.agregarEspacioDeportivo}
        component={AgregarEspacioDeportivoScreen}
        options={{ title: "Nuevo Espacio Deportivo" }}
      />
      <Stack.Screen
        name={screen.espaciosdeportivos.espaciodeportivo}
        component={EspacioDeportivoScreen}
        options={{ title: "Espacio Deportivo" }}
      />
      <Stack.Screen
        name={screen.espaciosdeportivos.agregarReservaEspacioDeportivo}
        component={AgregarReservaEspacioDeportivo}
        options={{ title: "Reserva de Horario" }}
      />
    </Stack.Navigator>
  );
}
