// Cuentas y sesiones de la app. Solo se usa en el servidor.
//
// Para el prototipo todo se guarda en un archivo JSON (data/usuarios.json),
// sin base de datos. En Coolify la carpeta DATA_DIR debe ser un volumen
// persistente; si no, las cuentas se pierden en cada despliegue.
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CUENTAS_DEMO, DEMO } from './contenido.js';
import { MATERA_DEMO } from './matera.js';

const carpeta = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const archivo = path.join(carpeta, 'usuarios.json');
const DURACION_SESION = 1000 * 60 * 60 * 24 * 30; // 30 días

// Cola simple para que dos escrituras seguidas no se pisen.
let cola = Promise.resolve();

// Las cuentas demo para cada perfil de consumidor existen siempre.
const hashes = new Map();
function asegurarDemo(datos) {
  // Asegurar cuenta demo legacy
  if (!datos.usuarios.some((u) => u.correo === DEMO.correo)) {
    if (!hashes.has(DEMO.contrasena)) hashes.set(DEMO.contrasena, cifrar(DEMO.contrasena));
    datos.usuarios.push({
      id: 'demo',
      nombre: DEMO.nombre,
      correo: DEMO.correo,
      contrasena: hashes.get(DEMO.contrasena),
      creado: new Date().toISOString(),
      demo: true,
      tipo: 'visitante',
      rol: 'Visitante general',
      materas: [{ ...MATERA_DEMO }]
    });
  }

  // Asegurar cuentas especializadas por consumidor
  for (const c of CUENTAS_DEMO) {
    let u = datos.usuarios.find((x) => x.correo === c.correo);
    if (!hashes.has(c.contrasena)) hashes.set(c.contrasena, cifrar(c.contrasena));
    if (!u) {
      datos.usuarios.push({
        id: `demo-${c.tipo}`,
        nombre: c.nombre,
        correo: c.correo,
        contrasena: hashes.get(c.contrasena),
        creado: new Date().toISOString(),
        demo: true,
        tipo: c.tipo,
        rol: c.rol,
        materas: [{ ...c.matera }]
      });
    } else {
      // Actualizar metadatos si ya existía
      u.demo = true;
      u.tipo = c.tipo;
      u.rol = c.rol;
      if (!u.materas || u.materas.length === 0) {
        u.materas = [{ ...c.matera }];
      }
    }
  }

  return datos;
}

async function leer() {
  try {
    return asegurarDemo(JSON.parse(await readFile(archivo, 'utf8')));
  } catch (e) {
    if (e.code === 'ENOENT') return asegurarDemo({ usuarios: [], sesiones: [] });
    throw e;
  }
}

async function guardar(datos) {
  await mkdir(carpeta, { recursive: true });
  const temporal = `${archivo}.${process.pid}.tmp`;
  await writeFile(temporal, JSON.stringify(datos, null, 2));
  await rename(temporal, archivo);
}

function modificar(cambio) {
  const tarea = cola.then(async () => {
    const datos = await leer();
    const resultado = await cambio(datos);
    await guardar(datos);
    return resultado;
  });
  cola = tarea.catch(() => {});
  return tarea;
}

function cifrar(contrasena, sal = randomBytes(16).toString('hex')) {
  return `${sal}:${scryptSync(contrasena, sal, 64).toString('hex')}`;
}

function coincide(contrasena, guardada) {
  const [sal, hash] = guardada.split(':');
  const esperado = Buffer.from(hash, 'hex');
  const calculado = scryptSync(contrasena, sal, 64);
  return esperado.length === calculado.length && timingSafeEqual(esperado, calculado);
}

function nuevaSesion(datos, usuarioId) {
  const ahora = Date.now();
  datos.sesiones = datos.sesiones.filter((s) => s.expira > ahora);
  const token = randomBytes(32).toString('hex');
  datos.sesiones.push({ token, usuarioId, expira: ahora + DURACION_SESION });
  return token;
}

export const normalizarCorreo = (correo) => correo.trim().toLowerCase();

// Devuelve { token } o { error }.
export function crearUsuario({ nombre, correo, contrasena }) {
  return modificar((datos) => {
    const email = normalizarCorreo(correo);
    if (datos.usuarios.some((u) => u.correo === email)) {
      return { error: 'Ya existe una cuenta con ese correo. Inicia sesión.' };
    }
    const usuario = {
      id: randomBytes(8).toString('hex'),
      nombre: nombre.trim(),
      correo: email,
      contrasena: cifrar(contrasena),
      creado: new Date().toISOString(),
      materas: []
    };
    datos.usuarios.push(usuario);
    return { token: nuevaSesion(datos, usuario.id) };
  });
}

// Devuelve { token } o { error }.
export function iniciarSesion({ correo, contrasena }) {
  return modificar((datos) => {
    const usuario = datos.usuarios.find((u) => u.correo === normalizarCorreo(correo));
    if (!usuario || !coincide(contrasena, usuario.contrasena)) {
      return { error: 'El correo o la contraseña no coinciden.' };
    }
    return { token: nuevaSesion(datos, usuario.id) };
  });
}

// Le da a la cuenta su matera de demostración, si todavía no tiene.
export function agregarMateraDemo(usuarioId) {
  return modificar((datos) => {
    const usuario = datos.usuarios.find((u) => u.id === usuarioId);
    if (usuario && !usuario.materas?.length) usuario.materas = [{ ...MATERA_DEMO }];
  });
}

export function cerrarSesion(token) {
  return modificar((datos) => {
    datos.sesiones = datos.sesiones.filter((s) => s.token !== token);
  });
}

// Usuario dueño de la sesión, sin la contraseña, o null.
export async function usuarioDeSesion(token) {
  if (!token) return null;
  const datos = await leer();
  const sesion = datos.sesiones.find((s) => s.token === token && s.expira > Date.now());
  const usuario = sesion && datos.usuarios.find((u) => u.id === sesion.usuarioId);
  if (!usuario) return null;
  const { contrasena, ...publico } = usuario;
  return publico;
}

export { DURACION_SESION };
