import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const Home = () => {
  const user = auth.currentUser;

  const styles = {
    page: { padding: '48px 20px', maxWidth: 1100, margin: '0 auto' },
    hero: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)',
      padding: '36px',
      borderRadius: 18,
      boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
    },
    title: { margin: 0, fontSize: '1.8rem', lineHeight: 1.1, color: '#0f172a' },
    subtitle: { marginTop: 8, color: '#475569' },
    ctaGroup: { display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' },
    ctaPrimary: { background: '#6366f1', color: '#fff', padding: '12px 18px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 },
    ctaSecondary: { background: '#10b981', color: '#fff', padding: '12px 18px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 },
    heroImage: { width: 220, height: 140, borderRadius: 12, background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' },
    features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 28 },
    card: { background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' },
    small: { color: '#64748b', marginTop: 8 }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>GoalFlow — досягайте більше, плануючи простіше.</h1>
          <p style={styles.subtitle}>Створюйте цілі, відстежуйте прогрес та святкуйте результати. Швидко, приємно та без зайвого шуму.</p>

          <div style={styles.ctaGroup}>
            <Link to="/goals" style={styles.ctaPrimary}>Перейти до цілей</Link>
            <Link to="/progress" style={styles.ctaSecondary}>Переглянути прогрес</Link>
          </div>

          <p style={{ marginTop: 14, color: '#94a3b8', fontSize: 14 }}>{user ? `Ви увійшли як ${user.email}` : 'Увійдіть, щоб почати зберігати та відстежувати свої цілі.'}</p>
        </div>

        <div style={{ width: 260, textAlign: 'center' }}>
          <div style={styles.heroImage}>Ваш простий дашборд</div>
          <p style={{ marginTop: 12, color: '#64748b', fontSize: 13 }}>Швидкий доступ до створення цілей та перегляду прогресу</p>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.card}>
          <h3 style={{ margin: 0 }}>Створюйте цілі</h3>
          <p style={styles.small}>Легко додайте дедлайни, теги та описи. Натисніть «Створити ціль» щоб почати.</p>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: 0 }}>Відстежуйте прогрес</h3>
          <p style={styles.small}>Перевіряйте виконані цілі в розділі «Прогрес», фільтруйте за датою для звітів.</p>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: 0 }}>Спільнота</h3>
          <p style={styles.small}>Діліться досягненнями з іншими, надихайтеся та змагайтеся.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;