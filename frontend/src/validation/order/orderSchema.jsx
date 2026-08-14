import * as Yup from "yup";

const orderSchema = Yup.object({
    customer_name: Yup.string()
        .trim()
        .required("Customer name is required"),

    due_date: Yup.date()
        .required("Due date is required"),

    items: Yup.array()
        .min(1, "At least one item is required")
        .of(
            Yup.object({
                description: Yup.string()
                    .trim()
                    .required("Description is required"),

                quantity: Yup.number()
                    .typeError("Quantity must be a number")
                    .positive("Quantity must be greater than 0")
                    .integer("Quantity must be an integer")
                    .required("Quantity is required"),

                unit_price: Yup.number()
                    .typeError("Unit price must be a number")
                    .min(0, "Unit price cannot be negative")
                    .required("Unit price is required"),
            })
        ),
});

export default orderSchema;