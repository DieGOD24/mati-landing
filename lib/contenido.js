// Todo el contenido de la landing en un solo lugar, para que el equipo
// pueda cambiar textos sin tocar los componentes.

export const equipo = [
  { iniciales: 'ED', nombre: 'Eider Alejandro Díaz Castañeda' },
  { iniciales: 'MA', nombre: 'Miguel Ángel Arcila Gómez' },
  { iniciales: 'JC', nombre: 'Juan Camilo Castro Montoya' },
  { iniciales: 'DG', nombre: 'Diego Alejandro Giraldo A.' }
];

export const problemas = [
  {
    titulo: 'Se riega de más',
    texto: 'La causa número uno de muerte en plantas de interior. Por fuera se ve igual que la sed.'
  },
  {
    titulo: 'Le falta luz',
    texto: 'Un rincón bonito para nosotros puede ser una cueva para ella.'
  },
  {
    titulo: 'El suelo se acidifica',
    texto: 'El pH cambia con el agua y el abono. Es invisible, y es lo que la enferma aunque la riegues bien.'
  }
];

export const sensores = [
  {
    clase: 's-water',
    etiqueta: 'Sensor 1',
    titulo: 'Humedad del suelo',
    texto: 'Sabe cuándo la tierra se secó de verdad, no cuando se ve seca por encima.'
  },
  {
    clase: 's-ph',
    etiqueta: 'Sensor 2',
    titulo: 'pH del suelo',
    texto: 'El dato que ninguna matera del mercado mide, y el que explica las hojas amarillas.',
    destacado: 'Lo que nadie mide'
  },
  {
    clase: 's-sun',
    etiqueta: 'Sensor 3',
    titulo: 'Luz recibida',
    texto: 'Cuenta las horas de buena luz del día y avisa si hay que moverla de sitio.'
  },
  {
    clase: 's-leaf',
    etiqueta: 'Y además',
    titulo: 'Riega sola',
    texto: 'Si la humedad baja del mínimo, la bomba se enciende unos segundos. También desde la app.'
  }
];

export const pasos = [
  {
    titulo: 'Enchufa la matera',
    texto: 'Cualquier cargador de celular sirve. La cara parpadea cuando está lista.'
  },
  {
    titulo: 'Dile cuál es tu planta',
    texto: 'Eliges la especie en la app y la matera toma sus rangos de humedad, pH y luz.'
  },
  {
    titulo: 'Ya está',
    texto: 'Mide sola cada diez minutos y te escribe al celular solo cuando hace falta.'
  }
];

// Comparación tomada de la matriz de competencia del proyecto.
export const competidores = ['Mati', 'Xiaomi Flower Care', 'Parrot Pot', 'Lua'];

export const comparacion = [
  { funcionalidad: 'Humedad del suelo', valores: [true, true, true, true] },
  { funcionalidad: 'pH del suelo', valores: [true, false, false, false], resaltar: true },
  { funcionalidad: 'Luz', valores: [true, true, true, true] },
  { funcionalidad: 'Cara que muestra el estado', valores: [true, false, false, true] },
  { funcionalidad: 'Alertas en el celular', valores: [true, true, true, false] },
  { funcionalidad: 'Historial y gráficas', valores: [true, true, true, false] },
  { funcionalidad: 'WiFi sin aparato extra', valores: [true, false, true, false] },
  { funcionalidad: 'Riego automático', valores: [true, false, true, false] }
];

export const modelo = [
  {
    titulo: 'Pago único · $185.000 COP',
    etiqueta: 'Kit Completo',
    texto: 'Compras la matera con sus 3 sensores, display y bomba incluida. Sin mensualidades, sin suscripciones obligatorias.'
  },
  {
    titulo: 'Por piezas y módulos',
    etiqueta: 'Modular Lego',
    texto: 'Base, sensor y tanque se conectan como un lego. Si quieres ampliar capacidad o cambiar una maceta, compras solo esa pieza.'
  },
  {
    titulo: 'Repuestos y accesorios',
    etiqueta: 'Sostenibilidad',
    texto: 'Nuestro modelo de ingresos se basa en el hardware y consumibles como sondas de pH calibradas ($35.000 COP) y nutrientes.'
  }
];

