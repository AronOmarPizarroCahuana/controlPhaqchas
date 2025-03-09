import { LucideIcon } from "lucide-react";

export type SidebarItem = {
    type: "item";
    icon?: LucideIcon;
    label: string;
    link: string;
  };
  
  export type SidebarGroup = {
    type: "group";
    icon?: LucideIcon
    label: string;
    items: SidebarItem[];
  };
  
  export type SidebarSeparator = {
    type: "separator";
    label: string;
  };
  
  export type SidebarMenuItem = SidebarItem | SidebarGroup | SidebarSeparator;
  