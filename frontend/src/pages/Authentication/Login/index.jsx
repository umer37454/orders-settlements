import { Form, Alert, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";

import AppInput from "../../../components/common/AppInput";
import AppButton from "../../../components/common/AppButton";
import Auth from "../../../components/layouts/Auth";

import loginSchema from "../../../validation/auth/loginSchema";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema: loginSchema,

        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await login(values);
            } catch (error) {
                console.error("Login Error:", error);

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
        <Auth title="Login">
            <Form onSubmit={formik.handleSubmit}>

                {formik.errors.general && (
                    <Alert variant="danger" className="mb-3">
                        {formik.errors.general}
                    </Alert>
                )}

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

                <Row className="g-2">
                    <Col>
                        <div className="d-grid">
                            <AppButton
                                type="submit"
                                loading={formik.isSubmitting}
                            >
                                Login
                            </AppButton>
                        </div>
                    </Col>

                    <Col>
                        <div className="d-grid">
                            <AppButton
                                type="button"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </AppButton>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Auth>
    );
};

export default Login;