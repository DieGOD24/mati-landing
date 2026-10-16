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
    titulo: 'Pago único',
    texto: 'Compras la matera y es tuya. Sin mensualidades, sin cápsulas que haya que estar comprando.'
  },
  {
    titulo: 'Por piezas',
    texto: 'Base, sensor y tanque se conectan como un lego. Si quieres ampliarla o cambiar una pieza, compras solo esa.'
  },
  {
    titulo: 'De ahí vivimos',
    texto: 'Nuestro ingreso está en la venta de las materas y de sus repuestos, como la sonda de pH, que se desgasta con el uso.'
  }
];

export const caras = [
  { id: 'sedienta', nombre: 'Sedienta', regla: 'Humedad bajo el mínimo' },
  { id: 'ahogada', nombre: 'Ahogada', regla: 'Demasiada agua' },
  { id: 'sueno', nombre: 'Con sueño', regla: 'Le faltó luz hoy' },
  { id: 'mareada', nombre: 'Mareada', regla: 'pH fuera de rango' },
  { id: 'feliz', nombre: 'Feliz', regla: 'Todo en su rango' }
];
