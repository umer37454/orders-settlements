import { Alert, Form } from "react-bootstrap";
import { useFormik } from "formik";

import AppInput from "../../../components/common/AppInput";
import AppButton from "../../../components/common/AppButton";

import registerSchema from "../../../validation/auth/registerSchema";
import Auth from "../../../components/layouts/Auth";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { register } = useAuth();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },

        validationSchema: registerSchema,

        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await register(values);
            } catch (error) {
                console.error("Registration Error:", error);

                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({
                        general:
                            error.response?.data?.message || "Something went wrong.",
                    });
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Auth title="Register">
            <Form onSubmit={formik.handleSubmit}>
                {formik.errors.general && (
                    <Alert variant="danger" className="mb-3">
                        {formik.errors.general}
                    </Alert>
                )}

                <AppInput
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your name"
                    error={
                        formik.touched.name &&
                        formik.errors.name
                    }
                />

                <AppInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email"
                    error={
                        formik.touched.email &&
                        formik.errors.email
                    }
                />

                <AppInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    error={
                        formik.touched.password &&
                        formik.errors.password
                    }
                />

                <div className="d-grid">

                    <AppButton
                        type="submit"
                        loading={formik.isSubmitting}
                    >
                        Register
                    </AppButton>

                </div>
            </Form>
        </Auth>
    );
};

export default Register;