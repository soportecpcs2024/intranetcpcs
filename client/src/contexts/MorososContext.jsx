import React, { createContext, useContext, useReducer } from "react";

// --- Contextos separados para estado y dispatch ---
const MorososStateContext = createContext();
const MorososDispatchContext = createContext();

// --- URL del backend desde .env ---
const apiBaseUrlPy = import.meta.env.VITE_BACKEND_URL_PY;

// --- Estado inicial ---
const initialState = {
  archivoMorosos: null,
  archivoFamiliares: null,
  diaCita: "",
  mesCita: "",
  hora: "",
  lugar: "",
  loading: false,
  mensaje: "",
  resultados: null,
};

// --- Reducer principal ---
function reducer(state, action) {
  switch (action.type) {
    case "SET_FILE_MOROSOS":
      return { ...state, archivoMorosos: action.payload };
    case "SET_FILE_FAMILIARES":
      return { ...state, archivoFamiliares: action.payload };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_MENSAJE":
      return { ...state, mensaje: action.payload };
    case "SET_RESULTADOS":
      return { ...state, resultados: action.payload };
    case "RESET":
      return initialState;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// --- Provider principal ---
export function MorososProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MorososStateContext.Provider value={state}>
      <MorososDispatchContext.Provider value={dispatch}>
        {children}
      </MorososDispatchContext.Provider>
    </MorososStateContext.Provider>
  );
}

// --- Hooks personalizados ---
export function useMorososState() {
  const context = useContext(MorososStateContext);
  if (!context)
    throw new Error("useMorososState debe usarse dentro de un MorososProvider");
  return context;
}

export function useMorososDispatch() {
  const context = useContext(MorososDispatchContext);
  if (!context)
    throw new Error(
      "useMorososDispatch debe usarse dentro de un MorososProvider"
    );
  return context;
}

// ✅ Hook combinado (más cómodo de usar)
export function useMorosos() {
  const state = useMorososState();
  const dispatch = useMorososDispatch();
  return { state, dispatch };
}

// --- Función central para procesar archivos ---
export async function procesarMorosos(state, dispatch) {
  const { archivoMorosos, archivoFamiliares, diaCita, mesCita, hora, lugar } = state;

  // Validaciones simples
  if (!archivoMorosos || !archivoFamiliares) {
    dispatch({
      type: "SET_MENSAJE",
      payload: "⚠️ Debes seleccionar ambos archivos.",
    });
    return;
  }

  if (!diaCita || !mesCita || !hora || !lugar) {
    dispatch({
      type: "SET_MENSAJE",
      payload: "⚠️ Completa todos los datos de la cita.",
    });
    return;
  }

  const formData = new FormData();
  formData.append("morosos", archivoMorosos);
  formData.append("familiares", archivoFamiliares);
  formData.append("dia_cita", diaCita);
  formData.append("mes_cita", mesCita);
  formData.append("hora", hora);
  formData.append("lugar", lugar);

  try {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_MENSAJE", payload: "⏳ Procesando archivos..." });

    const res = await fetch(`${apiBaseUrlPy}/procesar-morosos`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Error al procesar los archivos");

    const data = await res.json();
    dispatch({ type: "SET_MENSAJE", payload: `✅ ${data.mensaje}` });
    dispatch({ type: "SET_RESULTADOS", payload: data });
  } catch (error) {
    console.error("❌ Error procesando archivos:", error);
    dispatch({
      type: "SET_MENSAJE",
      payload: "❌ Error al procesar los archivos.",
    });
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}
