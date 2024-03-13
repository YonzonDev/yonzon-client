import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  Form,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getItems, addTransaction } from "../../redux/actions/itemAction";
import {
  BsQrCodeScan,
  BsBagCheckFill,
  BsBagDashFill,
  BsQuestionSquareFill,
  BsArrowRepeat,
  BsCartXFill,
  BsSearch,
} from "react-icons/bs";
import { baseURL } from "../../redux/constants/url";

import "./Invoice.css";
import jsPDF from "jspdf";
import Paginate from "../../components/paginate/Paginate";
import InvoiceItem from "../../components/invoice-item/InvoiceItem";
import YonzonLogo from "../../assets/images/yonzon-logo.png";

const Invoice = () => {
  // Set up redux fetching
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.item.getItems); // destructure get items

  // Modals
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [isQRCodeModal, setIsQRCodeModal] = useState(false);
  const [isTransactionModal, setIsTransactionModal] = useState(false);
  const [isInsufficientModal, setIsInsufficientModal] = useState(false);
  const [isEmptyModal, setIsEmptyModal] = useState(false);
  const [isChangeModal, setIsChangeModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Stacks the selected items
  const [selectedItems, setSelectedItems] = useState([]);

  // Search state
  const [search, setSearch] = useState("");

  // Fetch to be purchased item
  const [item, setItem] = useState({});
  const [checkout, setCheckout] = useState(0);
  const [change, setChange] = useState(0);

  const [selectedFilter, setSelectedFilter] = useState("");

  const filterOptions = [
    "Dashcams",
    "LED Lights",
    "X-Films",
    "Car Cover",
    "Car Mattings",
    "Pristine Car Care",
    "Other Accessories",
  ];

  // Display product item data
  const handleGetItem = () => {
    const { id } = item;
    return `${baseURL}/get-item/${id}`;
  };

  // Call as a variable
  const generateURL = handleGetItem();

  // Get total price
  const handleTotalPrice = () => {
    return selectedItems
      .map((item) => (item.amount === undefined ? 1 : item.amount) * item.price)
      .reduce((acc, price) => acc + price, 0);
  };

  const totalPrice = handleTotalPrice();
  const totalAmount = selectedItems.reduce(
    (accumulator, currentValue) =>
      accumulator +
      (typeof currentValue.quantity === "number" ? currentValue.quantity : 1),
    0
  );

  const handleDownloadReceipt = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set initial Y position
    let y = 10;

    // Add transaction date
    doc.setFontSize(10);
    doc.text(`Transaction Date: ${getCurrentDate()}`, 10, 10);

    // Add Yonzon logo image as receipt header
    const imgData = YonzonLogo; // Convert the image to Base64
    doc.addImage(imgData, "PNG", 75, 20, 50, 20); // Adjust the position and size of the image as needed

    // Add "Receipt" text
    doc.setFontSize(12);
    doc.text("Receipt", 90, 50);

    // Add line divider
    doc.setLineWidth(0.5);
    doc.line(10, 60, 200, 60);

    // Add purchased items
    y = 80; // Adjust starting Y position for purchased items
    doc.text("Quantity", 15, 70);
    doc.text("Product", 90, 70);
    doc.text("Price", 150, 70);
    selectedItems.forEach((item) => {
      // Item details
      doc.text(`x${item.quantity === undefined ? 1 : item.quantity}`, 15, y);
      doc.text(`${item.product}`, 90, y);
      doc.text(`Php ${formatNumber(item.price)}`, 150, y);

      y += 10; // Increase Y position for the next item
    });

    // Add line divider
    doc.line(10, y, 200, y);

    // Add total amount, amount tendered, and change remaining
    y += 10; // Adjust Y position
    doc.setFontSize(12);
    doc.text(`Total Amount: Php ${formatNumber(totalPrice)}`, 120, y);
    y += 10; // Adjust Y position
    doc.text(`Amount Tendered: Php ${formatNumber(checkout)}`, 120, y);

    // Add line between "Amount Tendered" and "Change"
    y += 5; // Adjust Y position
    doc.line(120, y + 3, 200, y + 3); // Draw a line

    y += 10; // Adjust Y position
    doc.text(`Change: Php ${formatNumber(checkout - totalPrice)}`, 120, y);

    const currentDate = new Date().toLocaleDateString("en-GB");
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const currentDateTime = `${currentDate} ${currentTime}`;
    // Save and download the PDF
    doc.save(`Receipt ${currentDateTime}.pdf`);

    clearTransaction();
    setCheckout("");
  };

  // Get items redux fetch
  useEffect(() => {
    const fetchItems = () => {
      dispatch(getItems());
    };

    fetchItems();
  }, [dispatch]);

  // Clear selected items
  const clearTransaction = () => {
    setSelectedItems([]);
  };

  // Get date for transactions made
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // Get items redux fetch
  const handleRefetch = async () => {
    dispatch(getItems());
  };

  // Open QR code modal and pass required fields
  const handleQRCode = (item) => {
    setIsQRCodeModal(!isQRCodeModal);
    setItem(item);
  };

  // Add transaction redux fetch
  const handleAddTransaction = async () => {
    if (checkout < totalPrice) {
      setIsInsufficientModal(!isInsufficientModal);
      setIsTransactionModal(!isTransactionModal);
      return;
    }

    if (selectedItems.length <= 0) {
      setIsEmptyModal(!isEmptyModal);
      setIsTransactionModal(!isTransactionModal);
      return;
    }

    if (selectedItems.length > 0) {
      for (const { id, quantity, model, price, product } of selectedItems) {
        const date = getCurrentDate();
        const transaction = {
          id: id,
          model: model,
          product: product,
          orders: quantity >= 1 ? quantity : 1,
          price: price * (quantity >= 1 ? quantity : 1),
          date: date,
        };

        setChange(checkout - totalPrice);
        setIsTransactionModal(!isTransactionModal);
        setIsChangeModal(!isChangeModal);
        dispatch(addTransaction(transaction));
      }

      handleRefetch();
      handleDownloadReceipt();
    }
  };

  const handleItemSelected = (selectedItem) => {
    if (selectedItem.quantity === 0) {
      // If quantity becomes 0, remove the item from the array
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.id !== selectedItem.id)
      );
    } else {
      const existingItemIndex = selectedItems.findIndex(
        (item) => item.id === selectedItem.id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...selectedItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          amount: selectedItem.quantity, // Update amount
        };

        setSelectedItems(updatedItems);
      } else {
        // Check if the length of selectedItems is less than 10 before adding a new item
        if (selectedItems.length < 10) {
          setSelectedItems((prevSelectedItems) => [
            ...prevSelectedItems,
            selectedItem,
          ]);
        } else {
          // If the array already contains 10 items, disregard the new item
          return;
        }
      }
    }
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

  // Search logic
  const handleSearch = (e) => {
    const max = 33; // Set maximum characters
    let input = e.target.value.toLowerCase();

    if (input.length > max) {
      input = input.slice(0, max);
    }

    // Capitalize the first letter
    input = input.charAt(0).toUpperCase() + input.slice(1);

    setCurrentPage(1);
    setSearch(input);
  };

  const handleItemDeselect = (itemToRemove) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item.id !== itemToRemove.id)
    );
  };

  // Pagination logic
  const filteredItems = items.filter(
    (item) =>
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase()) ||
      item.price.toString().includes(search.toLowerCase())
  );

  const filteredByCategory = selectedFilter
    ? filteredItems.filter(
        (item) => item.product.toLowerCase() === selectedFilter.toLowerCase()
      )
    : filteredItems;

  // Calculate total number of filtered items
  const totalFilteredItems = filteredByCategory.length;

  const itemsPerPage = 9; // set amount of items shown per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredByCategory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      <Container className="invoice-container">
        <Row>
          <Card className="invoice-card">
            <Card.Body>
              <Row>
                <Col>
                  <Card.Title>
                    Yonzon Invoice / {search.length === 0 ? "All" : search}
                  </Card.Title>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <hr className="my-4" />
          <Col>
            <Card className="mb-3 invoice-card">
              <Card.Body>
                <Row>
                  <Col md={6} className="mt-2">
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
                            className="invoice-form"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Form>
                  </Col>
                  <Col className="mt-2">
                    <Form>
                      <Form.Group controlId="filterDropdown" className="mb-3">
                        <Dropdown>
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="invoice-dropdown-toggle invoice-form"
                          >
                            {selectedFilter || "All Categories"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => setSelectedFilter("")}
                            >
                              All Categories
                            </Dropdown.Item>
                            {filterOptions.map((option, index) => (
                              <Dropdown.Item
                                key={index}
                                onClick={() => setSelectedFilter(option)}
                              >
                                {option}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    </Form>
                  </Col>
                  <Col md={1}>
                    <BsQuestionSquareFill
                      style={{
                        width: "25px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                      className="mt-2"
                      onClick={() => setIsInfoModal(true)}
                    />
                  </Col>
                  <Col md={1}>
                    <BsArrowRepeat
                      style={{
                        height: "30px",
                        width: "25px",
                        cursor: "pointer",
                      }}
                      className="mt-2"
                      onClick={handleRefetch}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <hr className="my-4" />
            {status === "pending" ? (
              <Card.Text className="text-center">Loading...</Card.Text>
            ) : currentItems.length <= 0 ? (
              <Card.Text className="text-center">No Items Found</Card.Text>
            ) : (
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
              >
                <Masonry>
                  {currentItems.map((item, index) => (
                    <InvoiceItem
                      key={index}
                      {...item}
                      onItemSelect={(selectedItem) =>
                        handleItemSelected(selectedItem)
                      }
                    />
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            )}
          </Col>
          <Col>
            <Card className="mb-3 product-container invoice-card">
              <Card.Body>
                <Row className="d-flex flex-row">
                  <Col>
                    <Card.Title>Products</Card.Title>
                    <Card.Text>Items / {selectedItems.length}</Card.Text>
                  </Col>
                </Row>
                <Card className="pt-3 my-5 inner-product-container invoice-inner-card">
                  {selectedItems.length <= 0 ? (
                    <Card.Text className="text-center">
                      No Items Selected
                    </Card.Text>
                  ) : (
                    selectedItems.map((item, index) => (
                      <Card
                        className="mt-3 mx-3 invoice-selected-card"
                        key={index}
                      >
                        <Card.Body>
                          <Row>
                            <Col>
                              <Card.Title>{item.model}</Card.Title>
                              <Card.Text>{item.product}</Card.Text>
                            </Col>
                            <Col>
                              <Card.Title>Quantity</Card.Title>
                              <Card.Text>
                                {item.quantity === undefined
                                  ? 1
                                  : item.quantity}
                              </Card.Text>
                            </Col>
                            <Col>
                              <Card.Title>Price</Card.Title>
                              <Card.Text>
                                {formatNumber(
                                  (item.amount === undefined
                                    ? 1
                                    : item.amount) * item.price
                                )}
                              </Card.Text>
                            </Col>
                            <Col className="mt-3 text-center">
                              <Row>
                                <Col>
                                  <BsQrCodeScan
                                    style={{
                                      height: "25px",
                                      width: "25px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleQRCode(item)}
                                  />
                                </Col>
                                <Col>
                                  <BsCartXFill
                                    style={{
                                      height: "25px",
                                      width: "25px",
                                      cursor: "pointer",
                                      color: "#fa1e4e",
                                    }}
                                    onClick={() => handleItemDeselect(item)}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </Card>
                <Row className="d-flex flex-row">
                  <Col>
                    <Card.Title>Total Checkout</Card.Title>
                    <Card.Text>
                      Amount / Php {formatNumber(totalPrice)}
                    </Card.Text>
                  </Col>
                  <Col md={1}>
                    <BsBagCheckFill
                      style={{
                        height: "25px",
                        width: "25px",
                        cursor: "pointer",
                      }}
                      className="mt-3"
                      onClick={() => setIsTransactionModal(!isTransactionModal)}
                    />
                  </Col>
                  <Col md={1}>
                    <BsBagDashFill
                      style={{
                        height: "25px",
                        width: "25px",
                        cursor: "pointer",
                        color: "#fa1e4e",
                      }}
                      className="mt-3"
                      onClick={clearTransaction}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Pagination */}
      <Paginate
        itemsPerPage={itemsPerPage}
        totalItems={totalFilteredItems}
        currentPage={currentPage}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
      {isQRCodeModal && (
        <Modal
          show={isQRCodeModal !== false}
          onHide={() => setIsQRCodeModal(false)}
          className="invoice-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>QR Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center invoice-modal-body">
            <QRCodeSVG
              value={generateURL}
              size={128}
              level={"H"}
              includeMargin={false}
              imageSettings={{
                src: "https://cdn-icons-png.flaticon.com/512/3522/3522683.png",
                height: 36,
                width: 36,
                excavate: true,
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setIsQRCodeModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isSuccessModal && (
        <Modal
          show={isSuccessModal !== false}
          onHide={() => setIsSuccessModal(false)}
          className="invoice-modal-container"
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
      {isChangeModal && (
        <Modal
          show={isChangeModal !== false}
          onHide={() => {
            setIsChangeModal(false);
            clearTransaction();
            setCheckout("");
          }}
          className="invoice-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card.Title className="mb-3">Total Change</Card.Title>
            <Card.Text>Php {formatNumber(change)}</Card.Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsChangeModal(false);
                clearTransaction();
                setCheckout("");
              }}
            >
              Close
            </Button>
            {/* <Button className="yonzon-button" onClick={handleDownloadReceipt}>
              Download Receipt
            </Button> */}
          </Modal.Footer>
        </Modal>
      )}
      {isInsufficientModal && (
        <Modal
          show={isInsufficientModal !== false}
          onHide={() => setIsInsufficientModal(false)}
          className="invoice-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Insufficient</Modal.Title>
          </Modal.Header>
          <Modal.Body>Insufficient payment balance.</Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setIsInsufficientModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isEmptyModal && (
        <Modal
          show={isEmptyModal !== false}
          onHide={() => setIsEmptyModal(false)}
          className="invoice-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Empty Items</Modal.Title>
          </Modal.Header>
          <Modal.Body>There are no items to be checked out.</Modal.Body>
          <Modal.Footer>
            <Button
              className="yonzon-button"
              onClick={() => setIsEmptyModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isTransactionModal && (
        <Modal
          show={isTransactionModal !== false}
          onHide={() => setIsTransactionModal(false)}
          className="invoice-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <Card.Title className="mb-3">Products</Card.Title>
                {selectedItems.length <= 0 ? (
                  <Card.Text>-</Card.Text>
                ) : (
                  selectedItems.map((item, index) => (
                    <Card.Text key={index}>
                      {index + 1}. {item.model}
                    </Card.Text>
                  ))
                )}
              </Col>
              <Col>
                <Card.Title className="mb-3">Quantity</Card.Title>
                {selectedItems.length <= 0 ? (
                  <Card.Text>-</Card.Text>
                ) : (
                  selectedItems.map((item, index) => (
                    <Card.Text key={index}>
                      x {item.quantity >= 1 ? item.quantity : 1}
                    </Card.Text>
                  ))
                )}
              </Col>
              <Col>
                <Card.Title className="mb-3">Amount</Card.Title>
                {selectedItems.length <= 0 ? (
                  <Card.Text>-</Card.Text>
                ) : (
                  selectedItems.map((item, index) => (
                    <Card.Text key={index}>
                      Php{" "}
                      {formatNumber(
                        item.price * (item.quantity >= 1 ? item.quantity : 1)
                      )}
                    </Card.Text>
                  ))
                )}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col></Col>
              <Col>{totalAmount} items</Col>
              <Col>Php {formatNumber(totalPrice)}</Col>
            </Row>
            <Card.Title className="my-3">Total Payment</Card.Title>
            <Form className="mb-3">
              <Form.Group controlId="formPrice" className="mt-3">
                <Form.Control
                  type="number"
                  placeholder="Enter payment"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className="invoice-form"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setIsTransactionModal(false)}
            >
              Close
            </Button>
            <Button className="yonzon-button" onClick={handleAddTransaction}>
              Purchase
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isInfoModal && (
        <Modal
          show={isInfoModal !== false}
          onHide={() => setIsInfoModal(false)}
          className="invoice-modal-container"
        >
          <Modal.Header closeButton>
            <Modal.Title>Info</Modal.Title>
          </Modal.Header>
          <Modal.Body className="invoice-modal-body">
            <ul>
              <li className="my-3">
                <BsQrCodeScan
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3"
                />
                Scan Product - show QR code of the product.
              </li>
              <li className="my-3">
                <BsCartXFill
                  style={{
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    color: "#fa1e4e",
                  }}
                  className="me-3"
                />
                Remove Product - remove product from transaction.
              </li>
              <li className="my-3">
                <BsBagCheckFill
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3"
                />
                Add Transaction - purchase products in transaction.
              </li>
              <li className="my-3">
                <BsBagDashFill
                  style={{
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    color: "#fa1e4e",
                  }}
                  className="me-3"
                />
                Clear Product - remove all products in transaction.
              </li>
              <li className="my-3">
                <BsArrowRepeat
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  className="me-3"
                />
                Refresh data - refetch data from the database.
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

export default Invoice;
