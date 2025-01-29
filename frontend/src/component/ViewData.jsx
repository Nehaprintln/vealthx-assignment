import React, { useState, useEffect } from 'react';
import './view.css';
export default function ViewData() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    console.log(claims);
    useEffect(() => {
      const fetchClaims = async () => {
        try {
          const response = await fetch("https://vealthx-assignment.onrender.com/api/claims");
          const data = await response.json();
          if (data.success) {
            setClaims(data.claims);
          } else {
            setError("Failed to fetch claims data");
          }
        } catch (err) {
          setError("Error fetching claims data");
        } finally {
          setLoading(false);
        }
      };
  
      fetchClaims();
    }, []);
  
    if (loading) {
      return <p className="loading">Loading...</p>;
    }
  
    if (error) {
      return <p className="error-message">{error}</p>;
    }
  
    return (
      <div className="view-data-container">
        <h2 className="claims-heading">Claims Data</h2>
        {claims.length === 0 ? (
          <p className="no-claims">No claims found.</p>
        ) : (
          <table className="claims-table">
            <thead>
              <tr>
                <th>Claim Type</th>
                <th>Policy Number</th>
                <th>Claim Amount</th>
                <th>Incident Date</th>
                <th>Description</th>
                <th>Email</th>
                <th>AlternameEmaile</th>
                <th>Phone</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim._id}>
                  <td>{claim.claimType}</td>
                  <td>{claim.policyNumber}</td>
                  <td>{claim.claimAmount}</td>
                  <td>{new Date(claim.incidentDate).toLocaleDateString()}</td>
                  <td>{claim.description}</td>
                  <td>{claim.email}</td>
                  <td>{claim.alternameEmaile}</td>
                  <td>{claim.phone}</td>
                  <td>
                    {claim.filePath && (
                      <a href={`http://localhost:5000/${claim.filePath}`} target="_blank" rel="noopener noreferrer" className="view-file-link">
                        View File
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
}
