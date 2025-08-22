import { useState } from 'react';
import { useRouter } from 'next/router';

type FormState = {
    username: string;
    password: string;
    activo: 'Y' | 'N';
}

export default function NewUserPage(){
    const router = useRouter();
    const [form, setForm] = useState<FormState>({ username: '', password: '', activo: 'Y'});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if(!form.username || !form.password){
            setError('Usuario y contraseña son requeridos');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form),
                // credentials: "include", //Envia cookie al token
            });

            const data = await res.json();
            if (res.status === 201 ){
                //Success -> Regresar al listado despues de guardar
                router.push('/dashboards');
            }else {
                setError(data?.message || 'Error al guardar')
            }
        } catch {
            setError('Error de red o del servidor');
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => router.push('/dashboards');

    return (
        <main className='min-h-screen bg-gray-100 p-6'>
            <div className='max-w-xl mx-auto bg-white rounded-lg shadow p-6'>
                {/* Barra superior con boton volver */}
                <div className='mb-6 flex items-center gap-3'>
                    <button onClick={() => router.push('/')} className='text-blue-600 hover:underline flex items-center'>
                        <span className='mr-1'>←</span>Volver
                    </button>
                    <h1 className='text-2x1 font-bold mx-auto'>Agregar Usuario</h1>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Username</label>
                        <input 
                            type="text"
                            className='w-full border rounded px-3 py-2'
                            value={form.username}
                            onChange={(e) => setForm({...form, username: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-1'>Contraseña</label>
                        <input 
                            type="password"
                            className='w-full border rounded px-3 py-2'
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                        />
                    </div>

                    <div>
                        <label>Usuario Activo</label>
                        <select 
                            className='w-full border rounded px-3 py-2'
                            value={form.activo}
                            onChange={(e) => setForm({...form, activo: e.target.value as 'Y' | 'N'})}
                        >
                            <option value='Y'>Sí (Activo)</option>
                            <option value='N'>No (Inactivo)</option>
                        </select>
                    </div>
                    
                    {error && <p className='text-red-600 text-sm'>{error}</p>}

                    <div className='flex gap-2'>
                        <button
                            type='submit'
                            disabled={loading}
                            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60'
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type='button'
                            onClick={handleCancel}
                            className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </main>

    );

}