import React, { useState, useEffect } from 'react';
import GoalCard from '../components/GoalCard';
import { db, auth } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const MyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('всі');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', tag: 'IT & Code', deadline: '', description: '' });
  
  // Стан для поточного користувача
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // 1. Стежимо за авторизацією (щоб уникнути замикання старого юзера)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Завантажуємо цілі тільки коли currentUser визначений
  useEffect(() => {
    if (!currentUser) {
      setGoals([]); // Очищуємо список, якщо ніхто не залогінений
      return;
    }

    const q = query(
      collection(db, "goals"), 
      where("userId", "==", currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Сортуємо по даті створення (свіжі зверху)
      const sorted = goalsData.sort((a, b) => {
        const t1 = a.createdAt?.seconds || 0;
        const t2 = b.createdAt?.seconds || 0;
        return t2 - t1;
      });
      setGoals(sorted);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.deadline) return alert("Заповніть назву та дату!");
    if (!currentUser) return alert("Ви не авторизовані!");
    
    setLoading(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newGoal, 
          userId: currentUser.uid // Використовуємо актуальний UID
        }),
      });

      if (response.ok) {
        setNewGoal({ title: '', tag: 'IT & Code', deadline: '', description: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Помилка створення:", error);
    } finally { 
      setLoading(false); 
    }
  };

  const toggleStatus = async (id) => {
    if (!currentUser) return;

    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    let nextStatus = goal.status === 'активні' ? 'завершені' : goal.status === 'завершені' ? 'відкладені' : 'активні';
    let nextProgress = nextStatus === 'завершені' ? 100 : nextStatus === 'відкладені' ? 50 : 0;
    let completedAtDate = nextStatus === 'завершені' ? new Date().toISOString().split('T')[0] : null;
    const wasCompleted = goal.status === 'завершені';

    try {
      // 1. Оновлюємо основну ціль у Firestore
      await updateDoc(doc(db, "goals", id), { 
        status: nextStatus, 
        progress: nextProgress, 
        completedAt: completedAtDate 
      });

      // 2. Якщо статус став "завершені" — пишемо в історію через API
      if (nextStatus === 'завершені') {
        await fetch('/api/completed-goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            goalId: id, 
            goalTitle: goal.title, 
            category: goal.tag, 
            completionDate: completedAtDate, 
            userId: currentUser.uid 
          })
        });
      }

      // 3. Якщо зняли статус "завершені" — видаляємо з історії
      if (wasCompleted && nextStatus !== 'завершені') {
        await fetch('/api/completed-goals', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            goalId: id, 
            userId: currentUser.uid, 
            completedAt: goal.completedAt 
          })
        });
      }
    } catch (error) { 
      console.error("Помилка оновлення статусу:", error); 
    }
  };

  const filteredGoals = goals.filter(g => filter === 'всі' ? true : g.status === filter);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Мої цілі</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#6366f1', color: '#fff', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
          {showForm ? 'Скасувати' : 'Створити ціль'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGoal} style={{ background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gap: '15px' }}>
            <input type="text" placeholder="Назва *" required value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="datetime-local" required value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <button type="submit" disabled={loading} style={{ background: '#6366f1', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none' }}>
              {loading ? 'Збереження...' : 'Додати ціль'}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['всі', 'активні', 'завершені', 'відкладені'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filter === s ? '#6366f1' : '#f1f5f9', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer' }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredGoals.length === 0 && !loading ? (
          <p style={{ color: '#94a3b8' }}>Цілей поки немає.</p>
        ) : (
          filteredGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onToggle={() => toggleStatus(goal.id)} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyGoals;