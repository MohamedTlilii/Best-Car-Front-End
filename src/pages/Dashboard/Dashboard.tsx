
import { useState, useEffect } from 'react';
import './Dashboard.scss'; 
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCar, faUserShield, faChartBar, faBars } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin") || "{}"));
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarVisible(true); 
      } else {
        setIsSidebarVisible(false); 
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
        <h3 style={{ borderBottom: "1px solid white " }}>Menu</h3>
        <ul>
          <li>
            <Link className='linkkkk' to='calender'>
              <FontAwesomeIcon icon={faCalendar} className="fa-icon" /> Calendar
            </Link>
          </li>
          <li>
            <Link className='linkkkk' to='/' >
              <FontAwesomeIcon icon={faCar} className="fa-icon" /> Cars
            </Link>
          </li>
          {admin.role === "superadmin" && (
            <li>
              <Link className='linkkkk' to='admin'>
                <FontAwesomeIcon icon={faUserShield} className="fa-icon" /> Admin
              </Link>
            </li>
          )}
          <li>
            <Link className='linkkkk' to='statistical'>
              <FontAwesomeIcon icon={faChartBar} className="fa-icon" /> Statistical
            </Link>
          </li>
        </ul>
      </div>

      <button onClick={toggleSidebar} className={`toggle-button ${isSidebarVisible ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className="content" style={{ minHeight: "90vh" }}>
        <Outlet /> 
      </div>
    </div>
  );
}

export default Dashboard;
