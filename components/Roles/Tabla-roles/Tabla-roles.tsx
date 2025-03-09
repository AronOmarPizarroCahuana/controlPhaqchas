import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API_URL } from "../../../config";
import { Admin } from "@/app/Interface/admin";
import Swal from "sweetalert2";

interface FieldProps {
  FieldItems: Admin[];
}

export function AdminList({ FieldItems }: FieldProps) {
  const [admins, setAdmins] = useState<Admin[]>(FieldItems);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null); // Acepta string o null
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    dni: '',
    phone: '',
    birth_date: '',
  });
  useEffect(() => {
    setAdmins(FieldItems);
  }, [FieldItems]);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
    fetch(`${API_URL}/admi`)
      .then((res) => res.json())
      .then((data) => setAdmins(data.data))
      .catch((err) => console.error("Error fetching admins:", err));
      
  }, []);

  const handleEdit = (admin: Admin) => {
    setEditAdmin(admin);
    setShowModal(true);
  };

  
  const handleSubmit = (updatedAdmin: Admin) => { 

    interface ValidationErrors {
      name: string;
      surname: string;
      phone: string;
      dni: string;
      password: string;
      birth_date: string;
    }
    
    const validationErrors: ValidationErrors = {
      name: '',
      surname: '',
      phone: '',
      dni: '',
      password: '',
      birth_date: '',
    };
  // Validación de campos
  if (!updatedAdmin.name) validationErrors.name = 'El nombre es obligatorio';
    else if (!/^[a-zA-Z\s]+$/.test(updatedAdmin.name)) validationErrors.name = 'El nombre solo puede contener letras y espacios';

    if (!updatedAdmin.surname) validationErrors.surname = 'El apellido es obligatorio';
    else if (!/^[a-zA-Z\s]+$/.test(updatedAdmin.surname)) validationErrors.surname = 'El apellido solo puede contener letras y espacios';

    if (!updatedAdmin.dni) validationErrors.dni = 'El DNI es obligatorio';
    else if (!/^\d{8}$/.test(updatedAdmin.dni)) validationErrors.dni = 'El DNI debe tener exactamente 8 dígitos';

    if (!updatedAdmin.phone) validationErrors.phone = 'El teléfono es obligatorio';
    else if (!/^\d{9,}$/.test(updatedAdmin.phone)) validationErrors.phone = 'El teléfono debe tener al menos 9 dígitos';

    if (!updatedAdmin.birth_date) validationErrors.birth_date = 'La fecha de nacimiento es obligatoria';
    else if (isNaN(new Date(updatedAdmin.birth_date).getTime())) validationErrors.birth_date = 'La fecha de nacimiento no es válida';

  // Si hay errores, no enviar el formulario
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }



    console.log("token",token)
    fetch(`${API_URL}/auth/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => response.json())
    .then(data => {
      fetch(`${API_URL}/admi/updateAdmi/${data.id}/${updatedAdmin.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAdmin),
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: "Registrado!",
              text: "Se a editado correctamente",
              icon: "success",
            });
          console.log("respuesta ",response)
            setAdmins((prev) =>
              prev.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin))
            );
            setShowModal(false);
          } else {
            console.log("respuesta ",response)

            // Imprimir error detallado si la respuesta no es OK
            response.text().then((text) => {
              console.error("Error updating admin:", text); // Imprime el cuerpo de la respuesta
            }).catch((error) => {
             
              console.error("Failed to read error response:", error); // Si falla al leer el cuerpo del error

            });
          }
        })
        .catch((error) => {
          // Imprime errores de la solicitud fetch
          
          console.error("Error with PUT request:", error);
        });    })
      .catch((error) => {
        // Imprime errores de la solicitud fetch
        console.error("Error with PUT request:", error);
      });

   
  };
  

  return (
    <>
      {showModal && editAdmin && (
      <Dialog open={showModal} onOpenChange={setShowModal}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="p-4 bg-white rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Editar Administrador</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(editAdmin);
            }}
          >
            {[
              { label: 'Nombre', key: 'name', typ: 'text' },
              { label: 'Apellido', key: 'surname', typ: 'text' },
              { label: 'DNI', key: 'dni', typ: 'text' },
              { label: 'Teléfono', key: 'phone', typ: 'text' },
              { label: 'Fecha de Nacimiento', key: 'birth_date', typ: 'date' },
            ].map(({ label, key, typ }) => (
              <div className="mb-4" key={key}>
                <label className="block text-sm font-medium">{label}</label>
                <input
                  type={typ}
                  value={editAdmin[key as keyof typeof editAdmin] as string}
                  onChange={(e) =>
                    setEditAdmin({ ...editAdmin, [key]: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-md"
                />
                {errors[key as keyof typeof errors] && (
                  <p className="text-red-500 text-sm">{errors[key as keyof typeof errors]}</p>
                )}
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-sm font-medium">Rol</label>
              <select
                value={editAdmin.rol_id}
                onChange={(e) =>
                  setEditAdmin({ ...editAdmin, rol_id: parseInt(e.target.value) })
                }
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value={1}>Dueño del Establecimiento</option>
                <option value={2}>Administrador Secundario</option>
              </select>
            </div>

            <div className="flex justify-between">
              <Button type="submit" className="bg-blue-500 text-white">
                Guardar
              </Button>
              <Button
                type="button"
                className="bg-red-500 text-white"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2 border-b">DNI</th>
              <th className="px-4 py-2 border-b">Nombre y Apellido</th>
              <th className="px-4 py-2 border-b">Rol en el Sistema</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 border-b text-center">
                  No hay administradores disponibles.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-center">{admin.dni}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {admin.name} {admin.surname}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {admin.rol_id === 1
                      ? "Dueño del Establecimiento"
                      : "Administrador Secundario"}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {admin.status === 1 ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button onClick={() => handleEdit(admin)} title="Editar">
                      <FaEdit className="text-blue-500 hover:text-blue-700" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
