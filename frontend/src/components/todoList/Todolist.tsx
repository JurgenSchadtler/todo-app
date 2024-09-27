import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Todo } from "../../types/Todo";
import axios from "axios";
import "./Todolist.css";
import Modal from "../modal/Modal";

export const Todolist = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null); // For editing

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axiosInstance.get<Todo[]>("/todos");
        setTodos(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching todos:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        await axiosInstance.post("/todos", {
          title: newTodo,
          completed: false,
        });
        // Update the state with the new todo without waiting for a response
        setTodos((prevTodos) => [
          ...prevTodos,
          { id: Date.now(), title: newTodo, completed: false }, // Create a temporary ID
        ]);
        setNewTodo("");
        setIsModalOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error adding todo:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (todoToUpdate) {
        const updatedTodo = {
          title: todoToUpdate.title,
          completed: !todoToUpdate.completed,
        };

        // Send the update to the server
        const response = await axiosInstance.put(`/todos/${id}`, updatedTodo);

        // Update the state based on the server response
        if (response.status === 200) {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === id
                ? { ...todo, completed: updatedTodo.completed }
                : todo
            )
          );
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating todo:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting todo:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleEditTodo = (id: number, title: string) => {
    setEditingTodoId(id);
    setNewTodo(title); // Pre-fill the modal with the current title
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleUpdateTodo = async () => {
    if (editingTodoId !== null && newTodo.trim() !== "") {
      try {
        const updatedTodo = { title: newTodo, completed: false };
        await axiosInstance.put(`/todos/${editingTodoId}`, updatedTodo);

        // Update the state with the edited todo
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === editingTodoId ? { ...todo, title: newTodo } : todo
          )
        );
        setNewTodo("");
        setEditingTodoId(null);
        setIsModalOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error updating todo:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  return (
    <>
      <div>
        <h1>Todo List Terrific Interview</h1>

        <div className="action-container">
          <button onClick={() => setIsModalOpen(true)}>Add Task</button>
        </div>

        <div className="list-container">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`list-item ${todo.completed ? "completed" : ""} `}
            >
              <div className="flex-title">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                <div className="item-title">{todo.title}</div>
              </div>

              <div className="button-container">
                <button
                  disabled={todo.completed}
                  className="update"
                  onClick={() => handleEditTodo(todo.id, todo.title)}
                >
                  Update
                </button>
                <button
                  disabled={todo.completed}
                  className="cancel"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTodoId(null); // Reset editing state
          }}
          onSubmit={editingTodoId !== null ? handleUpdateTodo : handleAddTodo}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
        />
      </div>
    </>
  );
};
