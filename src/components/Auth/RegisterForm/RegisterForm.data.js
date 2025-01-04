import * as Yup from "yup";

export function initialValues() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
    nombre: "",
    rut: "",
    carrera: "",
    genero: "",
    anoingreso: "",
  };
}

export function validationSchema() {
  return Yup.object({
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales")
      .required("Repetir la contraseña es obligatorio"),
    nombre: Yup.string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .required("El nombre es obligatorio"),
    rut: Yup.string()
      .matches(/^\d{7,8}-[0-9kK]$/, "El RUT debe tener el formato 12345678-9")
      .required("El RUT es obligatorio"),
    carrera: Yup.string()
      .min(3, "La carrera debe tener al menos 3 caracteres")
      .required("La carrera es obligatoria"),
    genero: Yup.string()
      .oneOf(["Masculino", "Femenino", "Otro"], "Seleccione un género válido")
      .required("El género es obligatorio"),
    anoingreso: Yup.number()
      .min(1940, "El año debe ser válido")
      .required("El año de ingreso es obligatorio"),
  });
}
