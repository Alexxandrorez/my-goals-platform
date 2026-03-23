import React, { useState, useEffect } from 'react';

const GoalCard = ({ goal, onToggle }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const isCompleted = goal.status === 'завершені';
  const isDeferred = goal.status === 'відкладені';

  const tagColor = goal.tag === 'Спорт' ? '#fee2e2' : goal.tag === 'Здоров\'я' ? '#ecfdf5' : '#e0e7ff';
  const tagTextColor = goal.tag === 'Спорт' ? '#ef4444' : goal.tag === 'Здоров\'я' ? '#10b981' : '#6366f1';

  useEffect(() => {
    if (isCompleted || isDeferred || !goal.deadline) {
      setTimeLeft("");
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(goal.deadline);
      const total = end - now;

      if (total <= 0) {
        setTimeLeft("Час вичерпано!");
        clearInterval(timer);
      } else {
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        setTimeLeft(`${days}д ${hours}г ${minutes}хв`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [goal.deadline, goal.status, isCompleted, isDeferred]);

  const cardStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: isDeferred ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    borderLeft: isCompleted ? '6px solid #10b981' : 
                isDeferred ? '6px solid #d1d5db' : '6px solid #6366f1',
    transition: '0.3s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    opacity: isDeferred ? '0.6' : '1'
  };

  const getButtonText = () => {
    if (isCompleted) return 'Відновити';
    if (isDeferred) return 'Активувати знову';
    return 'Завершити';
  };

  return (
    <article className={`goal-card ${goal.status}`} style={cardStyle}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ 
            background: tagColor, 
            color: tagTextColor, 
            padding: '4px 10px', 
            borderRadius: '6px', 
            fontSize: '0.75rem', 
            fontWeight: '600' 
          }}>
            {goal.tag}
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            {goal.status}
          </span>
        </div>

        <h3 style={{ 
          margin: '15px 0 10px', 
          textDecoration: isCompleted ? 'line-through' : 'none',
          color: isCompleted ? '#64748b' : '#1e293b'
        }}>
          {goal.title}
        </h3>
        
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#64748b', 
          marginBottom: '15px' 
        }}>
          {goal.description}
        </p>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '10px', overflow: 'hidden', margin: '10px 0' }}>
          <div style={{ 
            width: `${goal.progress}%`, 
            height: '100%', 
            background: isCompleted ? '#10b981' : 
                        isDeferred ? '#9ca3af' : 'linear-gradient(90deg, #6366f1, #10b981)',
            transition: 'width 0.8s ease'
          }}></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <p style={{ color: '#64748b', margin: 0 }}>
            {isCompleted ? 'Виконано' : `до ${goal.deadline?.replace('T', ' ') || '...'}`}
          </p>
          {timeLeft && (
            <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
              {timeLeft}
            </div>
          )}
        </div>

        <button 
          onClick={onToggle}
          style={{ 
            width: '100%', 
            marginTop: '15px', 
            padding: '12px', 
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#fff',
            background: isCompleted ? '#6b7280' : isDeferred ? '#f59e0b' : '#6366f1'
          }} 
        >
          {getButtonText()}
        </button>
      </div>
    </article>
  );
};

export default GoalCard;