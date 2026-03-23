import React from 'react';
import Comment from '../components/Comment';

const Community = () => {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '10px' }}>Стрічка спільноти</h2>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Діліться успіхами та надихайте інших користувачів.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Comment 
            user="Олександр Петренко" 
            text="Нарешті здав проект на React! Таймер допоміг не відволікатися на соцмережі." 
            likes={42} 
            avatar=""
            time="15 хв тому"
          />
          <Comment 
            user="Ірина Кравченко" 
            text="Сьогодні відклала ціль 'Вивчити китайську', зате закрила 'Спорт'. Пріоритети!" 
            likes={18} 
            avatar=""
            time="1 год тому"
          />
          <Comment 
            user="Максим Білий" 
            text="Хто зі мною на ранкову пробіжку завтра о 6:00? Пишіть в ЛС!" 
            likes={5} 
            avatar=""
            time="3 год тому"
          />
        </div>
      </div>
    </div>
  );
};

export default Community;