

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../CarCard/CarCard';
import './Cars.scss';
import { Spinner, Modal, Button, Form } from 'react-bootstrap';

interface Car {
  name: string;
  image: File | null;
  description: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  isAvailable: boolean;
}

function Cars() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newCar, setNewCar] = useState<Car>({
    name: '',
    image: null,
    description: '',
    brand: '',
    model: '',
    year: 0,
    price: 0,
    color: '',
    mileage: 0,
    isAvailable: true
  });
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:3000/car/getcars', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (Array.isArray(response.data.cars)) {
          setCars(response.data.cars);
        } else {
          setError('Data received is not an array');
        }
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching car data');
        setLoading(false);
      });
  }, [token]);

  const handleUpdateCar = (updatedCar: any) => {
    setCars(prevCars =>
      prevCars.map(car => car.id === updatedCar.id ? updatedCar : car)
    );
  };

  const handleDeleteCar = (id: number) => {
    setCars(prevCars =>
      prevCars.filter(car => car.id !== id)
    );
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setImagePreview(null); // Clear the image preview when closing the modal
    setNewCar({
      name: '',
      image: null,
      description: '',
      brand: '',
      model: '',
      year: 0,
      price: 0,
      color: '',
      mileage: 0,
      isAvailable: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files?.[0] ?? null;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setNewCar(prevCar => ({
            ...prevCar,
            image: file
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setNewCar(prevCar => ({
        ...prevCar,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCreateCar = () => {
    const formData = new FormData();
    Object.keys(newCar).forEach(key => {
      const value = newCar[key as keyof Car];
      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value !== 'object') {
        formData.append(key, String(value)); // Convert non-File values to string
      }
    });

    axios.post('http://localhost:3000/car/createcar', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setCars(prevCars => [...prevCars, response.data.car]);
        handleCloseModal();
      })
      .catch(error => {
        setError('Error creating car');
      });
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return (
    <div className="error-container">
      <p>{error}</p>
    </div>
  );

  return (
    <div style={{ color: 'green' }}>
      <h2>Cars Section</h2>
      <p>This is the Cars content.</p>
      <button style={{ marginBottom: "10px" }} className="custom-button" onClick={handleShowModal}>
        +
      </button>
      <div className="car-card-container">
        {cars.length > 0 ? (
          cars.map(car => (
            <CarCard
              key={car.id}
              car={car}
              onUpdate={handleUpdateCar}
              onDelete={handleDeleteCar}
            />
          ))
        ) : (
          <p>No cars available</p>
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter car name"
                value={newCar.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter car description"
                value={newCar.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                placeholder="Enter car brand"
                value={newCar.brand}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                name="model"
                placeholder="Enter car model"
                value={newCar.model}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                name="year"
                placeholder="Enter car year"
                value={newCar.year}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter car price"
                value={newCar.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                placeholder="Enter car color"
                value={newCar.color}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mileage</Form.Label>
              <Form.Control
                type="number"
                name="mileage"
                placeholder="Enter car mileage"
                value={newCar.mileage}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleInputChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview as string}
                  alt="Preview"
                  style={{ maxWidth: '100%', marginTop: '10px' }}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Available</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  name="isAvailable"
                  label="Available"
                  checked={newCar.isAvailable}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateCar}>
            Create Car
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cars;
