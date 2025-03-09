export interface PublishedItem {
    id?: string;
    title?: string;
    description?: string;
    image: File | null;  // Cambiar de string a File
    status?: boolean;
    imageUrl?: string; // Agregar esta línea

  }
  