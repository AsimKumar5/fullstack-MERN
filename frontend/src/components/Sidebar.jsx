import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ShieldCheck
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) {
      navigate("/login", { replace: true });
    }
  };

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
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <Bell size={20} />
    }
  ];

  if (profile?.isAdmin) {
    menuItems.push({
      name: "Admin panel",
      path: "/admin",
      icon: <ShieldCheck size={20} />,
    });
  }

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

        {error && <p className="error-message">{error}</p>}

        <button className="logout" onClick={handleLogout} disabled={status === "loading"}>
          <LogOut size={20} />
          <span>{status === "loading" ? "Logging out..." : "Logout"}</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;