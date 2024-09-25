import { useEffect, useState } from 'react';
import axios from 'axios';
import CarCard from '../CarCard/CarCard';
import './Cars.scss';
import Spinner from '../Spiner/Spinner';
import { FaPlus, FaSearch } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap';
interface Car {
  id: number; 
  productname: string;
  image: string[]; 
  price: number; 
  disponibilite: string;
  carrosserie: string;
  garantie: number; 
  nombredeplaces: number; 
  nombredeportes: number; 
  nombredecylindres: number;
  energie: string; 
  puissancefiscale: number; 
  puissancechdin: number; 
  couple: number; 
  cylindree: number; 
  boite: string; 
  nombrederapports: number; 
  transmission: string; 
  longueur: number; 
  largeur: number; 
  hauteur: number; 
  volumeducoffre: number; 
  kmh: number; 
  vitessemaxi: number;
  consommationurbaine: number;
  consommationextraurbaine: number;
  consommationmixte: number;
  emissionsdec: number;
  abs: string;
  airbags: string;
  alarmeantivol: string;
  allumageautomatiquedesfeux: string;
  antidemarragelectronique: string;
  controledepressiondespneus: string;
  antipatinage: string;
  aideaumaintiendanslavoie: string;
  aideaustationnement: string;
  detecteurdefatigue: string;
  directionassistee: string;
  regulateurdevitesse: string;
  limiteurdevitesse: string; 
  baguettesexterieuresdencadrementdesvitres: string; 
  elementsexterieurscouleurcarrosserie: string;
  feuxaled: string; 
  jantes: string; 
  phares: string; 
  autoradio: string; 
  connectivite: string;
  ecrancentral: number; 
  accoudoirs: string; 
  cieldepavillon: string; 
  lumieresdambiance: string; 
  sellerie: string; 
  seuilsdeportes: string; 
  siegesreglablesenhauteur: string;
  tapisdesol: string; 
  volant: string; 
  volantreglable: string; 
  climatisation: string; 
  detecteurdepluie: string; 
  fermeturecentralisee: string; 
  freindestationnement: string; 
  ordinateurdebord: string; 
  retroviseursexterieurs: string;
  retroviseurinterieur: string; 
  vitreselectriques: string; 
  isActive: boolean; 
  events?: Event[]; 
}




