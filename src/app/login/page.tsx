"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useUser } from "@/context/UserContext";

const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Login gagal");
  }
};

const getCurrentUser = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(form.username, form.password);
      const userData = await getCurrentUser();

      // ❌ Cek role 4 dan 5 → tolak
      if ([4, 5].includes(Number(userData.ROLE))) {
        setError("Anda tidak memiliki hak akses ke aplikasi ini.");
        return; // stop di sini, jangan setUser
      }

      // ✅ hanya setUser kalau role valid
      setUser({
        id: userData.USER_ID,
        username: userData.USERNAME,
        role: Number(userData.ROLE),
        nama: userData.NAMA,
        email: userData.EMAIL,
        kd_unit: userData.KD_UNIT,
        nama_unit: userData.upt?.NM_UNIT ?? null,
      });

      router.replace("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
