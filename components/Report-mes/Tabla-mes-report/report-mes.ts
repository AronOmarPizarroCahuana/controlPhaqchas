export interface BookingResponse {
    message: string;
    data: BookingData;
    type: string;
  }
  
  export interface BookingData {
    bookings: Booking[];
    fieldTotals: Record<string, number>;
  }
  
  export interface Booking {
    date: string; // Fecha en formato "YYYY-MM-DD"
    fields: FieldData[];
    totalMonth: number;
  }
  
  export interface FieldData {
    field: string; // Nombre del campo
    total: number ; // Total, puede ser número o cadena representando un número
  }
  