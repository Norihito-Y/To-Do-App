import { useState, useRef } from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4 } from "uuid";
import './App.scss';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [todos, setTodos] = useState({});
  const categoryRef = useRef();
  const todoNameRef = useRef();

  const handleAddCategory = () => {
    const category = categoryRef.current.value;
    if (category === "") return;
    setCategories((prevCategories) => [...prevCategories, category]);
    setTodos((prevTodos) => ({ ...prevTodos, [category]: [] }));
    categoryRef.current.value = null;
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleDeleteCategory = (categoryToDelete) => {
    // カテゴリーを削除し、該当するタスクも削除
    setCategories((prevCategories) => prevCategories.filter((category) => category !== categoryToDelete));
    setTodos((prevTodos) => {
      const newTodos = { ...prevTodos };
      delete newTodos[categoryToDelete];
      return newTodos;
    });
    // 削除したカテゴリーが選択されていた場合、選択を解除する
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory(null);
    }
  };

  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === "" || !selectedCategory) return;
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos[selectedCategory], { id: uuidv4(), name: name, completed: false }];
      return { ...prevTodos, [selectedCategory]: newTodos };
    });
    todoNameRef.current.value = null;
  };

  const toggleTodo = (id) => {
    const newTodos = [...todos[selectedCategory]];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    setTodos((prevTodos) => ({
      ...prevTodos,
      [selectedCategory]: newTodos
    }));
  };

  const handleClear = () => {
    const newTodos = todos[selectedCategory].filter((todo) => !todo.completed);
    setTodos((prevTodos) => ({
      ...prevTodos,
      [selectedCategory]: newTodos
    }));
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "40%", backgroundColor: "#6f6f6f", height: "100vh" }}>
        <h2 style={{ color: "#fff" }}>Categories</h2>
        <input type="text" ref={categoryRef} placeholder="New Category" className="box-text" />
        <button onClick={handleAddCategory}>Add</button>
        <ul>
          {categories.map((category) => (
            <li key={category}>
              <span onClick={() => handleSelectCategory(category)} style={{ cursor: "pointer" }}>
                {category}
              </span>
              <button onClick={() => handleDeleteCategory(category)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: "60%" }}>
        <h2 className="h2-right">{selectedCategory ? `Tasks in ${selectedCategory}` : "Select a Category"}</h2>
        {selectedCategory && (
          <>
            <div className="container">
              <input type="text" ref={todoNameRef} placeholder="New Task" style={{ width: "40%" }} className="box-text2" />
              <button onClick={handleAddTodo} className="button2">Add Task</button>
              <button onClick={handleClear} className="button3">Clear</button>
            </div>
            <TodoList todos={todos[selectedCategory]} toggleTodo={toggleTodo} />
            <div className="card">
              Remaining tasks: {todos[selectedCategory].filter((todo) => !todo.completed).length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

