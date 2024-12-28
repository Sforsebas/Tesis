import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReportesScreen } from "../screens/Reportes/ReportesScreen";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function ReportesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screen.reportes.reportes}
        component={ReportesScreen}
        options={{ title: "Reportes" }}
      />
    </Stack.Navigator>
  );
}
