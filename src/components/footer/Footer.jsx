import { Container } from "react-bootstrap";

import "./Footer.css";

const Footer = () => {
  // Updated year logic
  const currentYear = new Date().getFullYear();

  return (
    <>
      <hr className="my-4" />
      <footer className="footer mt-auto py-3 text-center">
        <Container>
          <span>
            &copy; {currentYear} Yonzon Autogears. All Rights Reserved.
          </span>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
