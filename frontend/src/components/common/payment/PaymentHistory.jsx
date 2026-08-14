import { Table } from "react-bootstrap";

const PaymentHistory = ({ payments = [] }) => {
    return (
        <>
            {payments.length === 0 ? (
                <p className="text-muted mb-0">
                    No payments found.
                </p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.payment_date}</td>
                                <td>₹ {payment.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default PaymentHistory;