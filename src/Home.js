import React from 'react';
import Card from './Homepage/Card.js';

const HomePage = ({ setToken }) => {
  // Main container style
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', sans-serif",
    marginTop:"-50px"
  };

  // Content wrapper style
  const contentStyle = {
    maxWidth: '1200px',
    width: '100%',
    textAlign: 'center'
  };

  // Header style
  const headerStyle = {
    marginBottom: '90px',
    padding: '0 20px'
  };

  // Title style
  const titleStyle = {
    fontSize: '2.8rem',
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: '15px',
    background: 'linear-gradient(90deg, #3498db, #2c3e50)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  };

  // Subtitle style
  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6
  };

  // Cards container style
  const cardsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '40px',
    marginTop: '-30px'
  };

  // Card custom styles
  const cardStyles = [
    {
      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
      border: '1px solid rgba(52, 152, 219, 0.2)',
      boxShadow: '0 10px 30px rgba(52, 152, 219, 0.15)',
      iconColor: '#3498db'
    },
    {
      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
      border: '1px solid rgba(46, 204, 113, 0.2)',
      boxShadow: '0 10px 30px rgba(46, 204, 113, 0.15)',
      iconColor: '#2ecc71'
    }
  ];

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Maternal Health Portal</h1>
          <p style={subtitleStyle}>
            Comprehensive care solutions for expectant mothers. Monitor risks, 
            upload reports, and access personalized health insights.
          </p>
        </div>

        <div style={cardsContainerStyle}>
          <Card 
            title="Pregnancy Risk Classification" 
            description="Health analysis, checkup recommendations, and diet plans"
            link="/Pregnancypost"
            style={cardStyles[0]}
          />
          <Card 
            title="Pregnancy Report Upload File" 
            description="Securely upload and analyze your health check reports"
            link="/PregnancyUpload"
            style={cardStyles[1]}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;