function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:3000/car/getcars', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data.cars)) {
          setCars(response.data.cars);
        } else {
          setError('Data received is not an array');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching car data');
        setLoading(false);
      });
  }, [token]);

  const handleAddCarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(key, value);
    });

    const images = formData.getAll('image');
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('image', image); 
      });
    } else {
      console.warn("No images selected!");
    }

    try {
      const response = await axios.post('http://localhost:3000/car/createcar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Car added successfully:', response.data);
      setCars(prevCars => [...prevCars, response.data.car]);
      setIsModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || 'Error adding car');
        console.error('Error adding car:', error.response?.data || error.message);
      } else {
        setError('Unexpected error occurred');
        console.error('Unexpected error:', error);
      }
    }
  };




 const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  const filteredCars = cars.filter((car) =>
    car.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fields = [
    { label: 'Product Name', name: 'productname', type: 'text', required: true },
    { label: 'Price', name: 'price', type: 'number', required: true },
    { label: 'Puissance CH Din', name: 'puissancechdin', type: 'number', required: true },
    { label: 'Image', name: 'image', type: 'file', placeholder: 'Enter image URLs', required: true },

    { label: 'Disponibilité', name: 'disponibilite', type: 'text', required: true },
    { label: 'Carrosserie', name: 'carrosserie', type: 'text', required: true },
    { label: 'Garantie (in years)', name: 'garantie', type: 'number', required: true },
    { label: 'Nombre de Places', name: 'nombredeplaces', type: 'number', required: true },
    { label: 'Nombre de Portes', name: 'nombredeportes', type: 'number', required: true },
    { label: 'Nombre de Cylindres', name: 'nombredecylindres', type: 'number', required: true },
    { label: 'Énergie', name: 'energie', type: 'text', required: true },
    { label: 'Puissance Fiscale', name: 'puissancefiscale', type: 'number', required: true },
    { label: 'Couple', name: 'couple', type: 'number', required: true },
    { label: 'Cylindrée', name: 'cylindree', type: 'number', required: true },
    { label: 'Boite', name: 'boite', type: 'text', required: true },
    { label: 'Nombre de Rapports', name: 'nombrederapports', type: 'number', required: true },
    { label: 'Transmission', name: 'transmission', type: 'text', required: true },
    { label: 'Longueur (cm)', name: 'longueur', type: 'number', required: true },
    { label: 'Largeur (cm)', name: 'largeur', type: 'number', required: true },
    { label: 'Hauteur (cm)', name: 'hauteur', type: 'number', required: true },
    { label: 'Volume du Coffre (L)', name: 'volumeducoffre', type: 'number', required: true },
    { label: 'Vitesse Maxi (km/h)', name: 'vitessemaxi', type: 'number', required: true },
    { label: 'KM/H', name: 'kmh', type: 'number', required: true }, // Added KM/H field
    { label: 'Consommation Urbaine (L/100km)', name: 'consommationurbaine', type: 'number', required: true },
    { label: 'Consommation Extra Urbaine (L/100km)', name: 'consommationextraurbaine', type: 'number', required: true },
    { label: 'Consommation Mixte (L/100km)', name: 'consommationmixte', type: 'number', required: true },
    { label: 'Émissions de CO2 (g/km)', name: 'emissionsdec', type: 'number', required: true },
    
    // Equipements de sécurité
    { label: 'ABS', name: 'abs', type: 'text', required: true },
    { label: 'Airbags', name: 'airbags', type: 'text', required: true },
    { label: 'Alarme Antivol', name: 'alarmeantivol', type: 'text', required: true },
    { label: 'Allumage Automatique des Feux', name: 'allumageautomatiquedesfeux', type: 'text', required: true },
    { label: 'Antidémarrage Électronique', name: 'antidemarragelectronique', type: 'text', required: true },
    { label: 'Contrôle de Pression des Pneus', name: 'controledepressiondespneus', type: 'text', required: true },

    // Aides à la conduite
    { label: 'Antipatinage', name: 'antipatinage', type: 'text', required: true },
    { label: 'Aide au Maintien dans la Voie', name: 'aideaumaintiendanslavoie', type: 'text', required: true },
    { label: 'Aide au Stationnement', name: 'aideaustationnement', type: 'text', required: true },
    { label: 'Détecteur de Fatigue', name: 'detecteurdefatigue', type: 'text', required: true },
    { label: 'Direction Assistée', name: 'directionassistee', type: 'text', required: true },
    { label: 'Régulateur de Vitesse', name: 'regulateurdevitesse', type: 'text', required: true },
    { label: 'Limiteur de Vitesse', name: 'limiteurdevitesse', type: 'text', required: true },

    // Equipements extérieurs
    { label: "Baguettes Extérieures d'Encadrement des Vitres", name: 'baguettesexterieuresdencadrementdesvitres', type: 'text', required: true },
    { label: 'Éléments Extérieurs Couleur Carrosserie', name: 'elementsexterieurscouleurcarrosserie', type: 'text', required: true },
    { label: 'Feux À LED', name: 'feuxaled', type: 'text', required: true },
    { label: 'Jantes', name: 'jantes', type: 'text', required: true },
    { label: 'Phares', name: 'phares', type: 'text', required: true },

    // Audio et communication
    { label: 'Autoradio', name: 'autoradio', type: 'text', required: true },
    { label: 'Connectivité', name: 'connectivite', type: 'text', required: true },
    { label: 'Écran Central', name: 'ecrancentral', type: 'number', required: true },

    // Equipements intérieurs
    { label: 'Accoudoirs', name: 'accoudoirs', type: 'text', required: true },
    { label: 'Ciel de Pavillon', name: 'cieldepavillon', type: 'text', required: true },
    { label: 'Lumières d\'Ambiance', name: 'lumieresdambiance', type: 'text', required: true },
    { label: 'Sellerie', name: 'sellerie', type: 'text', required: true },
    { label: 'Seuils de Portes', name: 'seuilsdeportes', type: 'text', required: true },
    { label: 'Sièges Réglables en Hauteur', name: 'siegesreglablesenhauteur', type: 'text', required: true },
    { label: 'Tapis de Sol', name: 'tapisdesol', type: 'text', required: true },
    { label: 'Volant', name: 'volant', type: 'text', required: true },
    { label: 'Volant Réglable', name: 'volantreglable', type: 'text', required: true },

    // Equipements fonctionnels
    { label: 'Climatisation', name: 'climatisation', type: 'text', required: true },
    { label: 'Détecteur de Pluie', name: 'detecteurdepluie', type: 'text', required: true },
    { label: 'Fermeture Centralisée', name: 'fermeturecentralisee', type: 'text', required: true },
    { label: 'Frein de Stationnement', name: 'freindestationnement', type: 'text', required: true },
    { label: 'Ordinateur de Bord', name: 'ordinateurdebord', type: 'text', required: true },
    { label: 'Rétroviseurs Extérieurs', name: 'retroviseursexterieurs', type: 'text', required: true },
    { label: 'Rétroviseur Intérieur', name: 'retroviseurinterieur', type: 'text', required: true },
    { label: 'Vitres Électriques', name: 'vitreselectriques', type: 'text', required: true },
];

  
  return (
    <div>
 
      <div className="header-container">
        
      <h2>Cars Section <FaPlus onClick={openModal} className="add-car-icon" /></h2> 

    
    
        <div className="search-bar">
          <input
            type="text"
            id="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>
            <FaSearch className="search-button" />
          </button>
        </div>

        
      </div>

      
      <div className="car-card-container">
       
        {filteredCars.map((car, index) => (
          <div key={car.id} className="car-card-wrapper">
            {/* {index === 0 && <FaPlus style={{ fontSize: '24px', position: 'absolute', top: '10px', right: '10px' }} />} */}
            <CarCard key={car.id} car={car} />
          </div>
        ))}
       
      </div>
 
   <Modal show={isModalOpen} onHide={closeModal}>
  <Modal.Header closeButton>
    <Modal.Title>Create New Car</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <form onSubmit={handleAddCarSubmit}>
    {fields.map(({ label, name, type, required }) => (
      <div key={name}>
        <label>{label}:</label>
        <input
          type={type}
          name={name}
          required={required}
          placeholder={type !== 'file' ? 'Enter URL or additional info' : undefined}
          multiple={type === 'file'}
        />
      </div>
    ))}
    <div style={{ marginTop: '10px' }}>
      <Button type="submit" variant="primary">Add Car</Button>
      <Button type="button" onClick={closeModal} variant="secondary" style={{ marginLeft: '10px' }}>Cancel</Button>
    </div>
  </form>
</Modal.Body>

</Modal>


      
    </div>
  );
}

export default Cars;
