'use client';

import { useEffect, useState }from 'react';
import { useParams, useRouter } from 'next/navigation';

type Perfil = {
    id_usuario: number;
    nombre: string;
    telefono: string;
    correo: string;
    imagen_perfil: string;
};

export default function PerfilPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id as string;
    const router = useRouter();

    const [perfil, setPerfil] = useState<Perfil>({
        id_usuario: Number(id),
        nombre: '',
        telefono: '',
        correo: '',
        imagen_perfil: ''
    });

    const [loading, setLoading] = useState(true);
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
        if(!id) return;

        fetch(`/api/info_users/${id}`)
        .then((res) => res.json())
        .then((data) => {
            if (data && data.length > 0) {
                setPerfil(data[0]); // Ya existe, edición
                setIsNew(false);
            } else {
                // Usuario sin perfil, inicializamos vacío
                setPerfil({
                    id_usuario: Number(id),
                    nombre: '',
                    telefono: '',
                    correo: '',
                    imagen_perfil: ''
                });
                setIsNew(true);
            }
            setLoading(false);
        })
        .catch(() => {
            setPerfil({
                id_usuario: Number(id),
                nombre: '',
                telefono: '',
                correo: '',
                imagen_perfil: ''
            });
            setLoading(false);
        });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPerfil({...perfil, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = isNew ? '/api/info_users' : `/api/info_users/${id}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: perfil.id_usuario,
                nombre: perfil.nombre,
                telefono: perfil.telefono,
                correo: perfil.correo,
                imagen_perfil: perfil.imagen_perfil
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            setTimeout(() => router.push('/dashboards'), 100) //Regresamos a la lista de usuarios con delay para detectar el logeo
        } else {
            alert('Error: ' + data.message);
        }
    };
    if (loading) return <p className="text-center mt-4">Cargando Perfil...</p>

    return (
        <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {isNew ? 'Crear Perfil' : 'Editar Perfil'}
            </h2>
            <button
                type="button"
                onClick={() => {
                    setTimeout(() => router.push('/dashboards'), 100)
                }}
                className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                ← Regresar
            </button>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
                <div>
                    <label>Id Usuario: {perfil.id_usuario}</label>
                    <label className="block text-gray-700 font-semibold mb-1">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={perfil.nombre || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Telefono"
                        value={perfil.telefono || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Correo</label>
                    <input
                        type="text"
                        name="correo"
                        placeholder="Correo"
                        value={perfil.correo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Imagen de Perfil (URL)</label>
                    <input
                    type="text"
                    name="imagen_perfil"
                    value={perfil.imagen_perfil || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                    {isNew ? 'Crear' : 'Actualizar'}    
                </button>
            </form>
        </div>
    )

}