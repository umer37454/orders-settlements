import { useEffect, useMemo, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";

import { createOrder, getOrder, updateOrder } from "../../../api/order";
import OrderItemsTable from "../../../components/common/order/OrderItemsTable";
import AppInput from "../../../components/common/AppInput";
import AppButton from "../../../components/common/AppButton";
import orderSchema from "../../../validation/order/orderSchema";

import PaymentHistory from "../../../components/common/payment/PaymentHistory";
import PaymentModal from "../../../components/common/payment/PaymentModal";

const OrderForm = ({ mode }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isView = mode === "view";

    const [loading, setLoading] = useState(!isCreate);

    const [order, setOrder] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const defaultDate = today.toISOString().split("T")[0];

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            customer_name: "",
            due_date: defaultDate,
            items: [
                {
                    id: null,
                    description: "",
                    quantity: 1,
                    unit_price: 0,
                },
            ],
        },

        validationSchema: isView ? null : orderSchema,

        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                if (isCreate) {
                    await createOrder(values);
                } else {
                    await updateOrder(id, values);
                }

                navigate("/", {
                    replace: true,
                });
            } catch (error) {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({
                        general:
                            error.response?.data?.message ??
                            "Something went wrong.",
                    });
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    const loadOrder = async () => {
        try {
            const response = await getOrder(id);
            const order = response.data;

            if (!order) {
                navigate("/");
                return;
            }

            setOrder(order);

            formik.setValues({
                customer_name: order.customer_name,
                due_date: order.due_date,
                items: order.items.map((item) => ({
                    id: item.id,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                })),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isCreate) {
            loadOrder();
        }

    }, [id, isCreate]);

    const total = useMemo(() => {
        return formik.values.items.reduce((sum, item) => {
            return (
                sum +
                Number(item.quantity || 0) * Number(item.unit_price || 0)
            );
        }, 0);
    }, [formik.values.items]);

    const handleAddItem = () => {
        formik.setFieldValue("items", [
            ...formik.values.items,
            { id: null, description: "", quantity: 1, unit_price: 0 },
        ]);
    };

    const handleRemoveItem = (index) => {
        const updated = formik.values.items.filter((_, i) => i !== index);
        formik.setFieldValue("items", updated);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Card>
            <Card.Body>
                <h3 className="mb-4">
                    {isCreate
                        ? "Create Order"
                        : isEdit
                            ? "Edit Order"
                            : "Order Details"}
                </h3>

                {formik.errors.general && (
                    <div className="alert alert-danger">
                        {formik.errors.general}
                    </div>
                )}

                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <AppInput
                                label="Customer Name"
                                name="customer_name"
                                value={formik.values.customer_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isView}
                                error={
                                    formik.touched.customer_name &&
                                    formik.errors.customer_name
                                }
                            />
                        </Col>

                        <Col md={6}>
                            <AppInput
                                type="date"
                                label="Due Date"
                                name="due_date"
                                value={formik.values.due_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isView}
                                error={
                                    formik.touched.due_date &&
                                    formik.errors.due_date
                                }
                            />
                        </Col>
                    </Row>

                    <h5 className="mb-3">Line Items</h5>

                    <OrderItemsTable
                        items={formik.values.items}
                        errors={formik.errors.items}
                        touched={formik.touched.items}
                        readOnly={isView}
                        disableDelete={!isCreate && (order?.payments?.length ?? 0) > 0}
                        onChange={(items) => formik.setFieldValue("items", items)}
                        onAdd={handleAddItem}
                        onRemove={handleRemoveItem}
                    />

                    {typeof formik.errors.items === "string" && (
                        <div className="text-danger mt-2">
                            {formik.errors.items}
                        </div>
                    )}

                    <div className="d-flex justify-content-end mt-4">
                        <h4>Total : ₹ {total.toFixed(2)}</h4>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        {!isCreate &&
                            (
                                <>
                                    <h5 className="mb-2">Payment History</h5>
                                    <h6 className="mb-0">Balance : ₹ {order?.remaining_amount}</h6>
                                </>
                            )}

                        {isEdit && order?.status !== "paid" && (
                            <AppButton
                                type="button"
                                onClick={() => setShowPaymentModal(true)}
                            >
                                Add Payment
                            </AppButton>
                        )}
                    </div>

                    {isEdit && (
                        <PaymentModal
                            show={showPaymentModal}
                            onHide={() => setShowPaymentModal(false)}
                            orderId={id}
                            onSuccess={loadOrder}
                        />
                    )}

                    {!isCreate && (
                        <PaymentHistory payments={isCreate ? [] : order?.payments ?? []} />
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <AppButton
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/", {
                                replace: true,
                            })}
                        >
                            Back
                        </AppButton>

                        {!isView && (
                            <AppButton
                                type="submit"
                                loading={formik.isSubmitting}
                            >
                                {isCreate ? "Create Order" : "Update Order"}
                            </AppButton>
                        )}
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default OrderForm;