import * as Yup from "yup";

// Función para truncar la hora de la fecha actual
function truncateTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Función para obtener la hora actual en formato HH:mm
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function initialValues() {
  return {
    description: "",
    date: null, // Cambiado para evitar problemas con cadenas vacías
    time: "",
  };
}

export function validationSchema() {
  return Yup.object({
    description: Yup.string().max(
      100,
      "La descripción no puede tener más de 100 caracteres."
    ),
    date: Yup.date()
      .typeError("La fecha seleccionada no es válida.")
      .min(
        truncateTime(new Date()),
        "La fecha debe ser igual o posterior al día actual."
      )
      .required("La fecha es obligatoria."),
    time: Yup.string()
      .required("La hora es obligatoria.")
      .test(
        "is-valid-time",
        "La hora debe ser igual o posterior a la actual.",
        function (value) {
          const { date } = this.parent; // Accede al campo de fecha
          if (!date) return true; // Si no hay fecha, no validar hora

          const selectedDate = truncateTime(new Date(date));
          const today = truncateTime(new Date());

          if (selectedDate.getTime() === today.getTime()) {
            // Si la fecha es hoy, compara la hora
            return value >= getCurrentTime();
          }
          return true; // Si la fecha no es hoy, cualquier hora es válida
        }
      ),
  });
}
