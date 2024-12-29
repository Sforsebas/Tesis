import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReportesScreen } from "../screens/Reportes/ReportesScreen";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function ReportesStack() {
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
        name={screen.reportes.reportes}
        component={ReportesScreen}
        options={{ title: "Reportes" }}
      />
    </Stack.Navigator>
  );
}
