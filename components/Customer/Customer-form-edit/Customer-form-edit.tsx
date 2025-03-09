import React, { useState, useEffect } from 'react';
import { Customer } from "@/app/Interface/customer";
import {API_URL} from "../../../config";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit: Customer | null;  // Asegúrate de tener este campo
  onEditCustomer: (updatedCustomer: Customer) => void;// Datos del cliente a editar
}

const EditCustomerModal: React.FC<CustomerFormProps> = ({ isOpen, onClose, customerToEdit, onEditCustomer }) => {
  // Inicializamos los estados con los datos del cliente a editar
  const [name, setName] = useState(customerToEdit?.name || '');
  const [surname, setSurname] = useState(customerToEdit?.surname || '');
  const [dni, setDni] = useState(customerToEdit?.dni || '');
  const [phone, setPhone] = useState(customerToEdit?.phone || '');
  const [address, setAddress] = useState(customerToEdit?.address || '');
  const [birth_date, setBirthdate] = useState(customerToEdit?.birth_date || '');
  const [password, setPassword] = useState(''); // Contraseña opcional

  // Estados de validación
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    dni: '',
    phone: '',
    address: '',
    birth_date: '',
    password: '', // Contraseña opcional
  });

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {
      name: name ? '' : 'Nombre es requerido.',
      surname: surname ? '' : 'Apellido es requerido.',
      dni: validateDni(dni) ? '' : 'DNI inválido. Debe ser un número de 8 dígitos.',
      phone: validatePhone(phone) ? '' : 'Teléfono inválido. Debe ser un número válido.',
      address: address ? '' : 'Dirección es requerida.',
      birth_date: birth_date ? '' : 'Fecha de nacimiento es requerida.',
      password: password && password.length < 8 ? 'La contraseña debe tener al menos 6 caracteres.' : '',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  // Validaciones de DNI y Teléfono
  const validateDni = (dni: string) => /^\d{8}$/.test(dni);
  const validatePhone = (phone: string) => /^\d{9}$/.test(phone);

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validamos antes de enviar
    if (!validateForm()) {
      console.log('Por favor, corrige los errores en el formulario.');
      return;
    }

    const updatedCustomerData = {
      id: customerToEdit?.id, // Aseguramos que estamos editando el cliente correcto
      name,
      surname,
      dni,
      phone,
      address,
      birth_date,
      password, // Incluir la contraseña si se modifica
    };

    try {
        if(customerToEdit?.id != null){
            const response = await fetch(`${API_URL}/user/${customerToEdit.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                body: JSON.stringify(updatedCustomerData),
              });
        
       
     
      if (response.ok) {
        console.log('Cliente actualizado', response);
        onClose(); // Cierra el modal
        onEditCustomer(updatedCustomerData); // Pasamos los datos actualizados
      } else {
        const errorDetails = await response.json();
        console.error('Detalles del error:', errorDetails);
        throw new Error('Error al actualizar cliente');
      }
    }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  useEffect(() => {
    // Si el modal se abre y hay un cliente a editar, actualizamos los valores del formulario
    if (isOpen && customerToEdit) {
      setName(customerToEdit.name || '');
      setSurname(customerToEdit.surname || '');
      setDni(customerToEdit.dni || '');
      setPhone(customerToEdit.phone || '');
      setAddress(customerToEdit.address || '');
      setBirthdate(customerToEdit.birth_date || '');
      setPassword(''); // Reseteamos la contraseña, si no se va a cambiar
    }
  }, [isOpen, customerToEdit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white p-4 lg:p-6 rounded-md w-auto lg:w-96">
    <h2 className="sm:text-xl text-[15px] font-bold mb-3">Editar cliente</h2>
    <form onSubmit={handleSubmit}>
      {/* Nombre */}
      <div className="mb-1">
        <label htmlFor="name" className="block lg:text-sm text-[12px] font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 h-8 lg:h-10 w-full block p-2 border border-gray-300 rounded-md"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Apellido */}
      <div className="mb-1">
        <label htmlFor="surname" className="block lg:text-sm text-[12px] font-medium text-gray-700">Apellido</label>
        <input
          type="text"
          id="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="mt-1 h-8 lg:h-10 w-full block p-2 border border-gray-300 rounded-md"
        />
        {errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname}</p>}
      </div>

      {/* DNI */}
      <div className="mb-1">
        <label htmlFor="dni" className="block lg:text-sm text-[12px] font-medium text-gray-700">DNI</label>
        <input
          type="text"
          id="dni"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="mt-1 h-8 lg:h-10 w-full block p-2 border border-gray-300 rounded-md"
        />
        {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
      </div>

      {/* Teléfono */}
      <div className="mb-1">
        <label htmlFor="phone" className="block lg:text-sm text-[12px] font-medium text-gray-700">Teléfono</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 h-8 lg:h-10 w-full block p-2 border border-gray-300 rounded-md"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Dirección */}
      <div className="mb-1">
        <label htmlFor="address" className="block lg:text-sm text-[12px] font-medium text-gray-700">Dirección</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 h-8 lg:h-10 w-full block p-2 border border-gray-300 rounded-md"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      {/* Fecha de nacimiento */}
      <div className="mb-1">
        <label htmlFor="birth_date" className="block lg:text-sm text-[12px] font-medium text-gray-700">Fecha de Nacimiento</label>
        <input
          type="date"
          id="birth_date"
          value={birth_date}
          onChange={(e) => setBirthdate(e.target.value)}
          className="mt-1 h-8 lg:h-10 w-full block p-2 border border-gray-300 rounded-md"
        />
        {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
      </div>

    

      {/* Botones de guardar y cancelar */}
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
          className="mt-1 h-9 lg:h-10 w-full p-1 lg:p-2 border text-white bg-[#A9A8A5]"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default EditCustomerModal;
