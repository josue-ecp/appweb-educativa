import { useState, useEffect } from 'react'
import Header from './components/Header'
import AventuraView from './components/AventuraView'
import PreguntasView from './components/PreguntasView'
import Navbar from './components/Navbar'
import MisionesView from './components/MisionesView'
import TiendaView from './components/TiendaView'
import TrofeosView from './components/TrofeosView'
import MochilaView from './components/MochilaView'
import MascotaView from './components/MascotaView'
import LoginView from './components/LoginView'
import AdminView from './components/AdminView'
import PlanesModal from './components/PlanesModal'
import CheckoutForm from './components/CheckoutForm'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { getUsuario } from './services/api'
import './index.css'

const stripePromise = loadStripe('pk_test_51R894YRsY0EF16lUosBbp992DrQLogjnxYjESTrDDN8yMJhTT7NsAUxqsaAXf9mEMaOjFI8MRjG1wHacKqYP5u400q3QAYWGQ');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('appweb_usuario') || localStorage.getItem('appweb_admin') ? true : false;
  })
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('appweb_admin') ? true : false;
  })

  const [view, setView] = useState('aventura')
  const [subject, setSubject] = useState(null)
  
  const [tiempoAgotado, setTiempoAgotado] = useState(false)
  const [tiempoRestanteStr, setTiempoRestanteStr] = useState('15:00')
  const [paqueteSeleccionadoStripe, setPaqueteSeleccionadoStripe] = useState(null)
  
  const [usuario, setUsuario] = useState(() => {
    const adminGuardado = localStorage.getItem('appweb_admin');
    if (adminGuardado) return JSON.parse(adminGuardado);

    const usuarioGuardado = localStorage.getItem('appweb_usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : {
      nombre: 'Explorador',
      nivel: 4,
      estrellas: 128,
      dias_racha: 5,
      pase_ilimitado: false
    }
  })

  // Temporizador de sesión (Omitido si el usuario ya compró el pase ilimitado o es Admin)
  useEffect(() => {
    if (isAdmin || !isLoggedIn) return;

    // Si ya tiene el pase ilimitado, no iniciamos temporizador
    if (usuario.pase_ilimitado) {
      setTiempoRestanteStr('Ilimitado ♾️');
      return;
    }

    const TIEMPO_LIMITE = 10 * 1000; // 10 segundos para pruebas (Cámbialo a 15 * 60 * 1000 cuando gustes)
    let inicioSesion = sessionStorage.getItem('appweb_inicio_tiempo');
    
    if (!inicioSesion) {
      inicioSesion = Date.now();
      sessionStorage.setItem('appweb_inicio_tiempo', inicioSesion);
    }

    const intervalo = setInterval(() => {
      const tiempoTranscurrido = Date.now() - parseInt(inicioSesion);
      const tiempoRestante = TIEMPO_LIMITE - tiempoTranscurrido;

      if (tiempoRestante <= 0) {
        setTiempoAgotado(true);
        setTiempoRestanteStr('00:00');
        clearInterval(intervalo);
      } else {
        const minutos = Math.floor(tiempoRestante / 60000);
        const segundos = Math.floor((tiempoRestante % 60000) / 1000);
        setTiempoRestanteStr(`${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [isLoggedIn, isAdmin, usuario.pase_ilimitado]);

  const handleLoginSuccess = (datosLogin) => {
    setUsuario(datosLogin);
    setIsAdmin(false);
    setIsLoggedIn(true);
    setTiempoAgotado(false);
    
    if (!datosLogin.pase_ilimitado) {
      setTiempoRestanteStr('15:00');
      sessionStorage.setItem('appweb_inicio_tiempo', Date.now());
    } else {
      setTiempoRestanteStr('Ilimitado ♾️');
    }
    
    localStorage.setItem('appweb_usuario', JSON.stringify(datosLogin));
    localStorage.removeItem('appweb_admin');
  }

  const handleAdminLoginSuccess = (adminData) => {
    setUsuario(adminData);
    setIsAdmin(true);
    setIsLoggedIn(true);
    setTiempoAgotado(false);
    setView('admin');
    localStorage.setItem('appweb_admin', JSON.stringify(adminData));
    localStorage.removeItem('appweb_usuario');
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setSubject(null);
    setView('aventura');
    setTiempoAgotado(false);
    setTiempoRestanteStr('15:00');
    setPaqueteSeleccionadoStripe(null);
    localStorage.removeItem('appweb_usuario');
    localStorage.removeItem('appweb_admin');
    sessionStorage.removeItem('appweb_inicio_tiempo');
  }

  const startSubject = (selectedSubject) => {
    setSubject(selectedSubject)
    setView('preguntas')
  }

  const goHome = () => {
    setSubject(null)
    setView('aventura')
  }

  const handleRefreshUser = async () => {
  if (!isAdmin) {
    const data = await getUsuario();

    if (data) {
      const usuarioCombinado = {
        ...data,
        pase_ilimitado: Boolean(data.pase_ilimitado)
      };

      setUsuario(usuarioCombinado);

      localStorage.setItem(
        'appweb_usuario',
        JSON.stringify(usuarioCombinado)
      );
    }
  }
};

  const comprarPlanStripe = (paquete) => {
    setPaqueteSeleccionadoStripe(paquete);
  };

  if (!isLoggedIn) {
    return (
      <LoginView 
        onLoginSuccess={handleLoginSuccess} 
        onAdminLoginSuccess={handleAdminLoginSuccess} 
      />
    );
  }

  if (isAdmin && view === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 flex flex-col w-full m-0 p-0">
        <div className="w-full flex-1 flex flex-col h-screen relative overflow-y-auto">
          <AdminView 
            onVolver={handleLogout} 
            onIrAppPublica={() => setView('aventura')} 
          />
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (view === 'preguntas' && subject) {
      return <PreguntasView subject={subject} onBack={goHome} onStar={handleRefreshUser} />
    }
    if (view === 'misiones') {
       return <MisionesView onAddStars={handleRefreshUser} />
    } 
    if (view === 'tienda') {
       return <TiendaView stars={usuario.estrellas} onUpdateUser={handleRefreshUser} />
    }
    if (view === 'mascota') {
       return <MascotaView usuario={usuario} onUpdateUser={handleRefreshUser} />
    }
    if (view === 'trofeos') {
       return <TrofeosView stars={usuario.estrellas} />
    }
    if (view === 'mochila') {
       return <MochilaView stars={usuario.estrellas} onUpdateUser={handleRefreshUser} />
    }
    if (view !== 'aventura') {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center my-auto min-h-[60vh]">
          <span className="text-5xl mb-3 animate-bounce">🌿</span>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">PRÓXIMAMENTE</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">Estamos preparando una nueva aventura increíble en el bosque para ti.</p>
          <button 
            onClick={goHome}
            className="mt-6 px-8 py-3 bg-emerald-500 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-600 transition transform hover:scale-105 cursor-pointer"
          >
            Volver a Aventura
          </button>
        </div>
      )
    }
    return <AventuraView onStart={startSubject} />
  }

  return (
    <div className="min-h-screen bg-[#f4fbf7] flex flex-col w-full m-0 p-0 font-sans">
      <div className="w-full flex-1 bg-[#f4fbf7] flex flex-col h-screen relative shadow-none border-0 overflow-hidden">
        
        <Header usuario={usuario} onLogout={handleLogout} tiempoRestante={usuario.pase_ilimitado ? 'Ilimitado ♾️' : tiempoRestanteStr} />
        
        {isAdmin && (
          <div className="bg-emerald-900 text-white px-4 py-2 flex justify-between items-center text-xs font-black shadow-md z-20 border-b border-emerald-800">
            <span>🌿 Modo Vista Previa (Administrador del Bosque)</span>
            <button 
              onClick={() => setView('admin')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition cursor-pointer shadow-xs"
            >
              ⚙️ Volver al Panel Docente
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pb-28 md:pb-24">
          <div className="max-w-5xl mx-auto w-full px-4 md:px-6">
            {renderView()}
          </div>
        </div>
        <Navbar activeView={view === 'preguntas' ? 'aventura' : view} onNavigate={(nextView) => { setSubject(null); setView(nextView) }} />
      </div>

      {/* Modal de Planes (Solo aparece si el tiempo se agotó y NO tiene pase ilimitado) */}
      {tiempoAgotado && !usuario.pase_ilimitado && !paqueteSeleccionadoStripe && (
        <PlanesModal onComprarStripe={comprarPlanStripe} />
      )}

      {/* Modal de Tarjeta 3D Interactiva */}
      {paqueteSeleccionadoStripe && (
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            paquete={paqueteSeleccionadoStripe} 
            onClose={() => {
              setPaqueteSeleccionadoStripe(null);
              setTiempoAgotado(false);
            }} 
            onUpdateUser={handleRefreshUser} 
          />
        </Elements>
      )}
    </div>
  )
}

export default App