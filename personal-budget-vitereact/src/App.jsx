import React, { useState, useEffect } from "react";
import "./App.scss";
import { Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./components/Menu";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import BudgetsPage from "./pages/BudgetsPage";
import ExpensesPage from "./pages/ExpensesPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./context/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const theme = createTheme({
  palette: {
    primary: {
      main: '#E6969A', 
    },
    secondary: {
      main: '#FFC107',
    },
    error: {
      main: '#E65B10', 
    },
    success: {
      main: '#43A047', 
    },
    info: {
      main: '#1976D2', 
    },
    warning: {
      main: '#FF9800', 
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontFamily: 'Pacifico, cursive',
    },
    h2: {
      fontFamily: 'Pacifico, cursive',
    },
    h3: {
      fontFamily: 'Pacifico, cursive',
    },
    h4: {
      fontFamily: 'Pacifico, cursive',
    },
    h5: {
      fontFamily: 'Pacifico, cursive',
    },
    h6: {
      fontFamily: 'Pacifico, cursive',
    },
  },
});


function App() {
  const { isAuthenticated, logout } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    let timer;

    if (token) {
      const expirationTime = new Date().getTime() + 60000; 
      const remaining = expirationTime - new Date().getTime();
      console.log(expirationTime, new Date().getTime(), remaining);
      setRemainingTime(remaining);

      timer = setInterval(() => {
        const remaining = expirationTime - new Date().getTime();
        setRemainingTime(remaining);

        if (remaining <= 20000) {
          console.log("timer called");
          setShowDialog(true);
        }
      }, 1000); // Update remaining time every second

      return () => clearInterval(timer);
    }
  }, [token]);

  const handleStayLoggedIn = async () => {
    // Handle user choosing to stay logged in
    // Implement any necessary actions to refresh the token or extend the session
    fetch("http://54.226.243.159:3000/users/refreshToken", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => response.json())
      .then((response) => {
      console.log("response", response);
      const newToken = response.token;
      console.log("newToken", newToken);
      localStorage.setItem("token", newToken);
      setShowDialog(false);
      console.log("Token refreshed", showDialog);
    }).catch((error) => {
      setShowDialog(false);
      navigate("/login");
      console.log("Error refreshing token:", err);
      alert("Error refreshing token. Redirect to login page", err);
    });
  };

  const handleLogout = () => {
    // Handle user choosing to logout
    setShowDialog(false);
    logout();
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {showDialog && (
          <Dialog
            open={showDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Want to Stay Logged in?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Your session will expire in {Math.floor(remainingTime / 1000)}{" "}
                seconds. Click Stay Logged in or Refresh the screen to stay
                here.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleStayLoggedIn}>Stay Logged in</Button>
              <Button onClick={handleLogout}>Logout</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>

      <Menu />
      <div className="mainContainer">
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/Budgets" element={<BudgetsPage />} />
              <Route path="/Expenses" element={<ExpensesPage />} />
            </>
          ) : (
            <Route path="/login" element={<LoginPage />} />
          )}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>

      <Footer />
    </ThemeProvider>
  );
}

export default App;
