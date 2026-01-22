import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Clients from './pages/Clients';
import Movements from './pages/Movements';
import Ventas from './pages/Ventas';
import ClientAccount from './pages/ClientAccount';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/clientes/:id/cuenta" element={<ClientAccount />} />
          <Route path="/movimientos" element={<Movements />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
