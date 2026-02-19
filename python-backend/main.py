import logging
import time
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --------------------------------------------------
# Logging configuration (stdout, container friendly)
# --------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

logger = logging.getLogger("python-backend")

# --------------------------------------------------
# App initialization
# --------------------------------------------------
app = FastAPI(title="Fullstack Deployment Test Backend")

logger.info("Starting Python FastAPI backend")

# --------------------------------------------------
# CORS (for React frontend)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # OK for learning / CI-CD
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# In-memory storage
# --------------------------------------------------
todos = []
counter = 1

# --------------------------------------------------
# Models
# --------------------------------------------------
class TodoCreate(BaseModel):
    title: str


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool


# --------------------------------------------------
# Middleware: request logging
# --------------------------------------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = int((time.time() - start_time) * 1000)
    logger.info(
        f"[HTTP] {request.method} {request.url.path} -> "
        f"{response.status_code} ({duration}ms)"
    )

    return response


# --------------------------------------------------
# Routes
# --------------------------------------------------
@app.get("/health")
def health():
    logger.info("[HEALTH] Health check called")
    return {"status": "ok"}


@app.get("/todos", response_model=List[TodoResponse])
def get_todos():
    logger.info(f"[TODO] Fetching todos (count={len(todos)})")
    return todos


@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate):
    global counter

    logger.info(f"[TODO] Creating todo: {todo.title}")

    new_todo = {
        "id": counter,
        "title": todo.title,
        "completed": False
    }

    todos.append(new_todo)
    counter += 1

    return new_todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate):
    logger.info(f"[TODO] Updating todo id={todo_id}")

    for item in todos:
        if item["id"] == todo_id:
            if todo.title is not None:
                item["title"] = todo.title
            if todo.completed is not None:
                item["completed"] = todo.completed
            return item

    logger.error(f"[TODO] Todo not found id={todo_id}")
    raise HTTPException(status_code=404, detail="Todo not found")


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    global todos

    logger.info(f"[TODO] Deleting todo id={todo_id}")

    todos = [item for item in todos if item["id"] != todo_id]
    return {"message": "Todo deleted"}
