import { Button, Spinner } from "react-bootstrap";

const AppButton = ({
    children,
    type = "button",
    variant = "primary",
    loading = false,
    className = "",
    ...props
}) => {
    return (
        <Button
            type={type}
            variant={variant}
            disabled={loading}
            className={className}
            {...props}
        >
            {loading ? (
                <>
                    <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                    />
                    Please wait...
                </>
            ) : (
                children
            )}
        </Button>
    );
};

export default AppButton;