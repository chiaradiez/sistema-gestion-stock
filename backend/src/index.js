// backend/src/index.js
const express = require('express');
const cors = require('cors'); // Para permitir peticiones desde el frontend
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Para entender JSON
app.use(cors());         // Para que el frontend no tenga errores de seguridad

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('✅ Servidor Stock funcionando correctamente');
});

// Rutas de PRODUCTOS
app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.producto.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { nombre, sku, precio, stock } = req.body;
        const newProduct = await prisma.producto.create({
            data: { nombre, sku, precio, stock }
        });
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: 'Error creando producto. El SKU debe ser único.' });
    }
});

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});