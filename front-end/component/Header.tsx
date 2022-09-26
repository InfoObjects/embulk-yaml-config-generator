import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

type Prop = {
  pageDetail: any;
};

const Header: React.FC<Prop> = ({pageDetail}) => {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none p-0">
            <img
              alt="infoObjects"
              src="/images/logo.png"
              height="40"
              className="me-2 d-inline-block align-top"
            />{" "}
            <span className="fs-4">{(pageDetail?.title ? pageDetail.title : '')}</span>
          </Navbar.Brand>
        </Link>
      </Container>
    </Navbar>
  );
};

export default Header;
