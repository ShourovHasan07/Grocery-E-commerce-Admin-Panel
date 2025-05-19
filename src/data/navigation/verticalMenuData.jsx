const verticalMenuData = () => [
  // This is how you will normally render submenu
  {
    label: "dashboards",
    icon: "tabler-smart-home",
    href: "/dashboard",
  },
  {
    label: "Admin",
    icon: "tabler-user",
    children: [
      {
        label: "view",
        icon: "tabler-circle",
        href: "/apps/user/view",
      },
      {
        label: "Admin List",
        icon: "tabler-circle",
        href: "/admin/list",
      },
    ],
  },
];

export default verticalMenuData;
