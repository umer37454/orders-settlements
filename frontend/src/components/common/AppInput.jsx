import { Form } from "react-bootstrap";

const AppInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    onBlur,
    placeholder = "",
    error,
    className = "",
    ...props
}) => {
    return (
        <Form.Group className={`mb-3 ${className}`}>
            {label && <Form.Label>{label}</Form.Label>}

            <Form.Control
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                isInvalid={!!error}
                {...props}
            />

            {error && (
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};

export default AppInput;