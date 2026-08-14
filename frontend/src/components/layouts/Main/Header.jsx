import { Navbar, Container, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
    const { logout } = useAuth();

    return (
        <Navbar bg="white" className="border-bottom shadow-sm px-3">
            <Container fluid>
                <Navbar.Brand className="fw-semibold">
                    Orders & Settlements
                </Navbar.Brand>

                <Button
                    variant="outline-danger"
                    onClick={logout}
                >
                    Logout
                </Button>
            </Container>
        </Navbar>
    );
};

export default Header;