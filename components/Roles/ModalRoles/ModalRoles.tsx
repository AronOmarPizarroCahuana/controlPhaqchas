import Switch from "@/components/Switch/Switch";
import { API_URL } from "@/config";
import React, { useEffect, useState } from "react";
interface RolesModalProps {
  adminId: number | null;
  onClose: () => void;
}
export default function ModalRoles({ adminId, onClose }: RolesModalProps) {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState<{ [key: string]: boolean }>({});
  const [userPermissions, setUserPermissions] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetch(`${API_URL}/role`)
      .then((res) => res.json())
      .then((data) => setRoles(data.data))
      .catch((err) => console.error("Error fetching roles:", err));
    fetch(`${API_URL}/permission`)
      .then((res) => res.json())
      .then((data) => setPermissions(data.data))
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  useEffect(() => {
    if (adminId) {
      const rolesUrl = `${API_URL}/users/${adminId}/roles`;
      const permissionsUrl = `${API_URL}/users/${adminId}/permissions`;

      Promise.all([fetch(rolesUrl), fetch(permissionsUrl)])
        .then(([rolesRes, permissionsRes]) =>
          Promise.all([rolesRes.json(), permissionsRes.json()])
        )
        .then(([rolesData, permissionsData]) => {
          console.log("Roles del usuario:", rolesData);
          console.log("Permisos del usuario:", permissionsData);

          // Almacenar los roles con el nombre correcto
          const rolesMap = rolesData.data.reduce(
            (acc: any, role: any) => ({ ...acc, [role.name]: true }),
            {}
          );

          const permissionsMap = permissionsData.data.reduce(
            (acc: any, perm: any) => ({ ...acc, [perm.name]: true }),
            {}
          );

          setUserRoles(rolesMap);
          setUserPermissions(permissionsMap);
        })
        .catch((err) =>
          console.error("Error fetching user roles/permissions:", err)
        );
    }
  }, [adminId]);

  const handleRoleChange = (roleName: string) => {
    setUserRoles((prevRoles) => ({
      ...prevRoles,
      [roleName]: !prevRoles[roleName],
    }));

    fetch(`${API_URL}/users/${adminId}/assign-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: roleName }),
    }).catch((err) => console.error("Error updating role:", err));
  };
  const handlePermissionChange = (permissionName: string) => {
    const updatedPermissions = {
      ...userPermissions,
      [permissionName]: !userPermissions[permissionName],
    };
    setUserPermissions(updatedPermissions);

    fetch(`${API_URL}/users/${adminId}/assign-permission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permission: permissionName }),
    }).catch((err) => console.error("Error updating permission:", err));
  };

  return (
    <div className="fixed inset-0 flex items-start z-50 justify-center bg-black bg-opacity-50 pt-4">
      <div className="bg-white rounded-lg p-5 w-1/2 flex flex-col gap-y-4">
        <h2>Asignacioń de roles y permisos</h2>
        <hr className="h-[2px]" />
        <div className="flex flex-col gap-y-2">
          <h2>Roles del sistema</h2>
          <div className="flex items-center gap-x-5">
            {roles.map((role: any) => (
              <div key={role.id} className="flex items-center flex-col gap-x-4">
                <Switch
                  id={role.id}
                  checked={!!userRoles[role.name]}
                  onChange={() => handleRoleChange(role.name)}
                />
                <span className="capitalize">{role.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <h2>Permisos</h2>
          <div className="flex items-center gap-x-5">
            {permissions.map((perm: any) => (
              <div key={perm.id} className="flex items-center gap-x-4">
                <Switch
                  id={perm.id}
                  checked={!!userPermissions[perm.name]}
                  onChange={() => handlePermissionChange(perm.name)}
                />
                <span className="capitalize">{perm.name}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
