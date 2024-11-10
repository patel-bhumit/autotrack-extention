import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import './index.css';
import { SignupForm } from "./features/auth/components/SignupForm";
import LoginForm from "./features/auth/components/LoginForm";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./features/pages/Dashboard";
import PrivateRoute from "./features/auth/components/PrivateRoute";



function App() {
  return (
    <main className={"font-sans min-w-[400px]"}>
    <MemoryRouter >
    <AuthProvider>
      <ThemeProvider storageKey="vite-ui-theme">
        
          <Routes>
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
            </Route>
            
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/signup" element={<SignupForm/>}/>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
    </MemoryRouter>
    </main>  
  )
}

export default App
