import React, { useState } from 'react';
import './Dashboard.scss'; 
import Calendar from '../../components/Calendar/Calendar';
import Cars from '../../components/Cars/Cars';

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState<string>('calendar');

  const renderContent = () => {
    switch (selectedSection) {
      case 'calendar':
        return <Calendar />; 
      case 'cars':
        return <Cars />;
      default:
        return <div style={{ color: "red" }}>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h3>Sidebar</h3>
        <ul>
          <li onClick={() => setSelectedSection('calendar')}>Calendar</li>
          <li onClick={() => setSelectedSection('cars')}>Cars</li>
        </ul>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;
