import * as Yup from "yup";

const registerSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: Yup.string()
        .trim()
        .email("Please enter a valid email address")
        .required("Email is required"),

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
});

export default registerSchema;