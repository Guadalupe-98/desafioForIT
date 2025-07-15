const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 3000;

// Habilitar CORS
app.use(cors()); // Esto permite cualquier origen (ideal para desarrollo)

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

//Middleware para interpretar Json
app.use(express.json());
//

// Función para leer tareas desde data.json
function leerTareas() {
  try {
    const data = fs.readFileSync("data.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer data.json:", error);
    return [];
  }
}

// Función para escribir tareas a data.json
function escribirTareas(tareas) {
  try {
    fs.writeFileSync("data.json", JSON.stringify(tareas, null, 2));
  } catch (error) {
    console.error("Error al escribir data.json:", error);
  }
}

let tareas = leerTareas();

//End Points

//GET obtener todas las tareas
app.get("/api/tasks", (req, resp) => {
  resp.json(tareas);
});

//Obtener tarea por ID
app.get("/api/tasks/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return resp.status(404).json({ mensaje: "No encontrado" });
  }
  resp.json(tarea);
});

// POST Crear una nueva tarea
app.post("/api/tasks", (req, resp) => {
  const {
    descripcion,
    completada = false,
    fecha_vencimiento = null,
    prioridad = null,
  } = req.body;

  if (!descripcion) {
    return resp.status(400).json({ mensaje: "La descripción es obligatoria" });
  }

  const nuevaTarea = {
    id: Date.now(),
    descripcion,
    completada,
    fecha_vencimiento,
    prioridad,
  };

  tareas.push(nuevaTarea);
  escribirTareas(tareas);
  resp.status(201).json(nuevaTarea);
});

// PUT Actualizar una tarea existente
app.put("/api/tasks/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return resp.status(404).json({ mensaje: "No encontrado" });
  }

  // Solo actualizar los campos que se envían en la petición
  if (req.body.hasOwnProperty("descripcion")) {
    tarea.descripcion = req.body.descripcion;
  }
  if (req.body.hasOwnProperty("completada")) {
    tarea.completada = req.body.completada;
  }
  if (req.body.hasOwnProperty("fecha_vencimiento")) {
    tarea.fecha_vencimiento = req.body.fecha_vencimiento;
  }
  if (req.body.hasOwnProperty("prioridad")) {
    tarea.prioridad = req.body.prioridad;
  }

  escribirTareas(tareas);
  resp.json(tarea);
});

// DELETE Eliminar una tarea
app.delete("/api/tasks/:id", (req, resp) => {
  const id = parseInt(req.params.id);
  const tareaExistente = tareas.find((t) => t.id === id);

  if (!tareaExistente) {
    return resp.status(404).json({ mensaje: "No encontrado" });
  }

  tareas = tareas.filter((t) => t.id !== id);
  escribirTareas(tareas);
  resp.status(204).send(); //no hay contenido
});

//Iniciar Servidor
app.listen(port, () => {
  console.log(`Servidor corriendo ${port}`);
});
