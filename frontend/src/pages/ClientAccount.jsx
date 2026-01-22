import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import { DollarSign } from 'lucide-react';

const ClientAccount = () => {
    const { id } = useParams();
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    // Payment Form
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const data = await api.getClientAccount(id);
            setMovements(data);

            // Calculate Balance (Positive = Debt for the client)
            // COMPRA adds to debt, PAGO subtracts from debt
            const currentBalance = data.reduce((acc, mov) => {
                const amount = parseFloat(mov.monto);
                return mov.tipo === 'COMPRA' ? acc + amount : acc - amount;
            }, 0);
            setBalance(currentBalance);
        } catch (error) {
            console.error(error);
            alert('Error cargando cuenta corriente');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            await api.registerPayment({
                clienteId: id,
                monto: paymentAmount,
                metodoPago: paymentMethod,
                descripcion: description
            });
            alert('Pago registrado con éxito');
            setPaymentAmount('');
            setDescription('');
            loadData(); // Reload to update balance and list
        } catch (error) {
            alert('Error registrando pago: ' + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign /> Cuenta Corriente
            </h1>

            {/* Balance Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={balance > 0 ? "border-l-4 border-red-500" : "border-l-4 border-green-500"}>
                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Saldo Actual</h2>
                    <p className={`text-3xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${balance.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {balance > 0 ? 'El cliente debe dinero.' : 'El cliente está al día o tiene saldo a favor.'}
                    </p>
                </Card>

                {/* Payment Form */}
                <Card>
                    <h2 className="text-lg font-medium mb-4 dark:text-white">Registrar Pago</h2>
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Método</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                    <option value="TARBETA">Tarjeta</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Nota opcional..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                            Registrar Pago
                        </button>
                    </form>
                </Card>
            </div>

            {/* History Table */}
            <Card>
                <h2 className="text-lg font-medium mb-4 dark:text-white">Historial de Movimientos</h2>
                <Table headers={['Fecha', 'Tipo', 'Descripción', 'Monto']}>
                    {loading ? (
                        <tr><td colSpan="4" className="px-6 py-4 text-center dark:text-gray-300">Cargando...</td></tr>
                    ) : movements.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-4 text-center dark:text-gray-300">No hay movimientos registrados.</td></tr>
                    ) : (
                        movements.map((mov) => (
                            <tr key={mov.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {new Date(mov.fecha).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                    <span className={mov.tipo === 'COMPRA' ? 'text-red-500' : 'text-green-500'}>
                                        {mov.tipo}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {mov.descripcion} {mov.metodoPago ? `(${mov.metodoPago})` : ''}
                                    {mov.venta?.items && (
                                        <div className="mt-1 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                            <ul className="list-disc pl-4">
                                                {mov.venta.items.map(item => (
                                                    <li key={item.id}>
                                                        {item.cantidad} x {item.producto?.nombre || 'Producto'} (${item.producto?.precio})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${mov.tipo === 'COMPRA' ? 'text-red-600' : 'text-green-600'}`}>
                                    ${parseFloat(mov.monto).toFixed(2)}
                                </td>
                            </tr>
                        ))
                    )}
                </Table>
            </Card>
        </div>
    );
};

export default ClientAccount;
