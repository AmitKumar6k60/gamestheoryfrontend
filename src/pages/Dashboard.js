import React from 'react';

const Dashboard = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-center">Game Theory Assignment</h1>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Name: Amit Kumar</h2>
                    <p className="text-gray-700">Roll Number: IIT2021088</p>
                </div>
                <div className="flex justify-center space-x-4">
                    <a
                        href="https://github.com/AmitKumar6k60"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/amit-kumar-075755222/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="mailto:amitkumar6k60@example.com"
                        className="text-blue-500 hover:underline"
                    >
                        Email
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
