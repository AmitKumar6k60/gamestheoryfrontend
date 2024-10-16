import React, { useEffect, useState } from 'react';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [centres, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [newResource, setNewResource] = useState({ name: '', type: '' });
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSport, setSelectedSport] = useState('');

  // Fetch resources and centres on component mount
  useEffect(() => {
    fetchResources();
    fetchCenters();
  }, []);

  // Fetch resources from the backend
  const fetchResources = () => {
    fetch('http://13.60.199.62:5001/api/resources')
      .then((response) => response.json())
      .then((data) => setResources(data))
      .catch((error) => console.error('Error fetching resources:', error));
  };

  // Fetch centres from the backend
  const fetchCenters = () => {
    fetch('http://13.60.199.62:5001/api/centres') // Adjust URL as needed
      .then((response) => response.json())
      .then((data) => setCenters(data))
      .catch((error) => console.error('Error fetching centres:', error));
  };

  // Fetch sports based on selected center
  const fetchSports = (centerId) => {
    fetch(`http://13.60.199.62:5001/api/sports_with_centreId/${centerId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched sports:', data); // Log fetched sports
        setSports(Array.isArray(data) ? data : []); // Ensure sports is always an array
      })
      .catch((error) => {
        console.error('Error fetching sports:', error);
        setSports([]); // Reset to empty array on error
      });
  };

  // Handle input changes for new resource
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  // Handle center selection change
  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    setSelectedSport(''); // Reset sport selection when center changes
    fetchSports(centerId); // Fetch sports for the selected center
  };

  // Handle sport selection change
  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
  };

  // Add new resource
  const addResource = (e) => {
    e.preventDefault();
    fetch('http://13.60.199.62:5001/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newResource,
        centreId: selectedCenter,
        sportId: selectedSport,
      }),
    })
      .then(() => {
        fetchResources(); // Refresh the resources list after adding
        setNewResource({ name: '', type: '' }); // Clear the input fields
        setSelectedCenter(''); // Reset selected center
        setSelectedSport(''); // Reset selected sport
      })
      .catch((error) => console.error('Error adding resource:', error));
  };

  // Delete resource
  const deleteResource = (id) => {
    fetch(`http://13.60.199.62:5001/api/resources/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchResources()) // Refresh the list after deleting
      .catch((error) => console.error('Error deleting resource:', error));
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Resources</h1>

      {/* Add Resource Card */}
      <div className="max-w-md mx-right bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Add New Resource</h2>
        <form onSubmit={addResource}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Centre</label>
            <select
              name="centerId"
              value={selectedCenter}
              onChange={handleCenterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select a center</option>
              {centres.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Sport</label>
            <select
              name="sportId"
              value={selectedSport}
              onChange={handleSportChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
              disabled={!selectedCenter} // Disable if no center is selected
            >
              <option value="">Select a sport</option>
              {sports.length > 0 ? (
                sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No sports available</option> // Fallback option when no sports are present
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newResource.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Type</label>
            <input
              type="text"
              name="type"
              value={newResource.type}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={!selectedCenter || !selectedSport} // Disable if either selection is missing
          >
            Add Resource
          </button>
        </form>
      </div>

      {/* Resources Table */}
      <table className="bg-white shadow-md rounded-lg overflow-hidden w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Resource ID</th>
            <th className="px-4 py-2 text-center">Resource Name</th>
            <th className="px-4 py-2 text-center">Type</th>
            <th className="px-4 py-2 text-center">Sports ID</th>
            <th className="px-4 py-2 text-center">Centre ID</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} className="border-t">
              <td className="px-4 py-2 text-center">{resource.id}</td>
              <td className="px-4 py-2 text-center">{resource.name}</td>
              <td className="px-4 py-2 text-center">{resource.type}</td>
              <td className="px-4 py-2 text-center">{resource.sportId}</td>
              <td className="px-4 py-2 text-center">{resource.centreId}</td>

              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => deleteResource(resource.id)}
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

export default ManageResources;
