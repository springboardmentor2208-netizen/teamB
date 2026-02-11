import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");


  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("cs_user", JSON.stringify(userData));
    localStorage.setItem("cs_token", jwt);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("cs_user");
    localStorage.removeItem("cs_token");
  };

  //Sample login for dev
  const devLogin = () => {
    const fakeUser = {
      _id: "dev-user-1",
      name: "Demo Citizen",
      email: "[email protected]",
      role: "user",
    };
    const fakeToken = "dev-token";
    login(fakeUser, fakeToken);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("cs_user");
    const savedToken = localStorage.getItem("cs_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, devLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
