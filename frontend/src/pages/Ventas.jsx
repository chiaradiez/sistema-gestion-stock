import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trash, Search, User, Minus, Plus, ShoppingCart, CheckCircle, ChevronUp, ChevronDown, X } from 'lucide-react';

const Ventas = () => {
    // Data States
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI/Filter States
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCartMobile, setShowCartMobile] = useState(false);

    // Transaction States
    const [cart, setCart] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [clientsData, productsData, categoriesData] = await Promise.all([
                api.getClients(),
                api.getProducts(),
                api.getCategories()
            ]);
            setClients(clientsData);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Cart Logic ---

    const addToCart = (product) => {
        if (product.stock <= 0) return;

        const existingItem = cart.find(item => item.product.id === product.id);
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                alert('Stock máximo alcanzado');
                return;
            }
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        const item = cart.find(i => i.product.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + delta;

        // Remove if 0
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // Check stock limit
        if (newQuantity > item.product.stock) {
            // alert('No hay suficiente stock');
            return;
        }

        setCart(cart.map(i =>
            i.product.id === productId ? { ...i, quantity: newQuantity } : i
        ));
    };

    const handleCheckout = async () => {
        if (!selectedClientId) return alert('Seleccione un cliente');
        if (cart.length === 0) return alert('El carrito está vacío');

        try {
            await api.createSale({
                clienteId: selectedClientId,
                items: cart.map(item => ({ productoId: item.product.id, cantidad: item.quantity }))
            });
            alert('¡Venta registrada con éxito!');
            setCart([]);
            setSelectedClientId('');
            setShowCartMobile(false);
            loadData(); // Update stock
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.product.precio * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // --- Filtering Logic ---
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'ALL' || p.categoriaId === selectedCategory;
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 overflow-hidden relative">

            {/* LEFT COL: CATALOG */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${showCartMobile ? 'hidden md:flex' : 'flex'}`}>

                {/* 1. Header & Filters */}
                <div className="p-4 bg-white dark:bg-gray-800 shadow-sm z-10">
                    <div className="flex flex-col space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar producto (Nombre, SKU)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {/* Category Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory('ALL')}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'ALL'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Product Grid */}
                <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
                    {loading ? (
                        <div className="text-center text-gray-500 mt-10">Cargando productos...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">No se encontraron productos.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20 md:pb-0">
                            {filteredProducts.map(product => {
                                const hasStock = product.stock > 0;
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => hasStock && addToCart(product)}
                                        className={`group relative flex flex-col justify-between p-4 rounded-xl border-2 transition-all duration-200 ${hasStock
                                                ? 'bg-white dark:bg-gray-800 border-transparent hover:border-indigo-500 cursor-pointer shadow-sm hover:shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                                            }`}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                                                {product.nombre}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                                        </div>

                                        <div className="mt-4 flex items-end justify-between">
                                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                ${product.precio}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${hasStock ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* FLOATING MOBILE CART SUMMARY */}
            {!showCartMobile && cart.length > 0 && (
                <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                    <button
                        onClick={() => setShowCartMobile(true)}
                        className="w-full bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/40 p-4 flex justify-between items-center animate-in slide-in-from-bottom duration-300"
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ShoppingCart size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs opacity-90">{totalItems} items</p>
                                <p className="font-bold text-lg">${total.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 font-medium text-sm">
                            Ver Carrito <ChevronUp size={16} />
                        </div>
                    </button>
                </div>
            )}

            {/* RIGHT COL: TICKET/CART (Responsive Overlay) */}
            <div className={`
                transition-transform duration-300 ease-in-out md:transform-none transform
                ${showCartMobile ? 'translate-y-0 fixed inset-0 z-50' : 'translate-y-full md:translate-y-0 fixed bottom-0 left-0 right-0 top-full md:static'}
                w-full md:w-96 bg-white dark:bg-gray-800 flex flex-col h-full shadow-xl
            `}>

                {/* Mobile Header (Close Button) */}
                <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShoppingCart size={20} className="text-indigo-600" /> Tu Carrito
                    </h2>
                    <button onClick={() => setShowCartMobile(false)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-white">
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* 1. Header (Client Select) */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cliente</h2>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        >
                            <option value="">-- Seleccionar Cliente --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 2. Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-50">
                            <ShoppingCart size={48} />
                            <p>El carrito está vacío</p>
                            <button onClick={() => setShowCartMobile(false)} className="md:hidden mt-4 text-indigo-600 font-medium">Volver al catálogo</button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} className="flex flex-col p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.product.nombre}</span>
                                    <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash size={16} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        ${(item.product.precio * item.quantity).toFixed(2)}
                                    </span>

                                    <div className="flex items-center space-x-3 bg-white dark:bg-gray-600 rounded-md shadow-sm border border-gray-200 dark:border-gray-500 px-1 py-0.5">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, -1)}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-500 rounded text-gray-600 dark:text-white"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-medium w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, 1)}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-500 rounded text-gray-600 dark:text-white"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 3. Footer (Totals & Action) */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pb-8 md:pb-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Total a Pagar</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || !selectedClientId}
                        className={`w-full py-4 px-6 rounded-xl shadow-lg flex justify-center items-center gap-2 text-white font-bold text-lg transition-all transform active:scale-95 ${cart.length > 0 && selectedClientId
                                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                            }`}
                    >
                        <CheckCircle size={24} />
                        CONFIRMAR VENTA
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Ventas;
