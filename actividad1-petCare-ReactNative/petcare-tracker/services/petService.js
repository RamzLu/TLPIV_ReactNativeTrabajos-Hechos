import { mockPets } from "./mockData";
import { deleteRecordsByPetId } from "./recordService";

// Latencia simulada para las respuestas asíncronas (800ms)
const SIMULATED_DELAY_MS = 800;

// Estado mutable en memoria para la sesión activa
let petsState = [...mockPets];

/**
 * Obtiene todas las mascotas registradas.
 * @returns {Promise<Array>} Lista de mascotas.
 */
export const getPets = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...petsState]);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Busca una mascota específica por su ID.
 * @param {string} petId - ID de la mascota buscada.
 * @returns {Promise<Object|null>} Mascota encontrada o null.
 */
export const getPetById = (petId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pet = petsState.find((p) => p.id === petId) || null;
      resolve(pet ? { ...pet } : null);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Registra una nueva mascota.
 * @param {Object} newPetData - Datos de la mascota creada.
 * @returns {Promise<Object>} Mascota creada.
 */
export const addPet = (newPetData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const createdPet = {
        id: `p${Date.now()}`,
        ...newPetData,
      };
      petsState = [createdPet, ...petsState];
      resolve(createdPet);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * Actualiza los datos de una mascota existente.
 * @param {string} petId - ID de la mascota a modificar.
 * @param {Object} updatedData - Nuevos datos a fusionar.
 * @returns {Promise<Object>} Mascota actualizada.
 */
export const updatePet = (petId, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const petIndex = petsState.findIndex((p) => p.id === petId);
      if (petIndex === -1) {
        reject(new Error("Mascota no encontrada"));
        return;
      }

      const updatedPet = {
        ...petsState[petIndex],
        ...updatedData,
        id: petId,
      };

      petsState[petIndex] = updatedPet;
      resolve(updatedPet);
    }, SIMULATED_DELAY_MS);
  });
};

/**
 * ELIMINACIÓN EN CASCADA (Mascota + Registros Médicos):
 * 1. Verifica la existencia de la mascota en el estado.
 * 2. Borra en cascada los registros médicos dependientes invocando deleteRecordsByPetId.
 * 3. Remueve la mascota de la colección petsState tras la latencia simulada.
 * @param {string} petId - ID de la mascota a eliminar.
 * @returns {Promise<boolean>} true si se completó la eliminación.
 */
export const deletePet = (petId) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const petExists = petsState.some((p) => p.id === petId);
      if (!petExists) {
        reject(new Error("Mascota no encontrada para eliminar"));
        return;
      }

      // Paso 1: Cascada - Limpiar registros médicos asociados en recordService
      await deleteRecordsByPetId(petId);

      // Paso 2: Remover la mascota de la lista principal
      petsState = petsState.filter((p) => p.id !== petId);

      resolve(true);
    }, SIMULATED_DELAY_MS);
  });
};
