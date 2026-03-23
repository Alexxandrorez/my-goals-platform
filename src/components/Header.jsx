import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ sticky: 'top', background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 20px' }}>
      <div className="container" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b' }}>Goal<span style={{color: '#3b82f6'}}>Flow</span></div>
        <nav style={{ display: 'flex', gap: '25px' }}>
          <NavLink to="/goals" style={({isActive}) => ({ textDecoration: 'none', color: isActive ? '#3b82f6' : '#64748b', fontWeight: '600' })}>Цілі</NavLink>
          <NavLink to="/progress" style={({isActive}) => ({ textDecoration: 'none', color: isActive ? '#3b82f6' : '#64748b', fontWeight: '600' })}>Прогрес</NavLink>
          <NavLink to="/community" style={({isActive}) => ({ textDecoration: 'none', color: isActive ? '#3b82f6' : '#64748b', fontWeight: '600' })}>Спільнота</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;