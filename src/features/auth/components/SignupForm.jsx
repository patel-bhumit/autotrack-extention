import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "../../../components/mode-toggle"

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

export function SignupForm() {

  const { signup, currentUser } = useAuth(); // Get the signup method from AuthProvider
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To handle any errors
  const [loading, setLoading] = useState(false); // To prevent multiple submissions
  const navigate = useNavigate();
  
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password, firstName, lastName); // Call the signup function
      navigate("/")
    } catch (err) {
      setError("Failed to create an account. Please try again.");
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="h-screen items-center flex justify-center">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <ModeToggle />
        </div>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" onChange={(e) => setFirstName(e.target.value)} placeholder="Max" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" onChange={(e) => setLastName(e.target.value)} placeholder="Robinson" required />
              </div>
            </div>
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

            {/* Display any signup errors */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Create an account"}
            </Button>
            <Button variant="outline"  className="w-full">
              Sign up with GitHub
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
