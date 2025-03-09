import { CalendarCheck, Megaphone, Building, Users, FileText, ShieldCheck } from "lucide-react";
import { SidebarMenuItem } from "./NavbarLetf.types";

export const menuItems: SidebarMenuItem[] = [
  { type: "separator", label: "Menú" },

  { type: "item", icon: CalendarCheck, label: "Reserva", link: "/AdminGestion/Reserva" },
  { type: "item", icon: Megaphone, label: "Anuncio web", link: "/AdminGestion/Anuncio" },

  { type: "separator", label: "Mantenimiento" },

  {
    type: "group",
    icon: Building,
    label: "Mantenimiento Local",
    items: [
      { type: "item", label: "Deportes", link: "/AdminGestion/Deportes" },
      { type: "item", label: "Canchas", link: "/AdminGestion/Canchas" }
    ]
  },

  { type: "separator", label: "Clientes" },

  {
    type: "group",
    icon: Users,
    label: "Cliente",
    items: [
      { type: "item", label: "Mantenimiento", link: "/AdminGestion/Mantenimiento-cliente" },
      { type: "item", label: "Clientes frecuentes", link: "/AdminGestion/Historial-cliente" }
    ]
  },

  { type: "separator", label: "Administración" },

  {
    type: "group",
    icon: Users,
    label: "Administradores",
    items: [
      { type: "item", label: "Mantenimiento roles", link: "/AdminGestion/Mantenimiento-rol" }
    ]
  },

  { type: "separator", label: "Reportes" },

  {
    type: "group",
    icon: FileText,
    label: "Reporte",
    items: [
      { type: "item", label: "Mes", link: "/AdminGestion/Report-mes" }
    ]
  },

  { type: "separator", label: "Roles y permisos" },

  {
    type: "group",
    icon: ShieldCheck,
    label: "Roles y permisos",
    items: [
      { type: "item", label: "Roles", link: "/AdminGestion/roles" },
      { type: "item", label: "Permisos", link: "/AdminGestion/permisos" }
    ]
  }
];
