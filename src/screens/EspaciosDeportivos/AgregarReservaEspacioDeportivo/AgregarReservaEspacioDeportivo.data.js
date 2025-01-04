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
      .test(
        "is-not-weekend",
        "No es posible realizar reservas durante los días sábado y domingo.",
        function (value) {
          if (!value) return true; // Si no hay fecha, no validar aún
          const dayOfWeek = new Date(value).getDay();
          return dayOfWeek !== 0 && dayOfWeek !== 6; // No permite domingos (0) ni sábados (6)
        }
      )
      .required("La fecha es obligatoria."),
    time: Yup.string()
      .matches(
        /^(0[9]|1[0-9]|2[0-3]):([0-5][0-9])$/, // Asegura formato de hora HH:mm
        "La hora debe estar en formato HH:mm."
      )
      .required("La hora es obligatoria.")
      .test(
        "is-valid-time-range",
        "La hora debe estar entre las 09:00 y las 19:00.",
        function (value) {
          if (!value) return true; // Si no hay valor, no validar aún

          const [hours, minutes] = value.split(":").map(Number); // Extrae horas y minutos
          const timeInMinutes = hours * 60 + minutes;

          // Hora de inicio: 9:00 (en minutos)
          const startTimeInMinutes = 9 * 60;
          // Hora de fin: 19:00 (en minutos)
          const endTimeInMinutes = 19 * 60;

          return (
            timeInMinutes >= startTimeInMinutes &&
            timeInMinutes <= endTimeInMinutes
          );
        }
      )
      .test(
        "is-valid-time-today",
        "La hora debe ser igual o posterior a la actual si es hoy.",
        function (value) {
          const { date } = this.parent; // Accede al campo de fecha
          if (!value || !date) return true; // Si no hay hora o fecha, no validar

          const selectedDate = truncateTime(new Date(date));
          const today = truncateTime(new Date());

          if (selectedDate.getTime() === today.getTime()) {
            // Si la fecha es hoy, compara la hora con la actual
            return value >= getCurrentTime();
          }
          return true; // Si no es hoy, cualquier hora dentro del rango es válida
        }
      ),
  });
}
