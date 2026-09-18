import { mockRecords } from "./mockData";

// Constante de latencia para simular el tiempo de respuesta de red (800ms)
const SIMULATED_DELAY_MS = 800;

// Estado mutable en memoria para persistir registros creados o eliminados en runtime
let recordsState = [...mockRecords];

/**
 * Obtiene la lista completa de registros médicos y turnos.
 * @returns {Promise<Array>} Lista de registros médicos.
 */
export const getRecords = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...recordsState]);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Obtiene el detalle completo de un registro por su ID.
 * @param {string} recordId - ID del registro a consultar.
 * @returns {Promise<Object|null>} Objeto de la ficha médica o null si no se encuentra.
 */
export const getRecordById = (recordId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = recordsState.find((r) => r.id === recordId) || null;
      resolve(record ? { ...record } : null);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Filtra los registros correspondientes a una sola mascota.
 * @param {string} petId - ID de la mascota.
 * @returns {Promise<Array>} Lista de registros de esa mascota.
 */
export const getRecordsByPetId = (petId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = recordsState.filter((r) => r.petId === petId);
      resolve(filtered);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Registra una nueva consulta o vacuna en la lista.
 * @param {Object} newRecordData - Datos del formulario.
 * @returns {Promise<Object>} Registro médico creado.
 */
export const addRecord = (newRecordData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const createdRecord = {
        id: `r${Date.now()}`,
        status: newRecordData.status || "Pendiente",
        ...newRecordData,
      };
      recordsState = [createdRecord, ...recordsState];
      resolve(createdRecord);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * ELIMINACIÓN EN CASCADA:
 * Remueve del estado todos los turnos, vacunas y consultas pertenecientes a una mascota.
 * Esto asegura que no queden 'registros huérfanos' apuntando a una mascota inexistente.
 * @param {string} petId - ID de la mascota eliminada.
 * @returns {Promise<boolean>} true cuando la operación finaliza con éxito.
 */
export const deleteRecordsByPetId = (petId) => {
  return new Promise((resolve) => {
    // Filtramos la colección manteniendo solo los registros de OTRAS mascotas
    recordsState = recordsState.filter((record) => record.petId !== petId);
    resolve(true);
  });
};
