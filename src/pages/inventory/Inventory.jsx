import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import {
  BsFillPlusSquareFill,
  BsQuestionSquareFill,
  BsTrashFill,
  BsPencilSquare,
  BsArrowDownSquareFill,
  BsArrowRepeat,
  BsSearch,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getItems, addItem, getCSV } from "../../redux/actions/itemAction";

import "./Inventory.css";
import InventoryItem from "../../components/inventory-item/InventoryItem";
import Paginate from "../../components/paginate/Paginate";

const Inventory = () => {
  // Set up redux fetching
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.item.getItems); // Destructure get items

  // Get access type; owner (1) and cashier (2)
  const access = useSelector((state) => state.auth.user.access_type);

  // Search state
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isAddModal, setIsAddModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [isExistsModal, setIsExistsModal] = useState(false);
  const [isProductEmptyModal, setIsProductEmptyModal] = useState(false);

  // Required fields
  const [productValue, setProductValue] = useState("Dashcams");
  const [modelValue, setModelValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [quantityValue, setQuantityValue] = useState("");

  // Get items redux fetch
  useEffect(() => {
    const fetchItems = () => {
      dispatch(getItems());
    };

    fetchItems();
  }, [dispatch]);

  // Get CSV redux fetch
  const handleDownload = async () => {
    dispatch(getCSV());

    // Modal get state
    setIsSuccessModal(true);
  };

  // Get items redux fetch
  const handleRefetch = async () => {
    dispatch(getItems());
  };

  // Add item redux fetch
  const handleAddItem = async () => {
    const isExists = items.some((item) => item.model === modelValue);

    if (isExists) {
      setIsExistsModal(!isExistsModal);
      return;
    }

    if (productValue === "") {
      setIsProductEmptyModal(!isProductEmptyModal);
      return;
    }

    const item = {
      model: modelValue,
      product: productValue,
      price: parseFloat(priceValue),
      quantity: parseInt(quantityValue),
    };

    dispatch(addItem(item));
    dispatch(getItems());

    // Modal post state
    setProductValue("");
    setModelValue("");
    setPriceValue("");
    setQuantityValue("");
    setIsAddModal(false);
    setIsSuccessModal(true);
  };

  // Drop down modal choices
  const choices = [
    "Dashcams",
    "LED Lights",
    "X-Films",
    "Car Cover",
    "Car Mattings",
    "Pristine Car Care",
    "Other Accessories",
  ];

  // Search logic
  const handleSearch = (e) => {
    const max = 33; // Set maximum characters
    let input = e.target.value.toLowerCase();

    if (input.length > max) {
      input = input.slice(0, max);
    }

    // Capitalize the first letter
    input = input.charAt(0).toUpperCase() + input.slice(1);

    setSearch(input);
    setCurrentPage(1);
  };

  // Pagination logic
  const filteredItems = items.filter(
    (item) =>
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase()) ||
      item.price.toString().includes(search.toLowerCase())
  );

  const itemsPerPage = 6; // Total items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Container className="inventory-container">
        <Row>
          <Col>
            <Card className="mb-3 inventory-card">
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title className="inventory-title">
                      Yonzon Inventory / {search.length === 0 ? "All" : search}
                    </Card.Title>
                  </Col>
                  <Col md={4} className="ml-4">
                    <Form>
                      <Form.Group controlId="searchBar">
                        <InputGroup className="mb-3">
                          <InputGroup.Text>
                            <BsSearch />
                          </InputGroup.Text>{" "}
                          <FormControl
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            className="inventory-form"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <BsQuestionSquareFill
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3 mt-1"
                  onClick={() => setIsInfoModal(true)}
                />
                {access === 1 && (
                  <>
                    <BsFillPlusSquareFill
                      style={{
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      className="me-3 mt-1"
                      onClick={() => setIsAddModal(true)}
                    />
                    <BsArrowDownSquareFill
                      style={{
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                        color: "#fa1e4e",
                      }}
                      className="me-3 mt-1"
                      onClick={handleDownload}
                    />
                  </>
                )}
                <BsArrowRepeat
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3 mt-1"
                  onClick={handleRefetch}
                />
              </Card.Body>
            </Card>
            <hr className="my-4" />
            {status === "pending" ? (
              <Card.Text className="text-center">Loading...</Card.Text>
            ) : currentItems.length <= 0 ? (
              <Card.Text className="text-center">No Items Found</Card.Text>
            ) : (
              currentItems.map((item, index) => (
                <InventoryItem key={index} {...item} />
              ))
            )}
          </Col>
        </Row>
      </Container>
      {/* Pagination */}
      <Paginate
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems.length}
        currentPage={currentPage}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
      {/* Modals */}
      {isAddModal && (
        <Modal
          show={isAddModal !== false}
          onHide={() => setIsAddModal(false)}
          className="inventory-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formProduct" className="mt-3">
                <Form.Label>Product</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    className="inventory-dropdown-toggle"
                  >
                    {productValue || "Select a Product"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {choices.map((choice, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => setProductValue(choice)}
                      >
                        {choice}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group controlId="formModel" className="mt-3">
                <Form.Label>Model</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter model name"
                  value={modelValue}
                  onChange={(e) => setModelValue(e.target.value)}
                  className="inventory-form"
                />
              </Form.Group>
              <Form.Group controlId="formPrice" className="mt-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  className="inventory-form"
                />
              </Form.Group>
              <Form.Group controlId="formQuantity" className="mt-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quantity"
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(e.target.value)}
                  className="inventory-form"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsAddModal(false)}>
              Close
            </Button>
            <Button className="yonzon-button" onClick={handleAddItem}>
              Add Product
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isSuccessModal && (
        <Modal
          show={isSuccessModal !== false}
          onHide={() => setIsSuccessModal(false)}
          className="inventory-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Operation completed successfully!</Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setIsSuccessModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isExistsModal && (
        <Modal
          show={isExistsModal !== false}
          onHide={() => setIsExistsModal(false)}
          className="inventory-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Item Exists</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Item already exists, if you wish to add a new value to a product
            then use update product instead.
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setIsExistsModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isProductEmptyModal && (
        <Modal
          show={isProductEmptyModal !== false}
          onHide={() => setIsProductEmptyModal(false)}
          className="inventory-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Empty Product Field</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please select a specific product category</Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setIsProductEmptyModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isInfoModal && (
        <Modal
          show={isInfoModal !== false}
          onHide={() => setIsInfoModal(false)}
          className="inventory-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              <li className="my-3">
                <BsFillPlusSquareFill
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3"
                />
                Add Product - add product into the inventory.
              </li>
              <li className="my-3">
                <BsPencilSquare
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3"
                />
                Update Product - edit contents of the product.
              </li>
              <li className="my-3">
                <BsTrashFill
                  style={{
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    color: "#fa1e4e",
                  }}
                  className="me-3"
                />
                Delete Product - remove product from the inventory.
              </li>
              <li className="my-3">
                <BsArrowDownSquareFill
                  style={{
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    color: "#fa1e4e",
                  }}
                  className="me-3"
                />
                Download Data - get sales and inventory data.
              </li>
              <li className="my-3">
                <BsArrowRepeat
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3"
                />
                Refresh Data - refetch data from the database.
              </li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setIsInfoModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Inventory;
