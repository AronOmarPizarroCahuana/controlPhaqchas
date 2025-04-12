import React, { useState } from 'react';
import { Customer } from "@/app/Interface/customer";
import { API_URL } from '@/config';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (newCustomer: Customer) => void; // Recibe el nuevo cliente
}

const AddCustomerModal: React.FC<CustomerFormProps> = ({ isOpen, onClose, onAddCustomer  }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birth_date, setBirthdate] = useState('');

  // Estados de validación
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    dni: '',
    phone: '',
    address: '',
    birth_date: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: name ? '' : 'Nombre es requerido.',
      surname: surname ? '' : 'Apellido es requerido.',
      dni: validateDni(dni) ? '' : 'DNI inválido. Debe ser un número de 8 dígitos.',
      phone: validatePhone(phone) ? '' : 'Teléfono inválido. Debe ser un número válido.',
      address: address ? '' : 'Dirección es requerida.',
      birth_date: birth_date ? '' : 'Fecha de nacimiento es requerida.',
    };
    setErrors(newErrors);

    // Si algún campo tiene un error, no enviamos el formulario
    return Object.values(newErrors).every((error) => error === '');
  };

  // Validación de DNI (debe ser un número de 8 dígitos)
  const validateDni = (dni: string) => /^\d{8}$/.test(dni);

  // Validación de Teléfono (ejemplo, para un formato simple de 9 dígitos)
  const validatePhone = (phone: string) => /^\d{9}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validamos antes de enviar
    if (!validateForm()) {
      console.log('Por favor, corrige los errores en el formulario.');
      return;
    }

    const customerData = {
      name,
      surname,
      dni,
      phone,
      address,
      birth_date,
    };

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        console.log('Cliente agregado', response);
        console.log("cliente enviado",customerData)
        setName('');
        setSurname('');
        setDni('');
        setPhone('');
        setAddress('');
        setBirthdate('');
        setErrors({
          name: '',
          surname: '',
          dni: '',
          phone: '',
          address: '',
          birth_date: '',
        });
        onClose(); // Cierra el modal
        if(onAddCustomer != null){
          onAddCustomer(customerData)
        }
      
      } else {
        console.log("cliente enviado",customerData)
        const errorDetails = await response.json();
        console.error('Detalles del error:', errorDetails);
        throw new Error('Error al agregar cliente');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 lg:p-6 rounded-md w-auto lg:w-96">
        <h2 className="sm:text-xl text-[15px] font-bold mb-3">Agregar nuevo cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label htmlFor="name" className="block lg:text-sm text-[12px] font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-8 lg:h-10 lg:w-full  block p-2 border border-gray-300 rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-1 lg:mb-4">
            <label htmlFor="surname" className="block lg:text-sm text-[12px] font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="mt-1 block h-8 lg:h-10 lg:w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname}</p>}
          </div>

          <div className="mb-1 lg:mb-4">
            <label htmlFor="dni" className="block lg:text-sm text-[12px] font-medium text-gray-700">
              DNI
            </label>
            <input
              type="text"
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="mt-1 block h-8 lg:h-10 lg:w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
          </div>

          <div className="mb-1 lg:mb-4">
            <label htmlFor="phone" className="block lg:text-sm text-[12px] font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block h-8 lg:h-10 lg:w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-1 lg:mb-4">
            <label htmlFor="address" className="block lg:text-sm text-[12px] font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block h-8 lg:h-10 lg:w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="mb-1 lg:mb-4">
            <label htmlFor="birthdate" className="block lg:text-sm text-[12px] font-medium text-gray-700">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              id="birthdate"
              value={birth_date}
              onChange={(e) => setBirthdate(e.target.value)}
              className="mt-1 block h-8 lg:h-10 lg:w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
          </div>

          <div className="mb-1 lg:mb-4 mt-3 lg:mt-6"> 
          <button
              type="submit"
              className="mt-1 h-9 lg:h-10 w-full p-1 lg:p-2 border text-white bg-[#E1BC00]"
            >
              Guardar
            </button>          
             <button
              type="button"
              onClick={onClose}
              className="mt-1  h-9 lg:h-10 w-full p-1 lg:p-2 border text-white bg-[#A9A8A5]"
            >
              Cancelar
            </button>
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
