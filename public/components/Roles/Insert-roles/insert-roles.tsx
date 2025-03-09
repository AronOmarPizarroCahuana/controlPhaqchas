import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const roles = ['Administrador', 'Trabajador'];
const statuses = ['Activo', 'Inactivo'];

type FormData = {
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  rol_id: number; // Maneja el ID numérico del rol
  status: number; // 1 para activo, 0 para inactivo
  password: string;
};

interface UserFormProps {
  onSubmit: (formData: FormData) => void;
}

const UserForm = ({ onSubmit }: UserFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    dni: '',
    rol_id: 1, // Administrador por defecto
    status: 1, // Activo por defecto
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: 'rol_id' | 'status', value: string) => {
    const parsedValue = field === 'rol_id' 
      ? value === 'Administrador' ? 1 : 2 
      : value === 'Activo' ? 1 : 0;
    setFormData((prev) => ({ ...prev, [field]: parsedValue }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reiniciar formulario después de enviar
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      dni: '',
      rol_id: 1,
      status: 1,
      password: '',
    });
  };

  return (
    <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-4">
      {/* Campo Nombre */}
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
        />
      </div>

      {/* Campo Apellido */}
      <div>
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          placeholder="Apellido"
        />
      </div>

      {/* Campo Teléfono */}
      <div>
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          placeholder="Teléfono"
        />
      </div>

      {/* Campo DNI */}
      <div>
        <Label htmlFor="dni">DNI</Label>
        <Input
          id="dni"
          name="dni"
          value={formData.dni}
          onChange={handleInputChange}
          placeholder="DNI"
        />
      </div>

      {/* Selección de Rol */}
      <div>
        <Label htmlFor="rol">Rol</Label>
        <Select
          onValueChange={(value) => handleSelectChange('rol_id', value)}
          defaultValue={roles[0]} // Rol predeterminado: Administrador
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selección de Estado */}
      <div>
        <Label htmlFor="status">Estado</Label>
        <Select
          onValueChange={(value) => handleSelectChange('status', value)}
          defaultValue={statuses[0]} // Estado predeterminado: Activo
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Estado" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campo Contraseña */}
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Contraseña"
        />
      </div>

      {/* Botón de envío */}
      <div className="col-span-2">
        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-500 mt-4">
          Registrar Usuario
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
