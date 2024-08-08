import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Sidebar.css'; // Ensure you have the CSS for the sidebar
import logo from '../../../assets/labol2is.png';

const Sidebar = () => {
  const { accessToken, setAccessToken, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const logoutUser = async () => {
    try {
      await axios.post(`${BASE_URL}/user/logout`, null, getConfig(accessToken));
      localStorage.removeItem('currentToken');
      setAccessToken('');
      setCurrentUser(null);
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('currentToken');
        setAccessToken('');
        setCurrentUser(null);
        toast.error('Déconnexion échouée');
        navigate('/');
      }
      console.log(error);
    }
  };

  return (
    <>
       <div className="flex flex-1 pt-20 " >
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sidebar-logo">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Laboratory Logo" />
          </Link>
        </div>
        <div className="sb-sidenav-menu">
          <div className="nav">
            {/* Dashboard */}
            <Link className="nav-link" to="/dashboard/Utilisateur">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Utilisateurs
            </Link>
            <Link className="nav-link" to="/dashboard/NewsAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Actualités
            </Link>
            {/* Organisation */}
            <Link className="nav-link" to="/dashboard/Member">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Members
            </Link>
            {/* Research Teams */}
            <div className="nav-link section-title" onClick={toggleSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-user-friends"></i></div>
              Équipes
            </div>
            <ul className={`submenu ${isSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/dashboard/equipe">Équipe</Link></li>
              <li><Link to="/dashboard/presentation">Présentation</Link></li>
              <li><Link to="/dashboard/axe">Axes de Recherche</Link></li>
              <li><Link to="/dashboard/publication">Publications</Link></li>
            </ul>
            {/* Research and Projects */}
            <div className="sb-sidenav-menu-heading">Research & Projects</div>
            <Link className="nav-link" to="/dashboard/ProjectsAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-project-diagram"></i></div>
              Projets Industriels
            </Link>
            <Link className="nav-link" to="/dashboard/publicas">
              <div className="sb-nav-link-icon"><i className="fas fa-book"></i></div>
              Publications
            </Link>
            {/* Information and Events */}
            <div className="sb-sidenav-menu-heading">Information & Events</div>
            <Link className="nav-link" to="/dashboard/informa">
              <div className="sb-nav-link-icon"><i className="fas fa-info-circle"></i></div>
              Informations
            </Link>
            <Link className="nav-link" to="/dashboard/evene">
              <div className="sb-nav-link-icon"><i className="fas fa-calendar-alt"></i></div>
              Événements
            </Link>
            {/* Management */}
            <div className="sb-sidenav-menu-heading">Management</div>
            <Link className="nav-link" to="/dashboard/mana">
              <div className="sb-nav-link-icon"><i className="fas fa-cogs"></i></div>
              Admin Dashboard
            </Link>
            <button className="nav-link" onClick={logoutUser}>
              <div className="sb-nav-link-icon"><i className="fas fa-sign-out-alt"></i></div>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
      </div>
    </>
  );
};

export default Sidebar;
