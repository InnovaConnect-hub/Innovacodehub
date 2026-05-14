// 1. IMPORTACIONES COMPLETAS DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. CONFIGURACIÓN DE FIREBASE
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

// 3. BASES DE DATOS DE LA PLATAFORMA
const titulosMisiones = {
    1: "Entrenamiento de Astronautas",
    2: "Abordando la Nave",
    3: "Motores de Movimiento",
    4: "Gravedad Cero",
    5: "Radares y Sensores",
    6: "Recolectando Energía",
    7: "Taller de Diseño",
    8: "El Gran Despegue"
};

const catalogoMedallas = [
    { id: "primer_ingreso", icono: "🌟", nombre: "Primer Inicio", desc: "Iniciaste sesión en tu nave por primera vez. ¡El viaje comienza!" },
    { id: "nivel_1_ok", icono: "🤖", nombre: "Nivel 1 Superado", desc: "Completaste tu entrenamiento básico de astronauta." },
    { id: "hacker_rapido", icono: "⚡", nombre: "Hacker Veloz", desc: "Completaste una misión en tiempo récord." },
    { id: "maestro_bucle", icono: "🔁", nombre: "Maestro de los Bucles", desc: "Usaste el bloque de repetición de mBlock sin ayuda." },
    { id: "gran_despegue", icono: "🚀", nombre: "El Gran Despegue", desc: "Terminaste todo el curso y creaste tu videojuego final." }
];

