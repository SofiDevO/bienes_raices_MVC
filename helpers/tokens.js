// Función para generar un ID único
const generateId = () =>
    // Genera una cadena aleatoria en base 32 y elimina los dos primeros caracteres (generalmente "0.")
    Math.random().toString(32).substring(2)
    // Añade la representación en base 32 del timestamp actual para asegurar unicidad
    + Date.now().toString(32);

  // Exportamos la función generateId para que pueda ser utilizada en otras partes de la aplicación
  export {
    generateId,
  };
