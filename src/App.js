import './App.css';

import { useState, useEffect } from "react"
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs"

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState("") //vai ser usado para consultar e atualizar o valor do titulo
  const [motor, setMotor] = useState("") //horario da Task
  const [todos, setTodos] = useState([]) //Criar uma lista vazia para inserir todos dentro delas
  const [loading, setLoading] = useState(false) // Criar um tempo de espera da tela de resultados

  //Load todos on page load
  useEffect(() => {
    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err))
      
      setLoading(false)
      
      setTodos(res)
    }

    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      motor,
      done: false,
    }

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Teste Envio para api
    //console.log(todo)

    setTodos((prevState) => [...prevState, todo])

    //Zerando o inputs
    setTitle("")
    setMotor("")
  } // Com este evento é possível parar o envio do formulário

  const handleDelete = async (id) => {

    await fetch(API + "/todos/" + id, {
      method: "DELETE"
    })
    
    setTodos((prevState) => prevState.filter((todo) =>todo.id !== id))
  }

  const handleEdit = async(todo) => {
    todo.done = !todo.done

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    })

    setTodos((prevState) => 
    prevState.map((t) => (t.id === data.id ? (t = data) : t))
    )
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      {/*Teremos a aplicacao dividida em 3 partes header/form/lista */}
      <div className='todo-header'>
        <h1>Cadastro de Carros</h1>
      </div>
      <div className='todo-form'>
        <h2>Cadastre seu carro:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>Qual é o apelido do carro:</label>
            <input
              type="text"
              name="title"
              placeholder="Ex: Camaro Amarelo"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required>
            </input>
          </div>
          <div className='form-control'>
            <label htmlFor='motor'>Motorização:</label>
            <input
              type="text"
              name="motor"
              placeholder="Ex: 1.0 3 cilndros Aspirado"
              onChange={(e) => setMotor(e.target.value)}
              value={motor || ""}
              required>
            </input>
          </div>
          <input type='submit' value="Cadastrar"></input>
        </form> {/*(ON é sempre uma evento) e (handle) é geralmente uma função que corresponde ao evento  */}
      </div>
      <div className='todo-list'>
        <h2>Lista de Carros:</h2>
        {todos.length === 0 && <p>Não há carros!</p>}
        {todos.map((todo) => (
        <div className='todo' key={todo.id}>
          <h4 className={todo.done ? "todo-done" : ""}>{todo.title}</h4>
          <p>Motorização: {todo.motor}</p>
          <div className='actions'>
            <span onClick={() => handleEdit(todo)}>
              {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
            </span>
            <BsTrash onClick={() => handleDelete(todo.id)} />
          </div>
        </div>))}
      </div>
    </div>
  )
}

export default App