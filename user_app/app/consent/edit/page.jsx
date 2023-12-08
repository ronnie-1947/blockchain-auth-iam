'use client'

import React, { useState } from 'react';
import './style.scss'; 
import { useSearchParams } from 'next/navigation';


const ReactPage = () => {

  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    active: false,
    expiry: searchParams.expiry,
    purpose: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="form-container">
      <h1>Edit Consent</h1>
      <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
          <label>Active</label>
          <select
            name="active"
            value={formData.active}
            onChange={handleChange}
          >
            <option value="" disabled>Select Active</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expiry</label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="Enter expiry"
          />
        </div>

        <div className="form-group">
          <label>Purpose</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Enter purpose"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReactPage;
