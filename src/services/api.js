const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api' 
  : 'https://appweb-backend-production.up.railway.app/api';

// Función auxiliar para obtener el ID del usuario actual logueado
const getUserIdActual = () => {
    const usuario = JSON.parse(localStorage.getItem('appweb_usuario') || '{}');
    return usuario.id || null;
};

// Obtener datos del usuario (estrellas, nivel, racha)
export const getUsuario = async () => {
    try {
        const userId = getUserIdActual();
        const response = await fetch(`${API_URL}/usuario${userId ? `?user_id=${userId}` : ''}`);
        if (!response.ok) throw new Error('Error al obtener el usuario');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

// Obtener la lista de materias (mundos)
export const getMaterias = async () => {
    try {
        const response = await fetch(`${API_URL}/materias`);
        if (!response.ok) throw new Error('Error al obtener las materias');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
};

// Sumar o restar estrellas al completar misiones o abrir cofres
export const sumarEstrellas = async (cantidad) => {
    try {
        const userId = getUserIdActual();
        const response = await fetch(`${API_URL}/usuario/estrellas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: userId,
                estrellas: cantidad 
            })
        });
        const data = await response.json();

        // Actualizamos inmediatamente el localStorage para que el Header lo refleje al instante
        const usuarioGuardado = JSON.parse(localStorage.getItem('appweb_usuario') || '{}');
        if (usuarioGuardado.estrellas !== undefined) {
            usuarioGuardado.estrellas += cantidad; // Suma si es positivo, resta si es negativo (-30)
            localStorage.setItem('appweb_usuario', JSON.stringify(usuarioGuardado));
        }

        return data;
    } catch (error) {
        console.error("Error:", error);
        return { success: false };
    }
};

// Registrar cuenta nueva en la BD
export const registrarUsuario = async (datos) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(datos)
        });
        return await response.json();
    } catch (error) {
        console.error("Error en registro:", error);
        return { success: false, message: 'Error de red' };
    }
};

// Iniciar sesión con cuenta existente
export const loginUsuario = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    } catch (error) {
        console.error("Error en login:", error);
        return { success: false, message: 'Error de red' };
    }
};

// Obtener los trofeos del usuario desde la BD
export const getTrofeosAPI = async () => {
    try {
        const userId = getUserIdActual();
        const response = await fetch(`${API_URL}/trofeos${userId ? `?user_id=${userId}` : ''}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener trofeos:", error);
        return [];
    }
};

// Desbloquear un trofeo en la BD y sumar su recompensa
export const desbloquearTrofeoAPI = async (slug, recompensa) => {
    try {
        const userId = getUserIdActual();
        const response = await fetch(`${API_URL}/trofeos/desbloquear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ 
                user_id: userId,
                trofeo_slug: slug, 
                recompensa: recompensa 
            })
        });
        return await response.json();
    } catch (error) {
        console.error("Error al desbloquear trofeo:", error);
        return { success: false };
    }
};

// Obtener accesorios de la mochila desde la BD
export const getMochilaAPI = async () => {
    try {
        const userId = getUserIdActual();
        const response = await fetch(`${API_URL}/mochila${userId ? `?user_id=${userId}` : ''}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al cargar mochila:", error);
        return [];
    }
};

// Guardar accesorio desbloqueado en la BD
export const desbloquearAccesorioAPI = async (accesorioSlug) => {
    try {
        const userId = getUserIdActual();
        const response = await fetch(`${API_URL}/mochila/desbloquear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: userId,
                accesorio_slug: accesorioSlug 
            })
        });
        return await response.json();
    } catch (error) {
        console.error("Error al desbloquear accesorio:", error);
        return { success: false };
    }
};

// Crear una nueva materia desde el panel de admin
export const crearMateriaAPI = async (datosMateria) => {
    try {
        const response = await fetch(`${API_URL}/materias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(datosMateria)
        });
        return await response.json();
    } catch (error) {
        console.error("Error al crear materia:", error);
        return { success: false, message: 'Error de red' };
    }
};

// Iniciar sesión como Administrador
export const loginAdminAPI = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    } catch (error) {
        console.error("Error en login de admin:", error);
        return { success: false, message: 'Error de red' };
    }
};

export const crearMundoCompletoAPI = async (datosMundo) => {
    try {
        const response = await fetch(`${API_URL}/admin/mundo-completo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(datosMundo)
        });
        return await response.json();
    } catch (error) {
        console.error("Error al crear mundo completo:", error);
        return { success: false, message: 'Error de red' };
    }
};

// Confirmar pago de Stripe y activar pase ilimitado
export const confirmarPagoStripe = async (paymentIntentId) => {
    try {
        const userId = getUserIdActual();

        const response = await fetch(`${API_URL}/stripe/confirmar-pago`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                payment_intent_id: paymentIntentId,
                user_id: userId
            })
        });

        const data = await response.json();

        if (data.success && data.usuario) {
            localStorage.setItem(
                'appweb_usuario',
                JSON.stringify(data.usuario)
            );
        }

        return data;

    } catch (error) {
        console.error("Error al confirmar pago de Stripe:", error);

        return {
            success: false,
            message: 'Error de conexión al confirmar el pago.'
        };
    }
};