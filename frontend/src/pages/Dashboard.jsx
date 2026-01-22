import React from 'react';
import { Package, Users, ArrowRightLeft, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const Dashboard = () => {
    const stats = [
        { label: 'Productos', value: 'Gestión', icon: <Package size={24} />, to: '/productos', color: 'bg-blue-500' },
        { label: 'Categorías', value: 'Gestión', icon: <Layers size={24} />, to: '/categorias', color: 'bg-green-500' },
        { label: 'Clientes', value: 'Gestión', icon: <Users size={24} />, to: '/clientes', color: 'bg-purple-500' },
        { label: 'Movimientos', value: 'Historial', icon: <ArrowRightLeft size={24} />, to: '/movimientos', color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} to={stat.to} className="block transform hover:scale-105 transition-transform duration-200">
                        <Card className="h-full">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <Card className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Bienvenido al Sistema de Gestión de Stock</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Seleccione una opción del menú superior o las tarjetas de arriba para comenzar a gestionar su inventario.
                </p>
            </Card>
        </div>
    );
};

export default Dashboard;
