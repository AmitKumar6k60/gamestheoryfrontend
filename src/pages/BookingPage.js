import React, { useEffect, useState } from 'react';

const BookingPage = () => {
  const [centres, setCentres] = useState([]);
  const [sports, setSports] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    customer_name: '', // Customer Name field
    centreId: '',
    sportId: '',
    resourceId: '',
    timeSlot: '',
    date: '', // Added booking date field
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch centres, sports, resources, and bookings from the backend
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCentres(), fetchBookings()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchCentres = async () => {
    try {
      const response = await fetch('http://13.60.199.62:5001/api/centres');
      const data = await response.json();
      setCentres(data);
    } catch (error) {
      console.error('Error fetching centres:', error);
      setErrorMessage('Failed to load centres. Please try again later.');
    }
  };

  const fetchSports = async (centreId) => {
    try {
      const response = await fetch(`http://13.60.199.62:5001/api/sports_with_centreId/${centreId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSports(data);
      } else {
        setSports([]);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
      setErrorMessage('Failed to load sports. Please try again later.');
      setSports([]);
    }
  };

  const fetchResources = async (centreId, sportId) => {
    try {
      const response = await fetch(`http://13.60.199.62:5001/api/resources/${centreId}/${sportId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setResources(data);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setErrorMessage('Failed to load resources. Please try again later.');
      setResources([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://13.60.199.62:5001/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrorMessage('Failed to load bookings. Please try again later.');
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await fetch(`http://13.60.199.62:5001/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error('Error deleting booking:', error);
      setErrorMessage('Failed to delete booking. Please try again later.');
    }
  };

  // Update sports and resources based on selected centre
  const handleCentreChange = (e) => {
    const selectedCentreId = e.target.value;
    setNewBooking({ ...newBooking, centreId: selectedCentreId, sportId: '', resourceId: '', timeSlot: '', date: '' });
    setResources([]);
    fetchSports(selectedCentreId);
    setAvailableTimeSlots([]);
  };

  const handleSportChange = (e) => {
    const selectedSportId = e.target.value;
    setNewBooking({ ...newBooking, sportId: selectedSportId, resourceId: '', timeSlot: '' });
    fetchResources(newBooking.centreId, selectedSportId);
    setAvailableTimeSlots([]);
  };

  const handleResourceChange = (e) => {
    const selectedResourceId = e.target.value;
    setNewBooking({ ...newBooking, resourceId: selectedResourceId, timeSlot: '' });
    updateAvailableTimeSlots(newBooking.centreId, newBooking.sportId, selectedResourceId);
  };

  const updateAvailableTimeSlots = (centreId, sportId, resourceId) => {
    const bookedSlots = bookings
      .filter(booking => booking.centreId === centreId && booking.sportId === sportId && booking.resourceId === resourceId)
      .map(booking => booking.timeSlot);

    const allTimeSlots = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`); // 8 AM to 8 PM
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableTimeSlots(availableSlots);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const addBooking = async (e) => {
    e.preventDefault();
    const { timeSlot, date } = newBooking; // Include date
    const [hour] = timeSlot.split(':');
    const start_time = timeSlot;
    const end_time = `${parseInt(hour) + 1}:00`; // Assuming 1-hour slots

    try {
      await fetch('http://13.60.199.62:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newBooking, start_time, end_time, date }), // Include date
      });
      console.log("Amit");
      fetchBookings(); // Refresh the bookings list
      setNewBooking({ customer_name: '', centreId: '', sportId: '', resourceId: '', timeSlot: '', date: '' }); // Reset the form
      setAvailableTimeSlots([]);
    } catch (error) {
      console.error('Error adding booking:', error);
      setErrorMessage('Failed to add booking. Please try again later.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const isBookingDisabled = !newBooking.customer_name || !newBooking.centreId || !newBooking.sportId || !newBooking.resourceId || !newBooking.timeSlot || !newBooking.date || !availableTimeSlots.length;


  // ... the return statement follows
return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Bookings</h1>
  
      {/* New Booking Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
        <form onSubmit={addBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Customer Name</label>
            <input
              type="text"
              name="customer_name"
              value={newBooking.customer_name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Centre</label>
            <select
              name="centreId"
              value={newBooking.centreId}
              onChange={handleCentreChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select a Centre</option>
              {centres.map((centre) => (
                <option key={centre.id} value={centre.id}>
                  {centre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Sport</label>
            <select
              name="sportId"
              value={newBooking.sportId}
              onChange={handleSportChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select a Sport</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Resource</label>
            <select
              name="resourceId"
              value={newBooking.resourceId}
              onChange={handleResourceChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select a Resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Booking Date</label>
            <input
              type="date"
              name="date"
              value={newBooking.date}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Time Slot</label>
            <select
              name="timeSlot"
              value={newBooking.timeSlot}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select a Time Slot</option>
              {availableTimeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
            disabled={isBookingDisabled} // Disable button if booking cannot proceed
          >
            Book Event
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <table className="bg-white shadow-md rounded-lg overflow-hidden w-full">
        <thead>
          <tr>
            <th className="px-2 py-2 text-center">Booking ID</th>
            <th className="px-2 py-2 text-center">Customer Name</th>
            <th className="px-2 py-2 text-center">Centre ID</th>
            <th className="px-2 py-2 text-center">Sport ID</th>
            <th className="px-2 py-2 text-center">Resource ID</th>
            <th className="px-2 py-2 text-center">Date</th>
            <th className="px-2 py-2 text-center">Time Slot</th>
            <th className="px-2 py-2 text-center">Actions</th> {/* Added Actions column */}
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="px-2 py-2 text-center">{booking.id}</td>
                <td className="px-2 py-2 text-center">{booking.customer_name}</td>
                <td className="px-2 py-2 text-center">{booking.centreId}</td>
                <td className="px-2 py-2 text-center">{booking.sportId}</td>
                <td className="px-2 py-2 text-center">{booking.resourceId}</td>
                <td className="px-2 py-2 text-center">{booking.date}</td>
                <td className="px-2 py-2 text-center">{booking.start_time + " - "+ booking.end_time}</td>
                <td className="px-2 py-2 text-center">
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No bookings available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingPage;
