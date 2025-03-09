'use client';

import React from 'react';
import TopClientes from '@/components/Topcliente/Topcliente';
import HistorialClientes from '@/components/Historialcliente/Historialcliente';

const Home = () => {
 /* const [topClientes, setTopClientes] = useState([]);
  const [historialClientes, setHistorialClientes] = useState([]);

  useEffect(() => {
    fetch('/path-to-your/topClientes.json')
      .then((response) => response.json())
      .then((data) => setTopClientes(data));

    fetch('/path-to-your/historialClientes.json')
      .then((response) => response.json())
      .then((data) => setHistorialClientes(data));
  }, []);*/

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Top 5 de clientes con más reservas del mes</h1>
      <TopClientes  />
      <h2 className="text-xl font-bold mt-8">Historial de clientes</h2>
      <HistorialClientes  />
    </div>
  );
};

export default Home;
