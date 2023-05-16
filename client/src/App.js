import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import FileUpload from "./components/FileUpload";
import { UserProvider } from "./context/UserContext";
import PrivateRoute from "./components/PrivateRoute";
import axios from "axios";

function App() {
  const [user, setUser] = useState({
    token: undefined,
    user: undefined,
    loggedIn: false,
  });
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await axios.post("api/user/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });
      if (tokenRes.data) {
        const userRes = await axios.get("api/user", {
          headers: { "x-auth-token": token },
        });
        setUser({
          token,
          user: userRes.data,
          loggedIn: true,
        });
      }
    };

    checkLoggedIn();
  }, []);
  return (
    <Router>
      <UserProvider value={{ user, setUser }}>
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route exact path="/register" component={SignUp} />
          <>
            <div style={{ display: "flex" }}>
              <ResponsiveDrawer />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/fileUpload" component={FileUpload} />
            </div>
          </>
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;
