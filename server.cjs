const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');

// Шукаємо файл ключа в поточному каталозі процесу (це надійніше для Render)
const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "my-goals-app-89062" 
});

const db = admin.firestore();
const app = express();

app.use(express.json());
app.use(cors());

// ПУНКТ 1: Роздача статичних файлів React
app.use(express.static(path.join(__dirname, 'dist')));

// API: отримати/створити цілі (клієнт може використовувати /api/goals для POST створення)
app.get('/api/goals', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = db.collection('goals');
    if (userId) query = query.where('userId', '==', userId);

    const snapshot = await query.get();
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const data = req.body || {};
    // Додаємо serverTimestamp для відстеження створення
    data.createdAt = admin.firestore.Timestamp.now();
    const ref = await db.collection('goals').add(data);
    res.status(201).json({ success: true, id: ref.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ПУНКТ 3: GET маршрут для Прогресу (фільтрація за датою)
app.get('/api/completed-goals', async (req, res) => {
  const { date, userId } = req.query; 
  try {
    let query = db.collection('completed_history');
    
    // Якщо вказано userId — фільтруємо записами тільки цього користувача
    if (userId) {
      query = query.where('userId', '==', userId);
    }

    if (date) {
      // Фільтруємо безпосередньо в запиті до Firestore (Пункт 3)
      query = query.where('completedAt', '==', date);
    }

    const snapshot = await query.get();
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(goals);
  } catch (error) {
    res.status(500).json([]);
  }
});

// ПУНКТ 4: POST маршрут для збереження завершеної цілі
app.post('/api/completed-goals', async (req, res) => {
  try {
    const { goalId, goalTitle, category, completionDate, userId } = req.body;
    const entry = {
      goalId,
      title: goalTitle,
      tag: category,
      completedAt: completionDate, // Поле часу виконання (Пункт 4)
      userId,
      serverTimestamp: admin.firestore.Timestamp.now()
    };
    // Захист від дублювання: перевіряємо чи вже є запис з тим же goalId, userId і completedAt
    const dupQuery = db.collection('completed_history')
      .where('goalId', '==', goalId)
      .where('userId', '==', userId)
      .where('completedAt', '==', completionDate)
      .limit(1);

    const dupSnapshot = await dupQuery.get();
    if (!dupSnapshot.empty) {
      // Якщо вже є - повертаємо успіх, але не додаємо ще раз
      return res.status(200).json({ success: true, duplicated: true });
    }

    await db.collection('completed_history').add(entry);
    res.status(201).json({ success: true, duplicated: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Підтримка React Router
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порту ${PORT}`);
});

// DELETE маршрут для видалення запису про виконану ціль (передати goalId та userId,
// optional: completedAt or completionDate). Повертає { deleted: N }
app.delete('/api/completed-goals', async (req, res) => {
  try {
    // Підтримуємо як query-параметри, так і тіло запиту
    const source = Object.keys(req.query).length ? req.query : req.body || {};
    const { goalId, userId } = source;
    const completedAt = source.completedAt || source.completionDate;

    if (!goalId || !userId) return res.status(400).json({ error: 'goalId and userId required' });

    let query = db.collection('completed_history').where('goalId', '==', goalId).where('userId', '==', userId);
    if (completedAt) query = query.where('completedAt', '==', completedAt);

    const snapshot = await query.get();
    if (snapshot.empty) return res.status(200).json({ deleted: 0 });

    const batch = db.batch();
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();

    return res.status(200).json({ deleted: snapshot.size });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});