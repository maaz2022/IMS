'use client'
import React, { useState } from 'react';

const AddTransmittalForm: React.FC = () => {
  const [formData, setFormData] = useState({
    mall: '',
    storeCollectedFrom: '',
    storeDeliveredTo: '',
    managerName: '',
    descriptionOfGoods: '',
    quantity: '',
    dateDispatched: '',
    dateReceived: '',
    time: '',
    receivingStoreRepName: '',
    receivingStoreRepSignature: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission goes here
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">New Transmittal Form</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mall Field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mall">
              Mall
            </label>
            <input
              type="text"
              name="mall"
              value={formData.mall}
              onChange={handleChange}
              placeholder="Enter mall name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Store Collected From */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="storeCollectedFrom">
              Store Collected From
            </label>
            <input
              type="text"
              name="storeCollectedFrom"
              value={formData.storeCollectedFrom}
              onChange={handleChange}
              placeholder="Enter store collected from"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Store Delivered To */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="storeDeliveredTo">
              Store Delivered To
            </label>
            <input
              type="text"
              name="storeDeliveredTo"
              value={formData.storeDeliveredTo}
              onChange={handleChange}
              placeholder="Enter store delivered to"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Manager Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="managerName">
              Manager Name
            </label>
            <input
              type="text"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              placeholder="Enter manager name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Description of Goods */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descriptionOfGoods">
              Description of Goods
            </label>
            <input
              type="text"
              name="descriptionOfGoods"
              value={formData.descriptionOfGoods}
              onChange={handleChange}
              placeholder="Enter description of goods"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Date Dispatched */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateDispatched">
              Date Dispatched
            </label>
            <input
              type="date"
              name="dateDispatched"
              value={formData.dateDispatched}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Date Received */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateReceived">
              Date Received
            </label>
            <input
              type="date"
              name="dateReceived"
              value={formData.dateReceived}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Receiving Store Rep Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="receivingStoreRepName">
              Receiving Store Rep Name
            </label>
            <input
              type="text"
              name="receivingStoreRepName"
              value={formData.receivingStoreRepName}
              onChange={handleChange}
              placeholder="Enter representative name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Receiving Store Rep Signature */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="receivingStoreRepSignature">
              Receiving Store Rep Signature
            </label>
            <input
              type="text"
              name="receivingStoreRepSignature"
              value={formData.receivingStoreRepSignature}
              onChange={handleChange}
              placeholder="Enter signature"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add New Transmittal
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransmittalForm;
