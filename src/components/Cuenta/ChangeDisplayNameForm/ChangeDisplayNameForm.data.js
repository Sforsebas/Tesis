import * as Yup from "yup";

export function initialValues() {
  return {
    displayName: "",
  };
}

export function validationSchema() {
  return Yup.object({
    displayName: Yup.string().required("El Nombre y Apellidos son requeridos"),
  });
}
