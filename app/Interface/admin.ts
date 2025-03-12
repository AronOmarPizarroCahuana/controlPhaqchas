export interface Admin {
    id?: number;
    name: string;
    surname: string;
    dni: string;
    phone: string;
    address: string;
    status: number;
    birth_date: string;
    roles: { name: string}[];
  }