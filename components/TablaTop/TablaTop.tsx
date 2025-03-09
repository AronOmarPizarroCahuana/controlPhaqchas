'use client';



export default function TablaTop() {

  return (

    <div className="p-6 bg-[#EFEFEF] space-y-8">
  <div className="flex justify-center items-center space-x-8 flex-wrap sm:flex-nowrap">
    <div className="flex items-center space-x-2 sm:space-x-4">
      <div className="w-6 h-6 bg-red-800 rounded-full sm:w-8 sm:h-8"></div>
      <span className="text-gray-700 font-semibold text-sm sm:text-base">Completado</span>
    </div>
    <div className="flex items-center space-x-2 sm:space-x-4">
      <div className="w-6 h-6 bg-amber-600 rounded-full sm:w-8 sm:h-8"></div>
      <span className="text-gray-700 font-semibold text-sm sm:text-base">Reservado</span>
    </div>
    <div className="flex items-center space-x-2 sm:space-x-4">
      <div className="w-6 h-6 bg-yellow-500 rounded-full sm:w-8 sm:h-8"></div>
      <span className="text-gray-700 font-semibold text-sm sm:text-base">En espera</span>
    </div>
    <div className="flex items-center space-x-2 sm:space-x-4">
      <div className="w-6 h-6 bg-white border-2 border-gray-700 rounded-full sm:w-8 sm:h-8"></div>
      <span className="text-gray-700 font-semibold text-sm sm:text-base">Disponible</span>
    </div>
  </div>
</div>


  
  );
}
