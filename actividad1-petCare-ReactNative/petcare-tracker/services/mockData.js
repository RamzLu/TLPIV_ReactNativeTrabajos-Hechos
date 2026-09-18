// Datos estáticos iniciales de mascotas para pruebas en la app
export const mockPets = [
  {
    id: "p1",
    name: "Milo",
    species: "Perro",
    breed: "Golden Retriever",
    age: "3 años",
    weight: "30 kg",
    photoUri:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p2",
    name: "Luna",
    species: "Gato",
    breed: "Siamés",
    age: "2 años",
    weight: "4.5 kg",
    photoUri:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p3",
    name: "Rocky",
    species: "Perro",
    breed: "Bulldog Francés",
    age: "1 año",
    weight: "12 kg",
    photoUri:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
  },
];

// Datos estáticos iniciales de atenciones, vacunas y turnos veterinarios
export const mockRecords = [
  {
    id: "r1",
    petId: "p1",
    petName: "Milo",
    type: "Vacuna", // Opciones: 'Vacuna' | 'Desparasitación' | 'Consulta' | 'Control'
    title: "Vacuna Antirrábica Anual",
    date: "2026-08-20", // Próximo turno (futuro)
    veterinarian: "Dra. Sofía Martínez - Clínica San Roque",
    appliedProduct: "Rabisin / Dosis 1ml",
    cost: 15000,
    status: "Pendiente", // 'Pendiente' | 'Realizado'
    notes:
      "Recordar llevar libreta sanitaria física para sellar el comprobante.",
  },
  {
    id: "r2",
    petId: "p2",
    petName: "Luna",
    type: "Desparasitación",
    title: "Desparasitación Interna Semestral",
    date: "2026-07-15", // Registro pasado
    veterinarian: "Dr. Martín Gómez - Veterinaria Central",
    appliedProduct: "Total F - 1 comprimido palatable",
    cost: 8500,
    status: "Realizado",
    notes: "Toleró bien la pastilla. Próxima dosis recomendada en 6 meses.",
  },
  {
    id: "r3",
    petId: "p1",
    petName: "Milo",
    type: "Consulta",
    title: "Revisión General y Control de Peso",
    date: "2026-06-10",
    veterinarian: "Dra. Sofía Martínez - Clínica San Roque",
    appliedProduct: "N/A",
    cost: 12000,
    status: "Realizado",
    notes: "Excelente estado dental y articular. Se mantiene en su peso ideal.",
  },
  {
    id: "r4",
    petId: "p3",
    petName: "Rocky",
    type: "Control",
    title: "Chequeo Respiratorio Preventivo",
    date: "2026-08-28", // Próximo turno
    veterinarian: "Dra. Camila Morales - VetCare Belgrano",
    appliedProduct: "N/A",
    cost: 14000,
    status: "Pendiente",
    notes: "Control estacional por alergias y respiración braquicéfala.",
  },
];
