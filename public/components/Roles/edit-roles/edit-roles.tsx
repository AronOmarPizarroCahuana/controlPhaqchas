import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
interface User {
  id: number;
  name: string;
  surname: string;
  phone: string;
  dni: string;
  rol_id: number;
}

interface FormData {
  name: string;
  surname: string;
  phone: string;
  dni: string;
  rol: string;  // Aquí puedes ajustar los valores según tus necesidades
}

interface EditUserModalProps {
  user: User;
  onEdit: (id: number, formData: FormData) => void;
}

const EditUserModal = ({ user, onEdit }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    dni: user.dni,
    rol: user.rol_id === 1 ? 'Administrador' : 'Trabajador',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(user.id, formData); // Llamamos a onEdit para actualizar el usuario
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="name">Nombre</Label>
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Nombre"
      />

      <Label htmlFor="surname">Apellido</Label>
      <Input
        id="surname"
        name="surname"
        value={formData.surname}
        onChange={handleInputChange}
        placeholder="Apellido"
      />

      <Label htmlFor="phone">Teléfono</Label>
      <Input
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="Teléfono"
      />

      <Label htmlFor="dni">DNI</Label>
      <Input
        id="dni"
        name="dni"
        value={formData.dni}
        onChange={handleInputChange}
        placeholder="DNI"
      />

      <div className="flex gap-4 mt-4">
        <Button onClick={handleSave} className="bg-blue-600 text-white">Guardar</Button>
        <Button variant="outline" className="text-gray-600">Cancelar</Button>
      </div>
    </div>
  );
};

export default EditUserModal;
