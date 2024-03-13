import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Modal,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import {
  BsTrashFill,
  BsPencilSquare,
  BsFillExclamationSquareFill,
} from "react-icons/bs";
import {
  updateItem,
  deleteItem,
  getItems,
} from "../../redux/actions/itemAction";
import { useDispatch, useSelector } from "react-redux";

import "./InventoryItem.css";
import PropTypes from "prop-types";
import Model from "../../components/model/Model";

const InventoryItem = ({ id, product, model, price, quantity }) => {
  // Set up redux fetching
  const dispatch = useDispatch();
  // const updateStatus = useSelector((state) => state.item.updateItem.status); // Get update item status
  // const deleteStatus = useSelector((state) => state.item.deleteItem.status); // Get delete item status

  // Get access type; owner (1) and cashier (2)
  const access = useSelector((state) => state.auth.user.access_type);

  // Modals
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);

  // Required fields
  const [priceValue, setPriceValue] = useState(price);
  const [quantityValue, setQuantityValue] = useState(quantity);

  const handleRefetch = async () => {
    dispatch(getItems());
  };

  useEffect(() => {
    const handleWarningFetch = () => {
      if (quantity <= 5) {
        setWarningModal(!warningModal);
      }
    };

    handleWarningFetch();
  }, [quantity, setWarningModal]);

  // Update item redux fetch
  const handleUpdateItem = async () => {
    const item = {
      id: id,
      price: priceValue,
      quantity: quantityValue,
    };

    dispatch(updateItem(item));

    // Modal post state
    setSuccessModal(true);
    setPriceValue("");
    setQuantityValue("");
    setIsUpdateModal(false);

    handleRefetch();
  };

  // Delete item redux fetch
  const handleDeleteItem = async () => {
    dispatch(deleteItem(id));

    // Modal post state
    setSuccessModal(true);
    setIsDeleteModal(false);

    handleRefetch();
  };

  // Comma based on number digits logic
  const formatNumber = (num) => {
    const numStr = num.toString();

    const numDigits = numStr.length;

    if (numDigits >= 4) {
      return `${numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.00`;
    }

    return `${numStr}.00`;
  };

  return (
    <Container className="inventory-item-container">
      <Card className="mt-3 inventory-item-card">
        <Card.Body>
          <Row>
            <Col>
              <Model modelName={model} />
            </Col>
            <Col>
              <Card.Title>{model}</Card.Title>
              <Card.Text>{product}</Card.Text>
            </Col>
            <Col>
              <Card.Title>Price</Card.Title>
              <Card.Text>Php {formatNumber(price)}</Card.Text>
            </Col>
            <Col>
              <Card.Title>Quantity</Card.Title>
              <Card.Text>
                {quantity}
                {quantity <= 5 && (
                  <BsFillExclamationSquareFill
                    className="mx-3 mb-1"
                    style={{ width: "25px", height: "25px", cursor: "pointer" }}
                    onClick={() => setWarningModal(!warningModal)}
                  />
                )}
              </Card.Text>
            </Col>
            <Col>
              <Card.Title>Total</Card.Title>
              <Card.Text>Php {formatNumber(quantity * price)}</Card.Text>
            </Col>
            <Col>
              {access === 1 && (
                <Row className="mt-3 d-flex text-center flex-row-start">
                  <Col>
                    <BsPencilSquare
                      style={{
                        marginLeft: "70px",
                        height: "25px",
                        width: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsUpdateModal(true)}
                    />
                  </Col>
                  <Col>
                    <BsTrashFill
                      style={{
                        height: "25px",
                        cursor: "pointer",
                        width: "25px",
                        color: "#fa1e4e",
                      }}
                      onClick={() => setIsDeleteModal(true)}
                    />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* Modals */}
      {isUpdateModal && (
        <Modal
          show={isUpdateModal !== false}
          onHide={() => {
            setIsUpdateModal(false);
            setPriceValue(price);
            setQuantityValue(quantity);
          }}
          className="inventory-item-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formPrice" className="mt-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  className="inventory-item-form"
                />
              </Form.Group>
              <Form.Group controlId="formQuantity" className="mt-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quantity"
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(e.target.value)}
                  className="inventory-item-form"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsUpdateModal(false);
                setPriceValue(price);
                setQuantityValue(quantity);
              }}
            >
              Close
            </Button>
            <Button className="yonzon-button" onClick={handleUpdateItem}>
              Update Product
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isDeleteModal && (
        <Modal
          show={isDeleteModal !== false}
          onHide={() => setIsDeleteModal(false)}
          className="inventory-item-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Delete product {product} - {model}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsDeleteModal(false)}>
              Close
            </Button>
            <Button className="yonzon-button" onClick={handleDeleteItem}>
              Delete Product
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {successModal && (
        <Modal
          show={successModal !== false}
          onHide={() => setSuccessModal(false)}
          className="inventory-item-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Operation completed successfully!</Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setSuccessModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {warningModal && (
        <Modal
          show={warningModal !== false}
          onHide={() => setWarningModal(false)}
          className="inventory-item-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {quantity} remaining quantity for {model}.
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setWarningModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

InventoryItem.propTypes = {
  choices: PropTypes.array,
  id: PropTypes.number,
  product: PropTypes.string,
  model: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
};

export default InventoryItem;
