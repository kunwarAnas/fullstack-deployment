import { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/todos`);
    const data = await res.json();
    console.log('Parsed todos:', data);
    setTodos(data);
    setLoading(false);
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    setTitle('');
    fetchTodos();
  };

  const toggleTodo = async (id, completed) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });

    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE'
    });

    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Fullstack Deployment Test</h1>
        <p style={styles.subtitle}>
          Fullstack app for deployment testing
        </p>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new todo"
          />
          <button style={styles.addButton} onClick={addTodo}>
            Add
          </button>
        </div>

        {loading && <p style={styles.infoText}>Loading todos...</p>}

        {!loading && todos.length === 0 && (
          <p style={styles.infoText}>No todos yet. Add one above 👆</p>
        )}

        <ul style={styles.list}>
          {todos.map(todo => (
            <li key={todo.id} style={styles.listItem}>
              <span
                style={{
                  ...styles.todoText,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#888' : '#000'
                }}
                onClick={() => toggleTodo(todo.id, todo.completed)}
              >
                {todo.title}
              </span>

              <button
                style={styles.deleteButton}
                onClick={() => deleteTodo(todo.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f6fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    background: '#fff',
    padding: '30px',
    width: '100%',
    maxWidth: '500px',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
  },
  heading: {
    marginBottom: '5px'
  },
  subtitle: {
    marginBottom: '20px',
    color: '#555',
    fontSize: '14px'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '14px'
  },
  addButton: {
    padding: '10px 16px',
    cursor: 'pointer'
  },
  infoText: {
    color: '#777',
    fontSize: '14px',
    marginBottom: '10px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #eee'
  },
  todoText: {
    cursor: 'pointer'
  },
  deleteButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#c0392b'
  }
};

export default App;
