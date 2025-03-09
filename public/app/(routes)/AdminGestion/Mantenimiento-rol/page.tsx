'use client';
const AdminPage = () => {

  return(
    <h2>mantenimiento page</h2>
  )
}
export default AdminPage;

/*
import { useState, useEffect } from 'react';
import UserForm from './../../../../components/Roles/Insert-roles/insert-roles';
import UserTable from './../../../../components/Roles/Tabla-roles/Tabla-roles';

interface User {
  id: number; // He cambiado el id a obligatorio, si es opcional asegúrate de manejarlo correctamente
  name: string;
  surname: string;
  password: string;
  dni: string;
  phone: string;
  status: string;
  rol_id: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/admi');
        if (!response.ok) throw new Error('Error al obtener los usuarios');
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (formData: User) => {
    const newUser = {
      name: formData.name,
      surname: formData.surname,
      password: formData.password,
      dni: formData.dni,
      phone: formData.phone,
      status: formData.status,
      rol_id: formData.rol_id === 'Administrador' ? '1' : '2', // Mantén el tipo string si así es requerido
    };
  
    console.log('Form Data:', newUser);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUsers((prevUsers) => [...prevUsers, data]);
      } else {
        const errorMessage = data.message || 'Error desconocido';
        console.error('Error adding user:', errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert(`Error al intentar agregar el usuario: ${error || error}`);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admi/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el usuario');

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-blue-600 mb-2">Agregar nuevo usuario</h1>
        <UserForm onSubmit={handleAddUser} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Lista de usuarios con acceso al sistema</h2>
        <UserTable users={users} onDelete={handleDeleteUser} onEdit={handleEditUser} />
      </div>
    </div>
  );
};

export default AdminPage;*/
