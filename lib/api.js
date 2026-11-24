function getBaseApiUrl() {
  if (typeof window !== 'undefined') {
    const configured = process.env.NEXT_PUBLIC_API_URL;
    if (!configured || (window.location.protocol === 'https:' && configured.startsWith('http:'))) {
      return '/api';
    }
    return configured;
  }
  return process.env.BACKEND_INTERNAL_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
}

const API_URL = getBaseApiUrl();

export async function loginApi(correo, contrasena) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || 'Error al iniciar sesión' };
  }
  return res.json();
}

export async function loginDemoApi(tipo) {
  const res = await fetch(`${API_URL}/auth/demo/${tipo}`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || 'Error al iniciar demo' };
  }
  return res.json();
}

export async function registroApi(nombre, correo, contrasena) {
  const res = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contrasena }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || 'Error al registrar' };
  }
  return res.json();
}

export async function regarApi(materaId, segundos = 5) {
  const res = await fetch(`${API_URL}/telemetria/${materaId}/regar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ segundos, origen: 'manual' }),
  });
  return res.json();
}
