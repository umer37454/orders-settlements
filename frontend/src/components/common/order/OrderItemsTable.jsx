import { Button, Form, Table, OverlayTrigger, Tooltip } from "react-bootstrap";

const OrderItemsTable = ({
    items,
    onChange,
    onAdd,
    onRemove,
    readOnly = false,
    errors = null,
    touched = null,
    disableDelete = false
}) => {
    const handleChange = (index, field, value) => {
        if (!onChange) return;

        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]:
                field === "quantity" || field === "unit_price"
                    ? Number(value)
                    : value,
        };

        onChange(updatedItems);
    };

    const getFieldError = (index, field) => {
        if (!errors || typeof errors === "string") return null;
        return errors?.[index]?.[field];
    };

    return (
        <>
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>Description</th>
                        <th style={{ width: "15%" }}>Qty</th>
                        <th style={{ width: "20%" }}>Unit Price</th>
                        <th style={{ width: "20%" }}>Subtotal</th>

                        {!readOnly && <th style={{ width: "5%" }}>Action</th>}
                    </tr>
                </thead>

                <tbody>
                    {items.map((item, index) => {
                        const subtotal =
                            Number(item.quantity || 0) *
                            Number(item.unit_price || 0);

                        const descError = getFieldError(index, "description");
                        const qtyError = getFieldError(index, "quantity");
                        const priceError = getFieldError(index, "unit_price");

                        return (
                            <tr key={item.id ?? index}>
                                <td>
                                    <Form.Control
                                        value={item.description}
                                        disabled={readOnly}
                                        isInvalid={!!descError}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {descError}
                                    </Form.Control.Feedback>
                                </td>

                                <td>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        disabled={readOnly}
                                        isInvalid={!!qtyError}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {qtyError}
                                    </Form.Control.Feedback>
                                </td>

                                <td>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={item.unit_price}
                                        disabled={readOnly}
                                        isInvalid={!!priceError}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "unit_price",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {priceError}
                                    </Form.Control.Feedback>
                                </td>

                                <td>
                                    <strong>{subtotal.toFixed(2)}</strong>
                                </td>

                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>
                                            Cannot delete item because payments have already been recorded for this order.
                                        </Tooltip>
                                    }
                                >
                                    <span className="d-inline-block">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => onRemove(index)}
                                            disabled={readOnly || disableDelete}
                                            style={
                                                readOnly || disableDelete
                                                    ? { pointerEvents: "none" }
                                                    : {}
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </span>
                                </OverlayTrigger>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {!readOnly && (
                <Button variant="primary" onClick={onAdd}>
                    + Add Item
                </Button>
            )}
        </>
    );
};

export default OrderItemsTable;