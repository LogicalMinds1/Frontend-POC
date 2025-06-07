import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#4a90e2',
    color: '#fff',
    textAlign: 'center',
    padding: '15px',
    width: '100%',
    bottom: 0,
    fontSize: '14px'
  };

  return (
    <footer style={footerStyle}>
      &copy; 2025 Pregnancy Tracker. All rights reserved.
    </footer>
  );
};

export default Footer;
