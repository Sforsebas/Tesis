import * as Yup from "yup";

export function initialValues() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
  };
}

export function validationSchema() {
  return Yup.object({
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),

    password: Yup.string().required("La contraseña es obligatoria"),

    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales")
      .required("Las contraseña es obligatoria"),
  });
}
