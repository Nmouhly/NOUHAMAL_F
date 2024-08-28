import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ProjectsPage from './pages/ProjectsPage';
import Login from './components/auth/Login';
import AxeEdit from './components/Dashboard/Axes/AxeEdit';
import AxeCreate from './components/Dashboard/Axes/AxeCreate';
import Revues from './pages/Revues';
import Reports from './pages/Reports';
import AdminRevue from './components/Dashboard/Publication/AdminRevue';
import RevueCreate from './components/Dashboard/Publication/RevueCreate';
import RevueEdit from './components/Dashboard/Publication/RevueEdit';
import AdminAxes from './components/Dashboard/Axes/AdminAxes';
import Ouvrages from './pages/Ouvrages';
import UserProfile from './components/User/UserProfile.jsx';
import UserInfo from './components/User/UserInfo.jsx';
import EditUser from './components/User/EditUser.jsx';
import MasterUser from './components/User/MasterUser.jsx';
import UserPrivateRoute from './UserPrivateRoute.jsx';
import UserOuvrage from './components/User/publication/UserOuvrage';
import UserCreateOuvrage from './components/User/publication/UserCreateOuvrage';
import UserRevues from './components/User/publication/UserRevues';
import UserThèse from './components/User/publication/UserThèse';
import UserRapport from './components/User/publication/UserRapport';
import UserHabilitation from './components/User/publication/UserHabilitation';
import UserConférence from './components/User/publication/UserConférence';
import PresentationsPage from './pages/PresentationsPage';
import MembresPage from './pages/MembresPage';
import AxessPage from './pages/AxesPage';
import Patents from './pages/Patents';
import Conference from './pages/Conference';
import TeamsPage  from './pages/Equipes';
import AdminOuvrage from './components/Dashboard/Publication/AdminOuvrage';
import OuvrageEdit from './components/Dashboard/Publication/OuvrageEdit';
import OuvrageCreat from './components/Dashboard/Publication/OuvrageCreat';
import AdminPatent from './components/Dashboard/Publication/AdminPatent';
import PatentEdit from './components/Dashboard/Publication/PatentEdit';
import PatentCreat from './components/Dashboard/Publication/PatentCreat';
import AdminReport from './components/Dashboard/Publication/AdminReport';
import ReportEdit from './components/Dashboard/Publication/ReportEdit.jsx';
import ReportCreat from './components/Dashboard/Publication/ReportCreat';
import AdminConference from './components/Dashboard/Publication/AdminConference';
import ConferenceEdit from './components/Dashboard/Publication/ConferenceEdit';
import ConferenceCreat from './components/Dashboard/Publication/ConferenceCreat';
import Axe from './pages/Axe';
import PresentationCreate from './components/Dashboard/equipe/PresentationCreate';
import PresentationEdit from './components/Dashboard/equipe/PresentationEdit';
import PresentationAdmin from './components/Dashboard/equipe/PresentationAdmin';
import Presentation from './pages/Presentation';
import Register from './components/auth/Register';
import Personnel from './pages/Personnel';
import Seminar from './pages/Seminar';
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
import SeminarDetails from './components/Dashboard/Seminar/SeminarDetails';
import SeminarForm from './components/Dashboard/Seminar/SeminarForm';
import SeminarList from './components/Dashboard/Seminar/SeminarList ';
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
import AxesPage from './pages/AxesPage.jsx';
import MemberProfile from "./pages/MemberProfile";

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
            <Route path="seminar" element={<Seminar />} />
            <Route path="/presentations/:teamId" element={<PresentationsPage />} />
            <Route path="/membre/:teamId" element={<MembresPage />} />
            <Route path="/axe/:teamId" element={<AxessPage />} />
            <Route path="revues" element={<Revues />} />
            <Route path="axe" element={<Axe />} />
            <Route path="ouvrages" element={<Ouvrages />} />
            <Route path="conferences" element={<Conference />} />
            <Route path="listEquipe" element={<TeamsPage  />} />
            <Route path="patents" element={<Patents />} />
            <Route path="reports" element={<Reports />} />
            
            <Route path="ProjectsPage" element={<ProjectsPage />} /> {/* Ajout de la route pour ProjectsPage */}
            <Route path="publications" element={<Publications />} />
            <Route path="news/:id" element={<NewsDetails />} /> 
            <Route path="presentation" element={<Presentation />} />
            <Route path="axe" element={<Axe />} />
            <Route path="publication" element={<Publication />} />
            <Route path="membre" element={<Membre />} />
            <Route path="personnelMember" element={<PersonnelMembere />} />
            <Route path="/member/:id" element={<MemberProfile />} />
            <Route path="personnelAncien" element={<PersonnelAncien />} />
          </Route>

          <Route element={<SimpleLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/dashboard" element={<AdminPrivateRoute><MasterLayout /></AdminPrivateRoute>}>
            <Route path="NewsAdmin" element={<NewsAdmin />} />
            <Route path="SeminarDetails/:id" element={<SeminarDetails />} />
            <Route path="SeminarForm" element={<SeminarForm />} />
            <Route path="SeminarList" element={<SeminarList />} />
            <Route path="ouvrage" element={<AdminOuvrage />} />
            <Route path="OuvrageEdit/:id" element={<OuvrageEdit />} />
            <Route path="OuvrageCreate" element={<OuvrageCreat />} />
            <Route path="patent" element={<AdminPatent />} />
            <Route path="PatentEdit/:id" element={<PatentEdit />} />
            <Route path="PatentCreate" element={<PatentCreat />} />
            <Route path="report" element={<AdminReport />} />
            <Route path="ReportEdit/:id" element={<ReportEdit />} />
            <Route path="ReportCreat" element={<ReportCreat />} />
            <Route path="conference" element={<AdminConference />} />
            <Route path="ConferenceEdit/:id" element={<ConferenceEdit />} />
            <Route path="ConferenceCreate" element={<ConferenceCreat />} />

            <Route path="NewsCreate" element={<NewsCreate />} />
            <Route path="NewsEdit/:id" element={<NewsEdit />} />
            <Route path="AdminUtilisateur" element={<AdminUtilisateur />} />
            <Route path="UserCreate" element={<UserCreate />} />
            <Route path="UserEdit/:id" element={<UserEdit />} />
            <Route path="ProjectsAdmin" element={<ProjectsAdmin />} />
            <Route path="ProjectsCreate" element={<ProjectsCreate />} />
            <Route path="ProjectsEdit/:id" element={<ProjectsEdit />} />
            <Route path="Organisation" element={<AdminOrganisation />} />
            <Route path="axe" element={<AdminAxes />} />  
            <Route path="AxeCreate" element={<AxeCreate />} />
            <Route path="AxeEdit/:id" element={<AxeEdit />} />
            
            <Route path="Member" element={<AdminMembers />} />
            <Route path="MembreCreate" element={<MembreCreate />} />
            <Route path="MembreEdit/:id" element={<MembreEdit />} />
            <Route path="revues" element={<AdminRevue />} />
            <Route path="RevueCreate" element={<RevueCreate />} />
            <Route path="RevuesEdit/:id" element={<RevueEdit />} />
            <Route path="equipe" element={<AdminEquipe />} />
            <Route path="PresentationCreate" element={<PresentationCreate />} />
            <Route path="PresentationEdit/:id" element={<PresentationEdit />} />
            <Route path="PresentationAdmin" element={<PresentationAdmin />} />
            <Route path="EquipeCreate" element={<EquipeCreat />} />
            <Route path="EquipeEdit/:id" element={<EquipeEdit />} />
            <Route path="Utilisateur" element={<AdminUtilisateur />} />
          </Route>
          <Route path="/user/*" element={<UserPrivateRoute><MasterUser /></UserPrivateRoute>}>
           <Route path="UserProfile" element={<UserProfile />} />
           <Route path="UserInfo" element={<UserInfo />} />
           <Route path="edit-user/:id" element={<EditUser />} />
              <Route path="UserOuvrage" element={<UserOuvrage />} /> 
              <Route path="UserCreateOuvrage" element={<UserCreateOuvrage />} /> 
            <Route path="UserRevues" element={<UserRevues />} />
            <Route path="UserThèse" element={<UserThèse />} />
            <Route path="UserRapport" element={<UserRapport />} />
            <Route path="UserHabilitation" element={<UserHabilitation />} />
            <Route path="UserConférence" element={<UserConférence />} />
       </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
