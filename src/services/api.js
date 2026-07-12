const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('jwt_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const rawText = await response.text();
    let data = null;

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error('La respuesta del servidor no es JSON válido.');
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || `Error HTTP ${response.status}`);
    }

    if (data?.success === false) {
      throw new Error(data.message || 'Error en la operación solicitada.');
    }

    return data;
  } catch (error) {
    console.error(`Error en API [${endpoint}]:`, error.message);
    throw error;
  }
};