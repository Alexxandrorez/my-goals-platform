const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');

// Шукаємо файл ключа
const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "my-goals-app-89062" 
  });
}

const db = admin.firestore();
const app = express();

app.use(express.json());
app.use(cors());

// Роздача статики React
app.use(express.static(path.join(__dirname, 'dist')));

// API: отримати цілі
app.get('/api/goals', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const snapshot = await db.collection('goals').where('userId', '==', userId).get();
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(goals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const data = req.body || {};
    data.createdAt = admin.firestore.Timestamp.now();
    const ref = await db.collection('goals').add(data);
    res.status(201).json({ success: true, id: ref.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET: Отримати прогрес (ВИПРАВЛЕНО ЛОГУВАННЯ ПОМИЛОК)
app.get('/api/completed-goals', async (req, res) => {
  const { date, userId } = req.query; 
  
  if (!userId || userId === 'undefined') {
    return res.status(400).json({ error: "userId is missing in request" });
  }

  try {
    console.log(`--- Запит для юзера: ${userId} на дату: ${date} ---`);
    
    // Базовий запит ЗАВЖДИ з userId
    let query = db.collection('completed_history').where('userId', '==', userId);
    
    if (date) {
      query = query.where('completedAt', '==', date);
    }

    const snapshot = await query.get();
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json(goals);
  } catch (error) {
    console.error("КРИТИЧНА ПОМИЛКА FIRESTORE:", error.message);
    // Якщо індексу немає, тут прийде посилання від Firebase. 
    // Ти побачиш його у вкладці Network -> Response
    res.status(500).send(error.message); 
  }
});

// POST: Зберегти завершену ціль
app.post('/api/completed-goals', async (req, res) => {
  try {
    const { goalId, goalTitle, category, completionDate, userId } = req.body;
    
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const entry = {
      goalId,
      goalTitle: goalTitle,
      category: category,
      completedAt: completionDate, 
      userId,
      serverTimestamp: admin.firestore.Timestamp.now()
    };

    // Перевірка на дублікат
    const dupSnapshot = await db.collection('completed_history')
      .where('goalId', '==', goalId)
      .where('userId', '==', userId)
      .where('completedAt', '==', completionDate)
      .limit(1)
      .get();

    if (!dupSnapshot.empty) {
      return res.status(200).json({ success: true, duplicated: true });
    }

    const ref = await db.collection('completed_history').add(entry);
    res.status(201).json({ success: true, id: ref.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE: Видалити з історії
app.delete('/api/completed-goals', async (req, res) => {
  try {
    const { goalId, userId, completedAt } = req.body;

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
    res.status(500).send(error.message);
  }
});

// Підтримка React Router
app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) return;
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер на порту ${PORT}`);
});