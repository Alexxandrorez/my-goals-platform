import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Header from './components/Header';
import Home from './pages/Home';
import MyGoals from './pages/MyGoals';
import Progress from './pages/Progress'; // Додайте цей імпорт
import Community from './pages/Community';
import Auth from './pages/Auth'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  if (loading) return <div style={{textAlign: 'center', marginTop: '20%'}}>Завантаження...</div>;

  return (
    <Router>
      {user && (
        <>
          <Header />
          <div style={{textAlign: 'right', padding: '10px', backgroundColor: '#f0f0f0'}}>
             <span>{user.email} </span>
             <button onClick={handleLogout} style={{marginLeft: '10px', cursor: 'pointer'}}>Вийти</button>
          </div>
        </>
      )}

      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/goals" element={user ? <MyGoals /> : <Navigate to="/auth" />} />
        <Route path="/progress" element={user ? <Progress /> : <Navigate to="/auth" />} /> {/* Додайте цей рядок */}
        <Route path="/community" element={user ? <Community /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;