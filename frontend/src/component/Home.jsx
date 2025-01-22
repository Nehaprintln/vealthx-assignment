import React from 'react'
import { Link } from 'react-router-dom';
import './home.css';

export default function Home() {
    return (
        <div className="home-container">
        <h2 className="welcome-text">Welcome to the Claim Management System</h2>
        <p className="choose-text">Choose one of the following options:</p>
        <div className="buttons-container">
            <Link to="/view-data">
                <button className="home-button view-button">View Data</button>
            </Link>
            <Link to="/claim-form">
                <button className="home-button claim-button">Fill Claim</button>
            </Link>
      </div>
    </div>
      );
}
