import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../config";

interface Task {
  id: number;
  descripcion: string;
  completada: boolean;
  fecha_vencimiento: string;
  prioridad: "alta" | "media" | "baja";
}

function TaskForm() {
  const [task, setTask] = useState<Task>({
    id: 0,
    descripcion: "",
    completada: false,
    fecha_vencimiento: "",
    prioridad: "media",
  });
  const [cargando, setCargando] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setCargando(true);
      fetch(`${apiUrl}/tasks/${id}`)
        .then((resp) => {
          if (!resp.ok) throw new Error("Tarea encontrada");
          return resp.json();
        })
        .then((data) => setTask(data))
        .catch((error) => console.error("Error al cargar tarea: ", error))
        .finally(() => setCargando(false));
    }
  }, [id]);

  //manejador de cambios
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //manejador de envio
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${apiUrl}/tasks/${id}` : `${apiUrl}/tasks`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!response) throw new Error("Error al guardar");
      navigate("/");
    } catch (error) {
      console.error("Error al guardar la tarea", error);
    } finally {
      setCargando(false);
    }
  };

  if (id && cargando) {
    return <p className="text-center mt-4">Cargando tarea...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{id ? "Editar Tarea" : "Crear Nueva Tarea"}</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="descripcion"
            value={task.descripcion}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Vencimiento</label>
          <input
            type="string"
            name="fecha_vencimiento"
            value={task.fecha_vencimiento}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Prioridad</label>
          <select
            name="prioridad"
            value={task.prioridad}
            onChange={handleChange}
            className="form-select"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
