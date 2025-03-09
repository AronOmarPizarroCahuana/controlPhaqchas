export interface BookingDetails {
    id: number;
    id_user: string;
    user_name?: string;
    yape: number;
    price: number;
    total?: number;
    id_sport?:string;
  }
  
 export interface Day {
    day_name: string;
    status?: 'disponible' | 'reservado' | 'completado' | 'en espera'; // Ajusta los estados posibles según sea necesario.
    booking_details?: BookingDetails | null;
  }
  
 export interface HourRange {
    start: string; // Hora de inicio en formato de cadena, por ejemplo, "08:00 AM".
    end: string;   // Hora de fin en formato de cadena, por ejemplo, "09:00 AM".
  }
  
 export interface Reservation {
    hour_range: HourRange;
    days: Day[];
  }
  
  

    /*
    Lunes_user_name: string;
    Lunes_status: string;
    Lunes_yape: number;
    Lunes_total: number;
    Martes_status: string;
    Martes_user_name: string;
    Martes_yape: number;
    Martes_total: number;
    Miercoles_status: string;
    Miercoles_user_name: string;
    Miercoles_yape: number;
    Miercoles_total: number;
    Jueves_status: string;
    Jueves_user_name: string;
    Jueves_yape: number;
    Jueves_total: number;
    Viernes_status: string;
    Viernes_user_name: string;
    Viernes_yape: number;
    Viernes_total: number;
    Sabado_status: string;
    Sabado_user_name: string;
    Sabado_yape: number;
    Sabado_total: number;
    Domingo_status: string;
    Domingo_user_name: string;
    Domingo_yape: number;
    Domingo_total: number;
    */
