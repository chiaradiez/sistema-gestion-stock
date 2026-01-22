// const API_URL = 'http://localhost:3000/api';
// Ahora (Para producción)
const API_URL = "https://mi-stock-api.onrender.com/api";

/**
 * Generic fetch wrapper to handle errors and JSON parsing.
 */
async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    // Products
    getProducts: () => request('/products'),
    createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
    deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

    // Categories
    getCategories: () => request('/categories'),
    createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
    deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

    // Clients
    getClients: () => request('/clients'),
    createClient: (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
    deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),

    // Movements & Sales
    getMovements: () => request('/movements'),
    createMovement: (data) => request('/movements', { method: 'POST', body: JSON.stringify(data) }),
    createSale: (data) => request('/sales', { method: 'POST', body: JSON.stringify(data) }),

    // Account Current
    getClientAccount: (id) => request(`/clients/${id}/account`),
    registerPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),

};
