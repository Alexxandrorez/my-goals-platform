import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar" style={{ height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', margin: '20px 0' }}>
      <div 
        className="fill" 
        style={{ 
          height: '100%', 
          width: `${progress}%`, 
          background: 'linear-gradient(90deg, #6366f1, #10b981)',
          transition: 'width 0.5s ease-in-out'
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;