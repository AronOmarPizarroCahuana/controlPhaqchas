export interface Field {
    id?: string;
    name: string;
    description: string;
    image: File | null;  // Cambiar de string a File
    status?: boolean;
    imageUrl?: string; // Agregar esta línea

  }
  