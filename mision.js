// 1. IMPORTACIONES COMPLETAS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE
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

// 3. TEMARIO OFICIAL 
const datosMisiones = {
    1: {
        titulo: "Entrenamiento de Astronautas",
        descripcion: "Cadetes, su misión hoy es encender los sistemas de su nave. Deben elegir un astronauta, colocar un fondo espacial y lograr que salude a la Tierra.",
        pista: "Comprende el concepto de algoritmo. Recuerda que mBlock tiene 3 áreas: El Teatro, Los Actores y El Guion.",
        tareas: [
            "Abre mBlock, borra al panda y agrega un objeto nuevo (cohete o astronauta).",
            "Introduce el bloque de la categoría Eventos: 'Al hacer clic en la bandera verde'.",
            "Haz que tu astronauta diga '¡Hola, Tierra!' usando el bloque 'Decir... por 2 segundos'."
        ]
    },
    2: {
        titulo: "Propulsores Básicos",
        descripcion: "El radar está fallando y necesitamos mover la nave manualmente. Su misión es programar una secuencia exacta para que la nave avance, gire y se detenga.",
        pista: "Diferencia entre 'mover pasos' (movimiento lineal) y 'girar grados' (rotación).",
        tareas: [
            "Introduce los bloques 'Mover 10 pasos' y 'Girar 15 grados'.",
            "Crea una secuencia de 5 bloques unidos uno debajo del otro.",
            "Logra que la nave se detenga justo en el centro de la pantalla, sin salirse del borde."
        ]
    },
    3: {
        titulo: "El Mapa Estelar",
        descripcion: "Hay que trazar la ruta de vuelo. Deben programar su nave para que empiece en la Base Terrestre y se 'deslice' suavemente hasta la Estación Espacial.",
        pista: "La 'X' es caminar de izquierda a derecha, y 'Y' es usar un elevador (arriba y abajo).",
        tareas: [
            "Usa el bloque 'Ir a x: () y: ()' para posicionar tu nave en la esquina inferior izquierda.",
            "Introduce el bloque 'Deslizar en 1 seg a x: () y: ()'.",
            "Desliza tu nave hasta la esquina superior derecha usando las coordenadas correctas."
        ]
    },
    4: {
        titulo: "Gravedad Cero",
        descripcion: "En el espacio, las cosas flotan sin parar. Su misión es crear una animación infinita para un alienígena o planeta al presionar la bandera verde.",
        pista: "Los programadores usan ciclos de repetición (Bucles) para no escribir el mismo código 100 veces.",
        tareas: [
            "Usa el bloque 'Por siempre' de la categoría Control.",
            "Añade el bloque 'Siguiente disfraz' de la categoría Apariencia.",
            "Controla la velocidad agregando el bloque 'Esperar 0.5 segundos'."
        ]
    },
    5: {
        titulo: "Piloto Automático",
        descripcion: "¡Tomamos el control manual de la nave! Deben programar las 4 flechas de su teclado para que la nave se mueva en todas las direcciones.",
        pista: "Aprende a controlar un objeto en tiempo real usando eventos de teclado en lugar de la bandera verde.",
        tareas: [
            "Usa el evento 'Al presionar tecla (flecha derecha)'.",
            "Conecta la flecha derecha al bloque 'Sumar a X: 10' y la izquierda a 'Sumar a X: -10'.",
            "Conecta la flecha arriba al bloque 'Sumar a Y: 10' y la de abajo a 'Sumar a Y: -10'."
        ]
    },
    6: {
        titulo: "Campo de Asteroides",
        descripcion: "¡Alerta de impacto! Si la nave toca un asteroide, debe regresar automáticamente a su punto de inicio y decir '¡Ay!'.",
        pista: "Usa la lógica de colisiones: un bloque 'Si () entonces' metido dentro de un bloque 'Por siempre'.",
        tareas: [
            "Agrega asteroides a la pantalla de tu juego.",
            "Arma la condición usando el sensor '¿Tocando asteroide?'.",
            "Si hay impacto, usa 'Ir a X: Y:' para reiniciar la nave y haz que diga '¡Ay!'."
        ]
    },
    7: {
        titulo: "Recolectando Energía",
        descripcion: "Necesitamos combustible. Programen estrellas de energía; cada vez que su nave toque una, su contador debe subir 1 punto.",
        pista: "Entiende qué es una Variable: una caja donde guardamos información, como nuestra puntuación.",
        tareas: [
            "Ve a Variables y crea una llamada 'Puntos' o 'Energía'.",
            "Al iniciar el juego, usa 'Fijar Puntos a 0'.",
            "Si la nave toca la estrella, usa 'Cambiar Puntos por 1', y escóndela."
        ]
    },
    8: {
        titulo: "El Gran Despegue",
        descripcion: "¡Misión Final! Construyan un juego completo de 'Atrapar objetos' en el espacio con controles de teclado, puntos y enemigos.",
        pista: "Integra todo lo aprendido: movimiento, bucles, condicionales y variables para tu proyecto final.",
        tareas: [
            "Programa tu nave para que se mueva libremente por el espacio.",
            "Agrega asteroides que resten puntos y estrellas que sumen.",
            "Agrega fondos de 'Game Over' o '¡Ganaste!' usando mensajes."
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los textos del HTML
    const tituloNivelUI = document.querySelector('.etiqueta-nivel');
    const nombreMisionUI = document.querySelector('.mision-titulo-top h2');
    const xpActualUI = document.querySelector('.xp-actual');
    const descripcionMisionUI = document.querySelector('.objetivos-mision p');
    const pistaMisionUI = document.querySelector('.alerta-pista');
    const listaTareasUI = document.getElementById('lista-tareas');
    const btnCompletar = document.getElementById('btn-completar');

    let nivelActual = 1;
    let xpTotal = 0;
    let totalTareas = 0;
    let evidenciaSubida = false; // Control de la imagen

    // 4. LEER LA BASE DE DATOS AL ENTRAR
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const datosAlumno = docSnap.data();
                nivelActual = datosAlumno.nivel_actual;
                xpTotal = datosAlumno.xp_total;

                const misionHoy = datosMisiones[nivelActual] || datosMisiones[1]; 

                // Pintamos los datos limpios
                if(tituloNivelUI) tituloNivelUI.innerHTML = `Nivel ${nivelActual}`;
                if(nombreMisionUI) nombreMisionUI.innerHTML = misionHoy.titulo;
                if(xpActualUI) xpActualUI.innerHTML = `🌟 ${xpTotal} XP`;
                if(descripcionMisionUI) descripcionMisionUI.innerHTML = misionHoy.descripcion;
                if(pistaMisionUI) pistaMisionUI.innerHTML = `<strong>💡 Pista de Sistema:</strong> ${misionHoy.pista}`;

                // Generar checkboxes
                if(listaTareasUI) {
                    listaTareasUI.innerHTML = ''; 
                    totalTareas = misionHoy.tareas.length;

                    misionHoy.tareas.forEach(tarea => {
                        listaTareasUI.innerHTML += `
                            <li>
                                <label>
                                    <input type="checkbox" class="tarea-checkbox">
                                    <span class="custom-checkbox"></span>
                                    ${tarea}
                                </label>
                            </li>
                        `;
                    });
                }

                // --- LÓGICA DE SUBIDA DE IMAGEN ---
                const inputCaptura = document.getElementById('input-captura');
                const labelDrop = document.getElementById('label-drop');
                const previewCaptura = document.getElementById('preview-captura');
                const btnCambiarFoto = document.getElementById('btn-cambiar-foto');

                if(inputCaptura && labelDrop && previewCaptura && btnCambiarFoto) {
                    inputCaptura.addEventListener('change', function(e) {
                        const archivo = e.target.files[0];
                        if (archivo) {
                            const lector = new FileReader();
                            lector.onload = function(evento) {
                                previewCaptura.src = evento.target.result;
                                previewCaptura.style.display = 'block';
                                labelDrop.style.display = 'none'; 
                                btnCambiarFoto.style.display = 'block'; 
                                evidenciaSubida = true; 
                                validarMision(); 
                            }
                            lector.readAsDataURL(archivo);
                        }
                    });

                    btnCambiarFoto.addEventListener('click', () => {
                        inputCaptura.value = ''; 
                        previewCaptura.src = '';
                        previewCaptura.style.display = 'none';
                        btnCambiarFoto.style.display = 'none';
                        labelDrop.style.display = 'flex'; 
                        evidenciaSubida = false; 
                        validarMision(); 
                    });
                }

                // --- VALIDACIÓN TOTAL (Tareas + Foto) ---
                function validarMision() {
                    const completadas = document.querySelectorAll('.tarea-checkbox:checked').length;
                    
                    if (completadas === totalTareas && evidenciaSubida) {
                        btnCompletar.classList.remove('bloqueado');
                        btnCompletar.classList.add('desbloqueado');
                        btnCompletar.removeAttribute('disabled');
                        btnCompletar.innerHTML = "✨ ¡MISIÓN COMPLETADA! (+100 XP)";
                    } else {
                        btnCompletar.classList.add('bloqueado');
                        btnCompletar.classList.remove('desbloqueado');
                        btnCompletar.setAttribute('disabled', 'true');
                        
                        if(completadas === totalTareas && !evidenciaSubida) {
                            btnCompletar.innerHTML = "📸 FALTA SUBIR TU CAPTURA";
                        } else {
                            btnCompletar.innerHTML = "🔒 COMPLETAR MISIÓN (+100 XP)";
                        }
                    }
                }

                // Le agregamos el validador a los checkboxes
                const checkboxes = document.querySelectorAll('.tarea-checkbox');
                checkboxes.forEach(cb => {
                    cb.addEventListener('change', validarMision);
                });

                // 5. GUARDAR PROGRESO
                if(btnCompletar) {
                    btnCompletar.onclick = async () => {
                        btnCompletar.innerHTML = "Subiendo progreso a la nave... 🚀";
                        btnCompletar.setAttribute('disabled', 'true');

                        try {
                            await updateDoc(docRef, {
                                nivel_actual: nivelActual + 1,
                                xp_total: xpTotal + 100
                            });

                            btnCompletar.style.background = "#10B981";
                            btnCompletar.innerHTML = "¡Datos guardados! Volviendo a la base... ✨";
                            
                            setTimeout(() => {
                                window.location.href = 'dashboard.html';
                            }, 1500);

                        } catch (error) {
                            console.error("Error guardando progreso: ", error);
                            btnCompletar.removeAttribute('disabled');
                            btnCompletar.innerHTML = "⚠️ Reintentar Conexión";
                            alert("La señal espacial es débil. Inténtalo de nuevo.");
                        }
                    };
                }
            }
        } else {
            window.location.href = "index.html";
        }
    });
});