# Mati · Landing

Landing del proyecto **Mati**, una matera inteligente con sensores de humedad, pH y luz y una cara digital
estilo tamagotchi que muestra cómo está la planta.

Proyecto de la clase de **Emprendimiento**, Universidad Tecnológica de Pereira.

## Equipo

- Eider Alejandro Díaz Castañeda
- Miguel Ángel Arcila Gómez
- Juan Camilo Castro Montoya
- Diego Alejandro Giraldo A.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura

```
app/
  layout.js      metadatos y fuentes (Bricolage Grotesque, Nunito Sans, JetBrains Mono)
  page.js        la landing completa, armada con los datos de lib/contenido.js
  globals.css    todos los estilos
components/
  Cara.js        las cinco expresiones de la matera en SVG
  Matera.js      la matera del hero en SVG
lib/
  contenido.js   TEXTOS Y DATOS: cambia aquí, no en los componentes
```

Para cambiar un texto, un paso o una fila de la tabla de competencia, edita `lib/contenido.js`.

## Despliegue

El `Dockerfile` usa el build `standalone` de Next y expone el puerto **3000**.

En Coolify: crear una aplicación desde este repositorio, build pack **Dockerfile**, puerto expuesto `3000`
y el dominio deseado. La versión HTML estática anterior está desplegada en https://mati.cerebria.co

## Notas

Los datos de la tabla de comparación salen de la matriz de competencia del proyecto
(`Matriz-Competencias/Matriz_de_competencia-plantas_completa.xlsx`).
