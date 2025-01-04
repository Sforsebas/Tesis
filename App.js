import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AppNavigation } from "./src/navigation/AppNavigation"; // Pestañas de la app
import { CuentaStack } from "./src/navigation/CuentaStack";

LogBox.ignoreAllLogs();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  useEffect(() => {
    const auth = getAuth();
    // Suscripción para detectar si el usuario está autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(user ? true : false); // Actualiza el estado de autenticación
    });

    // Limpia la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {/* Si el usuario está logueado, muestra las pestañas; si no, muestra el stack de login y registro */}
      {isAuthenticated ? <AppNavigation /> : <CuentaStack />}
      <Toast />
    </NavigationContainer>
  );
}
