import { API_URL } from '@/config';
import { useState } from 'react';

interface Customer {
  id: number;
  name: string;
  dni: string;
  bookings_count: number;
}

export default function TopCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [startMonth, setStartMonth] = useState('01');
  const [endMonth, setEndMonth] = useState('01');
  const [year, setYear] = useState('2025');
/*
  useEffect(() => {
    fetchCustomers();
  }, [startMonth, endMonth, year]);
*/
  const fetchCustomers = async () => {
    if (parseInt(startMonth) > parseInt(endMonth)) return;
    
    const startDate = `${year}-${startMonth}-01`;
    const endDate = `${year}-${endMonth}-30`;
  
    try {
      const response = await fetch(`${API_URL}/topCustomers/${startDate}/${endDate}`);
      const data = await response.json();
      
      if (Array.isArray(data.data)) {
        setCustomers(data.data);
      } else {
        setCustomers([]); 
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };
  

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setter(e.target.value);
    fetchCustomers();
  };

  const months = [
    { value: '01', label: 'Enero' }, { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' }, { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' }, { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' }, { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' }
  ];

  const medalStyles = [
    'bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-md',  // Oro
    'bg-gradient-to-r from-gray-300 to-gray-500 shadow-md',     // Plata
    'bg-gradient-to-r from-orange-400 to-orange-600 shadow-md', // Bronce
    'bg-gradient-to-r from-blue-400 to-blue-600 shadow-md',     // 4to lugar
    'bg-gradient-to-r from-green-400 to-green-600 shadow-md'    // 5to lugar
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-4 flex-wrap sm:flex-nowrap">
        <select value={startMonth} onChange={handleInputChange(setStartMonth)} className="p-2 border rounded w-full sm:w-auto">
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={endMonth} onChange={handleInputChange(setEndMonth)} className="p-2 border rounded w-full sm:w-auto">
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <input type="number" value={year} onChange={handleInputChange(setYear)} className="p-2 border rounded w-24 sm:w-auto" />
      </div>

      <div className="flex gap-4 justify-center flex-wrap sm:flex-nowrap">
      {(customers?.slice?.(0, 5) || []).map((customer, index) => (
          <div key={customer.id} className="relative mb-4 sm:mb-0">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full text-white font-bold transition-transform duration-300 relative ${medalStyles[index]}`}
            >
              {customer.name.slice(0, 2).toUpperCase()}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full border-2 border-white bg-gradient-to-b from-yellow-200 to-yellow-500 shadow-inner flex items-center justify-center text-black text-sm font-semibold">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border sm:table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">DNI</th>
              <th className="border p-2">Reservas</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="text-center">
                <td className="border p-2">{customer.id}</td>
                <td className="border p-2">{customer.name}</td>
                <td className="border p-2">{customer.dni}</td>
                <td className="border p-2">{customer.bookings_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
