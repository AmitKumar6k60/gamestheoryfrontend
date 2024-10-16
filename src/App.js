import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import ManageCentres from './pages/ManageCentres';
import ManageSports from './pages/ManageSports';
import ManageResources from './pages/ManageResources';
import BookingPage from './pages/BookingPage';

const App = () => {
  const [view, setView] = useState('dashboard');

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedule':
        return <Schedule />;
      case 'centres':
        return <ManageCentres />;
      case 'sports':
        return <ManageSports />;
      case 'resources':
        return <ManageResources />;
      case 'booking':
      return <BookingPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Sports Booking</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setView('dashboard')}
            className={`block w-full text-left font-semibold py-2 px-4 rounded ${
              view === 'dashboard' ? 'bg-blue-900' : 'hover:bg-blue-700'
            }`}
          >
            Dashboard
          </button>
          {/* <button
            onClick={() => setView('schedule')}
            className={`block w-full text-left font-semibold py-2 px-4 rounded ${
              view === 'schedule' ? 'bg-blue-900' : 'hover:bg-blue-700'
            }`}
          >
            Schedule
          </button> */}
          <button
            onClick={() => setView('booking')}
            className={`block w-full text-left font-semibold py-2 px-4 rounded ${
              view === 'booking' ? 'bg-blue-900' : 'hover:bg-blue-700'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setView('centres')}
            className={`block w-full text-left font-semibold py-2 px-4 rounded ${
              view === 'centres' ? 'bg-blue-900' : 'hover:bg-blue-700'
            }`}
          >
            Manage Centres
          </button>
          <button
            onClick={() => setView('sports')}
            className={`block w-full text-left font-semibold py-2 px-4 rounded ${
              view === 'sports' ? 'bg-blue-900' : 'hover:bg-blue-700'
            }`}
          >
            Manage Sports
          </button>
          <button
            onClick={() => setView('resources')}
            className={`block w-full text-left font-semibold py-2 px-4 rounded ${
              view === 'resources' ? 'bg-blue-900' : 'hover:bg-blue-700'
            }`}
          >
            Manage Resources
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-100">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
