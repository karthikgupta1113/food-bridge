import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "black", margin: 0 }}>
        🍲 Food Bridge
      </h1>

      <div>
        <Link
          to="/"
          style={{
            color: "black",
            textDecoration: "none",
            marginRight: "20px",
          }}
        >
          Home
        </Link>

        <Link
          to="/login"
          style={{
            color: "black",
            textDecoration: "none",
            marginRight: "20px",
          }}
        >
          Login
        </Link>

        <Link
          to="/signup"
          style={{
            color: "black",
            textDecoration: "none",
          }}
        >
          Signup
        </Link>
      </div>
      <Link to="/#how-it-works">
  How It Works
</Link>
    </nav>
  );
}

export default Navbar;