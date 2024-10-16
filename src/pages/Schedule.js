import React, { useEffect, useState } from 'react';

const Schedule = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Sample bookings. Replace with API call.
        setBookings([
            { id: 1, centre: 'Indiranagar', sport: 'Badminton', time: '10:00 AM' },
            { id: 2, centre: 'Koramangala', sport: 'Squash', time: '11:00 AM' }
        ]);
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Schedule</h1>
            <div className="space-y-4">
                {bookings.map(booking => (
                    <div key={booking.id} className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-lg font-semibold">{booking.centre} - {booking.sport}</p>
                        <p className="text-gray-600">Time: {booking.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
