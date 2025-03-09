"use client";
import ReporMes from "../Tabla-mes-report/tabla-mes-report"; // Importa el componente que recibe los datos

export default function ComponentePrincipal() {
  const meses = [
    1, 2, 3, 4, 5, 6, 
    7, 8, 9, 10, 11, 12
  ];

  const año = 2025; // El año que deseas pasar

  return (
    <div className="p-6  rounded-lg shadow-lg space-y-8">
      <h1 className="text-center text-xl font-light font-sans">CONTROL DIARIO DE INGRESO EN EL CAMPO DEPORTIVO PHAQCHAS</h1>
      {/* Genera una tabla para cada mes */}
      {meses.map((mes) => (
        <div key={mes} className="mb-6">
          <ReporMes meses={[mes]} año={año} />
        </div>
      ))}
    </div>
  );
}
