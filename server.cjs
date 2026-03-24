const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');

// Шукаємо файл ключа в поточному каталозі процесу
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

// API: отримати цілі
app.get('/api/goals', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    let query = db.collection('goals').where('userId', '==', userId);
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
    data.createdAt = admin.firestore.Timestamp.now();
    const ref = await db.collection('goals').add(data);
    res.status(201).json({ success: true, id: ref.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ПУНКТ 3: ВИПРАВЛЕНО - GET маршрут для Прогресу
app.get('/api/completed-goals', async (req, res) => {
  const { date, userId } = req.query; 
  
  // КРИТИЧНО: Якщо userId не передано, повертаємо порожній масив або помилку
  if (!userId) {
    return res.status(400).json({ error: "userId is required to fetch progress" });
  }

  try {
    // Починаємо запит ОБОВ'ЯЗКОВО з фільтрації по конкретному користувачу
    let query = db.collection('completed_history').where('userId', '==', userId);
    
    // Якщо додана дата — додаємо ще один фільтр
    if (date) {
      query = query.where('completedAt', '==', date);
    }

    const snapshot = await query.get();
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(goals);
  } catch (error) {
    console.error("Помилка Firestore:", error);
    res.status(500).json([]);
  }
});

// ПУНКТ 4: POST маршрут для збереження завершеної цілі
app.post('/api/completed-goals', async (req, res) => {
  try {
    const { goalId, goalTitle, category, completionDate, userId } = req.body;
    
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const entry = {
      goalId,
      goalTitle: goalTitle, // Використовуємо уніфіковану назву
      category: category,
      completedAt: completionDate, 
      userId,
      serverTimestamp: admin.firestore.Timestamp.now()
    };

    // Захист від дублювання
    const dupQuery = db.collection('completed_history')
      .where('goalId', '==', goalId)
      .where('userId', '==', userId)
      .where('completedAt', '==', completionDate)
      .limit(1);

    const dupSnapshot = await dupQuery.get();
    if (!dupSnapshot.empty) {
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

// DELETE маршрут
app.delete('/api/completed-goals', async (req, res) => {
  try {
    const source = Object.keys(req.query).length ? req.query : req.body || {};
    const { goalId, userId } = source;
    const completedAt = source.completedAt || source.completionDate;

    if (!goalId || !userId) return res.status(400).json({ error: 'goalId and userId required' });

    let query = db.collection('completed_history')
                  .where('goalId', '==', goalId)
                  .where('userId', '==', userId);
    
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