export const caras = [
  { id: 'sedienta', nombre: 'Sedienta', regla: 'Humedad bajo el mínimo' },
  { id: 'ahogada', nombre: 'Ahogada', regla: 'Demasiada agua' },
  { id: 'sueno', nombre: 'Con sueño', regla: 'Le faltó luz hoy' },
  { id: 'mareada', nombre: 'Mareada', regla: 'pH fuera de rango' },
  { id: 'feliz', nombre: 'Feliz', regla: 'Todo en su rango' }
];

// Llamado a la acción: lleva al registro y al ingreso de la app web,
// que viven en este mismo sitio (app/registro y app/ingresar).
export const app = {
  registro: '/registro',
  ingreso: '/ingresar'
};

// Cuentas demo preparadas para diferentes perfiles de consumidor según el análisis NED.
export const CUENTAS_DEMO = [
  {
    tipo: 'viajero',
    rol: 'Profesional Urbano / Viajero',
    icono: '✈️',
    nombre: 'Carlos Méndez',
    correo: 'viajero@mati.cerebria.co',
    contrasena: 'viajero123',
    planta: 'Lulú (Potus en Sala)',
    historia: 'Pasa semanas fuera de casa por trabajo. La matera riega sola y le avisa si el tanque necesita agua.',
    destacado: 'Riego autónomo y monitoreo a distancia',
    matera: {
      id: 'lulu-viajero',
      nombre: 'Lulú',
      especie: 'potus',
      ubicacion: 'Sala',
      codigo: 'MT-0042',
      escenario: 'viajero'
    }
  },
  {
    tipo: 'familia',
    rol: 'Familia con Niños',
    icono: '👨‍👩‍👧',
    nombre: 'Familia Gómez',
    correo: 'familia@mati.cerebria.co',
    contrasena: 'familia123',
    planta: 'Panchito (Suculenta en cuarto infantil)',
    historia: 'Sus hijos aprenden la responsabilidad de cuidar una planta gracias a las expresiones tamagotchi y la racha de días felices.',
    destacado: 'Vínculo emocional, gamificación y carita Tamagotchi',
    matera: {
      id: 'panchito-familia',
      nombre: 'Panchito',
      especie: 'suculenta',
      ubicacion: 'Habitación niños',
      codigo: 'MT-0105',
      escenario: 'familia'
    }
  },
  {
    tipo: 'botanica',
    rol: 'Plant Lover / Coleccionista',
    icono: '🔬',
    nombre: 'Valentina Rivas',
    correo: 'botanica@mati.cerebria.co',
    contrasena: 'botanica123',
    planta: 'Aura (Monstera en Estudio)',
    historia: 'Monstera con suelo acidificado (pH 5.2). La app muestra la alerta de pH que ninguna otra matera tiene y guía la corrección.',
    destacado: 'Medición de pH única en el mercado',
    matera: {
      id: 'aura-botanica',
      nombre: 'Aura',
      especie: 'monstera',
      ubicacion: 'Estudio con ventanal',
      codigo: 'MT-0089',
      escenario: 'botanica'
    }
  },
  {
    tipo: 'negocio',
    rol: 'Oficina / Café Local',
    icono: '☕',
    nombre: 'Café Macondo',
    correo: 'negocio@mati.cerebria.co',
    contrasena: 'negocio123',
    planta: 'Verde (Ficus en Recepción)',
    historia: 'Espacio comercial sin jardinero dedicado. Evita el típico encharcamiento por riegos dobles descoordinados.',
    destacado: 'Prevención de encharcamiento y bajo mantenimiento',
    matera: {
      id: 'verde-negocio',
      nombre: 'Verde',
      especie: 'ficus',
      ubicacion: 'Recepción',
      codigo: 'MT-0012',
      escenario: 'negocio'
    }
  }
];

// Cuenta pública predeterminada (compatible con enlaces anteriores)
export const DEMO = {
  correo: 'demo@mati.cerebria.co',
  contrasena: 'demo1234',
  nombre: 'Visitante'
};

export const llamado = {
  etiqueta: 'Pruébala ya',
  titulo: 'Tu planta está a una cuenta de empezar a hablar',
  texto:
    'Crea tu cuenta en la app web de Mati, conecta tu matera y elige qué planta vive en ella. Desde ahí ves su carita, el historial de humedad, pH y luz, y recibes los avisos cuando necesite algo.',
  pasos: ['Crea tu cuenta', 'Agrega tu matera', 'Elige tu planta'],
  nota: 'Gratis. Solo pedimos nombre, correo y contraseña.',
  demo: '¿Solo quieres mirar? Entra a la cuenta demo, con una matera simulada lista para probar.'
};
