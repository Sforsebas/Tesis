import * as Yup from "yup";

export function initialValues() {
  return {
    description: "",
  };
}

export function validationSchema() {
  return Yup.object({
    description: Yup.string().required("La descripción es requerido"),
  });
}
