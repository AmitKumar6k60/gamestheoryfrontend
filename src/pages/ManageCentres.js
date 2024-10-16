import React, { useEffect, useState } from 'react';

const ManageCentres = () => {
  const [centres, setCentres] = useState([]);
  const [newCentre, setNewCentre] = useState({ name: '', location: '' });

  // Fetch centres from the backend
  useEffect(() => {
    fetchCentres();
  }, []);

  const fetchCentres = () => {
    fetch('http://13.60.199.62:5001/api/centres')
      .then((response) => response.json())
      .then((data) => setCentres(data))
      .catch((error) => console.error('Error fetching centres:', error));
  };

  // Handle input change for new centre
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCentre({ ...newCentre, [name]: value });
  };

  // Add new centre
  const addCentre = (e) => {
    e.preventDefault();
    fetch('http://13.60.199.62:5001/api/centres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCentre),
      mode: 'no-cors',
    })
      .then(() => {
        fetchCentres(); // Refresh the centres list after adding
        setNewCentre({ name: '', location: '' }); // Clear the input fields
      })
      .catch((error) => console.error('Error adding centre:', error));
  };

  // Delete centre
  const deleteCentre = (id) => {
    fetch(`http://13.60.199.62:5001/api/centres/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchCentres()) // Refresh the list after deleting
      .catch((error) => console.error('Error deleting centre:', error));
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Centres</h1>

      {/* Add Centre Card */}
      <div className="max-w-md mx-right bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Add New Centre</h2>
        <form onSubmit={addCentre}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Centre Name</label>
            <input
              type="text"
              name="name"
              value={newCentre.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={newCentre.location}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Add Centre
          </button>
        </form>
      </div>

      {/* Centres Table */}
      <table className=" bg-white shadow-md rounded-lg overflow-hidden w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Centre ID</th>
            <th className="px-4 py-2 text-center">Centre Name</th>
            <th className="px-4 py-2 text-center">Location</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {centres.map((centre) => (
            <tr key={centre.id} className="border-t">
              <td className="px-4 py-2 text-center">{centre.id}</td>
              <td className="px-4 py-2 text-center">{centre.name}</td>
              <td className="px-4 py-2 text-center">{centre.location}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => deleteCentre(centre.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCentres;
