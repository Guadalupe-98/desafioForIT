import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { apiUrl } from '../config';
import TaskItem from "./taskItem";

export interface Task{
    id:number;
    descripcion:string,
    completada:boolean,
    fecha_vencimiento:string;
    prioridad: 'alta' | 'media' | 'baja';
}

function TaskList(){
    const [tasks, setTasks]=useState<Task[]>([]);

    useEffect(()=>{
      const fetchTasks = async () => {
        try {
          const res = await fetch(`${apiUrl}/tasks`);
          const data = await res.json();
          setTasks(data);
        } catch (error) {
          console.error('Error al cargar tareas:', error);
        }
      };
      fetchTasks();
    },[]);

    const deleteTask = async (id: number)=>{
      try {
        await fetch(`${apiUrl}/tasks/${id}`, { method: 'DELETE' });
        setTasks(prev => prev.filter(task => task.id !== id));
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
      }
    };

    const toggleComplete=async(id:number, completada:boolean)=>{
      try{
        await fetch(`${apiUrl}/tasks/${id}`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({completada}),
        });
        setTasks(prev=>
          prev.map(task=>
            task.id === id ? {...task, completada}: task
          )
        );
      }catch(error){
        console.error('Error al actualizar tarea:', error);
      }
    };

        return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">📝 Lista de Tareas</h1>
      <div className="mb-3 text-end">
        <Link to="/new" className="btn btn-primary">➕ Nueva Tarea</Link>
      </div>

      {tasks.length === 0 ? (
        <div className="alert alert-info">No hay tareas registradas.</div>
      ) : (
        <ul className="list-group">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onDelete={deleteTask} onToggleComplete={toggleComplete}/>
          ))}
        </ul>
      )}
    </div>
  );

}
export default TaskList;