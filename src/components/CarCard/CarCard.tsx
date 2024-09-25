import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import {  Toast } from 'react-bootstrap';
import axios from 'axios';
import './CarCard.scss';
import Spinner from '../Spiner/Spinner';
import { Link } from 'react-router-dom';

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



interface CarCardProps {
  car: Car;
}

function CarCard({ car }: CarCardProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading) return <Spinner />;
  
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="card-product">
      <Link className='linkkkk' to={`/dashboard/car/${car.id}`}>
        <img
          className="card-image"
          src={
            car.image.length > 0
              ? `http://localhost:3000/${car.image[0].replace(/\\/g, '/')}`
              : 'default-image-url'
          }
          alt={car.productname}
        />
        </Link>
        <Card.Body>
          <Card.Title>
          <Link className='linkkkk' to={`/dashboard/car/${car.id}`}>
  {car.productname}
</Link>

            </Card.Title>
          {/* {car.price} DT */}
        </Card.Body>
      </div>

      {/* Toast notification */}
      <Toast
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
        }}
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

export default CarCard;
