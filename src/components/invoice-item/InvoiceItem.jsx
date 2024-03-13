import { useState } from "react";
import { Card, Row, Col, Modal, Form, Button } from "react-bootstrap";

import PropTypes from "prop-types";
import Model from "../model/Model";
import "./InvoiceItem.css";

const InvoiceItem = ({ id, product, model, quantity, price, onItemSelect }) => {
  // const [newQuantity, setQuantity] = useState(0); // state for newQuantity
  const [isAddModal, setIsAddModal] = useState(false);
  const [amountValue, setAmountValue] = useState(0);

  const maximumCharacters = 15; // set maximum characters to be shown

  // Increment quantity
  const handleItemSelect = () => {
    // const totalQuantity =
    //   quantity > newQuantity ? newQuantity + 1 : newQuantity;
    // setQuantity(totalQuantity); // update quantity state
    const selectItem = {
      id: id,
      product: product,
      model: model,
      quantity: parseInt(amountValue),
      price: price,
    };
    console.log(selectItem);

    if (quantity >= amountValue) {
      onItemSelect(selectItem);
    }
  };

  // Decrement newQuantity
  // const handleItemDeselect = () => {
  //   if (newQuantity > 0) {
  //     const totalQuantity =
  //       quantity >= newQuantity ? newQuantity - 1 : newQuantity;
  //     setQuantity(totalQuantity); // Update quantity state
  //     onItemSelect({
  //       id: id,
  //       product: product,
  //       model: model,
  //       quantity: totalQuantity, // Pass updated quantity
  //       price: price,
  //     });
  //   }
  // };

  // Comma based on number digits logic
  const formatNumber = (num) => {
    const numStr = num.toString();

    const numDigits = numStr.length;

    if (numDigits >= 4) {
      return `${numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.00`;
    }

    return `${numStr}.00`;
  };

  // When length of characters exceeds
  const formatText = (text) => {
    if (text.length > maximumCharacters) {
      return text.substring(0, maximumCharacters) + "...";
    }
    return text;
  };

  return (
    <>
      <Card
        className="mb-3 mx-1 text-center invoice-item"
        style={{
          cursor: "pointer",
          color: "#ffffff",
          border: "1px solid transparent",
          backgroundColor: "#303030cc",
        }}
        onClick={() => setIsAddModal(!isAddModal)}
      >
        <Card.Body>
          <Row>
            <Col>
              <Model modelName={model} />
              <hr />
              <Card.Title>{formatText(model)}</Card.Title>
              <Card.Text>Php {formatNumber(price)}</Card.Text>
              <Card.Text>{quantity} in stock</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {isAddModal && (
        <Modal
          show={isAddModal !== false}
          onHide={() => setIsAddModal(false)}
          className="inventory-item-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add to Checkout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formPrice" className="mt-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                  className="inventory-item-form"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddModal(false);
                setAmountValue(0);
              }}
            >
              Close
            </Button>
            <Button
              className="yonzon-button"
              onClick={() => {
                setIsAddModal(false);
                handleItemSelect();
                setAmountValue(0);
              }}
            >
              Add Amount
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

InvoiceItem.propTypes = {
  id: PropTypes.number,
  product: PropTypes.string,
  model: PropTypes.string,
  quantity: PropTypes.number,
  price: PropTypes.number,
  onItemSelect: PropTypes.func,
};

export default InvoiceItem;
