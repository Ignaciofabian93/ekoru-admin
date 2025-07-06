"use client";
import useAuth from "./_hooks/useAuth";

export default function AuthPage() {
  const { data, handleData, handleSubmit, loading, error } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold mb-2 text-center">Iniciar sesión</h1>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={data.email}
          onChange={(e) => handleData({ email: e.target.value })}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={data.password}
          onChange={(e) => handleData({ password: e.target.value })}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-primary text-black py-2 rounded font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
