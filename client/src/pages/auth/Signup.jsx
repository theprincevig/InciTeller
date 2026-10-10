import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { TextInput, PasswordInput } from "../../components/inputs/index.js";

export default function Signup() {
  const { signup, signupLoading } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signupLoading) return; // blocks a double submit
    setError("");

    const result = await signup(form);
    // The server logs the user in on register, so PublicOnlyRoute redirects home.
    if (!result.success) setError(result.message);
  };

  return (
    <section className="auth-card" aria-labelledby="signup-heading">
      <div className="auth-card-header">
        <h1 id="signup-heading" className="font-display text-3xl font-bold">
          Join InciTeller
        </h1>
        <p className="mt-1">Two fields and you're in. Add your name later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <TextInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={form.email}
          onChange={handleChange}
          required
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          hint="8 to 72 characters."
          minLength={8}
          maxLength={72}
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && (
          <p role="alert" className="form-alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={signupLoading} className="btn-primary">
          {signupLoading ? "Creating account…" : "Sign up"}
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-bold underline decoration-sun decoration-4 underline-offset-4 hover:decoration-rose">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}