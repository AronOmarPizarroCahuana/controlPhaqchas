import React from 'react';
import { Button} from '@/components/ui/button';
const clientes: Cliente[] =
[
    { "nombre": "Jhonatan Espinoza", "dni": "73534380", "celular": "+51 987 654 231", "fecha": "Sab 17", "hora": "4pm a 5pm" },
    { "nombre": "Ana López", "dni": "65432178", "celular": "+51 987 123 456", "fecha": "Sab 17", "hora": "3pm a 4pm" }
  ];

interface Cliente {
  nombre: string;
  dni: string;
  celular: string;
  fecha: string;
  hora: string;
}

const HistorialClientes = ({ }) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr>
          <th className="border p-4">Nombres y Apellidos</th>
          <th className="border p-4">Número de Celular</th>
          <th className="border p-4">Fecha y hora de última reserva</th>
          <th className='border p-4'>Accion </th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente, index) => (
          <tr key={index}>
            <td className="border p-4">{cliente.nombre}</td>
            <td className="border p-4">{cliente.celular}</td>
            <td className="border p-4">{`${cliente.fecha} ${cliente.hora}`}</td>
            <td className='border p-4'>
            <Button variant="destructive">Eliminar</Button>
            <Button className="border bg-yellow-500">Editar</Button>


            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistorialClientes;
