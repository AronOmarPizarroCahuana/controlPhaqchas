import React, { useState, useEffect } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Sport } from '../../app/Interface/sport';
import {API_URL} from "../../config";
import Swal from "sweetalert2";

interface ReservaMProps {
  field: string;
  timeStart: string; // Este es el tiempo, por ejemplo, "08:00 AM - 09:00 AM"
  timeEnd: string;
  day: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave:  (data: {
    user_id: string;
    yape: number;
    price: number;
    field_id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    sport_id: number;
    total:number;
  }) => void
  initialData: {
    user_id: string;
    yape: number;
    sport_id:string;
  };
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  dni: string;
}

export default function ReservaM({
  field,
  timeStart,
  timeEnd,
  day,
  isOpen,
  onClose,
  onSave,
  initialData,
}: ReservaMProps) {
  const [user_id, setUser_id] = useState(initialData.user_id);
  const [yape, setYape] = useState(initialData.yape);
  const [sports, setSports] = useState<Sport[]>([]);
  const [total, setTotal] = useState(0); // Estado para el total
  const [phoneError, setPhoneError] = useState('');
  const formatTime = (time: string) => {
    const date = new Date('1970-01-01 ' + time);  // Usar una fecha arbitraria para convertir la hora
    return date.toTimeString().substring(0, 5);   // Extraer la hora en formato 24 horas (HH:mm)
  };
  
    const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [price, setPrice] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
 
  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/customer`);
        const data = await response.json();
        if (Array.isArray(data?.data)) {
          setCustomers(data.data);
          setFilteredCustomers(data.data);
          console.log(data)
        } else {
          console.error("Expected 'data' property to be an array, but got:", data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSports = async () => {
      try {
        const response = await fetch(`${API_URL}/sport`);
        const data = await response.json();
    
        const sportsList: Sport[] = data.data || [];
        setSports(sportsList);
    
        if (initialData.sport_id) {
          const selectedSport = sportsList.find((sport: Sport) => sport.id === Number(initialData.sport_id));
          setSelectedSportId(Number(initialData.sport_id));
    
          if (selectedSport) {
            // Obtener la hora actual para determinar si es mañana o tarde
            const newTimeEnd = formatTime(timeEnd);
            const endHour = parseInt(newTimeEnd.split(':')[0], 10);
            const isMorning = endHour <= 15;
    
            // Calcular el precio basado en el horario
            const total1 = isMorning ? selectedSport.price_morning : selectedSport.price_evening;
            setTotal(total1 || 0);
            setPrice(total1 ? total1 - yape : 0); // Si total1 es válido, calcula price
          }
        }
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };
    fetchCustomers();
    fetchSports();

  }, []);

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sportId = Number(e.target.value);
    setSelectedSportId(sportId);
    const selectedSport = sports.find((s) => s.id === sportId);
  
    if (selectedSport) {
      // Convierte timeStart a una hora de 24 horas
      const newtimeend=formatTime(timeEnd)
      const endHour = parseInt(newtimeend.split(':')[0], 10);
      console.log(endHour)
      const isMorning = endHour < 15;  // Consideramos 'mañana' antes de las 15:00
      const total1 = isMorning ? selectedSport.price_morning : selectedSport.price_evening;
      setTotal(total1 || 0);
      setPrice(total1 ? total1 - yape : 0);  // Si total1 es válido, calcula price
    }
  };

  const handleComplete = async () => {
    if (yape < 0) {
      console.log('El monto de Yape no puede ser negativo.');
      return;
    }
const start_time=formatTime(timeStart)
const end_time=formatTime(timeEnd)

    const requestData = {
      user_id: user_id,
      field_id: Number(field),
      booking_date: day.toISOString().split('T')[0],
      start_time: start_time??"",
      end_time: end_time ??"",
      price: 0,
      yape: price,
      sport_id: selectedSportId ?? 1,
      total:price,
    };
    console.log(requestData)

    try {
      const response = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Error al guardar la reserva: `,errorData);
        return;
      }
      console.log(requestData)
      onSave(requestData)
      onClose();
    } catch (error) {
      console.log(requestData)
      console.log(`Hubo un problema: ${error}`);
    }
  };

  // Fetch sports
  const fetchSports = async () => {
    try {
      const response = await fetch(`${API_URL}/sport`);
      const data = await response.json();
      if (Array.isArray(data?.data)) {
        setSports(data.data);
      } else {
        console.error("Expected 'data' property to be an array, but got:", data);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  // useEffect to call both functions
  useEffect(() => {
    fetchSports();
  }, [field, timeStart]);

 


  
  

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setPhoneSearch(phoneValue);
   

    if (phoneValue.trim() === '') {
      setFilteredCustomers(customers); // Show all customers
      setSelectedCustomer(null); // Clear selected customer
      setUser_id(''); // Clear user id
    } else {
      // Reset selected customer if phone number changes
      if (selectedCustomer?.phone !== phoneValue) {
        setSelectedCustomer(null);
        setUser_id('');
      }
      setFilteredCustomers(
        customers.filter((customer) => customer.phone.startsWith(phoneValue))
      );
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setUser_id(customer.id.toString());
    setPhoneSearch(customer.phone);
    setFilteredCustomers([]);
  };

  const handleSubmit = async () => {
    if (yape < 0) {
      console.log('El monto de Yape no puede ser negativo.');
      return;
    }
const start_time=formatTime(timeStart)
const end_time=formatTime(timeEnd)

    const requestData = {
      user_id: user_id,
      field_id: Number(field),
      booking_date: day.toISOString().split('T')[0],
      start_time: start_time??"",
      end_time: end_time ??"",
      price: 0,
      yape: yape,
      sport_id: selectedSportId ?? 1,
      total:price+yape,
    };
    console.log(requestData)

    try {
      const response = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes('user')) {
          setPhoneError('El número de celular es obligatorio');
        } else if(errorData.message?.includes('booking')) {
          Swal.fire({
            title: "Datos incorrectos!",
            text: "Reserva en una fecha actual o posterior, por favor",
            icon: "error",
          });

        } else

        console.log(`Error al guardar la reserva: `,errorData);
        return;
      }
      setPhoneError(''); // Limpia el error si la respuesta es exitosa

      console.log(requestData)
      onSave(requestData)
      onClose();
    } catch (error) {
      console.log(requestData)
      console.log(`Hubo un problema: ${error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h3 className="text-xl font-bold mb-3">Reserva </h3>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">Hora: {timeStart} - {timeEnd}</p>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">Día: {day.toDateString()}</p>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">Precio de la cancha: {total}</p>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">cancha: campo {field}</p>

          <div className="flex justify-between items-center mb-1 mt-2 sm:mt-0">
          <div className="relative flex flex-col w-2/3 ">
  <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-23">
    Buscar por teléfono
  </label>
  <Input
    id="phone"
    type="text"
    value={phoneSearch}
    onChange={handlePhoneSearch}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    autoComplete="off" // Esto evita la lista por defecto del navegador
  />
   <p className={`absolute text-red-500 mt-14 text-[10px] ${phoneError ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 mt-1`}>
    {phoneError || ' '}
  </p>

  {phoneSearch && !loading && filteredCustomers.length > 0 && (
    <ul className="absolute left-0 w-full max-h-40 overflow-auto border bg-white mt-16 z-[9999] rounded-md shadow-lg">
      {filteredCustomers.map((customer) => (
        <li
          key={customer.id}
          onClick={() => handleCustomerSelect(customer)}
          className="cursor-pointer p-2 hover:bg-gray-100"
        >
          {customer.phone}
        </li>
      ))}
    </ul>
  )}
</div>

{/* 
          <div className="flex flex-col sm:w-2/3  mt-5 ml-7">
            <button className="bg-[#3581F2] w-full  h-9 text-white py-1 sm:py-2 p-2 rounded-md hover:bg-blue-800 transition duration-200 flex items-center text-[10px] sm:text-[15px] ">
             
              <svg className="w-3 sm:w-4 h-6 sm:mr-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14" />
              </svg>
              Nuevo cliente
            </button>
          </div>  */}

            </div>

          
          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <Input
              value={selectedCustomer?.name || ''}
              disabled
              className="mt-1 w-full p-2 border bg-gray-100"
            />
            <label className="block text-sm font-medium text-gray-700">DNI</label>
            <Input
              value={selectedCustomer?.dni || ''}
              disabled
              className="mt-1 w-full p-2 border bg-gray-100"
            />
          </div>

        

          <div className="flex justify-between mb-2 sm:mb-4">
            {/* 
            <div>
              <label htmlFor="price" className="text-sm font-medium text-gray-700">Precio</label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                className="mt-1 p-2 w-20"
              />
            </div>
            */}
            <div >
              <label htmlFor="yape" className="block text-sm font-medium text-gray-700">Yape</label>
              <Input
                id="yape"
                value={yape}
                onChange={(e) => { const newYape = Number(e.target.value);  // Convierte el valor a número
                  setYape(newYape);
                }}
                type="number"
                 min="0"
                 max={price}
                className="mt-1 p-2 w-48"
              />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700">Deporte</label>
            <select
              onChange={handleSportChange}
              value={selectedSportId ?? ''}
              className="mt-1  p-2 w-full border bg-white"
            >
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="flex justify-between items-center ">

          <div>
              <label htmlFor="yape" className="text-sm font-medium text-gray-700 mb-2">Monto restante</label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
            <div className="flex flex-col sm:w-2/3 mt-6 ml-7">
            <button onClick={handleComplete}  className="bg-[#3581F2] text-white py-1 h-9 sm:py-2 px-5 rounded-md hover:bg-blue-800 transition duration-200 flex items-center text-[10px] sm:text-[15px]">
              Completar pago
            </button>
          </div>
          </div>


          <div className="mb-4 mt-6">
          <Button onClick={handleSubmit} className='mt-1 w-full p-2 border bg-[#3581F2]'>Guardar</Button>
          <Button onClick={onClose} className="mt-1 w-full p-2 border bg-[#A9A8A5]">Cerrar</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
