import React from 'react';
import arrowGif from '../assets/fleche.gif'; // Assurez-vous que le GIF est dans le bon dossier

const Axe = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Axes de Recherche du Laboratoire L2IS</h1>
        <p className="text-lg text-gray-700">
          Le laboratoire L2IS se consacre à la recherche avancée dans plusieurs domaines clés. Découvrez nos axes de recherche ci-dessous.
        </p>
        <img src={arrowGif} alt="Fleche animée" className="mx-auto my-4" />
      </header>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Internet des Objets (IoT) et Intelligence Artificielle</h2>
        <p>
          L'équipe L2IS se concentre sur le développement de solutions IoT intégrant des technologies d'intelligence artificielle pour améliorer la gestion des données et des systèmes intelligents.
        </p>
        <p>
          Les défis incluent l'intégration de l'IA dans les systèmes IoT pour optimiser la collecte et l'analyse des données, et développer des plateformes intelligentes pour divers environnements.
        </p>
        <p>Les thèmes abordés incluent :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Développement de plateformes IoT pour la gestion des infrastructures.</li>
          <li>Application de l’IA pour l’analyse et la prédiction des données.</li>
          <li>Conception de systèmes intelligents pour des environnements variés.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Science des Données et Big Data</h2>
        <p>
          L’accent est mis sur l’exploitation des grandes quantités de données générées par les systèmes IoT et autres sources pour extraire des informations pertinentes et soutenir la prise de décision.
        </p>
        <p>Les thèmes principaux incluent :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Développement d’algorithmes pour le traitement des big data.</li>
          <li>Analyse et gestion des flux d’énergies dans les configurations isolées ou connectées.</li>
          <li>Création d’outils pour la visualisation des données complexes.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Haute Performance Computing (HPC) et Cloud DevOps</h2>
        <p>
          L’équipe se concentre sur l’optimisation des performances des systèmes de calcul haute performance et l’intégration des pratiques DevOps dans le cloud pour améliorer l’efficacité et la scalabilité des systèmes.
        </p>
        <p>Les principaux thèmes incluent :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Optimisation des architectures HPC pour les applications scientifiques et industrielles.</li>
          <li>Développement de solutions DevOps pour le cloud.</li>
          <li>Gestion des infrastructures cloud et des applications distribuées.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Systèmes d'Information et Sécurité</h2>
        <p>
          Ce domaine se concentre sur la gestion des systèmes d'information et la sécurité des données dans divers environnements, en abordant les défis liés à la protection des informations sensibles.
        </p>
        <p>Les thèmes principaux incluent :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Gestion et protection des systèmes d’information.</li>
          <li>Sécurité des données et prévention des cyberattaques.</li>
          <li>Analyse des risques et gestion des vulnérabilités.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Ingénierie Pédagogique Universitaire</h2>
        <p>
          L’équipe se consacre à l’amélioration des méthodes pédagogiques et des outils d’enseignement pour le secteur universitaire, en intégrant des technologies modernes et des approches innovantes.
        </p>
        <p>Les thèmes abordés incluent :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Développement de méthodes pédagogiques basées sur la technologie.</li>
          <li>Conception d’outils d’apprentissage interactifs.</li>
          <li>Évaluation des pratiques pédagogiques et leur impact sur l’apprentissage.</li>
        </ul>
      </section>
    </div>
  );
};

export default Axe;
