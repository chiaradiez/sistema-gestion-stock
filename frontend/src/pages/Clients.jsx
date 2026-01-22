import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Table from '../components/Table';
import Card from '../components/Card';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    // Mock form state
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', direccion: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getClients();
            setClients(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar cliente?')) return;
        try {
            await api.deleteClient(id);
            setClients(clients.filter(c => c.id !== id));
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newClient = await api.createClient(formData);
            setClients([...clients, newClient]);
            setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>

            <Card>
                <h2 className="text-lg font-medium mb-4 dark:text-white">Registrar Cliente</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} className="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600" />

                    <div className="sm:col-span-2">
                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Guardar Cliente
                        </button>
                    </div>
                </form>
            </Card>

            <Table headers={['Nombre', 'Email', 'Teléfono', 'Dirección']}>
                {loading ? (
                    <tr><td colSpan="4" className="px-6 py-4 text-center dark:text-gray-300">Cargando...</td></tr>
                ) : clients.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-4 text-center dark:text-gray-300">No hay clientes.</td></tr>
                ) : (
                    clients.map((client) => (
                        <tr key={client.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{client.nombre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{client.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{client.telefono}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{client.direccion}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <Link to={`/clientes/${client.id}/cuenta`} className="text-indigo-600 hover:text-indigo-900 bg-transparent border-0 p-0 mr-4">
                                    Ver Cuenta
                                </Link>
                                <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400 bg-transparent border-0 p-0">
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

export default Clients;
