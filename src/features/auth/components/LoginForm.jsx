import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { ModeToggle } from "../../../components/mode-toggle"


export const description =
  "A simple login form with email and password. The submit button says 'Sign in'."

export default function LoginForm() {

  const {isAuthenticated, login} = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // To handle any errors
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // To prevent multiple submissions
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
  

    try {
      await login(email, password); // Call the signup function
      navigate("/")
    } catch (err) {
      setError("Failed to create an account. Please try again.");
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="h-screen items-center flex justify-center">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-2xl">Login</CardTitle>
          <ModeToggle />
        </div>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                placeholder="m@example.com"
                required
              />  
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                required
              />  
        </div>
      </CardContent>
      <div className="m-2 text-center text-sm">
            Do not have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
      </div>

      <CardFooter>
      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
      </CardFooter>

        
    </Card>
    </div>
  )
}
