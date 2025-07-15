import React from 'react';

const Recent_Logs = () => {
  return (
    <div className="px-10 mt-10 w-full">
      {/* Heading */}
      <h1 className="text-2xl font-bold ml-[80px] text-green-800 mb-4">Recent Logs</h1>

      {/* Table Wrapper */}
      <div className=" ml-[80px] bg-white border border-green-400 rounded-3xl shadow-xl p-6 overflow-x-auto w-full max-w-5xl hover:shadow-4xl transition duration-300 hover:-translate-y-1">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-800 text-white text-lg">
              <th className="px-6 py-3 rounded-l-lg">Time</th>
              <th className="px-6 py-3">Usage</th>
              <th className="px-6 py-3 rounded-r-lg">Amount</th>
            </tr>
          </thead>
          <tbody className="text-green-900 font-medium">
            <tr className="border-b hover:bg-green-50 transition">
              <td className="px-6 py-4">10:30 AM</td>
              <td className="px-6 py-4">Grocery</td>
              <td className="px-6 py-4">₹500</td>
            </tr>
            <tr className="border-b hover:bg-green-50 transition">
              <td className="px-6 py-4">1:00 PM</td>
              <td className="px-6 py-4">Food Delivery</td>
              <td className="px-6 py-4">₹300</td>
            </tr>
            <tr className="border-b hover:bg-green-50 transition">
              <td className="px-6 py-4">6:45 PM</td>
              <td className="px-6 py-4">Metro Recharge</td>
              <td className="px-6 py-4">₹100</td>
            </tr>
            <tr className="border-b hover:bg-green-50 transition">
              <td className="px-6 py-4">8:00 AM</td>
              <td className="px-6 py-4">Bus Fare</td>
              <td className="px-6 py-4">₹60</td>
            </tr>
            <tr className="border-b hover:bg-green-50 transition">
              <td className="px-6 py-4">11:15 AM</td>
              <td className="px-6 py-4">Stationery</td>
              <td className="px-6 py-4">₹150</td>
            </tr>
            <tr className="border-b hover:bg-green-50 transition">
              <td className="px-6 py-4">3:30 PM</td>
              <td className="px-6 py-4">Snacks</td>
              <td className="px-6 py-4">₹90</td>
            </tr>
            <tr className="hover:bg-green-50 transition">
              <td className="px-6 py-4">9:00 PM</td>
              <td className="px-6 py-4">Netflix</td>
              <td className="px-6 py-4">₹499</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Recent_Logs;
