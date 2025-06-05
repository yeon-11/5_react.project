import {
    Button,
    Container,
    Form,
    Nav,
    Navbar,
    NavDropdown,
    Offcanvas
} from 'react-bootstrap';

// Header 컴포넌트: 오프캔버스 방식의 반응형 내비게이션
const Header = () => {
    return (
        <>
        {['sm'].map((expand) => (
            <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
                <Container fluid>
                    <Navbar.Brand href="#">YEON</Navbar.Brand>

                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />

                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${expand}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                        placement="start"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                오프캔버스 메뉴
                            </Offcanvas.Title>
                        </Offcanvas.Header>

                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link href="">Home</Nav.Link>
                                <Nav.Link href="">Link</Nav.Link>

                                <NavDropdown
                                    title="Drop"
                                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                                >
                                    <NavDropdown.Item href="">one</NavDropdown.Item>
                                    <NavDropdown.Item href="">two</NavDropdown.Item>
                                    <NavDropdown.Item href="">three</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>

                            <Form className="d-flex mt-3 mt-sm-0">
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                />
                                <Button variant="outline-secondary">
                                    Search
                                </Button>
                            </Form>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        ))}
        </>
    );
};

export default Header;
