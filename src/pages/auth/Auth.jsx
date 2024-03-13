import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signin } from "../../redux/actions/authAction";
import {
  Container,
  Card,
  Form,
  Button,
  Modal,
  Spinner,
  Image,
} from "react-bootstrap";

import "./Auth.css";
import YonzonLogo from "../../assets/images/yonzon-logo.png";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Required fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/yonzon/invoice");
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async () => {
    if (username.length === 0 || password.length === 0) {
      setModalMessage(
        "Username and password cannot be empty. Please fill in the required fields."
      );
      setShowModal(true);
      return;
    }

    await dispatch(signin({ username, password })).then((result) => {
      if (result.error && result.payload === "Unauthorized") {
        setModalMessage("Incorrect username or password. Please try again.");
        setShowModal(true);
      }
    });

    if (isAuthenticated) {
      navigate("/yonzon/invoice");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="auth-container">
      <Container>
        <Card
          style={{ maxWidth: "400px", margin: "auto" }}
          className="auth-card"
        >
          <Card.Body>
            <Container className="text-center">
              <Image src={YonzonLogo} width={330} className="auth-image" />
            </Container>
            <Container>
              <h2 className="mt-3 text-center">Sign In</h2>
            </Container>
            <Form>
              <Form.Group controlId="formUsername" className="mt-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-form"
                  style={{ color: "white" }}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-form"
                />
              </Form.Group>
              <Button
                onClick={handleSignIn}
                className="w-100 my-4 yonzon-button"
              >
                {/* Conditional rendering of loader icon */}
                {status === "loading" ? (
                  <Spinner
                    animation="border"
                    role="status"
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>
            <Card.Text className="text-center">
              Need assistance?{" "}
              <a href="mailto:yonzondev@gmail.com" className="auth-help">
                Contact support
              </a>
            </Card.Text>
          </Card.Body>
        </Card>
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          className="auth-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button className="yonzon-button" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Auth;
