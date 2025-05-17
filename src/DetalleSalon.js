// DetalleSalon.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

// Generador de URLs posibles para imágenes del salón
const generarPosiblesUrls = (edificio, salon) => {
  const base = `https://econo2-almendros.s3.amazonaws.com`;

  const variantes = [
    salon,                                // "EG 4.1"
    salon.replace(/\s+/g, "-"),           // "EG-4.1"
    salon.replace(/-+/g, " "),            // "EG 4.1"
    salon.replace(/\s+/g, ""),            // "EG4.1"
  ];

  return variantes.map(nombre =>
    `${base}/${encodeURIComponent(edificio)}/${encodeURIComponent(nombre)}.jpg`
  );
};

function DetalleSalon() {
  const { nombre } = useParams();
  const navigate = useNavigate();

  const [detalles, setDetalles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);
  const [error, setError] = useState(null);

  // Cargar datos del salón
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const nombreDecodificado = decodeURIComponent(nombre);
    axios.get(`http://localhost:5000/api/salones/${nombreDecodificado}`)
      .then(res => {
        console.log("Datos recibidos:", res.data);
        setDetalles(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener detalles:", err);
        setError("No se pudo cargar la información del salón.");
        setIsLoading(false);
      });
  }, [nombre]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-gray-700">
          <div className="animate-spin mx-auto h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-300">Cargando información del salón...</p>
        </div>
      </div>
    );
  }

  if (!detalles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-gray-700">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Salón no encontrado</h2>
          <p className="text-gray-300 mb-6">No pudimos encontrar información para el salón solicitado.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow transition-colors duration-200"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const urls = generarPosiblesUrls(detalles.EDIFICIO, detalles["Salón"]);
  const imagenUrl = urls[urlIndex] || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-2xl overflow-hidden card-hover border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Salón {detalles["Salón"]}</h1>
            <p className="text-center text-purple-200 mt-2">Información detallada</p>
          </div>

          {/* Contenido principal */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detalles del salón */}
              <div className="bg-gray-700 rounded-xl p-6 shadow-sm card-hover border border-gray-600">
                <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Características del salón
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(detalles).map(([clave, valor]) =>
                    clave !== "_id" && (
                      <div key={clave} className="bg-gray-800 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-600">
                        <p className="text-sm font-medium text-gray-400">{clave}</p>
                        <p className="text-gray-100 font-semibold">{valor}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Imagen del salón */}
              <div className="bg-gray-700 rounded-xl p-6 shadow-sm card-hover border border-gray-600">
                <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Imagen del salón
                </h2>

                {imageError ? (
                  <div className="flex items-center justify-center bg-gray-800 rounded-lg p-6 text-center border border-gray-600">
                    <svg className="w-16 h-16 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-400">Imagen no disponible</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                    <img
                      src={imagenUrl}
                      alt={`Salón ${detalles["Salón"]}`}
                      onError={() => {
                        if (urlIndex + 1 < urls.length) {
                          setUrlIndex(prev => prev + 1);
                        } else {
                          setImageError(true);
                        }
                      }}
                      className="max-w-full h-auto object-contain img-hover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botón de volver */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Sistema de Información de Salones
        </footer>
      </div>
    </div>
  );
}

export default DetalleSalon;
