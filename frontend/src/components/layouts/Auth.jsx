import { Card, Col, Container, Row } from "react-bootstrap";

const Auth = ({ title, children }) => {
    return (
        <Container fluid className="bg-light min-vh-100">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={11} sm={8} md={6} lg={4}>
                    <Card className="shadow border-0">
                        <Card.Body className="p-4">
                            <h3 className="text-center mb-4">
                                {title}
                            </h3>

                            {children}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Auth;