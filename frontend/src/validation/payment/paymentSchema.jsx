import * as Yup from "yup";

const paymentSchema = Yup.object({
    amount: Yup.number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than 0")
        .required("Amount is required"),

    payment_date: Yup.date()
        .required("Payment date is required"),
});

export default paymentSchema;