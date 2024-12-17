import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {BusquedaScreen} from "../screens/BusquedaScreen";
import {screen} from "../utils";

const Stack = createNativeStackNavigator();

export function BusquedaStack(){
    return(
        <Stack.Navigator>
            
            <Stack.Screen 
            name={screen.busqueda.busqueda} 
            component={BusquedaScreen}
            options={{title: "Buscar"}}
            />

        </Stack.Navigator>
    );
}