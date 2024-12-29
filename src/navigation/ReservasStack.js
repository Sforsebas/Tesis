import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReservasScreen } from "../screens/Reservas/ReservasScreen";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function ReservasStack() {
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
        name={screen.reservas.reservas}
        component={ReservasScreen}
        options={{ title: "Reservas" }}
      />
    </Stack.Navigator>
  );
}
