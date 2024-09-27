import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import '../../../assets/admin/css/styles.css';
import '../../../assets/admin/js/scripts.js';

import Navbar from './Navbar'; // Import the Navbar component

const MasterLayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const layoutSidenavContentStyle = {
    paddingLeft: isSidebarVisible ? '40px' : '0',
    transition: 'padding-left 0s',
    marginTop: '-850px',  // Ajoutez ceci pour supprimer l'espace extérieur en haut


  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="sb-nav-fixed">
        <div id="layoutSidenav" style={{ position: 'relative' }}>
          {isSidebarVisible && (
            <div id="layoutSidenav_nav">
              <Sidebar />
            </div>
          )}
          <div id="layoutSidenav_content" style={layoutSidenavContentStyle}>
            <main>
              <Outlet /> {/* Cela affichera les routes enfants ici */}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterLayout;
