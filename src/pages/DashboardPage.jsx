import React from 'react';

const DashboardPage = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-10 text-center border-b-4 border-[#002147]">
      <h1 className="text-3xl font-bold text-[#002147] mb-4">My Dashboard</h1>
      <p className="text-gray-600 mb-8">This area is reserved for your saved groups and dashboard tools.</p>
      
      <div className="grid md:grid-cols-3 gap-6 text-left">
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-bold text-[#002147] mb-2">My Groups</h3>
          <p className="text-sm text-gray-500">You haven't joined any groups yet.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-bold text-[#002147] mb-2">Recent Activity</h3>
          <p className="text-sm text-gray-500">No recent activity to show.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-bold text-[#002147] mb-2">Profile Status</h3>
          <p className="text-sm text-gray-500">Student Account: Active</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
