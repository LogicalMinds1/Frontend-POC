import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, description, link, style }) => {
  return (
    <div style={{
      width: '320px',
      borderRadius: '20px',
      padding: '35px 30px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      transform: 'translateY(0)',
      cursor: 'pointer',
      ...style,
      ':hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
      }
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `rgba(${style.iconColor === '#3498db' ? '52, 152, 219' : '46, 204, 113'}, 0.08)`
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `rgba(${style.iconColor === '#3498db' ? '52, 152, 219' : '46, 204, 113'}, 0.05)`
      }}></div>
      
      {/* Icon container */}
      <div style={{
        fontSize: '3rem',
        marginBottom: '25px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px',
          borderRadius: '50%',
          background: `rgba(${style.iconColor === '#3498db' ? '52, 152, 219' : '46, 204, 113'}, 0.1)`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          {title.includes('Risk') ? '📈' : '📁'}
        </div>
      </div>
      
      {/* Content */}
      <h3 style={{
        fontSize: '1.55rem',
        fontWeight: 700,
        color: '#2c3e50',
        marginBottom: '15px',
        position: 'relative',
        zIndex: 2
      }}>
        {title}
      </h3>
      
      <p style={{
        color: '#6c7a89',
        lineHeight: 1.6,
        marginBottom: '30px',
        minHeight: '60px',
        fontSize: '1.05rem',
        position: 'relative',
        zIndex: 2
      }}>
        {description}
      </p>
      
      <Link to={link} style={{
        display: 'inline-block',
        padding: '14px 35px',
        background: `linear-gradient(90deg, ${style.iconColor}, ${style.iconColor === '#3498db' ? '#2471a3' : '#27ae60'})`,
        color: 'white',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 600,
        boxShadow: `0 5px 20px rgba(${style.iconColor === '#3498db' ? '52, 152, 219' : '46, 204, 113'}, 0.3)`,
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 2,
        ':hover': {
          transform: 'scale(1.05)',
          boxShadow: `0 7px 25px rgba(${style.iconColor === '#3498db' ? '52, 152, 219' : '46, 204, 113'}, 0.4)`
        }
      }}>
        Get Started
      </Link>
    </div>
  );
};

export default Card;