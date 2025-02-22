
import { SidebarLink } from "@/types";
export const themes = [
    { 
        value: 'light', 
        label: 'light', 
        icon: '/assets/icons/sun.svg'
    },
    { 
        value: 'dark', 
        label: 'dark', 
        icon: '/assets/icons/moon.svg'
    },
    { 
        value: 'system', 
        label: 'system', 
        icon: '/assets/icons/computer.svg'
    }
]

export const sidebarLinks: SidebarLink[] = [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/assets/icons/users.svg",
      route: "/community",
      label: "Community",
    },
    {
      imgURL: "/assets/icons/star.svg",
      route: "/collection",
      label: "Collections",
    },
   
    {
      imgURL: "/assets/icons/tag.svg",
      route: "/tags",
      label: "Categories",
    },
    {
      imgURL: "/assets/icons/user.svg",
      route: "/profile",
      label: "Profile",
    },
    {
      imgURL: "/assets/icons/micros-lab.svg",
      route: "/add-equipment",
      label: "Add an equipment",
    },
  ];
  
  