import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import API from "../../services/api";

export type UserRole = "medecin" | "patient" | "admin";

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  specialite?: string;
  carteVerifiee?: boolean;
  phone?: string;
  dateOfBirth?: string;
  hospitalOrClinic?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface SignupData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: "patient" | "medecin";
  specialite?: string;
  telephone?: string;
  dateNaissance?: string;
  carteMedicale?: File;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendUserToFrontendUser(backendUser: any): User {
  const fullName = backendUser.fullName || "";
  const nameParts = fullName.trim().split(" ");
  const prenom = nameParts[0] || "";
  const nom = nameParts.slice(1).join(" ") || "";

  return {
    id: backendUser._id || backendUser.id,
    nom,
    prenom,
    email: backendUser.email,
    role:
      backendUser.role === "doctor"
        ? "medecin"
        : backendUser.role === "patient"
        ? "patient"
        : "admin",
    specialite: backendUser.specialty || "",
    carteVerifiee: backendUser.role === "doctor" ? !!backendUser.isApproved : true,
    phone: backendUser.phone || "",
    dateOfBirth: backendUser.dateOfBirth || "",
    hospitalOrClinic: backendUser.hospitalOrClinic || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      const mappedUser = mapBackendUserToFrontendUser(res.data.user);

      localStorage.setItem("user", JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (error: any) {
      throw error?.response?.data?.message || "Email ou mot de passe incorrect.";
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    try {
      const fullName = `${data.prenom} ${data.nom}`.trim();

      if (data.role === "patient") {
        await API.post("/auth/register", {
          fullName,
          email: data.email,
          password: data.password,
          role: "patient",
          phone: data.telephone || "",
          dateOfBirth: data.dateNaissance || "",
        });
        return;
      }

      await API.post("/auth/register", {
        fullName,
        email: data.email,
        password: data.password,
        role: "doctor",
        specialty: data.specialite || "",
        licenseNumber: "TEMP-LICENSE",
        hospitalOrClinic: "À renseigner",
      });
    } catch (error: any) {
      throw error?.response?.data?.message || "Erreur lors de l'inscription.";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}