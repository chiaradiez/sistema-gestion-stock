import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Table from '../components/Table';
import Card from '../components/Card';
import { Plus } from 'lucide-react';

const Movements = () => {
    const [movements, setMovements] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        items: [],
        productoId: '',
        cantidad: '',
        tipo: 'ENTRADA'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [movementsData, productsData] = await Promise.all([
                api.getMovements(),
                api.getProducts()
            ]);
            setMovements(movementsData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createMovement({
                productoId: formData.productoId,
                cantidad: formData.cantidad,
                tipo: formData.tipo
            });
            setFormData({ ...formData, productoId: '', cantidad: '' });
            loadData();
            alert('Movimiento registrado con éxito');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Movimientos de Stock</h1>

            {/* Formulario de Entrada/Ajuste */}
            <Card>
                <h2 className="text-lg font-medium mb-4 dark:text-white">Registrar Movimiento Manual</h2>
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Producto</label>
                        <select
                            value={formData.productoId}
                            onChange={(e) => setFormData({ ...formData, productoId: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                        >
                            <option value="">Seleccione Producto</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.cantidad}
                            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="w-40">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        >
                            <option value="ENTRADA">ENTRADA (+)</option>
                            <option value="SALIDA">SALIDA (-)</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Plus size={16} className="mr-2" /> Registrar
                    </button>
                </form>
            </Card>

            <Table headers={['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Cliente']}>
                {loading ? (
                    <tr><td colSpan="5" className="px-6 py-4 text-center dark:text-gray-300">Cargando...</td></tr>
                ) : movements.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-4 text-center dark:text-gray-300">No hay movimientos.</td></tr>
                ) : (
                    movements.map((mov) => (
                        <tr key={mov.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(mov.fecha).toLocaleString()}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                                {mov.tipo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{mov.producto?.nombre || 'Producto Eliminado'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{mov.cantidad}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{mov.cliente?.nombre || '-'}</td>
                        </tr>
                    ))
                )}
            </Table>
        </div>
    );
};

export default Movements;
