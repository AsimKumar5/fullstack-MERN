import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Receipt,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      name: "Stocks",
      path: "/stocks",
      icon: <TrendingUp size={20} />
    },
    {
      name: "Portfolio",
      path: "/portfolio",
      icon: <Briefcase size={20} />
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <Receipt size={20} />
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={20} />
    }
  ];

  return (
    <aside className="sidebar">

      <nav>

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >

            {item.icon}

            <span>{item.name}</span>

          </NavLink>

        ))}

      </nav>

      <div className="sidebar-bottom">

        <NavLink to="/settings" className="menu-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <button className="logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;