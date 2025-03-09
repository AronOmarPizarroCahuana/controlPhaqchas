import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Search } from 'lucide-react'; // Importa el ícono de búsqueda
import AddCustomerModal from '../Customer-form/Customer-form'; // Importa tanto el componente como la interfaz si es necesario
import EditCustomerModal from '../Customer-form-edit/Customer-form-edit'; // Importa tanto el componente como la interfaz si es necesario
import { Customer } from "@/app/Interface/customer";
import {API_URL} from "../../../config";

export default function ClientTable() {
  const [clients, setClients] = useState<Customer[]>([]); // Usamos la interfaz Customer aquí
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);

  const handleAddClientClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Fetch inicial para obtener los clientes (puedes ajustar según tu API)
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/customer`);
        const data = await response.json();
        
        // Mostrar la respuesta completa para inspección
        console.log('Respuesta de la API:', data);
  
        // Suponiendo que la respuesta tiene la propiedad 'data' que contiene los clientes
        // Ajusta según el formato real de la respuesta
        if (data && Array.isArray(data.data)) {
          setClients(data.data); // Accedemos a 'data' si los clientes están allí
        } else {
          console.error('La respuesta no tiene la propiedad "data" o no es un arreglo de clientes:', data);
        }
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };
  
    fetchCustomers();
  }, []);

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setClients(prevCustomers =>
      prevCustomers.map(client =>
        client.id === updatedCustomer.id ? updatedCustomer : client
      )
    );
  };

  // Función para actualizar los clientes después de agregar uno nuevo
  const handleAddCustomer = (newCustomer: Customer) => {
    setClients((prevCustomers) => [...prevCustomers, newCustomer]);
  };

  // Filtrar los datos basados en la búsqueda
  const filteredData = clients.filter(client =>
    client.dni.startsWith(search) || 
    `${client.name} ${client.surname}`.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <button onClick={handleAddClientClick} className="bg-yellow-400 text-white font-bold py-2 px-4 rounded flex items-center mb-4 w-full md:w-auto">
        + Agregar nuevo cliente
      </button>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <div className="relative w-full md:w-auto flex-grow">
          <input
            type="text"
            placeholder="Ingrese nombre o DNI"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 pl-10 rounded w-full"
          />
          <Search size={20} className="absolute left-3 top-2 text-gray-500" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nombres y Apellidos</th>
              <th className="p-2">Número de Celular</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(client => (
                <tr key={client.id} className="border-b">
                  <td className="p-2 flex items-center space-x-2">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold bg-[#776321]">
                      {client.name.charAt(0)}{client.surname.charAt(0)}
                    </div>
                    <div>
                      <div>{`${client.name} ${client.surname}`}</div>
                      <div className="text-sm text-gray-500">{client.dni}</div>
                    </div>
                  </td>
                  <td className="p-2">{client.phone}</td>
                  <td className="p-2 space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
                    <button  onClick={() => setSelectedClient(client)} // Establecer el cliente seleccionado
                      className="bg-blue-500 text-white p-2 rounded flex items-center justify-center md:px-3 md:py-1"
                    >
                      <span className="md:hidden"><Pencil size={16} /></span>
                      <span className="hidden md:inline">Modificar datos</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">No se encontraron clientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddCustomerModal isOpen={isModalOpen} onClose={handleCloseModal} onAddCustomer={handleAddCustomer} />
      <EditCustomerModal
        isOpen={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        customerToEdit={selectedClient}
        onEditCustomer={handleUpdateCustomer}
      />
    </div>
  );
}
