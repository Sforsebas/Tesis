
# 📱 App de Gestión de Espacios Deportivos – Universidad del Bío-Bío

Aplicación móvil desarrollada con **React Native**, **Expo** y **Firebase**, programada en **JavaScript**. Permite gestionar la reserva de espacios deportivos para estudiantes de la Universidad del Bío-Bío.

---

## 🚀 Características principales

- Registro e inicio de sesión de usuarios.
- Visualización de espacios deportivos disponibles.
- Realización y gestión de reservas.
- Roles de usuario (estudiante / administrador).
- Uso de Firebase para autenticación, base de datos y almacenamiento.
- Integración con mapas, cámara, galería y archivos.

---

## ✅ Requisitos previos

Antes de instalar y ejecutar la app, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
  ```bash
  npm install -g expo-cli
  ```
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) (para emulador o compilación en Android)
  - Asegúrate de tener instalado el Android Emulator y las SDK Platforms (API 33 o superior)
  - Se recomienda configurar las variables de entorno `ANDROID_HOME`

---

## 🧑‍💻 Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. En la configuración, copia tus credenciales de Firebase Web.
3. Crea un archivo `.env` en la raíz del proyecto y define tus variables:

```
API_KEY=tu_api_key
AUTH_DOMAIN=tu_auth_domain
PROJECT_ID=tu_project_id
STORAGE_BUCKET=tu_storage_bucket
MESSAGING_SENDER_ID=tu_messaging_sender_id
APP_ID=tu_app_id
```

4. Asegúrate de que el archivo `.env` esté listado en tu `.gitignore`.

---

## 🤖 Ejecutar en Android

### Opción 1: Usar emulador (Android Studio)

1. Abre Android Studio y ejecuta un emulador.
2. Desde la terminal del proyecto:

```bash
npm start
# o
npm run android
```

### Opción 2: Usar dispositivo físico (con Expo Go)

1. Instala la app **Expo Go** desde Play Store.
2. Conecta el teléfono a la misma red Wi-Fi que tu PC.
3. Ejecuta:

```bash
npm start
```

4. Escanea el QR con Expo Go.

---

## 📦 Dependencias principales

| Paquete | Versión | Descripción |
|--------|---------|-------------|
| **React Native** | 0.74.2 | Framework para apps móviles nativas. |
| **Expo** | ~51.0.14 | Plataforma de desarrollo simplificada para React Native. |
| **Firebase** | ^10.12.2 | Autenticación, Firestore, almacenamiento y más. |
| **React Navigation** | ^6.x | Navegación entre pantallas. |
| **React Native Maps** | ^1.18.0 | Integración con mapas. |
| **React Native Vector Icons** | ^10.1.0 | Íconos personalizables. |
| **React Native Elements** / **@rneui** | ^4.0.0-rc.8 | Componentes de UI. |
| **Formik & Yup** | ^2.4.6 / ^1.4.0 | Validación y manejo de formularios. |
| **XLSX** | ^0.18.5 | Exportación a Excel. |
| **UUID** | ^10.0.0 | Generación de IDs únicos. |
| **react-native-toast-message** | ^2.2.0 | Notificaciones tipo toast. |

---

## 📁 Estructura del proyecto

```
/src
  /components        # Componentes reutilizables
  /screens           # Pantallas principales
  /services          # Firebase, API, etc.
  /navigation        # Stack y tab navigators
  /utils             # Funciones auxiliares
firebaseConfig.js    # Configuración Firebase
App.js               # Entrada principal
.env                 # Variables de entorno
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes ver más en el archivo [LICENSE](LICENSE).

---

## 👨‍💻 Autor

**Sebastián Carreño Muñoz** – _Ingeniero en Informática, Universidad del Bío-Bío_
