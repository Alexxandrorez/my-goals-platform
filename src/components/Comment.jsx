// src/components/Comment.jsx
import React, { useState } from 'react';

const Comment = ({ user, text, likes, time, avatar }) => {
  const [count, setCount] = useState(likes);
  const [active, setActive] = useState(false);

  const handleLike = () => {
    setCount(active ? count - 1 : count + 1);
    setActive(!active);
  };

  return (
    <div style={{ 
      background: '#fff', 
      padding: '20px', 
      borderRadius: '20px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      border: '1px solid #f1f5f9',
      display: 'flex',
      gap: '15px'
    }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        background: '#f1f5f9', 
        borderRadius: '15px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '1.5rem'
      }}>
        {avatar || "👤"}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <strong style={{ color: '#1e293b' }}>{user}</strong>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{time}</span>
        </div>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '15px' }}>{text}</p>
        
        <button 
          onClick={handleLike}
          style={{ 
            background: active ? '#fef2f2' : '#f8fafc', 
            border: 'none', 
            padding: '6px 12px', 
            borderRadius: '10px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: active ? '#ef4444' : '#64748b',
            transition: '0.2s'
          }}
        >
          <span style={{ fontSize: '1rem' }}>{active ? '❤️' : '🤍'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{count}</span>
        </button>
      </div>
    </div>
  );
};

export default Comment;