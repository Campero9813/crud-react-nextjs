import LoginForm from "@/src/components/LoginForm";

export default function Home() {
  return <LoginForm />
}

/* import UserList from "@/src/components/UserList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">CRUD de Usuarios</h1>
      <Link
        href="/users/new"
        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
      >
        Agregar Usuario
      </Link>
      <UserList />
    </main>
  );
} */