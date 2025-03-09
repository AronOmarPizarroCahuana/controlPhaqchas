import React from 'react';

interface Cliente {
  nombre: string;
  ranking: number;
}

const clientes: Cliente[] = [
  { nombre: "Pedro Pérez", ranking: 1 },
  { nombre: "Ana Gómez", ranking: 2 },
  { nombre: "María López", ranking: 3 },
  { nombre: "Santiago Ruiz", ranking: 4 },
  { nombre: "Javier Torres", ranking: 5 }
];

const colors = ['bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-purple-400', 'bg-yellow-400'];

const TopClientes = () => {
  const getInitials = (nombre: string) => {
    const [firstName, lastName] = nombre.split(' ');
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getCircleSize = (ranking: number) => {
    switch (ranking) {
      case 1:
        return 'w-24 h-24 text-4xl';
      case 2:
      case 3:
        return 'w-20 h-20 text-3xl';
      case 4:
      case 5:
        return 'w-16 h-16 text-2xl';
      default:
        return 'w-16 h-16';
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      {clientes.map((cliente, index) => (
        <div key={index} className="relative flex flex-col items-center">
          <div className={`flex items-center justify-center rounded-full ${colors[index % colors.length]} ${getCircleSize(cliente.ranking)}`}>
            <div className="text-white font-bold">{getInitials(cliente.nombre)}</div>
          </div>
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-black font-bold rounded-full w-8 h-8 flex items-center justify-center border border-gray-300">
            #{cliente.ranking}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopClientes;
