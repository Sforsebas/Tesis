import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { CuentaStack } from "./src/navigation/CuentaStack";

LogBox.ignoreAllLogs();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(user ? true : false);
    });

    // Limpia la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigation /> : <CuentaStack />}
      <Toast />
    </NavigationContainer>
  );
}
