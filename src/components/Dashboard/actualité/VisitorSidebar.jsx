import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VisitorSidebar.css';
import logo from '../../../assets/labol2is.png';

const VisitorSidebar = () => {
  const [isEquipesSubmenuOpen, setIsEquipesSubmenuOpen] = useState(false);
  const [isPersonnelSubmenuOpen, setIsPersonnelSubmenuOpen] = useState(false);
  const [isPublicationsSubmenuOpen, setIsPublicationsSubmenuOpen] = useState(false);

  const toggleEquipesSubmenu = () => {
    setIsEquipesSubmenuOpen(!isEquipesSubmenuOpen);
    if (isPersonnelSubmenuOpen) setIsPersonnelSubmenuOpen(false);
    if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false);
  };

  const togglePersonnelSubmenu = () => {
    setIsPersonnelSubmenuOpen(!isPersonnelSubmenuOpen);
    if (isEquipesSubmenuOpen) setIsEquipesSubmenuOpen(false);
    if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false);
  };

  const togglePublicationsSubmenu = () => {
    setIsPublicationsSubmenuOpen(!isPublicationsSubmenuOpen);
    if (isEquipesSubmenuOpen) setIsEquipesSubmenuOpen(false);
    if (isPersonnelSubmenuOpen) setIsPersonnelSubmenuOpen(false);
  };

  return (
    <div className="visitor-sidebar">
      <nav>
        <img src={logo} alt="Laboratory Logo" className="logo" />
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/organisation"> Organisation</Link></li>
          
           
            <li><Link to="/listEquipe"> Équipes</Link></li>
             
          

          <li className="no-indent">
            <button onClick={togglePersonnelSubmenu} className={`submenu-toggle ${isPersonnelSubmenuOpen ? 'open' : ''}`}>
              Personnel
            </button>
            <ul className={`submenu ${isPersonnelSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/personnelMember">Membres</Link></li>
              <li><Link to="/personnelAncien">Anciens</Link></li>
            </ul>
          </li>

          <li className="no-indent">
            <button onClick={togglePublicationsSubmenu} className={`submenu-toggle ${isPublicationsSubmenuOpen ? 'open' : ''}`}>
              Publications
            </button>
            <ul className={`submenu ${isPublicationsSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/ouvrages">Ouvrages</Link></li>
              <li><Link to="/revues">Revues</Link></li>
              <li><Link to="/conferences">Conférences</Link></li>
              <li><Link to="/reports">Rapports</Link></li>
              <li><Link to="/theses-doctorat">Thèses et Doctorat</Link></li>
              <li><Link to="/habilitation">Habilitation</Link></li>
            </ul>
          </li>

          <li><Link to="/ProjectsPage">Projets</Link></li>
          <li><Link to="/informations">Informations</Link></li>
          <li><Link to="/evenements">Événements </Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default VisitorSidebar;
