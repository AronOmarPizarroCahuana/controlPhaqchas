export interface Sport {
    id?: number;
    name: string;
    image?: File | null;  // Cambiar de string a File
    description?:string;
    price_morning:number;
    price_evening:number;
  }