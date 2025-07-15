import TaskList from "./components/taskList"
import TaskForm from "./components/taskForm"
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
          <Routes>
            <Route path="/" element={<TaskList/>}/>
            <Route path="/tasklist" element={<TaskList/>}/>
            <Route path="/taskform" element={<TaskForm/>}/>
            <Route path="/new" element={<TaskForm/>}/>
            <Route path="/edit/:id" element={<TaskForm />} />

          </Routes>
    </>
  )
}

export default App
