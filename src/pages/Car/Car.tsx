
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, } from 'react-router-dom';
import Spinner from '../../components/Spiner/Spinner';
import './Car.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faSave, faShare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Toast, ToastContainer } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
}


function Car() {
  const pdfContentRef = useRef<HTMLDivElement>(null); // Create a ref for pdf-content

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [originalCar, setOriginalCar] = useState<Car | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [files, setFiles] = useState<File[]>([])
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/car/getcar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const carData = response.data.car;
          setCar({
            ...carData,
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Error fetching car data');
          setLoading(false);
        });
    } else {
      navigate('/dashboard');
    }
  }, [id, token, navigate]);


  const showToastWithMessage = (message: string, type: 'success' | 'error', duration: number = 3000) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, duration);
  };


  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex === car!.image.length - 1) {
        return 1;
      }
      return prevIndex + 1;
    });
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex === 1) {
        return car!.image.length - 1;
      }
      return prevIndex - 1;
    });
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalCar(car);
    } else {
      setCar(originalCar);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;

    setCar((prevCar) => {
      if (!prevCar) return null;

      return {
        ...prevCar,
        [field]: value,
      };
    });
  };
  // const downloadPDF = () => {
  //   const doc = new jsPDF();

  //   // Add some content to the PDF
  //   doc.text("Car Details", 10, 10);
  //   doc.text("This is an example PDF for My Car.", 10, 20);

  //   // Save the PDF
  //   doc.save('My_Car.pdf');
  // };


  const downloadPDF = () => {
    const input = pdfContentRef.current; // Use the ref
    console.log('PDF content ref:', pdfContentRef.current);

    if (input) {
      html2canvas(input, { useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('portrait', 'px', 'A4');

        // Calculate image size and add it to PDF 
        const imgWidth = pdf.internal.pageSize.getWidth() - 30;
        const imgHeight = pdf.internal.pageSize.getHeight()

        pdf.addImage(imgData, 'PNG', 15, 0, imgWidth, imgHeight);
        pdf.save('My_Car.pdf');
      }).catch((error) => {
        console.error('Error generating PDF:', error);
      });
    } else {
      console.error('Element with id "pdf-content" not found.'); // Debugging message
    }
  };









  const handleSave = () => {
    if (!car) {
      showToastWithMessage('Car details are not available.', 'error');
      return;
    }

    const updatedCar: any = {
      ...car,
      image: car.image,
    };

    const form = new FormData()

    Object.keys(updatedCar).forEach((key: string) => form.append(key, updatedCar[key]))

    files.forEach((file) => form.append('image', file))


    axios.patch(`http://localhost:3000/car/updatecar/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setFiles([])
        setCar({
          ...car,
          ...response.data.updatedCar
        });
        setIsEditing(false);
        showToastWithMessage('Car details updated successfully!', 'success');
      })
      .catch(() => {
        showToastWithMessage('Error updating car details', 'error');
      });
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files)
      setFiles(Array.from(files))
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));

      console.log("Selected images:", newImages);

      setCar((prevCar) => ({
        ...prevCar!,
        image: newImages,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (car && car.image) {
        car.image.forEach(img => URL.revokeObjectURL(img));
      }
    };
  }, [car]);






  const handleDelete = async () => {

    try {
      await axios.delete(`http://localhost:3000/car/removecar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },

      });
      showToastWithMessage('Car deleted successfully!', 'success');
      navigate('/'); // Navigate to cars page after deletion
    } catch (error) {
      showToastWithMessage('Error deleting car', 'error');
    }
  };




  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!car) return <p>No car found</p>;

  return (
    <div className="car-detail">
      <h2 >{car.productname}</h2>
      <div className="image-container" style={{ position: 'relative' }}>
        {car.image[0].startsWith("blob:") ? (
          <>
            {/* Updated Image */}
            <img
              src={car.image[0]}
              alt={car.productname}
              style={{ opacity: 1 }}
            />
          </>
        ) : (
          <>
            {/* Original Image */}
            <img
              src={`http://localhost:3000/${car.image[0].replace(/\\/g, '/')}`}
              alt={car.productname}
              style={{ opacity: 1 }}
            />
          </>
        )}


      </div>


      <div className="action-buttons">
        <button onClick={handleEditToggle}>
          <FontAwesomeIcon style={{ fontSize: "40px", marginRight: "10px" }} icon={faEdit} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>

            <small style={{ fontSize: "12px", color: "#cccccc" }}>{isEditing ? 'Cancel Edit' : 'Edit Now'}</small>
          </div>
        </button>
        {isEditing && (
          <>
            <button onClick={handleSave}>
              <FontAwesomeIcon style={{ fontSize: "40px", marginRight: "10px" }} icon={faSave} />
              <span>Save</span>
            </button>
          </>
        )}
        <button onClick={handleDelete}>
          <FontAwesomeIcon style={{ fontSize: "40px", marginRight: "10px" }} icon={faTrashAlt} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span>Delete</span>
            <small style={{ fontSize: "12px", color: "#cccccc" }}>Delete Now</small>
          </div>
        </button>

        <button onClick={downloadPDF} style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon style={{ fontSize: '40px', marginRight: '10px' }} icon={faEye} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>View</span>
            <small style={{ fontSize: '12px', color: '#cccccc' }}>View Now</small>
          </div>
        </button>



        <button>
          <FontAwesomeIcon style={{ fontSize: "40px", marginRight: "10px" }} icon={faShare} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span>Share</span>
            <small style={{ fontSize: "12px", color: "#cccccc" }}>Share Now</small>
          </div>
        </button>
      </div>


      <div className='galerie-box'>
        <h4>Galerie</h4>
        <p className='titlle-galerie'>les atouts en photo</p>
      </div>
      
      {/* Gallery Section */}
      <div className="gallery">
        {car.image.slice(1, 7).map((img, index) => (
          <div onClick={() => openModal(index)} key={index} className="gallery-item">
            {!img.includes('http') && <img
              src={`http://localhost:3000/${img.replace(/\\/g, '/')}`}
              alt={car.productname}
              style={{ opacity: img.startsWith("blob:") ? 0.5 : 1 }}
            />}
            <img className='update-img'
              src={img}
              alt={car.productname}
              style={{ opacity: img.startsWith("blob:") ? 1 : 0 }}
            />
            {isEditing && (
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <button
                  className="edit-button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
            )}


          </div>
        ))}
      </div>



      {/* Modal for viewing images */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <button className="close" onClick={closeModal}>✕</button>
          <button className="prev" onClick={goToPrevImage}>‹</button>
          <img
            src={`http://localhost:3000/${car.image[currentImageIndex].replace(/\\/g, '/')}`}
            alt={`Gallery ${currentImageIndex + 1}`}
          />
          <button className="next" onClick={goToNextImage}>›</button>
        </div>
      )}
      <div className='galerie-box'>
        <h4>Fiche Technique</h4>
        <p className='titlle-galerie'>
          {isEditing ? (
            <input
              type="text"
              value={car.productname}
              onChange={(e) => handleChange(e, 'productname')}
            />
          ) : (
            <span>{car.productname}</span>
          )}
          {/* {car.productname} */}
        </p>
      </div>
      <div className='box-fiches' ref={pdfContentRef}>
        {/* Caractéristiques */}
        <div className="fiche-technique">
          <h3>Caractéristiques</h3>
          <div className="grid">
            <div className="item">
              <strong>Disponibilité</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.disponibilite}
                  onChange={(e) => handleChange(e, 'disponibilite')}
                />
              ) : (
                <span>{car.disponibilite}</span>
              )}
            </div>
            <div className="item">
              <strong>Carrosserie</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.carrosserie}
                  onChange={(e) => handleChange(e, 'carrosserie')}
                />
              ) : (
                <span>{car.carrosserie}</span>
              )}
            </div>
            <div className="item">
              <strong>Garantie</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.garantie}
                  onChange={(e) => handleChange(e, 'garantie')}
                />
              ) : (
                <span>{car.garantie} ans</span>
              )}
            </div>
            <div className="item">
              <strong>Nombre de places</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.nombredeplaces}
                  onChange={(e) => handleChange(e, 'nombredeplaces')}
                />
              ) : (
                <span>{car.nombredeplaces}</span>
              )}
            </div>
            <div className="item">
              <strong>Nombre de portes</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.nombredeportes}
                  onChange={(e) => handleChange(e, 'nombredeportes')}
                />
              ) : (
                <span>{car.nombredeportes}</span>
              )}
            </div>
          </div>
        </div>

        {/* Motorisation */}
        <div className="fiche-technique">
          <h3>Motorisation</h3>
          <div className="grid">
            <div className="item">
              <strong>Nombre de cylindres</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.nombredecylindres}
                  onChange={(e) => handleChange(e, 'nombredecylindres')}
                />
              ) : (
                <span>{car.nombredecylindres}</span>
              )}
            </div>
            <div className="item">
              <strong>Energie</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.energie}
                  onChange={(e) => handleChange(e, 'energie')}
                />
              ) : (
                <span>{car.energie}</span>
              )}
            </div>
            <div className="item">
              <strong>Puissance fiscale</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.puissancefiscale}
                  onChange={(e) => handleChange(e, 'puissancefiscale')}
                />
              ) : (
                <span>{car.puissancefiscale} CV</span>
              )}
            </div>
            <div className="item">
              <strong>Puissance (ch.din)</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.puissancechdin}
                  onChange={(e) => handleChange(e, 'puissancechdin')}
                />
              ) : (
                <span>{car.puissancechdin} CH</span>
              )}
            </div>
            <div className="item">
              <strong>Couple</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.couple}
                  onChange={(e) => handleChange(e, 'couple')}
                />
              ) : (
                <span>{car.couple} nm</span>
              )}
            </div>
            <div className="item">
              <strong>Cylindrée</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.cylindree}
                  onChange={(e) => handleChange(e, 'cylindree')}
                />
              ) : (
                <span>{car.cylindree} CM³</span>
              )}
            </div>
          </div>
        </div>

        {/* Transmission */}
        <div className="fiche-technique">
          <h3>Transmission</h3>
          <div className="grid">
            <div className="item">
              <strong>Boîte</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.boite}
                  onChange={(e) => handleChange(e, 'boite')}
                />
              ) : (
                <span>{car.boite}</span>
              )}
            </div>
            <div className="item">
              <strong>Nombre de rapports</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.nombrederapports}
                  onChange={(e) => handleChange(e, 'nombrederapports')}
                />
              ) : (
                <span>{car.nombrederapports}</span>
              )}
            </div>
            <div className="item">
              <strong>Transmission</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.transmission}
                  onChange={(e) => handleChange(e, 'transmission')}
                />
              ) : (
                <span>{car.transmission}</span>
              )}
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="fiche-technique">
          <h3>Dimensions</h3>
          <div className="grid">
            <div className="item">
              <strong>Longueur</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.longueur}
                  onChange={(e) => handleChange(e, 'longueur')}
                />
              ) : (
                <span>{car.longueur} mm</span>
              )}
            </div>
            <div className="item">
              <strong>Largeur</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.largeur}
                  onChange={(e) => handleChange(e, 'largeur')}
                />
              ) : (
                <span>{car.largeur} mm</span>
              )}
            </div>
            <div className="item">
              <strong>Hauteur</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.hauteur}
                  onChange={(e) => handleChange(e, 'hauteur')}
                />
              ) : (
                <span>{car.hauteur} mm</span>
              )}
            </div>
            <div className="item">
              <strong>Volume du coffre</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.volumeducoffre}
                  onChange={(e) => handleChange(e, 'volumeducoffre')}
                />
              ) : (
                <span>{car.volumeducoffre} L</span>
              )}
            </div>
          </div>
        </div>

        {/* Performances */}
        <div className="fiche-technique">
          <h3>Performances</h3>
          <div className="grid">
            <div className="item">
              <strong>0-100 Km/h</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.kmh}
                  onChange={(e) => handleChange(e, 'kmh')}
                />
              ) : (
                <span>{car.kmh} s</span>
              )}
            </div>
            <div className="item">
              <strong>Vitesse maxi</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.vitessemaxi}
                  onChange={(e) => handleChange(e, 'vitessemaxi')}
                />
              ) : (
                <span>{car.vitessemaxi} KM/H</span>
              )}
            </div>
          </div>
        </div>

        {/* Consommation */}
        <div className="fiche-technique">
          <h3>Consommation</h3>
          <div className="grid">
            <div className="item">
              <strong>Consommation urbaine</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.consommationurbaine}
                  onChange={(e) => handleChange(e, 'consommationurbaine')}
                />
              ) : (
                <span>{car.consommationurbaine} L/100 km</span>
              )}
            </div>
            <div className="item">
              <strong>Consommation extra-urbaine</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.consommationextraurbaine}
                  onChange={(e) => handleChange(e, 'consommationextraurbaine')}
                />
              ) : (
                <span>{car.consommationextraurbaine} L/100 km</span>
              )}
            </div>
            <div className="item">
              <strong>Consommation mixte</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.consommationmixte}
                  onChange={(e) => handleChange(e, 'consommationmixte')}
                />
              ) : (
                <span>{car.consommationmixte} L/100 km</span>
              )}
            </div>
            <div className="item">
              <strong>Emissions de CO2</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.emissionsdec}
                  onChange={(e) => handleChange(e, 'emissionsdec')}
                />
              ) : (
                <span>{car.emissionsdec} g/km</span>
              )}
            </div>
          </div>
        </div>

        {/* Equipements de sécurité */}
        <div className="fiche-technique">
          <h3>Equipements de sécurité</h3>
          <div className="grid">
            <div className="item">
              <strong>ABS</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.abs}
                  onChange={(e) => handleChange(e, 'abs')}
                />
              ) : (
                <span>{car.abs || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Airbags</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.airbags}
                  onChange={(e) => handleChange(e, 'airbags')}
                />
              ) : (
                <span>{car.airbags}</span>
              )}
            </div>
            <div className="item">
              <strong>Alarme antivol</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.alarmeantivol}
                  onChange={(e) => handleChange(e, 'alarmeantivol')}
                />
              ) : (
                <span>{car.alarmeantivol || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Allumage automatique des feux</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.allumageautomatiquedesfeux}
                  onChange={(e) => handleChange(e, 'allumageautomatiquedesfeux')}
                />
              ) : (
                <span>{car.allumageautomatiquedesfeux || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Anti-démarrage électronique</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.antidemarragelectronique}
                  onChange={(e) => handleChange(e, 'antidemarragelectronique')}
                />
              ) : (
                <span>{car.antidemarragelectronique || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Contrôle de pression des pneus</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.controledepressiondespneus}
                  onChange={(e) => handleChange(e, 'controledepressiondespneus')}
                />
              ) : (
                <span>{car.controledepressiondespneus || 'Non spécifié'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Aides à la conduite */}
        <div className="fiche-technique">
          <h3>Aides à la conduite</h3>
          <div className="grid">
            <div className="item">
              <strong>Anti-patinage</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.antipatinage}
                  onChange={(e) => handleChange(e, 'antipatinage')}
                />
              ) : (
                <span>{car.antipatinage}</span>
              )}
            </div>
            <div className="item">
              <strong>Aide au maintien dans la voie</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.aideaumaintiendanslavoie}
                  onChange={(e) => handleChange(e, 'aideaumaintiendanslavoie')}
                />
              ) : (
                <span>{car.aideaumaintiendanslavoie || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Aide au stationnement</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.aideaustationnement}
                  onChange={(e) => handleChange(e, 'aideaustationnement')}
                />
              ) : (
                <span>{car.aideaustationnement}</span>
              )}
            </div>
            <div className="item">
              <strong>Détecteur de fatigue</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.detecteurdefatigue}
                  onChange={(e) => handleChange(e, 'detecteurdefatigue')}
                />
              ) : (
                <span>{car.detecteurdefatigue || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Direction assistée</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.directionassistee}
                  onChange={(e) => handleChange(e, 'directionassistee')}
                />
              ) : (
                <span>{car.directionassistee || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Régulateur de vitesse</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.regulateurdevitesse}
                  onChange={(e) => handleChange(e, 'regulateurdevitesse')}
                />
              ) : (
                <span>{car.regulateurdevitesse || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Limiteur de vitesse</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.limiteurdevitesse}
                  onChange={(e) => handleChange(e, 'limiteurdevitesse')}
                />
              ) : (
                <span>{car.limiteurdevitesse || 'Non spécifié'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Equipements extérieurs */}
        <div className="fiche-technique">
          <h3>Equipements extérieurs</h3>
          <div className="grid">
            <div className="item">
              <strong>Baguettes extérieures d'encadrement des vitres</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.baguettesexterieuresdencadrementdesvitres}
                  onChange={(e) => handleChange(e, 'baguettesexterieuresdencadrementdesvitres')}
                />
              ) : (
                <span>{car.baguettesexterieuresdencadrementdesvitres}</span>
              )}
            </div>
            <div className="item">
              <strong>Éléments extérieurs couleur carrosserie</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.elementsexterieurscouleurcarrosserie}
                  onChange={(e) => handleChange(e, 'elementsexterieurscouleurcarrosserie')}
                />
              ) : (
                <span>{car.elementsexterieurscouleurcarrosserie || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Feux à LED</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.feuxaled}
                  onChange={(e) => handleChange(e, 'feuxaled')}
                />
              ) : (
                <span>{car.feuxaled}</span>
              )}
            </div>
            <div className="item">
              <strong>Jantes</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.jantes}
                  onChange={(e) => handleChange(e, 'jantes')}
                />
              ) : (
                <span>{car.jantes}</span>
              )}
            </div>
            <div className="item">
              <strong>Phares</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.phares}
                  onChange={(e) => handleChange(e, 'phares')}
                />
              ) : (
                <span>{car.phares}</span>
              )}
            </div>
          </div>
        </div>

        {/* Audio et communication */}
        <div className="fiche-technique">
          <h3>Audio et communication</h3>
          <div className="grid">
            <div className="item">
              <strong>Autoradio</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.autoradio}
                  onChange={(e) => handleChange(e, 'autoradio')}
                />
              ) : (
                <span>{car.autoradio || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Connectivité</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.connectivite}
                  onChange={(e) => handleChange(e, 'connectivite')}
                />
              ) : (
                <span>{car.connectivite}</span>
              )}
            </div>
            <div className="item">
              <strong>Ecran central</strong>
              {isEditing ? (
                <input
                  type="number"
                  value={car.ecrancentral}
                  onChange={(e) => handleChange(e, 'ecrancentral')}
                />
              ) : (
                <span>{car.ecrancentral} pouces</span>
              )}
            </div>
          </div>
        </div>

        {/* Equipements intérieurs */}
        <div className="fiche-technique">
          <h3>Equipements intérieurs</h3>
          <div className="grid">
            <div className="item">
              <strong>Accoudoirs</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.accoudoirs}
                  onChange={(e) => handleChange(e, 'accoudoirs')}
                />
              ) : (
                <span>{car.accoudoirs}</span>
              )}
            </div>
            <div className="item">
              <strong>Ciel de pavillon</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.cieldepavillon}
                  onChange={(e) => handleChange(e, 'cieldepavillon')}
                />
              ) : (
                <span>{car.cieldepavillon}</span>
              )}
            </div>
            <div className="item">
              <strong>Lumières d'ambiance</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.lumieresdambiance}
                  onChange={(e) => handleChange(e, 'lumieresdambiance')}
                />
              ) : (
                <span>{car.lumieresdambiance || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Sellerie</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.sellerie}
                  onChange={(e) => handleChange(e, 'sellerie')}
                />
              ) : (
                <span>{car.sellerie}</span>
              )}
            </div>
            <div className="item">
              <strong>Seuils de portes</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.seuilsdeportes}
                  onChange={(e) => handleChange(e, 'seuilsdeportes')}
                />
              ) : (
                <span>{car.seuilsdeportes}</span>
              )}
            </div>
            <div className="item">
              <strong>Sièges réglables en hauteur</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.siegesreglablesenhauteur}
                  onChange={(e) => handleChange(e, 'siegesreglablesenhauteur')}
                />
              ) : (
                <span>{car.siegesreglablesenhauteur}</span>
              )}
            </div>
            <div className="item">
              <strong>Tapis de sol</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.tapisdesol}
                  onChange={(e) => handleChange(e, 'tapisdesol')}
                />
              ) : (
                <span>{car.tapisdesol || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Volant</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.volant}
                  onChange={(e) => handleChange(e, 'volant')}
                />
              ) : (
                <span>{car.volant}</span>
              )}
            </div>
            <div className="item">
              <strong>Volant réglable</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.volantreglable}
                  onChange={(e) => handleChange(e, 'volantreglable')}
                />
              ) : (
                <span>{car.volantreglable}</span>
              )}
            </div>
          </div>
        </div>

        {/* Equipements fonctionnels */}
        <div className="fiche-technique">
          <h3>Equipements fonctionnels</h3>
          <div className="grid">
            <div className="item">
              <strong>Climatisation</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.climatisation}
                  onChange={(e) => handleChange(e, 'climatisation')}
                />
              ) : (
                <span>{car.climatisation}</span>
              )}
            </div>
            <div className="item">
              <strong>Détecteur de pluie</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.detecteurdepluie}
                  onChange={(e) => handleChange(e, 'detecteurdepluie')}
                />
              ) : (
                <span>{car.detecteurdepluie || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Fermeture centralisée</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.fermeturecentralisee}
                  onChange={(e) => handleChange(e, 'fermeturecentralisee')}
                />
              ) : (
                <span>{car.fermeturecentralisee}</span>
              )}
            </div>
            <div className="item">
              <strong>Frein de stationnement</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.freindestationnement}
                  onChange={(e) => handleChange(e, 'freindestationnement')}
                />
              ) : (
                <span>{car.freindestationnement}</span>
              )}
            </div>
            <div className="item">
              <strong>Ordinateur de bord</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.ordinateurdebord}
                  onChange={(e) => handleChange(e, 'ordinateurdebord')}
                />
              ) : (
                <span>{car.ordinateurdebord || 'Non spécifié'}</span>
              )}
            </div>
            <div className="item">
              <strong>Rétroviseurs extérieurs</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.retroviseursexterieurs}
                  onChange={(e) => handleChange(e, 'retroviseursexterieurs')}
                />
              ) : (
                <span>{car.retroviseursexterieurs}</span>
              )}
            </div>
            <div className="item">
              <strong>Rétroviseur intérieur</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.retroviseurinterieur}
                  onChange={(e) => handleChange(e, 'retroviseurinterieur')}
                />
              ) : (
                <span>{car.retroviseurinterieur}</span>
              )}
            </div>
            <div className="item">
              <strong>Vitres électriques</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={car.vitreselectriques}
                  onChange={(e) => handleChange(e, 'vitreselectriques')}
                />
              ) : (
                <span>{car.vitreselectriques}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }} className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} className={toastType === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default Car;
