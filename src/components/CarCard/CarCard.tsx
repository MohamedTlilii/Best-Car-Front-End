import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './CarCard.scss'; // Import custom CSS file

interface CarCardProps {
  car: {
    id: number;
    name: string;
    description: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    color: string;
    mileage: number;
    isAvailable: boolean;
    isActive: boolean;
    image: string | null; // Handle image as string or null
  };
  onUpdate: (updatedCar: any) => void;
  onDelete: (id: number) => void;
}

interface FormDataType {
  name: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  isAvailable: boolean;
  image: File | string;
}

function CarCard({ car, onUpdate, onDelete }: CarCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(car.image ? `http://localhost:3000/${car.image.replace(/\\/g, '/')}` : null);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState<FormDataType>({
    name: car.name,
    description: car.description,
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    color: car.color,
    mileage: car.mileage,
    isAvailable: car.isAvailable,
    image: car.image || '', // Handle case where image might be null
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === 'file' && files?.length) {
      const file = files[0];
      setFormData(prevData => ({
        ...prevData,
        [id]: file
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [id]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      console.log('FormData before sending:', formData); // Debug log

      const form = new FormData();
      (Object.keys(formData) as Array<keyof FormDataType>).forEach(key => {
        const value = formData[key];
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, value.toString());
        }
      });

      const response = await axios.patch(`http://localhost:3000/car/updatecar/${car.id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Response from server:', response);

      if (response.data && response.data.car) {
        onUpdate(response.data.car);
      } else {
        console.error('Unexpected response structure:', response.data);
      }

      handleClose();
    } catch (error) {
      console.error('Error updating car data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/car/removecar/${car.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      onDelete(car.id);
    } catch (error) {
      console.error('Error deleting car data:', error);
    }
  };

  return (
    <Card className='card-product'>
      <Card.Img className='card-image'
        variant="top" 
        src={car.image ? `http://localhost:3000/${car.image.replace(/\\/g, '/')}` : 'default-image-url'} 
        alt={car.name} 
      />  
      <Card.Body>
        <Card.Title>{car.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{`${car.brand} ${car.model} (${car.year})`}</Card.Subtitle>
        <Card.Text>
          {car.description}
          <br />
          <strong>Price:</strong> ${car.price}
          <br />
          <strong>Color:</strong> {car.color}
          <br />
          <strong>Mileage:</strong> {car.mileage} miles
          <br />
          <strong>Available:</strong> 
          <span className={`radio-indicator ${car.isAvailable ? 'available' : 'not-available'}`}></span>
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Button variant="primary" className="me-2" onClick={handleShow}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Card.Body>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Car Name</Form.Label>
              <Form.Control
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                id="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                id="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                id="model"
                value={formData.model}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                id="year"
                value={formData.year}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                id="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                id="color"
                value={formData.color}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mileage</Form.Label>
              <Form.Control
                type="number"
                id="mileage"
                value={formData.mileage}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                id="image"
                onChange={handleChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
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
                  id="isAvailable"
                  label="Available"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
                <div 
                  className={`radio-indicator ms-2 ${formData.isAvailable ? 'available' : 'not-available'}`}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default CarCard;
