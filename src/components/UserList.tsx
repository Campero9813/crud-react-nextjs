'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    id: number;
    username: string;
    created_at: string;
    activo: 'Y'|'N';
};

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUsers = () => {
        fetch('/api/users')
        .then((res) => res.json())
        .then((data) => {
            setUsers(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error al cargar los usuarios', error);
            setLoading(false);
        });
    };

    useEffect(()=>{
        fetchUsers();
    }, []);

    const handleReactivate = async (id: number) => {
        try {
            const res = await fetch('/api/users/reactivate', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({ id }),
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                fetchUsers(); //Actualizar Lista
            }else{
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error al reactivar el usuario: ', error);
        }
    }

    const handleDelete = async (id: number) => {
        const confirm = window.confirm(`¿Seguro que deseas eliminar al usaurio con ID ${id}?`);
        if(!confirm) return;
        try {
            const res = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id})
            });

            const data = await res.json();

            if(res.ok){
                alert(data.message);
                fetchUsers(); //Actualiza la lista
            }else{
                alert('Error: ' + data.message)
            }
        } catch (error) {
            console.error('Error al borrar el usuario: ', error);
        }
    };

    if (loading) return <p className="text-center mt-4">Cargando Usuarios...</p>;

    if (users.length === 0) return <p className="text-center mt-4">No hay usuarios.</p>

    return (
        <div className='max-w-4xl mx-auto mt-8'>
            <h2 className='text-2xl font-bold mb-4 text-center'>Usuarios</h2>
            <table className='w-full border-collapse border border-gray-300'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='border px-4 py-2'>ID</th>
                        <th className='border px-4 py-2'>Username</th>
                        <th className='border px-4 py-2'>Creado</th>
                        <th className='border px-4 py-2'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className={`text-center ${user.activo === 'N' ? 'bg-yellow-100' : ''}`}>
                            <td className='border px-4 py-2'>{user.id}</td>
                            <td className='border px-4 py-2'>{user.username}</td>
                            <td className='border px-4 py-2'>{new Date(user.created_at).toLocaleString()}</td>
                            <td className='border px-4 py-2'>
                                {user.activo === 'Y' ? ( 
                                    <>
                                        <button 
                                            className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600'
                                            onClick={() => router.push(`/perfil/${user.id}`)} // 👈 Nuevo botón
                                        >
                                            Crear/Editar Perfil
                                        </button>
                                        <button className='bg-red-500 text-while px-2 py-1 rounded hover: bg-red-600' onClick={() => handleDelete(user.id)}>
                                            Borrar
                                        </button>
                                    </>
                                ) : (
                                    <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" onClick={() => handleReactivate(user.id)}>
                                        Activar Usuario
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}