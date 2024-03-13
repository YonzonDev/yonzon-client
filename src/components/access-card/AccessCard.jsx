import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Modal,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import { BsCheckSquareFill, BsXSquareFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { changePassword } from "../../redux/actions/userAction";

import PropTypes from "prop-types";
import "./AccessCard.css";

const AccessCard = ({ title, icon, accessList }) => {
  const dispatch = useDispatch();

  // Modals
  const [changeModal, setChangeModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);

  const [warningMessage, setWarningMessage] = useState("");

  // Passwords
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (
      currentPassword.length <= 0 &&
      newPassword.length <= 0 &&
      confirmPassword.length <= 0
    ) {
      setWarningMessage("Passwords cannot be empty");
      setWarningModal(!warningModal);
      return;
    }

    if (currentPassword === newPassword) {
      setWarningMessage(
        "New password should not be the same as current password."
      );
      setWarningModal(!warningModal);
      return;
    }

    if (newPassword !== confirmPassword) {
      setWarningMessage("New password and current password do not match.");
      setWarningModal(!warningModal);
      return;
    }

    const access = {
      username: title.toLowerCase(),
      password: currentPassword,
      newPassword: newPassword,
    };

    dispatch(changePassword(access));
    setSuccessModal(!successModal);
    setChangeModal(!changeModal);
  };

  return (
    <Container className="access-container">
      <Col>
        <Card className="mb-3 access-card-card">
          <Card.Body>
            <Card.Title>
              {icon} {title}
            </Card.Title>
            <Card.Text
              onClick={() => setChangeModal(!changeModal)}
              className="access-help"
            >
              Change password
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="mb-3 access-card-card">
          <Card.Body>
            <Row>
              {accessList.map((item, index) => (
                <Card.Text key={index} className="my-2">
                  {item.isCheck ? (
                    <BsCheckSquareFill
                      style={{
                        marginRight: "10px",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  ) : (
                    <BsXSquareFill
                      style={{
                        marginRight: "10px",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  )}
                  {item.description}
                </Card.Text>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
      {changeModal && (
        <Modal
          show={changeModal !== false}
          onHide={() => setChangeModal(false)}
          className="access-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Current Password */}
            <Form>
              <Form.Group controlId="formCurrentPassword" className="mt-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="current-password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="access-form"
                />
              </Form.Group>
            </Form>
            {/* New Password */}
            <Form>
              <Form.Group controlId="formNewPassword" className="mt-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="new-password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="access-form"
                />
              </Form.Group>
            </Form>
            {/* Confirm Password */}
            <Form>
              <Form.Group controlId="formConfirmPassword" className="mt-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="access-form"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setChangeModal(false)}>
              Close
            </Button>
            <Button className="yonzon-button" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {successModal && (
        <Modal
          show={successModal !== false}
          onHide={() => setSuccessModal(false)}
          className="access-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Operation completed successfully!</Modal.Body>
          <Modal.Footer>
            <Button className="yonzon-button" onClick={() => setSuccessModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {warningModal && (
        <Modal
          show={warningModal !== false}
          onHide={() => setWarningModal(false)}
          className="access-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>{warningMessage}</Modal.Body>
          <Modal.Footer>
            <Button className="yonzon-button" onClick={() => setWarningModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

AccessCard.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  accessList: PropTypes.array,
};

export default AccessCard;
