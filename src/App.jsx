import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ProjectsPage from './pages/ProjectsPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Personnel from './pages/Personnel';
import Equipes from './pages/Equipes';
import Evenements from './pages/Evenements';
import Informations from './pages/Informations';
import Organisation from './pages/Organisation';
import Publications from './pages/Publications';
import { useEffect, useState } from 'react';
import { getConfig, BASE_URL } from './helpers/config';
import { AuthContext } from './context/authContext';
import axios from 'axios';
import MasterLayout from './components/layouts/admin/MasterLayout';
import AdminPrivateRoute from './AdminPrivateRoute';
import NewsAdmin from './components/Dashboard/actualité/NewsAdmin';
import NewsCreate from './components/Dashboard/actualité/NewsCreate';
import AdminUtilisateur from './components/Dashboard/Utilisateur/AdminUtilisateur';
import UserCreate from './components/Dashboard/Utilisateur/UserCreate';
import ProjectsEdit from './components/Dashboard/Projects/ProjectsEdit';
import ProjectsAdmin from './components/Dashboard/Projects/ProjectsAdmin';
import ProjectsCreate from './components/Dashboard/Projects/ProjectsCreate';
import NewsEdit from './components/Dashboard/actualité/NewsEdit';
import UserEdit from './components/Dashboard/Utilisateur/UserEdit';
import NewsDetails from './components/Dashboard/actualité/NewsDetails';
import VisitorLayout from './components/Dashboard/actualité/VisitorLayout';
import SimpleLayout from './components/Dashboard/actualité/SimpleLayout';
import AdminOrganisation from './components/Dashboard/Organisation/AdminOrganisation';
import Presentation from './pages/Presentation';
import Axe from './pages/Axe';
import Publication from './pages/Publication';
import Membre from './pages/Membre';
import AdminMembers from './components/Dashboard/equipe/AdminMembers';
import MembreCreate from './components/Dashboard/equipe/MembreCreate';
import MembreEdit from './components/Dashboard/equipe/MemberEdit';
import PersonnelAncien from './pages/PersonnelAncien';
import PersonnelMembere from './pages/PersonnelMembere';
import AdminEquipe from './components/Dashboard/equipe/AdminEquipe';
import EquipeCreat from './components/Dashboard/equipe/EquipeCreat';
import EquipeEdit from './components/Dashboard/equipe/EquipeEdit';

function App() {
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('currentToken');
    try {
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error("Failed to parse JSON from localStorage:", error);
      return null;
    }
  });
     const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken));
        setCurrentUser(response.data.user);
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem('currentToken');
          setCurrentUser(null);
          setAccessToken('');
        }
        console.log(error);
      }
    };
    if (accessToken) fetchCurrentlyLoggedInUser();
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VisitorLayout />}>
            <Route index element={<Home />} />
            <Route path="equipes" element={<Equipes />} />
            <Route path="evenements" element={<Evenements />} />
            <Route path="informations" element={<Informations />} />
            <Route path="organisation" element={<Organisation />} />
            <Route path="personnel" element={<Personnel />} />
            <Route path="ProjectsPage" element={<ProjectsPage />} /> {/* Ajout de la route pour ProjectsPage */}
            <Route path="publications" element={<Publications />} />
            <Route path="news/:id" element={<NewsDetails />} /> 
            <Route path="presentation" element={<Presentation />} />
            <Route path="axe" element={<Axe />} />
            <Route path="publication" element={<Publication />} />
            <Route path="membre" element={<Membre />} />
            <Route path="personnelMember" element={<PersonnelMembere />} />
            <Route path="personnelAncien" element={<PersonnelAncien />} />
          </Route>

          <Route element={<SimpleLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/dashboard" element={<AdminPrivateRoute><MasterLayout /></AdminPrivateRoute>}>
            <Route path="NewsAdmin" element={<NewsAdmin />} />
            <Route path="NewsCreate" element={<NewsCreate />} />
            <Route path="NewsEdit/:id" element={<NewsEdit />} />
            <Route path="AdminUtilisateur" element={<AdminUtilisateur />} />
            <Route path="UserCreate" element={<UserCreate />} />
            <Route path="UserEdit/:id" element={<UserEdit />} />
            <Route path="ProjectsAdmin" element={<ProjectsAdmin />} />
            <Route path="ProjectsCreate" element={<ProjectsCreate />} />
            <Route path="ProjectsEdit/:id" element={<ProjectsEdit />} />
            <Route path="Organisation" element={<AdminOrganisation />} />
            <Route path="Member" element={<AdminMembers />} />
            <Route path="MembreCreate" element={<MembreCreate />} />
            <Route path="MembreEdit/:id" element={<MembreEdit />} />
            <Route path="equipe" element={<AdminEquipe />} />
            <Route path="EquipeCreate" element={<EquipeCreat />} />
            <Route path="EquipeEdit/:id" element={<EquipeEdit />} />
            <Route path="Utilisateur" element={<AdminUtilisateur />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
