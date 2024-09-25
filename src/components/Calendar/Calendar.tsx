import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Spinner from '../Spiner/Spinner';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import axios from 'axios';
import { EventInput } from '@fullcalendar/core';


interface Event {
  id?: number;
  note: string;
  name: string;
  startdate: string;
  enddate: string;
  identityCardFront?: string;
  identityCardBack?: string;
  permitFront?: string;
  permitBack?: string;
  carId?: string;
}

interface Car {
  id: string;
  productname: string;
  price: number;
}
function Calendar() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [modalShow, setModalShow] = useState(false);

  const [newEvent, setNewEvent] = useState<Event>({
    note: '',
    name: '',
    startdate: '',
    enddate: '',
    carId: '',
    identityCardFront: '',
    identityCardBack: '',
    permitFront: '',
    permitBack: '',
  });

  const [cars, setCars] = useState<Car[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const token = localStorage.getItem('token');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailModalShow, setEventDetailModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false); // New state for edit modal

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/events/getevents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const fetchedEvents = response.data.map((event: Event) => ({
        id: event.id?.toString(),
        title: event.name,
        note: event.note,
        name: event.name,
        start: event.startdate,
        end: event.enddate,
        identityCardFront: event.identityCardFront,
        identityCardBack: event.identityCardBack,
        permitFront: event.permitFront,
        permitBack: event.permitBack,
        allDay: true,
      }));

      console.log('Fetched events:', fetchedEvents);
      setEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };



  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:3000/car/getcars', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const carsData = response.data.cars;
      // console.log(carsData);
      setCars(carsData);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCars();
  }, []);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
        setNewEvent(prevEvent => ({ ...prevEvent, [name]: files[0] }));
    }
};




  const handelCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    // console.log(newEvent);

    const formData = new FormData();
    formData.append('note', newEvent.note);
    formData.append('name', newEvent.name);
    formData.append('startdate', newEvent.startdate);
    formData.append('enddate', newEvent.enddate);
    formData.append('carId', newEvent.carId || '');

    if (newEvent.identityCardBack) {
      formData.append('identityCardBack', newEvent.identityCardBack);
    }
    if (newEvent.permitFront) {
      formData.append('permitFront', newEvent.permitFront);
    }
    if (newEvent.permitBack) {
      formData.append('permitBack', newEvent.permitBack);
    }
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`Key: ${key}, Value: ${value.name}`);
      } else {
        console.log(`Key: ${key}, Value: ${value}`);
      }
    });

    try {
      await axios.post('http://localhost:3000/events/createevent', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      fetchEvents();
      setToastMessage('Event successfully created!');
      setShowToast(true);
      setNewEvent({
        note: '',
        name: '',
        startdate: '',
        enddate: '',
        carId: '',
        identityCardFront: '',
        identityCardBack: '',
        permitFront: '',
        permitBack: ''
      });
      setModalShow(false);
    } catch (error) {
      console.error("Error creating event:", error);
      setToastMessage('Failed to create event.');
      setShowToast(true);
    }
  }


  // Handling event click for showing details
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id as string;
    const eventToShow = events.find(event => event.id === eventId);

    if (eventToShow) {
        setSelectedEvent({
            id: Number(eventToShow.id),
            note: eventToShow.note,
            name: eventToShow.name,
            startdate: eventToShow.start as string || '',
            enddate: eventToShow.end as string || '',
            identityCardFront: eventToShow.identityCardFront,
            identityCardBack: eventToShow.identityCardBack,
            permitFront: eventToShow.permitFront,
            permitBack: eventToShow.permitBack,
        });
        setEventDetailModalShow(true);
    }
};



  const renderEventDetailModal = () => (
    <Modal show={eventDetailModalShow} onHide={() => setEventDetailModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Event Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedEvent && (
          <>
            <p><strong>Name:</strong> {selectedEvent.name}</p>
            <p><strong>Start Date:</strong> {selectedEvent.startdate}</p>
            <p><strong>End Date:</strong> {selectedEvent.enddate}</p>
            <p><strong>Note:</strong> {selectedEvent.note}</p>

            {/* Display images if they exist */}
            {selectedEvent.identityCardFront && (
              <>
                <p><strong>Identity Card Front:</strong></p>
                <img
                  src={`http://localhost:3000${selectedEvent.identityCardFront}`}
                  alt="Identity Card Front"
                  style={{ width: '100%', height: 'auto' }}
                />
              </>
            )}

            {selectedEvent.identityCardBack && (
              <>
                <p><strong>Identity Card Back:</strong></p>
                <img
                  src={selectedEvent.identityCardBack}
                  alt="Identity Card Back"
                  style={{ width: '100%', height: 'auto' }}
                />
              </>
            )}

            {selectedEvent.permitFront && (
              <>
                <p><strong>Permit Front:</strong></p>
                <img
                  src={selectedEvent.permitFront}
                  alt="Permit Front"
                  style={{ width: '100%', height: 'auto' }}
                />
              </>
            )}

            {selectedEvent.permitBack && (
              <>
                <p><strong>Permit Back:</strong></p>
                <img
                  src={selectedEvent.permitBack}
                  alt="Permit Back"
                  style={{ width: '100%', height: 'auto' }}
                />
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setEventDetailModalShow(false)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedEvent(selectedEvent);
            setEditModalShow(true);
            setEventDetailModalShow(false);
          }}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            if (!selectedEvent) {
              console.error("No event selected for deletion.");
              return;
            }

            const confirmed = window.confirm("Are you sure you want to delete this event?");
            if (confirmed) {
              await handleDeleteEvent(selectedEvent.id);
              setEventDetailModalShow(false);
            }
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
  const handleDeleteEvent = async (eventId: number | undefined) => {
    if (!eventId) return;

    try {
      await axios.delete(`http://localhost:3000/events/deleteevent/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      fetchEvents();
      setToastMessage('Event successfully deleted!');
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting event:", error);
      setToastMessage('Failed to delete event.');
      setShowToast(true);
    }
  };



  if (loading) return <Spinner />;

  return (
    <div className='aaa' style={{ color: 'black', padding: '20px', position: 'relative' }}>
      <h2>Calendar Section</h2>
      {/* <p>This is the Calendar content.</p> */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        dateClick={(arg) => {
          setNewEvent({
            ...newEvent,
            startdate: arg.dateStr,
            enddate: arg.dateStr
          });
          setModalShow(true);
        }}
        eventClick={handleEventClick}
      />

      {/* Create Event Modal */}

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handelCreate}>

            <Form.Group controlId="formEventName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
                placeholder="Enter event name"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventStartDate">
              <Form.Label>start date</Form.Label>
              <Form.Control
                type="date"
                name="startdate"
                value={newEvent.startdate}
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
                // min={selectedDate}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEventEndDate">
              <Form.Label>end date</Form.Label>
              <Form.Control
                type="date"
                name="enddate"
                value={newEvent.enddate}
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
                // min={selectedDate}
                required
              />
            </Form.Group>


            <Form.Group controlId="formEventCar">
              <Form.Label>Select Car</Form.Label>
              <Form.Control
                as="select"
                name="carId"
                value={newEvent.carId}
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
                required
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>{car.productname}</option>
                ))}
              </Form.Control>
            </Form.Group>
            {/* Display the price if a car is selected */}


            {/* File Inputs */}
            <Form.Group controlId="formIdentityCardFront">
              <Form.Label>Identity Card Front</Form.Label>
              <Form.Control
                type="file"
                name="identityCardFront"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="formIdentityCardBack">
              <Form.Label>Identity Card Back</Form.Label>
              <Form.Control
                type="file"
                name="identityCardBack"
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
              />
            </Form.Group>
            <Form.Group controlId="formPermitFront">
              <Form.Label>Permit Front</Form.Label>
              <Form.Control
                type="file"
                name="permitFront"
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
              />
            </Form.Group>
            <Form.Group controlId="formPermitBack">
              <Form.Label>Permit Back</Form.Label>
              <Form.Control
                type="file"
                name="permitBack"
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
              />
            </Form.Group>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                name="note"
                value={newEvent.note}
                onChange={handleFileChange as React.ChangeEventHandler<HTMLInputElement>}
                placeholder="Enter event note"
                required
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Event
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>


      {/* Render Edit Modal */}
      {renderEventDetailModal()}
      {/* Toast notification */}
      <Toast
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999
        }}
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>






    </div>
  );
}

export default Calendar;







