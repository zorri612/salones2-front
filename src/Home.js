import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [salones, setSalones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:5000/api/salones")
      .then(res => {
        setSalones(res.data); // ahora incluye salones de todos los edificios
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener salones:", err);
        setIsLoading(false);
      });
  }, []);

  const enviarPregunta = async () => {
    if (!mensaje.trim()) return;

    const preguntaUsuario = mensaje;
    setMensaje("");
    setIsLoading(true);

    setHistorial((prev) => [...prev, { autor: "usuario", texto: preguntaUsuario }]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: preguntaUsuario });
      const respuestaIA = res.data.reply;
      setHistorial((prev) => [...prev, { autor: "ia", texto: respuestaIA }]);
    } catch (err) {
      console.error("Error en el chat:", err);
      setHistorial((prev) => [...prev, { autor: "ia", texto: "Hubo un error al procesar tu pregunta." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeleccion = (e) => {
    const idSalon = e.target.value;
    navigate(`/salon/${encodeURIComponent(idSalon)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-2xl overflow-hidden card-hover border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Sistema de Información de Salones</h1>
            <p className="text-center text-purple-200 mt-2">Consulta información detallada sobre los salones disponibles</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Selector de salón */}
            <div className="bg-gray-700 rounded-xl p-5 shadow-sm card-hover border border-gray-600">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Selecciona un salón para ver detalles</h2>

              <div className="relative">
                <select
                  onChange={handleSeleccion}
                  defaultValue=""
                  className="w-full bg-gray-800 border border-gray-600 text-gray-100 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none shadow-sm"
                >
                  <option value="" disabled>-- Selecciona un salón --</option>
                  {isLoading ? (
                    <option disabled>Cargando salones...</option>
                  ) : (
                    salones.map((s, idx) => (
                      <option key={idx} value={`${s.EDIFICIO}|||${s["Salón"]}`}>
                        {`${s["Salón"]} (${s.EDIFICIO})`}
                      </option>
                    ))
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Asistente de chat */}
            <div className="bg-gray-700 rounded-xl p-5 shadow-sm card-hover border border-gray-600">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Asistente Virtual</h2>
              <p className="text-gray-300 mb-4">¿Tienes preguntas sobre los salones? ¡Pregúntame!</p>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") enviarPregunta();
                  }}
                  placeholder="Ej: ¿Qué salón tiene más capacidad?"
                  className="flex-1 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isLoading}
                />
                <button
                  onClick={enviarPregunta}
                  disabled={isLoading || !mensaje.trim()}
                  className={`px-5 py-3 rounded-lg font-medium ${
                    isLoading || !mensaje.trim() 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando
                    </span>
                  ) : (
                    "Preguntar"
                  )}
                </button>
              </div>

              {/* Historial de chat */}
              {historial.length > 0 && (
                <div className="bg-gray-800 rounded-lg border border-gray-600 p-4 max-h-80 overflow-y-auto chat-scrollbar">
                  <div className="space-y-4">
                    {historial.map((item, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${
                          item.autor === "usuario" 
                            ? "bg-purple-900 ml-8 border border-purple-700" 
                            : "bg-gray-700 mr-8 border border-gray-600"
                        } ${index === historial.length - 1 ? "pulse" : ""}`}
                      >
                        <p className="font-medium text-sm text-gray-300 mb-1">
                          {item.autor === "usuario" ? "Tú" : "Asistente"}
                        </p>
                        <p className="text-gray-100">{item.texto}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Sistema de Información de Salones
        </footer>
      </div>
    </div>
  );
}

export default Home;
