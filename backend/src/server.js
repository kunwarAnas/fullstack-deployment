require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// CREATE
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.json(result.rows[0]);
});

// READ
app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
  res.json(result.rows);
});

// UPDATE
app.put('/todos/:id', async (req, res) => {
  const { completed } = req.body;
  const result = await pool.query(
    'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
    [completed, req.params.id]
  );
  res.json(result.rows[0]);
});

// DELETE
app.delete('/todos/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

async function startServer(PORT) {
  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 3000;

  for (let i = 1; i <= MAX_RETRIES; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('DB connected successfully');
      break;
    } catch (err) {
      console.error(
        `DB Connection attempt ${i}/${MAX_RETRIES} failed`
      );

      if (i === MAX_RETRIES) {
        console.error('DB Could not connect to database. Exiting.');
        process.exit(1);
      }

      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
    }
  }

  app.listen(PORT, () => {
    console.log(`Backend started on port ${PORT}`);
  });
}

startServer(process.env.PORT || 8080);
