"use client";

import React, { useEffect, useState } from "react";
import "./consent.scss"; // Import the SCSS stylesheet
import { useRouter } from "next/navigation";

const ViewDataPage = () => {
  const router = useRouter();

  const [data, setData] = useState({});
  const tokenStr = window.localStorage.getItem("token");
  if (!tokenStr) throw new Error("You are not logged in");
  const token = JSON.parse(tokenStr);
  const address = token?.address

  useEffect(() => {
    console.log(token.address);
    if (!token) router.push("/login");

    (async function () {
      const datastr = await fetch("http://localhost:3735/private/getConsents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: token?.address,
        }),
      });
      const data = await datastr.json()
      const finalData ={address: data}
      setData(finalData);
    })();

  }, []);


  return (
    <div className="container">
      {Object.entries(data).map(([address, organizations]) => (
        <div key={address} className="card">
          <h3>Address: {address}</h3>
          {Object.entries(organizations).map(([organization, records]) => (
            <div key={organization} className="card">
              <h4>Organization: {organization}</h4>
              {Object.entries(records).map(([recordType, record]) => (
                <div key={recordType} className="record-type">
                  <h5>{recordType}</h5>
                  <p>Active: {record.active ? "Yes" : "No"}</p>
                  <p>Expiry: {record.expiry}</p>
                  <p>Purpose: {record.purpose}</p>
                  <button
                    onClick={() =>
                      router.push(`/consent/edit?active=${record.active}&expiry=${record.expiry}&purpose=${record.purpose}`)
                    }
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ViewDataPage;
