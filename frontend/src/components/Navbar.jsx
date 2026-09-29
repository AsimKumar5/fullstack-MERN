import { Bell, LogIn, UserCircle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-logo">
        📈 StockMarket
      </div>

      <div className="navbar-right">

        <div className="market-status">
          <span>●</span>
          Market Open
        </div>

        <Bell size={20} />
        
        <div className="user-profile">
          <UserCircle size={28} />
          <span>Investor</span>
        </div>

      </div>

    </header>
  );
}

export default Navbar;