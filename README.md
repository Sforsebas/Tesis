
# REDUBB - Reserva de Espacios Deportivos

## Descripción

**REDUBB** es una aplicación móvil desarrollada en React Native que permite a los estudiantes, funcionarios y personal administrativo de la Universidad del Bío-Bío gestionar las reservas de espacios deportivos en tiempo real. Utiliza Firebase para almacenar y gestionar los datos de los usuarios, reservas y espacios deportivos.

## Requisitos

1. Tener Node.js instalado. Puedes descargarlo [aquí](https://nodejs.org/).
2. Tener Expo CLI instalado globalmente. Puedes instalar Expo CLI ejecutando el siguiente comando en tu terminal:
   ```bash
   npm install -g expo-cli
   ```

## Instalación

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/Sforsebas/Tesis.git
   ```

2. Accede al directorio del proyecto:
   ```bash
   cd Tesis
   ```

3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

4. Inicia la aplicación en el emulador o en un dispositivo físico:

   Para Android:
   ```bash
   expo start --android
   ```
   Para iOS (si tienes macOS):
   ```bash
   expo start --ios
   ```
   Para Web:
   ```bash
   expo start --web
   ```

## Configuración de Firebase

1. Crea una cuenta en [Firebase](https://firebase.google.com/) y crea un nuevo proyecto.
2. Configura Firebase en tu proyecto móvil utilizando el archivo `firebase.js` incluido en el repositorio.
3. Reemplaza los datos del archivo `firebase.js` con tu propia configuración de Firebase.

```js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};
```

## Estructura del Proyecto

- **src**: Contiene las carpetas `components`, `navigation`, `screens`, `utils`, que agrupan las funcionalidades de la aplicación.
  - **components**: Componentes reutilizables de la interfaz.
  - **navigation**: Configuración de las rutas de navegación.
  - **screens**: Vistas de las diferentes pantallas de la aplicación.
  - **utils**: Funciones auxiliares, constantes y configuraciones reutilizables.
- **assets**: Archivos gráficos e imágenes utilizadas en la interfaz.
- **firebase.js**: Configuración para integrar Firebase en la aplicación.

## Autor

Desarrollado por **Sebastián Carreño Muñoz**.

Correo: [sebastian3097@outlook.com](mailto:sebastian3097@outlook.com)

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo LICENSE para más detalles.
