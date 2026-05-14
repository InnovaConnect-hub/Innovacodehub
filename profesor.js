import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {

  apiKey: "AIzaSyB_6x_Y3k2G8nGj9C4gHNy1EI-cdV-75ek",

  authDomain: "innovacodehub.firebaseapp.com",

  projectId: "innovacodehub",

  storageBucket: "innovacodehub.firebasestorage.app",

  messagingSenderId: "280891701438",

  appId: "1:280891701438:web:7e6c49e695d95c341646ef"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función global para resetear contraseña
window.resetearPassword = function(correoAlumno) {
    if(confirm(`⚠️ ¿Estás seguro de enviar un enlace de recuperación a ${correoAlumno}?`)) {
        sendPasswordResetEmail(auth, correoAlumno)
            .then(() => alert(`✅ ¡Listo! Se ha enviado un correo a ${correoAlumno}.`))
            .catch((error) => alert("Hubo un error. Verifica que el correo esté bien escrito."));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const tablaAlumnosUI = document.getElementById('lista-alumnos-ui');
    const nombreProfeUI = document.getElementById('nombre-profe');
    const avatarProfeUI = document.getElementById('avatar-profe');
    const btnExportar = document.getElementById('btn-exportar');
    
    let datosParaExcel = []; // Aquí guardaremos los datos para exportar

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);

            // 1. SEGURIDAD: Verificar si es profe
            if (docSnap.exists() && docSnap.data().rol !== "profesor") {
                alert("⛔ ACCESO DENEGADO: Área restringida solo para Comandantes.");
                window.location.href = "dashboard.html"; 
                return; 
            }

            // 2. PERSONALIZAR EL PERFIL DE LA TRIPULACIÓN
            // Cambia estos correos por los reales que usen en tu equipo
            const equipoInnova = {
                "carlos@prueba.com": { nombre: "Cmdte. Carlos", avatar: "👨‍💻" },
                "yazmin@prueba.com": { nombre: "Cmdte. Yazmín", avatar: "👩‍🚀" },
                "esmeralda@prueba.com": { nombre: "Cmdte. Esmeralda", avatar: "👩‍🔬" },
                "nahomi@prueba.com": { nombre: "Cmdte. Nahomi", avatar: "👩‍🔧" },
                "susan@prueba.com": { nombre: "Cmdte. Susan", avatar: "👩‍🏫" }
            };

            const miPerfil = equipoInnova[user.email] || { nombre: "Comandante", avatar: "👑" };
            if(nombreProfeUI) nombreProfeUI.innerHTML = miPerfil.nombre;
            if(avatarProfeUI) avatarProfeUI.innerHTML = miPerfil.avatar;

            // 3. CARGAR LOS ALUMNOS
            try {
                const consultaUsuarios = await getDocs(collection(db, "usuarios"));
                tablaAlumnosUI.innerHTML = '';
                datosParaExcel = []; // Limpiamos la lista por si acaso

                if (consultaUsuarios.empty) {
                    tablaAlumnosUI.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 40px; color: white;">Aún no hay Hackers Junior.</td></tr>`;
                    return;
                }

                consultaUsuarios.forEach((usuarioDoc) => {
                    const alumno = usuarioDoc.data();
                    if (alumno.rol === "profesor") return; 

                    const cantidadMedallas = alumno.medallas ? alumno.medallas.length : 0;
                    let medallasHTML = '';
                    for(let i = 0; i < cantidadMedallas; i++) medallasHTML += '🌟 ';
                    if(cantidadMedallas === 0) medallasHTML = 'Ninguna';

                    // Inyectamos en la tabla HTML
                    tablaAlumnosUI.innerHTML += `
                        <tr>
                            <td style="font-weight: bold; color: white;">🧑‍🚀 ${alumno.email}</td>
                            <td><span class="badge-nivel">Nivel ${alumno.nivel_actual}</span></td>
                            <td class="xp-texto-tabla">${alumno.xp_total} XP</td>
                            <td style="font-size: 1.2rem;">${medallasHTML}</td>
                            <td>
                                <button onclick="window.resetearPassword('${alumno.email}')" style="background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                                    🔑 Reset
                                </button>
                            </td>
                        </tr>
                    `;

                    // Guardamos la información limpia para el Excel
                    datosParaExcel.push({
                        Correo: alumno.email,
                        Nivel: alumno.nivel_actual,
                        XP: alumno.xp_total,
                        Medallas: cantidadMedallas
                    });
                });

            } catch (error) {
                console.error("Error: ", error);
                tablaAlumnosUI.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 40px; color: #ef4444;">❌ Error de conexión.</td></tr>`;
            }

        } else {
            window.location.href = "index.html";
        }
    });

    // 4. LÓGICA DEL BOTÓN DE DESCARGAR EXCEL (CSV)
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            if (datosParaExcel.length === 0) {
                return alert("Aún no hay alumnos para exportar.");
            }

            // Creamos el archivo de texto formato CSV
            let contenidoCSV = "data:text/csv;charset=utf-8,";
            contenidoCSV += "Correo del Alumno,Nivel Actual,Total XP,Cantidad Medallas\n"; // Cabeceras

            // Agregamos las filas
            datosParaExcel.forEach(fila => {
                contenidoCSV += `${fila.Correo},${fila.Nivel},${fila.XP},${fila.Medallas}\n`;
            });

            // Forzamos la descarga mágica en el navegador
            const uriCodificada = encodeURI(contenidoCSV);
            const enlaceDescarga = document.createElement("a");
            enlaceDescarga.setAttribute("href", uriCodificada);
            enlaceDescarga.setAttribute("download", "Reporte_Alumnos_InnovaCodeHub.csv");
            document.body.appendChild(enlaceDescarga); // Requerido para Firefox
            enlaceDescarga.click();
            document.body.removeChild(enlaceDescarga);
        });
    }
});