// 4. TODO LO QUE PASA CUANDO CARGA LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 🔲 MOTOR DEL PERFIL PLEGABLE
    // =========================================
    const perfilInteractivo = document.getElementById('perfil-interactivo');
    if (perfilInteractivo) {
        perfilInteractivo.addEventListener('click', () => {
            perfilInteractivo.classList.toggle('collapsed');
        });
    }

    let docRefGlobal = null; 

    // --- REFERENCIAS A LA PANTALLA ---
    const nombreUsuarioUI = document.getElementById('nombre-header');
    const nombreLateralUI = document.getElementById('nombre-lateral');
    const xpTextoUI = document.querySelector('.xp-texto');
    const barraXpUI = document.querySelector('.barra-xp-progreso');
    const tituloMisionUI = document.querySelector('.mision-info h2');
    const descripcionMisionUI = document.querySelector('.mision-info p');
    const btnSalir = document.querySelector('.btn-salir');
    const btnJugar = document.querySelector('.btn-jugar');
    
    const inputAjustesNombre = document.getElementById('input-ajustes-nombre');
    const inputAjustesEmail = document.getElementById('input-ajustes-email');
    const btnResetPassword = document.getElementById('btn-reset-password');

    const toggleSonidos = document.getElementById('toggle-sonidos');
    const toggleMusica = document.getElementById('toggle-musica');
    const toggleDaltonico = document.getElementById('toggle-daltonico');
    const audioEfecto = document.getElementById('audio-efecto');
    const audioMusica = document.getElementById('audio-musica');

    // --- LÓGICA DEL MENÚ DE PESTAÑAS (SPA) ---
    const menuLinks = document.querySelectorAll('.opciones-flotantes a');
    const vistas = document.querySelectorAll('.vista-seccion');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            menuLinks.forEach(l => l.classList.remove('activo'));
            link.classList.add('activo');

            vistas.forEach(vista => vista.classList.add('oculto'));
            const targetId = link.getAttribute('data-target');
            const vistaObjetivo = document.getElementById(targetId);
            if(vistaObjetivo) vistaObjetivo.classList.remove('oculto');
        });
    });

    function renderizarMedallas(medallasDelUsuario) {
        const contenedorMedallas = document.getElementById('contenedor-medallas');
        if(!contenedorMedallas) return;
        contenedorMedallas.innerHTML = ''; 
        catalogoMedallas.forEach(medalla => {
            const laTiene = medallasDelUsuario.includes(medalla.id);
            if (laTiene) {
                contenedorMedallas.innerHTML += `<div class="insignia ganada" title="${medalla.nombre}" onclick="alert('🏆 ¡Tienes la medalla: ${medalla.nombre}!')">${medalla.icono}</div>`;
            } else {
                contenedorMedallas.innerHTML += `<div class="insignia bloqueada" title="Bloqueada" onclick="alert('🔒 Sigue programando para ganar esta medalla.')">🔒</div>`;
            }
        });
    }

    function renderizarMapa(nivelDelUsuario) {
        const contenedorMapa = document.getElementById('contenedor-mapa-dinamico');
        if(!contenedorMapa) return;
        contenedorMapa.innerHTML = ''; 
        for (let i = 1; i <= 8; i++) {
            let estadoClase = 'bloqueado';
            let iconoNivel = '🔒';
            let animacion = '';

            if (i < nivelDelUsuario) {
                estadoClase = 'completado';
                iconoNivel = '✅';
            } else if (i === nivelDelUsuario) {
                estadoClase = 'activo';
                iconoNivel = '🚀';
                animacion = 'animacion-pulso';
            }

            const nombreDeLaMision = titulosMisiones[i] || "Misión Oculta";
            contenedorMapa.innerHTML += `
                <div class="nivel ${estadoClase}">
                    <div class="nivel-icono ${animacion}">${iconoNivel}</div>
                    <div class="nivel-info">
                        <span class="etiqueta-nivel">Nivel ${i}</span>
                        <h3 style="color: white; margin: 5px 0;">${nombreDeLaMision}</h3>
                        ${estadoClase === 'activo' ? '<button class="btn-jugar" style="margin-top: 10px; padding: 8px 20px; border-radius: 15px; border: none; font-weight: bold; cursor: pointer; background: #10B981; color: white;" onclick="window.location.href=\'mision.html\'">▶️ JUGAR AHORA</button>' : ''}
                    </div>
                </div>
            `;
        }
    }

    function renderizarSalaTrofeos(medallasDelUsuario) {
        const contenedorSala = document.getElementById('contenedor-sala-trofeos');
        if(!contenedorSala) return;
        contenedorSala.innerHTML = ''; 
        catalogoMedallas.forEach(medalla => {
            const laTiene = medallasDelUsuario.includes(medalla.id);
            const claseEstado = laTiene ? 'ganado' : 'bloqueado';
            const descripcion = laTiene ? medalla.desc : "Sigue aprendiendo y completando misiones para revelar este trofeo secreto.";
            const iconoA_mostrar = laTiene ? medalla.icono : "🔒";
            
            contenedorSala.innerHTML += `
                <div class="trofeo-card ${claseEstado}">
                    <div class="trofeo-icono">${iconoA_mostrar}</div>
                    <h3>${medalla.nombre}</h3>
                    <p>${descripcion}</p>
                </div>
            `;
        });
    }

    // --- CONEXIÓN CON FIREBASE (CON BLINDAJE ANTI-CRASH) ---
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const docRef = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const datosAlumno = docSnap.data();
                    docRefGlobal = docRef; 

                    const misAjustes = datosAlumno.ajustes || { daltonico: false, musica: false, sonidos: true };

                    if (misAjustes.daltonico && toggleDaltonico) {
                        toggleDaltonico.checked = true;
                        document.body.classList.add('modo-daltonico');
                    }
                    if (misAjustes.musica && toggleMusica) toggleMusica.checked = true;
                    if (misAjustes.sonidos === false && toggleSonidos) toggleSonidos.checked = false;
                    
                    // Blindaje de seguridad
                    const correoSeguro = datosAlumno.email || user.email || "Cadete@nave";
                    const apodo = correoSeguro.split('@')[0];
                    const nivelSeguro = datosAlumno.nivel_actual || 1;
                    const xpSegura = datosAlumno.xp_total || 0;
                    
                    if(nombreUsuarioUI) nombreUsuarioUI.innerHTML = apodo;
                    if(nombreLateralUI) nombreLateralUI.innerHTML = `Explorador_${apodo}`;
                    if(inputAjustesNombre) inputAjustesNombre.value = `Explorador_${apodo}`;
                    if(inputAjustesEmail) inputAjustesEmail.value = user.email;
                    
                    if(xpTextoUI) xpTextoUI.innerHTML = `<span>Nivel ${nivelSeguro}</span><span>${xpSegura} / 1000 XP</span>`;
                    if(tituloMisionUI) tituloMisionUI.innerHTML = `Nivel ${nivelSeguro}: ${titulosMisiones[nivelSeguro] || "Misión Secreta"}`;
                    if(descripcionMisionUI) descripcionMisionUI.innerHTML = "¡Prepárate para programar! La nave te necesita.";

                    setTimeout(() => {
                        let porcentaje = (xpSegura / 1000) * 100;
                        if(barraXpUI) barraXpUI.style.width = `${porcentaje}%`;
                    }, 500);

                    renderizarMedallas(datosAlumno.medallas || []);
                    renderizarMapa(nivelSeguro);
                    renderizarSalaTrofeos(datosAlumno.medallas || []);
                    
                } else {
                    if(tituloMisionUI) tituloMisionUI.innerHTML = "⚠️ Perfil no encontrado";
                    if(descripcionMisionUI) descripcionMisionUI.innerHTML = "Cierra sesión y vuelve a registrarte, por favor.";
                }
            } catch (error) {
                if(tituloMisionUI) tituloMisionUI.innerHTML = "📡 Interferencia Espacial";
                if(descripcionMisionUI) descripcionMisionUI.innerHTML = "No pudimos conectar con los satélites.";
            }
        } else {
            window.location.href = "index.html";
        }
    });

    // --- BOTONES INTERACTIVOS ---
    if(btnJugar) {
        btnJugar.addEventListener('click', () => {
            btnJugar.innerHTML = "🚀 ¡DESPEGANDO!...";
            btnJugar.style.background = "#F97316"; 
            setTimeout(() => { window.location.href = 'mision.html'; }, 800);
        });
    }

    if(btnSalir) {
        btnSalir.addEventListener('click', () => {
            signOut(auth).then(() => { window.location.href = "index.html"; });
        });
    }

    if(btnResetPassword) {
        btnResetPassword.addEventListener('click', () => {
            const user = auth.currentUser;
            if (user && user.email) {
                sendPasswordResetEmail(auth, user.email)
                    .then(() => alert("¡Holograma enviado! Revisa tu correo para cambiar tu contraseña secreta."))
                    .catch((error) => alert("Hubo un error de comunicación espacial. Inténtalo más tarde."));
            }
        });
    }

    // --- LÓGICA DE SONIDOS Y MODO DALTÓNICO ---
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (toggleSonidos && toggleSonidos.checked && audioEfecto) {
                audioEfecto.currentTime = 0; 
                audioEfecto.play().catch(()=>{}); 
            }
        });
    });

    if (toggleMusica && audioMusica) {
        toggleMusica.addEventListener('change', async (e) => {
            const prendido = e.target.checked;
            if (prendido) {
                audioMusica.play().catch(() => console.log("Esperando clic...")); 
            } else {
                audioMusica.pause(); 
            }
            if(docRefGlobal) await updateDoc(docRefGlobal, { "ajustes.musica": prendido });
        });
    }

    if (toggleDaltonico) {
        toggleDaltonico.addEventListener('change', async (e) => {
            const prendido = e.target.checked;
            if (prendido) {
                document.body.classList.add('modo-daltonico'); 
            } else {
                document.body.classList.remove('modo-daltonico'); 
            }
            if(docRefGlobal) await updateDoc(docRefGlobal, { "ajustes.daltonico": prendido });
        });
    }
});

// =========================================
// 🎈 LÓGICA DE LA BURBUJA FLOTANTE
// =========================================
const inicializarBurbuja = () => {
    const btnBurbuja = document.getElementById('btn-burbuja');
    const menuFlotante = document.getElementById('menu-flotante');

    if (btnBurbuja && menuFlotante) {
        // Al hacer clic en el astronauta
        btnBurbuja.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se cierre al instante
            menuFlotante.classList.toggle('oculto');
        });

        // Cerrar el menú si dan clic en cualquier otra parte de la pantalla
        document.addEventListener('click', (e) => {
            if (!menuFlotante.contains(e.target) && e.target !== btnBurbuja) {
                menuFlotante.classList.add('oculto');
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBurbuja);
} else {
    inicializarBurbuja();
}
