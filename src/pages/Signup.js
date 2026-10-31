import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myImage from "../assets/vegiee.jpg";
import { register } from "../api";

const REQUIRED_MARK = "*";


const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: 'Donor',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly.slice(0, 10)
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
      password: formData.password,
      role: formData.userType,
      joined: new Date().toLocaleDateString(),
    });

    alert("Registration Successful");

    if (formData.userType === "Donor") {
      navigate("/donor");
    } else if (formData.userType === "Receiver") {
      navigate("/receiver");
    } else if (formData.userType === "Volunteer") {
      navigate("/volunteer");
    }
  } catch (error) {
    alert(error.message || "Registration failed. Please try again.");
  }
};

  return (
    <div style={styles.container}>
      {/* Left Column: Background Image with Overlay Text */}
      <main style={styles.overlay}>
              <h1 style={styles.overlayText}>we can end hunger</h1>
              <img
        src={myImage}
        alt="street food"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          maxwidth:"90px",
          objectFit: "cover",
          objectPosition: "left center"
        }}
      />
            </main>
    

      {/* Right Column: Registration Form */}
      <div style={styles.formColumn}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Create an Account</h2>
          <div style={styles.roleContainer}>
  <label style={styles.label}>I Want To {REQUIRED_MARK}</label>

  <div style={styles.roleButtons}>
    <button
      type="button"
      onClick={() =>
        setFormData({
          ...formData,
          userType: "Donor"
        })
      }
      style={{
        ...styles.roleBtn,
        backgroundColor:
          formData.userType === "Donor"
            ? "#2e7d32"
            : "#ffffff",
        color:
          formData.userType === "Donor"
            ? "#ffffff"
            : "#333333"
      }}
    >
      🍱 Donate Food
    </button>

    <button
      type="button"
      onClick={() =>
        setFormData({
          ...formData,
          userType: "Receiver"
        })
      }
      style={{
        ...styles.roleBtn,
        backgroundColor:
          formData.userType === "Receiver"
            ? "#ff9800"
            : "#ffffff",
        color:
          formData.userType === "Receiver"
            ? "#ffffff"
            : "#333333"
      }}
    >
      🍽 NGO
    </button>
    <button
      type="button"
      onClick={() =>
        setFormData({
          ...formData,
          userType: "Volunteer"
        })
      }
      style={{
        ...styles.roleBtn,
        backgroundColor:
          formData.userType === "Volunteer"
            ? "#1565c0"
            : "#ffffff",
        color:
          formData.userType === "Volunteer"
            ? "#ffffff"
            : "#333333"
      }}
    >
      👤Volunteer
    </button>
  </div>
</div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Full Name Input */}
            <div style={styles.inputGroup}>
              <label htmlFor="fullName" style={styles.label}>Full Name {REQUIRED_MARK}</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email Address {REQUIRED_MARK}</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Phone Number Input */}
            <div style={styles.inputGroup}>
              <label htmlFor="phoneNumber" style={styles.label}>Phone Number {REQUIRED_MARK}</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password {REQUIRED_MARK}</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Confirm Password Input */}
            <div style={styles.inputGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password {REQUIRED_MARK}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" style={styles.submitButton}>
              Register
            </button>
          </form>

          {/* Login Redirection link */}
          <p style={styles.footerText}>
  Already have an account?
  <a href="/login" style={styles.link}> Login</a>
</p>
        </div>
      </div>
    </div>
  );
};

// Inline CSS Styles matching the targeted UI panel
const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#FFF8DC',
    overflow: 'hidden',
  },
 roleContainer: {
  marginBottom: "20px",
},

roleButtons: {
  display: "flex",
  gap: "10px",
  marginTop: "8px",
},

roleBtn: {
  flex: 1,
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.3s",
},
  overlay: {
    flex: 0.9
  ,
      position: 'relative',
      background: `linear-gradient(
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4)
      ), url(${myImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '60px',
    },
  overlayText: {
   color: '#1e0303',
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.3,
    maxWidth: '400px',
    textShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  formColumn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    overflowY: 'auto',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#666666',
    margin: '0 0 24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#212121',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitButton: {
    backgroundColor: '#1b7431', // Theme green color from UI
    color: '#ffffff',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',

  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#555555',
    marginTop: '20px',
  },
  link: {
    color: '#1b7431',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default RegisterPage;

