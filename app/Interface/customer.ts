export interface Customer {
    id?: number;
    name: string;
    surname: string;
    email_verified_at?: string | null;
    dni: string;
    phone: string;
    address: string;
    status?: number;
    birth_date?: string | null;
    faults?: number;
    rol_id?: number;
    
  }