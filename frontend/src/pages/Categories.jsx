import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Table from '../components/Table';
import Card from '../components/Card';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar categoría?')) return;
        try {
            await api.deleteCategory(id);
            loadData();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createCategory({ nombre });
            setNombre('');
            loadData();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categorías</h1>

            <Card>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nueva Categoría
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="Ej: Periféricos"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Agregar
                    </button>
                </form>
            </Card>

            <Table headers={['ID', 'Nombre']}>
                {loading ? (
                    <tr><td colSpan="2" className="px-6 py-4 text-center dark:text-gray-300">Cargando...</td></tr>
                ) : categories.length === 0 ? (
                    <tr><td colSpan="2" className="px-6 py-4 text-center dark:text-gray-300">No hay categorías.</td></tr>
                ) : (
                    categories.map((cat) => (
                        <tr key={cat.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{cat.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cat.nombre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400 bg-transparent border-0 p-0">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </Table>
        </div>
    );
};

export default Categories;
