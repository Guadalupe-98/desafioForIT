import { Link } from "react-router-dom";
import type { Task } from "./taskList";

export interface TaskItemPromps {
  task: Task;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completada: boolean) => void;
}

function prioridadColor(prioridad: string) {
  switch (prioridad) {
    case "alta":
      return "danger";
    case "media":
      return "warning";
    case "baja":
      return "success";
    default:
      return "secondary";
  }
}
function TaskItem({ task, onDelete, onToggleComplete }: TaskItemPromps) {
return (
  <li className="list-group-item">
    <div className="row align-items-center">
      
      {/* ✅ Columna 1: Checkbox */}
      <div className="col-auto">
        <input
          type="checkbox"
          className="form-check-input"
          id={`check-${task.id}`}
          checked={task.completada}
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
        />
      </div>

      {/* ✅ Columna 2: Descripción */}
      <div className="col-5">
        <h5 className={`mb-1 ${task.completada ? 'text-decoration-line-through text-muted' : ''}`}>
          {task.descripcion}
        </h5>
      </div>

      {/* ✅ Columna 3: Fecha y prioridad */}
      <div className="col">
        <small className="text-muted">
          Vence: {task.fecha_vencimiento} |
          <span className={`ms-2 badge bg-${prioridadColor(task.prioridad)}`}>
            {task.prioridad}
          </span>
        </small>
      </div>

      {/* ✅ Columna 4: Acciones */}
      <div className="col-auto text-end">
        {!task.completada && (
          <Link to={`/edit/${task.id}`} className="btn btn-sm btn-outline-secondary me-2">
            ✏️
          </Link>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-sm btn-outline-danger"
        >
          🗑️
        </button>
      </div>
    </div>
  </li>
);
}
export default TaskItem;