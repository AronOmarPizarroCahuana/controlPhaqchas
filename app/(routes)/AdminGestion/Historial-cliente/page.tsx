'use client';

import React from 'react';
import TopClientes from '@/components/Report-customer/Report-customer/Report-customer';

const Home = () => {


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Top 5 de clientes con más reservas del mes</h1>
      <TopClientes  />
    
    </div>
  );
};

export default Home;
