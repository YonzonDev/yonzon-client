import { Container, Row, Col, Pagination } from "react-bootstrap";

import "./Paginate.css";
import PropTypes from "prop-types";

const Paginate = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
  // Page logic; totalPages = per page total items / total items
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <>
      <Container fluid className="pagination-container text-center">
        <div className="pagination-color">
          <Row>
            <Col className="mt-3 justify-content-center">
              <Pagination>
                {/* Back Pagination */}
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {/* Middle Length Pagination */}
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                {/* Next Pagination */}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>
        </div>
      </Container>
      <div className="content-below-paginate" />
    </>
  );
};

Paginate.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Paginate;
