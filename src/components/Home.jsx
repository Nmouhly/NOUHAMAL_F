// components/Home.js

import React from 'react';
import logo from '../assets/labol2is.png'; // Assurez-vous que le chemin du logo est correct
import arrowGif from '../assets/fleche.gif'; // Assurez-vous que le chemin de la flèche est correct
import HomeNews from './HomeNews';
//import TeamsPage    from '../pages/Equipes';
import Statistics from '../pages/Statistics';




const Home = ({ currentUser, logoutUser, isSidebarVisible, toggleSidebar }) => {
  return (
    <div className="p-4 flex flex-col items-center">
      {/* Section Logo */}
      <div className="flex items-center mb-4">
        <img
          src={logo}
          alt="Laboratory Logo"
          style={{ height: '140px', width: 'auto' }} // Ajuste la hauteur à 140px avec largeur automatique
        />
      </div>

      {/* Titre */}
      <h1
        style={{ fontSize: '3rem', marginTop: '2rem', marginBottom: '2rem', color: '#1A237E' }}
        className="font-bold text-center"
      >
        L2IS - Laboratoire d'Ingénierie Informatique et Systèmes
      </h1>

      {/* Description */}
      <p>
        Le Laboratoire de l'Ingénierie Informatique et des Systèmes (L2IS) est un centre de recherche affilié à la Faculté des Sciences et Techniques de Marrakech. Nos travaux de recherche s'appuient sur des domaines variés tels que l'Internet des Objets (IoT), l'Intelligence Artificielle, la Data Science et le Big Data, l'Ingénierie Pédagogique Universitaire, les Réseaux et la Sécurité, le Calcul Haute Performance (HPC), le Cloud DevOps, et le Management et la Gouvernance des Systèmes d'Information. Le L2IS se distingue par son engagement à aborder des problématiques complexes au croisement des technologies de l'information, des communications et des sciences de l'ingénieur.
      </p>
      <p>
        Le L2IS regroupe un ensemble de chercheurs, professeurs et administrateurs qui assurent le bon déroulement des projets. Nous avons également une équipe dynamique de doctorants contribuant activement aux recherches.
      </p>
      <p>
        Le L2IS collabore avec divers partenaires industriels et académiques pour des projets de recherche appliquée. Parmi nos initiatives notables, nous menons des projets collaboratifs visant à développer des solutions innovantes pour des problématiques spécifiques, renforçant ainsi notre rôle dans le domaine de la recherche et du développement technologique.
      </p>
      <p>
        Créé en 2020, le L2IS est un laboratoire en pleine expansion, dédié à l'avancement des connaissances et à l'application des sciences informatiques et des systèmes dans divers domaines d'innovation.
      </p>
      
      {/* Flèche animée */}
      <div className="flex flex-col items-center">
        <h2 style={{ color: '#1A237E', fontSize: '2rem', marginTop: '2rem' }}>Actualités</h2>
        <img
          src={arrowGif}
          alt="Flèche animée"
          style={{ height: '60px', width: 'auto' }} // Ajustez la taille selon vos besoins
        />
      </div>

      {/* Liste des actualités */}
      <HomeNews />
      {/* <TeamsPage /> */}
      <Statistics />

    </div>
  );
};

export default Home;
