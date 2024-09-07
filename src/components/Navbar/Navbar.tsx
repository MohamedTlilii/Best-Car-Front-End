import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../services/StoreContext';

function BasicExample() {
  const context = useContext(StoreContext);


  const { isLoggedIn, setIsLoggedIn } = context ;
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check localStorage for token and admin status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';

    if (token && adminStatus) {
      setIsAdmin(true); // Set admin status if token and isAdmin are valid
    } else {
      setIsAdmin(false);
    }
  }, [isLoggedIn]); // Re-run whenever `isLoggedIn` changes

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
    }

    setIsLoggedIn(!isLoggedIn); // Toggle login state
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand >React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Only show "Dashboard" link if user is logged in and isAdmin */}
            {isLoggedIn && isAdmin && (
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <Nav.Link as={Link} to="/" onClick={handleLoginLogout}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
