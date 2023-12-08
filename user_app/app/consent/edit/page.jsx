"use client";

import React, { useState } from "react";
import "./style.scss";
import { useRouter, useSearchParams } from "next/navigation";

const ReactPage = () => {
  const searchParams = useSearchParams();
  const date = "2024-12-08T04:54:56.326Z";
  const router = useRouter();
  const formattedExpiry = new Date(date).toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    active: searchParams.get("active"),
    expiry: formattedExpiry,
    purpose: searchParams.get("purpose"),
    data: searchParams.get("data"),
    domain: searchParams.get("domain"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tokenStr = window.localStorage.getItem("token");
    if (!tokenStr) throw new Error("You are not logged in");
    const token = JSON.parse(tokenStr);
    // Handle form submission logic here
    try {
      const datastr = await fetch(
        "http://localhost:3735/private/updateConsent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...formData, address: token?.address}),
        }
      );
      await datastr.json();
      router.push("/consent");
    } catch (error) {}
  };

  return (
    <div className="form-container">
      <h1>Edit Consent</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Active</label>
          <select name="active" value={formData.active} onChange={handleChange}>
            <option value="" disabled>
              Select Active
            </option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expiry</label>
          <input
            type="date"
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
