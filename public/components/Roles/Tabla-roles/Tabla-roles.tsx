import { Button } from '@/components/ui/button';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Table } from '@/components/ui/table';

interface User {
  id: number;
  name: string;
  surname: string;
  phone: string;
  dni: string;
  rol_id: number;
}

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
}

const UserTable = ({ users, onDelete, onEdit }: UserTableProps) => {
  return (
    <Table className="w-full">
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="px-4 py-2">DNI</th>
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Apellido</th>
          <th className="px-4 py-2">Teléfono</th>
          <th className="px-4 py-2">Rol</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="text-center border-b">
            <td className="px-4 py-2">{user.dni}</td>
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.surname}</td>
            <td className="px-4 py-2">{user.phone}</td>
            <td className="px-4 py-2">
              {user.rol_id === 1 ? 'Administrador' : 'Trabajador'}
            </td>
            <td className="px-4 py-2 flex justify-center gap-2">
              <Button
                variant="secondary"
                className="text-sm bg-yellow-500 text-white p-2"
                onClick={() => onEdit(user)} // Abre el modal de edición
              >
                <FaEdit />
              </Button>
              <Button
                variant="destructive"
                className="text-sm bg-red-600 text-white p-2"
                onClick={() => onDelete(user.id)} // Elimina el usuario
              >
                <FaTrashAlt />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
