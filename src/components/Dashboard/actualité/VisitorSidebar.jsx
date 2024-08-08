import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VisitorSidebar.css';
import logo from '../../../assets/labol2is.png';

const VisitorSidebar = () => {
  const [isEquipesSubmenuOpen, setIsEquipesSubmenuOpen] = useState(false);
  const [isPersonnelSubmenuOpen, setIsPersonnelSubmenuOpen] = useState(false);

  const toggleEquipesSubmenu = () => {
    setIsEquipesSubmenuOpen(!isEquipesSubmenuOpen);
    if (isPersonnelSubmenuOpen) setIsPersonnelSubmenuOpen(false);
  };

  const togglePersonnelSubmenu = () => {
    setIsPersonnelSubmenuOpen(!isPersonnelSubmenuOpen);
    if (isEquipesSubmenuOpen) setIsEquipesSubmenuOpen(false);
  };

  return (
    <div className="visitor-sidebar">
      <nav>
        <img src={logo} alt="Laboratory Logo" className="logo" />
        <ul>
          <li><Link to="/">Accueil</Link></li>
          
          <li className="no-indent">
            <button onClick={toggleEquipesSubmenu} className={`submenu-toggle ${isEquipesSubmenuOpen ? 'open' : ''}`}>
              Équipes
            </button>
            <ul className={`submenu ${isEquipesSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/presentation">Présentation</Link></li>
              <li><Link to="/axe">Axes de Recherche</Link></li>
              <li><Link to="/publication">Publications</Link></li>
              <li><Link to="/membre">Membres</Link></li>
            </ul>
          </li>
          <li className="no-indent">
            <button onClick={togglePersonnelSubmenu} className={`submenu-toggle ${isPersonnelSubmenuOpen ? 'open' : ''}`}>
              Personnel
            </button>
            <ul className={`submenu ${isPersonnelSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/personnelMember">Membres</Link></li>
              <li><Link to="/personnelAncien">Anciens</Link></li>
            </ul>
          </li>
          <li><Link to="/publications">Publications</Link></li>
          <li><Link to="/ProjectsPage">Projets</Link></li>
          <li><Link to="/informations">Informations</Link></li>
          <li><Link to="/evenements">Événements</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default VisitorSidebar;
