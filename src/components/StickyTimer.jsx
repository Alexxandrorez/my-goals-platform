import React, { useState, useEffect } from 'react';

const StickyTimer = () => {
  const [time, setTime] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date().setHours(23, 59, 59);
      const diff = end - now;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div id="sticky-timer" style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', border: '1px solid #6366f1', zIndex: 1000 }}>
      <button onClick={() => setVisible(false)} style={{ position: 'absolute', top: '0', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}></button>
      <div style={{ fontWeight: '800', color: '#6366f1', fontSize: '1.2rem' }}>{time}</div>
      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>До кінця дня лишилось</div>
    </div>
  );
};

export default StickyTimer;