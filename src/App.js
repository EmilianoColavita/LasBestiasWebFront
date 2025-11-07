import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Noticias from "./components/Noticias";
import NoticiaDetalle from "./components/NoticiaDetalle";
import Videos from "./components/Videos";
import Footer from "./components/Footer";
import Musica from "./components/Musica";
import MusicaCompleta from "./pages/MusicaCompleta";
import LoginPage from "./pages/Login";
import AdminNoticias from "./pages/AdminNoticias";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import ScrollToHashElement from "./components/ScrollToHashElement";
import ShowsPage from "./pages/ShowsPage";
import AdminEventos from "./pages/AdminEventos"; 
import Contacto from "./pages/Contacto";


function App() {
  return (
    <Router>
      <ScrollToHashElement />
      <div className="bg-black text-white">
        <Navbar />

        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Noticias />
                <Musica />
                <Videos />
              </>
            }
          />
          <Route path="/musica" element={<MusicaCompleta />} />
          <Route path="/noticia/:id" element={<NoticiaDetalle />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* 🛡️ Rutas de administración (protegidas) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="noticias" element={<AdminNoticias />} />
            <Route path="/admin/eventos" element={<AdminEventos />} />
            {/* futuras secciones */}
            {/* <Route path="musica" element={<AdminMusica />} /> */}
            {/* <Route path="videos" element={<AdminVideos />} /> */}
          </Route>
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
