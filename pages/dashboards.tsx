import { useAuth } from '@/src/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import UserList from '../src/components/UserList';
import Link from 'next/link';

export default function Dashboard() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/"); //Si no esta logeado, enviar al login
        }
    }, [isAuthenticated, router]);

    if(!isAuthenticated) return null; //Mientras redirige no mostrar nada

    return (
        <main className='min-h-screen bg-gray-100 p-6'>
            <div className='flex justify-between mb-6'>
                <h1 className='text-3xl font-bold'>CRUD de Usuarios Prueba</h1>
                <button
                    onClick={logout}
                    className='bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700'
                >
                    Cerrar Sesion</button>
            </div>
            <Link
                href="/users/new"
                className='bg-green-600 text-white px-3 py-2'
            >
                Agregar Usuario
            </Link>
            <UserList />
        </main>
    );
    
}
