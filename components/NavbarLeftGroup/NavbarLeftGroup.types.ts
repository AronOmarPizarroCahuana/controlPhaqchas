import { LucideIcon } from "lucide-react"

export type NavbarLeftGroupProps = {
    icon: LucideIcon,
    label: string,
    items: { label: string; link: string }[],
    isOpen: boolean,
    toggleDropdown: () => void,
}