import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../redux/reducers/authReducer";

import YonzonLogo from "../../assets/images/yonzon-logo.png";
import Time from "../time/Time";
import Icon from "../icon/Icon";
import "./Header.css";

const Header = () => {
  // Set up for redux fetching
  const dispatch = useDispatch();

  // Get access type; owner (1) and cashier (2)
  const access = useSelector((state) => state.auth.user.access_type);

  const handleSignout = () => {
    dispatch(signout());
  };

  // Get the current location
  const location = useLocation();

  return (
    <>
      <Navbar expand="lg" fixed="top" className="navbar-container">
        <Container>
          <Navbar.Brand as={NavLink} style={{ color: "white" }}>
            <Image src={YonzonLogo} width={120} className="navbar-image" /> /{" "}
            <Icon type={access} />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="navbar-toggle"
          />
          <Navbar.Collapse id="responsive-navbar-nav" className="navbar-links">
            <Nav className="mr-auto">
              {access === 1 && (
                <Nav.Link
                  as={NavLink}
                  to="/yonzon/dashboard"
                  style={{ color: "white" }}
                  active={location.pathname === "/yonzon/dashboard"}
                >
                  Dashboard
                </Nav.Link>
              )}
              <Nav.Link
                as={NavLink}
                to="/yonzon/invoice"
                style={{ color: "white" }}
                active={location.pathname === "/yonzon/invoice"}
              >
                Invoice
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/yonzon/inventory"
                style={{ color: "white" }}
                active={location.pathname === "/yonzon/inventory"}
              >
                Inventory
              </Nav.Link>
              {access === 1 && (
                <Nav.Link
                  as={NavLink}
                  to="/yonzon/settings"
                  style={{ color: "white" }}
                  active={location.pathname === "/yonzon/settings"}
                >
                  Settings
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              <Nav.Link
                onClick={handleSignout}
                to="/"
                style={{ color: "white" }}
                className={location.pathname === "/" ? "active" : ""}
              >
                Sign Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Time timezone={"PH"} />
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Header;
