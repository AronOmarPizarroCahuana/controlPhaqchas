'use client';
import CustomerTable from '@/components/Customer/Customer-table/Customer-table';
const AdminPage = () => {

  return(
    <div className="p-0 sm:p-9 bg-white rounded-lg ">
    <h1 className="text-[17px] px-6 sm:text-2xl mt-3 font-bold text-[#757575] ">Lista de Clientes</h1>
    <CustomerTable></CustomerTable>
  </div>
  
  )
}
export default AdminPage;
