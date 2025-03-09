import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableRow, TableCell, TableBody ,TableHeader} from '@/components/ui/table';
import Image from "next/image";

const clientes = [
  {
    nombre: "Jhonatan Espinoza",
    dni: "73534380",
    numeroCelular: "+51 987 654 231",
    imagen: "/path-to-profile-image.jpg"
  },
  {
    nombre: "Ana López",
    dni: "65432178",
    numeroCelular: "+51 987 123 456",
    imagen: "/path-to-profile-image.jpg"
  },
  {
    nombre: "Carlos Pérez",
    dni: "87654321",
    numeroCelular: "+51 976 543 210",
    imagen: "/path-to-profile-image.jpg"
  }
];

const ClientesPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lista de clientes registrados</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Ingrese nombre o DNI"
          className="border p-2 rounded-l w-1/2"
        />
        <Button className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 transition-all duration-300">
          Buscar
        </Button>
      </div>
      <Table className="w-full border-collapse border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableCell className="border p-4">Nombres y Apellidos</TableCell>
            <TableCell className="border p-4">Número de Celular</TableCell>
            <TableCell className="border p-4">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente, index) => (
            <TableRow key={index} className="border">
              <TableCell className="border p-4 flex items-center space-x-2">
                <Image
                  src={cliente.imagen}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div>{cliente.nombre}</div>
                  <div>{cliente.dni}</div>
                </div>
              </TableCell>
              <TableCell className="border p-4">{cliente.numeroCelular}</TableCell>
              <TableCell className="border p-4 space-x-2">
                <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300">
                  Modificar datos
                </Button>
                <Button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300">
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientesPage;
