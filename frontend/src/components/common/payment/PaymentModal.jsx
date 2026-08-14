import { useEffect } from "react";
import { Alert, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";

import AppInput from "../AppInput";
import AppButton from "../AppButton";

import paymentSchema from "../../../validation/payment/paymentSchema";
import { createPayment } from "../../../api/payment";

const PaymentModal = ({ show, onHide, orderId, onSuccess }) => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const defaultDate = today.toISOString().split("T")[0];

    const formik = useFormik({
        initialValues: {
            amount: "",
            payment_date: defaultDate,
        },

        validationSchema: paymentSchema,

        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
                await createPayment({
                    order_id: orderId,
                    ...values,
                });

                resetForm();
                onSuccess();
                onHide();
            } catch (error) {
                const status = error.response?.status;
                const data = error.response?.data;

                if (status === 422 && data?.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({
                        general: data?.message ?? "Something went wrong.",
                    });
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (show) {
            formik.resetForm({
                values: {
                    amount: "",
                    payment_date: defaultDate,
                },
            });
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add Payment
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {formik.errors?.general && (
                        <Alert variant="danger">
                            {formik.errors?.general}
                        </Alert>
                    )}

                    <AppInput
                        label="Amount"
                        type="number"
                        name="amount"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched?.amount &&
                            formik.errors?.amount
                        }
                    />

                    <AppInput
                        label="Payment Date"
                        type="date"
                        name="payment_date"
                        value={formik.values.payment_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched?.payment_date &&
                            formik.errors?.payment_date
                        }
                    />

                </Modal.Body>

                <Modal.Footer>

                    <AppButton
                        type="button"
                        variant="secondary"
                        onClick={onHide}
                    >
                        Cancel
                    </AppButton>

                    <AppButton
                        type="submit"
                        loading={formik.isSubmitting}
                    >
                        Save
                    </AppButton>

                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PaymentModal;