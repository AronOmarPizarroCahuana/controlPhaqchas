import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Sport } from '../../app/Interface/sport';
import {API_URL} from "../../config";
import Swal from "sweetalert2";

interface ReservaMProps {
  field: string;
  timeStart: string;
  timeEnd: string;
  day: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    user_id: string;
    start_time: string;
    end_time: string;
    booking_date: string;
    yape: number;
    price: number;
    sport_id: number;
  }) => void;
  initialData: {
    booking_id:number;
    user_id: string;
    yape: number;
    price:number;
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
  onClose,
  onSave,
  initialData,
}: ReservaMProps) {
  const [user_id, setUser_id] = useState(initialData.user_id || '');
  const [yape, setYape] = useState(initialData.yape || 0);
  const [sports, setSports] = useState<Sport[]>([]);
  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState(0);
  const [phoneError, setPhoneError] = useState('');

  //const [booking_id, setbooking_id] = useState(initialData.booking_id);
  const formatTime = (time: string) => {
    const date = new Date('1970-01-01 ' + time);  // Usar una fecha arbitraria para convertir la hora
    return date.toTimeString().substring(0, 5);   // Extraer la hora en formato 24 horas (HH:mm)
  };
  
  
   
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/customer`);
        const data = await response.json();
        setCustomers(data.data || []);
        setFilteredCustomers(data.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    interface Sport {
      id: number;
      name: string;
      price: number;
      price_morning:number;
      price_evening:number
    }
 
  
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
            const isMorning = endHour <= 16;
    
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

  useEffect(() => {
    // Si se pasa un user_id, buscamos el cliente correspondiente.
    if (user_id) {
      const customer = customers.find((c) => c.id === parseInt(user_id, 10));  // Convertimos user_id a número
      
      if (customer) {
        setSelectedCustomer(customer);  // Asigna el cliente seleccionado
        setPhoneSearch(customer.phone);  // Rellena el campo de búsqueda con el teléfono
      }
    }
  }, [customers, user_id]);  // Solo se ejecuta cuando cambia el user_id o customers
  
  useEffect(() => {
    if (sports.length > 0) {
      const firstSport = sports[0];
      if (firstSport.id !== undefined) { // Asegurar que id existe
        setSelectedSportId(firstSport.id);
        handleSportChange({ target: { value: String(firstSport.id) } } as React.ChangeEvent<HTMLSelectElement>);
      }
    }
  }, [sports]);
  
  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneSearch(value);
    if (value) {
      setFilteredCustomers(customers.filter((c) => c.phone.startsWith(value)));
    } else {
      setFilteredCustomers(customers);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);  // Establece el cliente seleccionado
    setUser_id(customer.id.toString());  // Asigna el id del cliente
    setPhoneSearch(customer.phone);  // Rellena el campo de búsqueda
    setFilteredCustomers([]);  // Limpiar la lista de filtrados
  };

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sportId = Number(e.target.value);
    setSelectedSportId(sportId);
    const selectedSport = sports.find((s) => s.id === sportId);
  
    if (selectedSport) {
      // Convierte timeStart a una hora de 24 horas
      const newtimeend=formatTime(timeEnd)
      const endHour = parseInt(newtimeend.split(':')[0], 10);
      const isMorning = endHour <= 16;  // Consideramos 'mañana' antes de las 15:00
      const total1 = isMorning ? selectedSport.price_morning : selectedSport.price_evening;
      setTotal(total1 || 0);
      setPrice(total1 ? total1 - yape : 0);  // Si total1 es válido, calcula price
    }
  };
  
const handleComplete = async () => {
  const requestPayment={
    yape:price
  }
  try {
    const response = await fetch(`${API_URL}/completePayment/${initialData.booking_id}`, { // Usa initialData.booking_id
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayment),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Error al guardar el yape');
    }
    const requestPayment2={
      yape:price,
      user_id,
    start_time:"",
    end_time:"",
    booking_date:"",
    price:0,
    sport_id:0,
    }
    onSave(requestPayment2)
    onClose(); 
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al guardar el yape');
  }
}

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedSportId) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
  
    const requestData = {
      user_id: user_id,
      field_id: field,
      booking_date: day.toISOString().split('T')[0], 
      start_time: formatTime(timeStart),
      end_time: formatTime(timeEnd),
     yape,
    price,
      sport_id: selectedSportId,
    };
    const requestPayment={
      yape:yape-initialData.yape
    }
    if(yape-initialData.yape!=0){
    try {
      const response = await fetch(`${API_URL}/completePayment/${initialData.booking_id}`, { // Usa initialData.booking_id
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayment),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes('user')) {
          setPhoneError('El número de celular es obligatorio');
        } else {
          setPhoneError('');
        }
        console.log(`Error al guardar la reserva: `,errorData);
        return;
      }
  
      onClose(); 
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al guardar el yape');
    }
  }
    try {
      const response = await fetch(`${API_URL}/booking/${initialData.booking_id}`, { // Usa initialData.booking_id
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al guardar la reserva');
      }
      onSave(requestData);

      alert('Reserva guardada correctamente');
      
      onClose(); 
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al guardar la reserva.');
    }
  };
  
  
 

  const deleteReserva = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Esta seguro que quiere cancelar?",
        text: "Al cancelar la reserva esta se eliminará permanentemente!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",

      });
  
      if (result.isConfirmed) {
        const response = await fetch(`${API_URL}/booking/${initialData.booking_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Error al cancelar la reserva');
        }
  
        const requestPayment2 = {
          yape: price,
          user_id,
          start_time: "",
          end_time: "",
          booking_date: "",
          price: 0,
          sport_id: 0,
        };
  
        onSave(requestPayment2);
        onClose(); // Cerrar el modal después de cancelar
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al cancelar la reserva.');
    }
  };
  

  return (
    <Dialog>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
  <button 
    className="absolute -top-2 right-2 text-[40px] text-gray-600 bg-transparent hover:text-gray-800"
    onClick={onClose}
  >
    &times;
  </button>


          <h3 className="text-xl font-bold mb-3">Reserva </h3>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">Hora: {timeStart} - {timeEnd}</p>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">Día: {day.toISOString().split('T')[0]}</p>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">Precio de la cancha: {total}</p>
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm text-gray-600">cancha: campo {field}</p>

          <div className="flex justify-between items-center mb-1 -mt-2 sm:mt-0 ">
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
   <p className={`absolute text-red-500 mt-16 text-[10px] ${phoneError ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 mt-1`}>
    {phoneError || ' '}
  </p>
          {phoneSearch && filteredCustomers.length > 0 && phoneSearch.length < 9 && (
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
          <div className="flex flex-col sm:w-2/3 mt-7 ml-7">
            <button  className="bg-[#3581F2] w-full  h-9 text-white py-1 sm:py-2 p-2 rounded-md hover:bg-blue-800 transition duration-200 flex items-center text-[10px] sm:text-[15px] ">
              <svg className="w-3 sm:w-4 h-6 sm:mr-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14" />
              </svg>
              Nuevo Cliente
            </button>
          </div>
          */}
            </div>


          <div className="mb-4">
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
                onChange={(e) =>{ const newYape = Number(e.target.value);  // Convierte el valor a número
                  setYape(newYape);
                }}
                min={initialData.yape}
                max={price}
                type="number"
                className="mt-1 p-2 w-48"
              />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700">Deporte</label>
            <select
              onChange={handleSportChange}
              value={selectedSportId ?? ''}
              className="mt-1 p-2 w-full border bg-white"
            >
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="flex justify-between items-center mb-1">

          <div>
              <label htmlFor="yape" className="text-sm font-medium text-gray-700 mb-2">Monto restante</label>
              <Input
                id="yape"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:w-2/3 mt-6 ml-7">
            <button  onClick={handleComplete}  className="bg-[#3581F2] text-white py-1 h-9 sm:py-2 px-5 rounded-md hover:bg-blue-800 transition duration-200 flex items-center text-[10px] sm:text-[15px]">
              Completar pago
            </button>
          </div>
          </div>


          <div className="mb-4 mt-6">
          <Button onClick={handleSubmit} className='mt-1 w-full p-2 border bg-[#3581F2]'>Guardar</Button>
        {/*  <Button onClick={deleteReserva} className="mt-1 w-full p-2 border bg-[#926d27] text-white">Reportar reserva</Button> */ }
          <Button onClick={deleteReserva} className="mt-1 w-full p-2 border bg-[#662b1c] text-white">Cancelar Reserva</Button>

          </div>
        </div>
      </div>

    </Dialog>



  );
}
