import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CuentaScreen } from "../screens/Cuenta/CuentaScreen";
import { LoginScreen } from "../screens/Cuenta/LoginScreen";
import { RegisterScreen } from "../screens/Cuenta/RegisterScreen";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function CuentaStack() {
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
        name={screen.cuenta.cuenta}
        component={CuentaScreen}
        options={{ title: "" }}
      />

      <Stack.Screen
        name={screen.cuenta.login}
        component={LoginScreen}
        options={{ title: "Iniciar Sesión" }}
      />

      <Stack.Screen
        name={screen.cuenta.register}
        component={RegisterScreen}
        options={{ title: "Crea tu Cuenta" }}
      />
    </Stack.Navigator>
  );
}
