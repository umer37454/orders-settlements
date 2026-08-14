import { useEffect, useState } from "react";
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getOrders } from "../../../api/order";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Order = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await getOrders();

            setOrders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteOrder(id);

            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "paid":
                return "success";

            case "partially_paid":
                return "warning";

            case "due":
                return "info";

            case "overdue":
                return "danger";

            case "pending":
                return "secondary";

            default:
                return "secondary";
        }
    };

    return (
        <Card>
            <Card.Body>

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h3 className="mb-0">
                        Orders
                    </h3>

                    <Button
                        onClick={() =>
                            navigate("/orders/create")
                        }
                    >
                        Create Order
                    </Button>

                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                        No orders found.
                    </div>
                ) : (
                    <Table
                        bordered
                        hover
                        responsive
                    >
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Remaining</th>
                                <th width={220}>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        {order.customer_name}
                                    </td>

                                    <td>
                                        {order.due_date}
                                    </td>

                                    <td>
                                        <Badge bg={getStatusVariant(order.status)}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </td>

                                    <td>
                                        ₹ {order.total}
                                    </td>

                                    <td>
                                        ₹ {order.paid_amount}
                                    </td>

                                    <td>
                                        ₹ {order.remaining_amount}
                                    </td>

                                    <td>

                                        <Button
                                            size="sm"
                                            variant="info"
                                            className="me-2"
                                            onClick={() =>
                                                navigate(
                                                    `/orders/${order.id}`
                                                )
                                            }
                                        >
                                            View
                                        </Button>

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    Edit Order & Add Payment
                                                </Tooltip>
                                            }
                                        >
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                className="me-2"
                                                onClick={() => navigate(`/orders/${order.id}/edit`)}
                                            >
                                                Edit
                                            </Button>
                                        </OverlayTrigger>

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() =>
                                                handleDelete(
                                                    order.id
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default Order;