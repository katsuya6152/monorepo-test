"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies(fetchTodos): <explanation>
  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!title) return;
    await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Todo List</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Todo Title"
        />
        <button type="button" onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", gap: "0.5rem" }}>
            <span>
              {todo.title} {todo.completed ? "(done)" : ""}
            </span>
            <button type="button" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
