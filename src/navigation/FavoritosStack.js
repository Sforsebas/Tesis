import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FavoritosScreen } from "../screens/FavoritosScreen";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function FavoritosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screen.favoritos.favoritos}
        component={FavoritosScreen}
        options={{ title: "Reservas" }}
      />
    </Stack.Navigator>
  );
}
