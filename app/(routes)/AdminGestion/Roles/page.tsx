"use client";
import { API_URL } from "@/config";
import { Pencil, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Role {
  id: number;
  name: string;
}

export default function Page() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editError, setEditError] = useState(""); // Nuevo estado para errores en el modal

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/role`);
      const data = await response.json();
      setRoles(data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDelete = (id: number) => {
    fetch(`${API_URL}/role/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setRoles(roles.filter((role) => role.id !== id));
        } else {
          console.error("Error al eliminar el rol");
        }
      })
      .catch((error) => console.error("Error al realizar la solicitud DELETE:", error));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewRoleName(value);

    if (value.length < 4) {
      setError("El nombre debe tener al menos 4 caracteres");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newRoleName.length < 4) {
      setError("El nombre debe tener al menos 4 caracteres");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newRoleName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear el rol");
      }

      setNewRoleName("");
      setError("");
      fetchRoles();
    } catch (error: any) {
      console.error("Error al crear rol:", error.message);
      setError("Hubo un problema al crear el rol");
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
    setEditError(""); 
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setEditError(""); 
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRole || editingRole.name.length < 4) {
      setEditError("El nombre debe tener al menos 4 caracteres"); 
      return;
    }

    try {
      const response = await fetch(`${API_URL}/role/${editingRole.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editingRole.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el rol");
      }

      setIsModalOpen(false);
      setEditingRole(null);
      setEditError(""); 
      fetchRoles();
    } catch (error: any) {
      console.error("Error al actualizar rol:", error.message);
      setEditError("Hubo un problema al actualizar el rol"); 
    }
  };

  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-4 w-svw">
      <div>
        <div className="flex flex-col gap-y-4 bg-gray-200/80 p-4 rounded-xl">
          <h2 className="text-center text-3xl font-bold text-gray-800/90">Crear rol</h2>
          <form action="" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-4">
                <label htmlFor="" className="text-gray-800/90 font-bold">
                  Nombre del rol
                </label>
                <input
                  type="text"
                  className={`py-2 px-4 rounded-xl outline-none border ${error ? "border-red-500" : ""}`}
                  value={newRoleName}
                  onChange={handleChange}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="w-full flex items-center justify-center">
                <button
                  type="submit"
                  className={`py-2 px-4 w-full rounded-xl bg-yellow-500 hover:bg-yellow-500/90 hover:cursor-pointer transition-colors text-xl font-semibold text-white ${
                    error ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={!!error}
                >
                  Crear rol
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-2 border-b">Nombre</th>
                <th className="px-4 py-2 border-b">Acción</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {roles.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-center space-x-2">{item.name}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <div className="flex items-center justify-center gap-x-4">
                      <button
                        title="Editar"
                        className="bg-blue-500 p-2 rounded-lg"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="text-white" />
                      </button>
                      <button
                        title="Eliminar"
                        className="bg-red-500 p-2 rounded-lg"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {isModalOpen && editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Editar rol</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre del rol</label>
                <input
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    editError ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                />
                {editError && <p className="text-red-500 text-sm mt-1">{editError}</p>}
              </div>
              <div className="flex justify-end gap-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={handleModalClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}