import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { TextInput, PasswordInput } from "../../components/inputs";

export default function Login() {
  const { login, loginLoading } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginLoading) return; // blocks a double submit
    setError("");

    const result = await login(form);
    // On success we do nothing here: PublicOnlyRoute sees authUser and redirects.
    if (!result.success) setError(result.message);
  };

  return (
    <section className="auth-card" aria-labelledby="login-heading">
      <div className="auth-card-header">
        <h1 id="login-heading" className="font-display text-3xl font-bold">
          Welcome back
        </h1>
        <p className="mt-1">Log in to share your next story.</p>
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
          autoComplete="current-password"
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

        <button type="submit" disabled={loginLoading} className="btn-primary">
          {loginLoading ? "Logging in…" : "Log in"}
        </button>

        <p className="text-center">
          No account yet?{" "}
          <Link to="/signup" className="font-bold underline decoration-sun decoration-4 underline-offset-4 hover:decoration-rose">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}