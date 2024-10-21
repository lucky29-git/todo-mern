import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  const createNewTodo = async(e) => {
    e.preventDefault();
    if(content.length > 3){
      try {
        const res = await fetch("http://localhost:5000/api/v1/todos",{
          method: "POST",
          body: JSON.stringify({todo: content}),
          headers:{
            "Content-type": "application/json"
          }
        })
        const newTodo = await res.json()
        setContent("")
        setTodos(prevTodos => [...prevTodos, newTodo]);
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  }

  const updateTodo = async(todoId, todoStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({status: !todoStatus}),
        headers: {
          "Content-type": "application/json"
        }
      });
      const json = await res.json();
      if(json.updatedTodo){
        setTodos(currentTodos => 
          currentTodos.map(currentTodo => 
            currentTodo._id === todoId 
              ? {...currentTodo, status: !currentTodo.status} 
              : currentTodo
          )
        );
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  const deleteTodo = async(todoId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/todos/${todoId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if(json.deletedTodo){
        setTodos(currentTodos => currentTodos.filter(currentTodo => currentTodo._id !== todoId));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  useEffect(() => {
    async function getTodos(){
      try {
        const res = await fetch("http://localhost:5000/api/v1/todos");
        const data = await res.json();
        setTodos(data.todos);
        console.log(data.todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    getTodos()
  }, [])

  return (
    <main className='container'>
      <h1 className='title'> Todos </h1>
      <form className='form' onSubmit={createNewTodo}>
        <input 
          type="text" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder='Enter a new Todo..' 
          required 
          className='form_input'
        />
        <button type='submit' className='form_button'>Create Todo</button>
      </form>
      <div className='todos'>
        {todos.length > 0 && 
          todos.map((todo) => (
            <TodoRender 
              todo={todo} 
              key={todo._id} 
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))
        }
      </div>
    </main>
  )
}

function TodoRender({todo, updateTodo, deleteTodo}) {
  return (
    <div className='todo'>
      <div>{todo.todo}</div>
      <div className='mutations'>
        <button 
          className='todo_status' 
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button 
          className='todo_delete' 
          onClick={() => deleteTodo(todo._id)}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default App