import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Акаунт створено успішно!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
  navigate('/goals'); // Перехід до цілей (виправлено шлях — в App маршрути використовують /goals)
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  return (
    <div style={styles.authWrapper}>
      <div style={styles.authCard}>
        {/* Верхня частина з іконкою */}
        <div style={styles.header}>
          <div style={styles.logoIcon}></div>
          <h2 style={styles.title}>{isRegister ? 'Створити акаунт' : 'З поверненням!'}</h2>
          <p style={styles.subtitle}>
            {isRegister 
              ? 'Почніть свій шлях до нових вершин вже сьогодні' 
              : 'Увійдіть, щоб продовжити працювати над своїми цілями'}
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleAuth} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Електронна пошта</label>
            <input 
              type="email" 
              placeholder="vash@email.com"
              style={styles.input}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={styles.input}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            {isRegister ? 'Зареєструватися' : 'Увійти'}
          </button>
        </form>

        {/* Перемикач режимів */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isRegister ? 'Вже маєте профіль?' : 'Вперше тут?'}
            <span 
              onClick={() => setIsRegister(!isRegister)} 
              style={styles.toggleLink}
            >
              {isRegister ? ' Увійти' : ' Створити акаунт'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Твій новий крутий дизайн ---
const styles = {
  authWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', // Світлий сучасний градієнт
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  authCard: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  header: {
    marginBottom: '30px',
  },
  logoIcon: {
    fontSize: '3rem',
    marginBottom: '10px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Твій фірмовий фіолетово-синій
    color: 'white',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  footer: {
    marginTop: '25px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  toggleLink: {
    color: '#6366f1',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
  }
};

export default Auth;