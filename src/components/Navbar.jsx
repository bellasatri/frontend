
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Giftly
      </Link>

      {!isAdmin && (
        <div className="nav-links">

          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/cart">
            Keranjang
            {count > 0 && (
              <span className="badge">{count}</span>
            )}
          </NavLink>

          <NavLink to="/checkout">
            Checkout
          </NavLink>

        </div>
      )}
    </nav>
  );
}
