import fs from 'fs';
import path from 'path';

// Función para cargar y parsear el contenido del archivo JSON
export function parseFile(filepath) {
  const fullPath = path.resolve(filepath); // Obtener la ruta absoluta
  const fileData = fs.readFileSync(fullPath, 'utf8'); // Leer el contenido del archivo
  return JSON.parse(fileData); // Convertir JSON a objeto
}