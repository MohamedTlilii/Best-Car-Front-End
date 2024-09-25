import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../services/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss';

function CustomNavbar() {
  const context = useContext(StoreContext);
  const { isLoggedIn, setIsLoggedIn } = context;
  const [userDetails, setUserDetails] = useState<{ username: string; image: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userDetailsFromStorage = JSON.parse(localStorage.getItem('admin') || '{}');
    if (userDetailsFromStorage.username && userDetailsFromStorage.image) {
      setUserDetails(userDetailsFromStorage);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserDetails(null);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`custom-navbar ${dropdownOpen ? 'expanded' : ''}`}>
      <div className="navbar-content">
        {isLoggedIn ? (
          <div className="user-info" onClick={toggleDropdown} ref={dropdownRef}>
            <img src={userDetails?.image} alt="Admin" className="user-image" />
            <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        ) : (
          <h4 className="brand-name">Best-Car</h4>
        )}
      </div>
    </nav>
  );
}

export default CustomNavbar;
