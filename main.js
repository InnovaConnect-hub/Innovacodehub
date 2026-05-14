// 1. IMPORTACIONES DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE (¡Arreglado el appId!)
const firebaseConfig = {
  apiKey: "AIzaSyB_6x_Y3k2G8nGj9C4gHNy1EI-cdV-75ek",
  authDomain: "innovacodehub.firebaseapp.com",
  projectId: "innovacodehub",
  storageBucket: "innovacodehub.firebasestorage.app",
  messagingSenderId: "280891701438",
  appId: "1:280891701438:web:7e6c49e695d95c341646ef" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS A LA VENTANA (MODAL) ---
    const modalLogin = document.getElementById('modal-login'); 
    const formLogin = document.getElementById('form-login');
    const btnSubmit = document.querySelector('.btn-submit');
    
    // Referencias a los botones nuevos y títulos
    const btnIngresar = document.getElementById('btn-ingresar');
    const btnProfeIndex = document.getElementById('btn-profe-index');
    const tituloModal = document.getElementById('titulo-modal');
    const tabsLogin = document.querySelector('.modal-tabs');
    const toggleModo = document.getElementById('toggle-modo'); 
    const btnCerrarLogin = document.getElementById('btn-cerrar-login');

    let esRegistro = false;

    // --- FUNCIÓN CENTRALIZADA PARA ABRIR EL MODAL ---
    const abrirModal = (modoProfe) => {
        if(modalLogin) {
            modalLogin.classList.remove('oculto'); // Le quitamos el escudo invisible
            modalLogin.classList.add('activo');    // Lo mostramos en pantalla
            
            if (modoProfe) {
                if(tituloModal) tituloModal.innerHTML = "👨‍🏫 Torre de Control";
                if(tabsLogin) tabsLogin.style.display = 'none'; 
                if(btnSubmit) btnSubmit.innerHTML = "Acceder al Panel 📡";
                esRegistro = false; 
            } else {
                if(tituloModal) tituloModal.innerHTML = "¡Bienvenido a la Nave! 🚀";
                if(tabsLogin) tabsLogin.style.display = 'flex'; 
                if(btnSubmit) btnSubmit.innerHTML = "Despegar 🚀";
                esRegistro = false;
            }
        }
    };

    // --- FUNCIÓN CENTRALIZADA PARA CERRAR EL MODAL ---
    const cerrarModal = () => {
        if(modalLogin) {
            modalLogin.classList.remove('activo');
            // Le damos tiempo a la animación antes de ocultarlo por completo
            setTimeout(() => { modalLogin.classList.add('oculto'); }, 300);
        }
    };

    // --- CONECTAMOS LOS BOTONES ---
    if (btnIngresar) btnIngresar.addEventListener('click', () => abrirModal(false));
    if (btnProfeIndex) btnProfeIndex.addEventListener('click', () => abrirModal(true));
    if (btnCerrarLogin) btnCerrarLogin.addEventListener('click', cerrarModal);

    // Cerrar si das clic fuera (en el fondo oscuro)
    window.addEventListener('click', (e) => {
        if (e.target === modalLogin) cerrarModal();
    });

    // --- CAMBIAR ENTRE INICIAR SESIÓN O CREAR CUENTA ---
    if (toggleModo) {
        toggleModo.addEventListener('click', (e) => {
            e.preventDefault();
            esRegistro = !esRegistro;
            if (esRegistro) {
                if(tituloModal) tituloModal.innerHTML = "¡Únete a la Tripulación! 👨‍🚀";
                if(btnSubmit) btnSubmit.innerHTML = "Crear Cuenta 🚀";
                if(toggleModo) toggleModo.innerHTML = "¿Ya tienes cuenta? Inicia Sesión";
            } else {
                if(tituloModal) tituloModal.innerHTML = "¡Bienvenido a la Nave! 🚀";
                if(btnSubmit) btnSubmit.innerHTML = "Despegar 🚀";
                if(toggleModo) toggleModo.innerHTML = "¿No tienes cuenta? Regístrate";
            }
        });
    }

    // --- ENVIAR EL FORMULARIO A FIREBASE ---
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = formLogin.querySelector('input[type="email"]').value;
            const password = formLogin.querySelector('input[type="password"]').value;

            if(btnSubmit) btnSubmit.innerHTML = "Conectando satélites... 🛰️";

            try {
                if (esRegistro) {
                    // RUTA A: CREAR NUEVA CUENTA DE ALUMNO
                    const credenciales = await createUserWithEmailAndPassword(auth, email, password);
                    const usuario = credenciales.user;

                    await setDoc(doc(db, "usuarios", usuario.uid), {
                        email: usuario.email,
                        rol: "alumno", 
                        xp_total: 0,
                        nivel_actual: 1,
                        medallas: ["primer_ingreso"]
                    });

                    if(btnSubmit) {
                        btnSubmit.style.background = "#10B981"; 
                        btnSubmit.innerHTML = "¡Cuenta creada! Entrando... 🚀";
                    }
                    setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
                    
                } else {
                    // RUTA B: INICIAR SESIÓN
                    const credenciales = await signInWithEmailAndPassword(auth, email, password);
                    const usuario = credenciales.user;
                    
                    if(btnSubmit) {
                        btnSubmit.style.background = "#10B981"; 
                        btnSubmit.innerHTML = "¡Acceso concedido! Analizando credenciales... 🛸";
                    }

                    const docRef = doc(db, "usuarios", usuario.uid);
                    const docSnap = await getDoc(docRef);

                    setTimeout(() => {
                        if (docSnap.exists() && docSnap.data().rol === "profesor") {
                            window.location.href = "profesor.html";
                        } else {
                            window.location.href = "dashboard.html";
                        }
                    }, 800);
                }
            } catch (error) {
                console.error("Error en autenticación: ", error);
                if(btnSubmit) {
                    btnSubmit.style.background = "#ef4444";
                    btnSubmit.innerHTML = "❌ Error de Acceso. Reintenta.";
                    
                    setTimeout(() => {
                        btnSubmit.style.background = "var(--btn-orange)";
                        btnSubmit.innerHTML = esRegistro ? "Crear Cuenta 🚀" : "Despegar 🚀";
                    }, 2000);
                }
            }
        });
    }
});