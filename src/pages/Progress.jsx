import React, { useState, useEffect } from 'react';

const Progress = () => {
  const [completedGoals, setCompletedGoals] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompletedGoals();
  }, [selectedDate]);

  const fetchCompletedGoals = async () => {
    setLoading(true);
    try {
      let url = '/api/completed-goals';
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setCompletedGoals(data);
    } catch (error) {
      console.error('Помилка при завантаженні:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>
        Прогрес - Виконані цілі
      </h1>
      
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '16px', 
        marginBottom: '30px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '600', color: '#64748b' }}>Фільтр за датою:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ 
              padding: '10px 15px', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={() => setSelectedDate('')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none',
              background: '#f1f5f9',
              color: '#64748b',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Скинути фільтр
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p>Завантаження...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {completedGoals.length === 0 ? (
            <div style={{ 
              gridColumn: '1/-1', 
              textAlign: 'center', 
              padding: '60px',
              background: '#fff',
              borderRadius: '16px',
              color: '#94a3b8'
            }}>
              <p style={{ fontSize: '18px' }}>Немає виконаних цілей</p>
              <p>Завершіть свою першу ціль, щоб побачити її тут!</p>
            </div>
          ) : (
            completedGoals.map(goal => (
              <div key={goal.id} style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '16px',
                borderLeft: '6px solid #10b981',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{goal.goalTitle || goal.title}</h3>
                <p style={{ color: '#64748b', margin: '5px 0' }}>
                  <strong>Категорія:</strong> {goal.category || goal.tag}
                </p>
                <p style={{ color: '#64748b', margin: '5px 0' }}>
                  <strong>Виконано:</strong> {goal.completedAt ? new Date(goal.completedAt).toLocaleDateString() : 'Дата не вказана'}
                </p>
                {goal.completedAt && (
                  <p style={{ color: '#10b981', fontSize: '14px', marginTop: '10px' }}>
                    ✅ Завершено {goal.completedAt}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Progress;