export const LINKS_BY_ROLE = {
  user: [
    { to: "/cart", label: "Cart" },
    { to: "/myTree", label: "My Tree" },
  ],
  admin: [
    { to: "/newTree", label: "New Tree" },
    { to: "/pending", label: "Pending Requests" },
    { to: "/assigned", label: "Assign Farmers" },
    { to: "/deleted", label: "Deleted Trees" },
  ],
  farmer: [
    { to: "/farmer/assigned", label: "My Assigned Trees" },
  ],
};