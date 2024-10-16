import React, { useEffect, useState } from 'react';

const ManageSports = () => {
  const [sports, setSports] = useState([]);
  const [centres, setCentres] = useState([]); // State for centres
  const [newSport, setNewSport] = useState({ name: '', centreId: '' }); // Removed description

  // Fetch sports and centres from the backend
  useEffect(() => {
    fetchSports();
    fetchCentres(); // Fetch centres on mount
  }, []);

  const fetchSports = () => {
    fetch('http://13.60.199.62:5001/api/sports')
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error('Error fetching sports:', error));
  };

  const fetchCentres = () => {
    fetch('http://13.60.199.62:5001/api/Centres') 
      .then((response) => response.json())
      .then((data) => setCentres(data))
      .catch((error) => console.error('Error fetching centres:', error));
  };

  // Handle input change for new sport
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSport({ ...newSport, [name]: value });
  };

  // Add new sport
  const addSport = (e) => {
    e.preventDefault();
    fetch('http://13.60.199.62:5001/api/sports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSport), // Send newSport with centreId
    })
      .then(() => {
        fetchSports(); // Refresh the sports list after adding
        setNewSport({ name: '', centreId: '' }); // Clear the input fields
      })
      .catch((error) => console.error('Error adding sport:', error));
  };

  // Delete sport
  const deleteSport = (id) => {
    fetch(`http://13.60.199.62:5001/api/sports/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchSports()) // Refresh the list after deleting
      .catch((error) => console.error('Error deleting sport:', error));
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-centre">Manage Sports</h1>

      {/* Add Sport Card */}
      <div className="max-w-md mx-left bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-centre">Add New Sport</h2>
        <form onSubmit={addSport}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Sport Name</label>
            <input
              type="text"
              name="name"
              value={newSport.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Centre</label>
            <select
              name="centreId"
              value={newSport.centreId}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select a centre</option>
              {centres.map((centre) => (
                <option key={centre.id} value={centre.id}>
                  {centre.name} {/* Adjust to match your center object's structure */}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Add Sport
          </button>
        </form>
      </div>

      {/* Sports Table */}
      <table className="bg-white shadow-md rounded-lg overflow-hidden w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Sport ID</th>
            <th className="px-4 py-2 text-center">Sport Name</th>
            <th className="px-4 py-2 text-center">Centre Id</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sports.map((sport) => (
            <tr key={sport.id} className="border-t">
              <td className="px-4 py-2 text-center">{sport.id}</td>
              <td className="px-4 py-2 text-center">{sport.name}</td>
              <td className="px-4 py-2 text-center">{sport.centreId}</td>

              <td className="px-4 py-2 text-centre">
                <button
                  onClick={() => deleteSport(sport.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded "
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

export default ManageSports;
