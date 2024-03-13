import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import { BsPersonLinesFill, BsPersonFillLock } from "react-icons/bs";

import "./Settings.css";
import AccessCard from "../../components/access-card/AccessCard";

const Settings = () => {
  const navigate = useNavigate();

  // Get access type; owner (1) and cashier (2)
  const access = useSelector((state) => state.auth.user.access_type);

  useEffect(() => {
    if (access === 2) {
      navigate("/invoice");
    }
  });

  // Levels of access descriptions
  const accessLevels = [
    {
      title: "Owner",
      icon: (
        <BsPersonLinesFill
          style={{
            width: "25px",
            height: "25px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        />
      ),
      access: [
        { description: "Overall access of inventory and sales", isCheck: true },
        { description: "View all pages", isCheck: true },
        { description: "Download sales and inventory", isCheck: true },
        {
          description: "Add, update, and delete from the inventory",
          isCheck: true,
        },
        { description: "Able to view the database sheets", isCheck: true },
      ],
    },
    {
      title: "Cashier",
      icon: (
        <BsPersonFillLock
          style={{
            width: "25px",
            height: "25px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        />
      ),
      access: [
        {
          description: "Overall access of inventory and sales",
          isCheck: true,
        },
        { description: "View all pages", isCheck: false },
        { description: "Download sales and inventory", isCheck: false },
        {
          description: "Add, update, and delete from the inventory",
          isCheck: false,
        },
        { description: "Able to view the database sheets", isCheck: true },
      ],
    },
  ];

  return (
    <>
      <Container className="settings-container">
        <Col>
          <Card className="mb-3 settings-card">
            <Card.Body>
              <Row>
                <Col>
                  <Card.Title>Administrative Access</Card.Title>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <hr className="my-4" />
        </Col>
        <Row>
          {accessLevels.map((accessLevel, index) => (
            <AccessCard
              key={index}
              title={accessLevel.title}
              icon={accessLevel.icon}
              accessList={accessLevel.access}
            />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Settings;
