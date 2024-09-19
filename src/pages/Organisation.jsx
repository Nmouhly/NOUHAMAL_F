import React, { useEffect, useState } from 'react';
import axios from 'axios';
import arrowGif from '../assets/fleche.gif';

const Organisation = () => {
  const [director, setDirector] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then(response => {
        const membersData = response.data;
        // Supposons que le directeur a un rôle spécifique, par exemple "Directeur"
        const directorData = membersData.find(users => users.email === 'directeurlaboratoirel2is@gmail.com');
        setDirector(directorData);
      })
      .catch(error => {
        console.error('There was an error fetching the members!', error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
     
     <div className="flex flex-col items-center">
                <h2 style={{ color: '#1A237E', fontSize: '2rem', marginTop: '2rem' }}>L’équipe dirigeante L2IS</h2>
                <img
                    src={arrowGif}
                    alt="Flèche animée"
                    style={{ height: '60px', width: 'auto' }} // Ajustez la taille selon vos besoins
                />
            </div>
            <div className="mt-8">
  {director ? (
    <div
      style={{
        maxWidth: '2000px', // Decreased by 23px from 300px (300px - 23px)
        padding: '10px', // Maintain padding
        margin: '10px auto', // Center the container with space around it
        border: '1px  #ccc', // Border for visibility
        borderRadius: '5px', // Slightly round the corners
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
        background: 'linear-gradient(135deg, #f0f4f8, #ffffff)',
        
      }}
      className="mb-8"
    >
      <h3 className="text-2xl font-bold mb-2">{director.name}</h3>
      <p className="text-xl font-semibold mb-2">{director.email}</p>
      <p className="text-gray-700 mb-4">{director.bio}</p>
      <div className="text-sm text-gray-500">
        <p>{director.contact_info}</p>
      </div>
    </div>
  ) : (
    <p>Chargement des informations du directeur...</p>
  )}
</div>

      
      {/* Ajout de la carte */}
      <div className="mt-8"> {/* Ajout de la marge supérieure pour espacer */}
        <h2 className="text-2xl font-semibold">Localisation</h2>
        <div className="mt-4">
          <iframe 
            width="100%" 
            height="600" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Marrakech%20FST+(L2SI)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
            <a href="https://www.maps.ie/population/">Population mapping</a>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Organisation;
