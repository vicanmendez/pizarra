// --- INICIO DEL ARCHIVO app.js MODIFICADO ---

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const restartBtn = document.getElementById('restartBtn');
const pencilBtn = document.getElementById('pencilBtn');
const eraserBtn = document.getElementById('eraserBtn');
const textBtn = document.getElementById('textBtn');
const selectAreaBtn = document.getElementById('selectAreaBtn');
const moveBtn = document.getElementById('moveBtn');
const captureBtn = document.getElementById('captureBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const selectionBox = document.getElementById('selectionBox');
const capturedImage = document.getElementById('capturedImage');
const classOutput = document.querySelector('.output');
// Nuevos elementos
const textPanel = document.getElementById('textPanel');
const textInput = document.getElementById('textInput');
const textSize = document.getElementById('textSize');
const textSizeValue = document.getElementById('textSizeValue');
const textFont = document.getElementById('textFont');
const textBold = document.getElementById('textBold');
const textItalic = document.getElementById('textItalic');
const applyTextBtn = document.getElementById('applyTextBtn');
const cancelTextBtn = document.getElementById('cancelTextBtn');
const shapesBtn = document.getElementById('shapesBtn');
const shapesMenu = document.getElementById('shapesMenu');
const shapeOptions = document.querySelectorAll('.shape-option');

// Elementos del modal de API Key
const apiKeyModal = document.getElementById('apiKeyModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const toggleApiKey = document.getElementById('toggleApiKey');
const saveApiKey = document.getElementById('saveApiKey');
const cancelApiKey = document.getElementById('cancelApiKey');

// Elementos de la salida de IA
const iaOutput = document.getElementById('iaOutput');
const closeIaOutput = document.getElementById('closeIaOutput');
const output = document.getElementById('output');


let darkMode = false;
let drawing = false;
let erasing = false;
let selecting = false;
let moving = false;
let textMode = false;
let shapeMode = false;
let currentShape = null;
let startX, startY, endX, endY;
let lastX, lastY;
let selectionRect = null;
let moveStartX, moveStartY;
let textConfig = {
  size: 24,
  font: 'Arial',
  bold: false,
  italic: false
};


// Variables para el movimiento de elementos
let canvasImageData = null;
let isMovingSelection = false;

// Variables para deshacer/rehacer
let undoStack = [];
let redoStack = [];
let maxUndoSteps = 20;

// Variables para API Key
let hasValidApiKey = false;
let apiKey = null;

// Función para verificar si existe una API Key válida
function checkApiKey() {
  const storedApiKey = localStorage.getItem('gemini_api_key');
  if (storedApiKey && storedApiKey.trim() !== '') {
    apiKey = storedApiKey;
    hasValidApiKey = true;
    return true;
  }
  return false;
}

// Función para validar API Key (simplificada - solo verifica que no esté vacía)
function validateApiKey(key) {
  return key && key.trim() !== '';
}

// Función para mostrar modal de API Key
function showApiKeyModal() {
  apiKeyModal.classList.add('show');
  apiKeyInput.focus();
}

// Función para ocultar modal de API Key
function hideApiKeyModal() {
  apiKeyModal.classList.remove('show');
  apiKeyInput.value = '';
}

// Función para guardar API Key
async function saveApiKeyToStorage() {
  const key = apiKeyInput.value.trim();
  
  if (!key) {
    showNotification('Por favor ingresa una API Key válida', 'error');
    return;
  }
  
  saveApiKey.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
  saveApiKey.disabled = true;
  
  try {
    const isValid = validateApiKey(key);
    
    if (isValid) {
      localStorage.setItem('gemini_api_key', key);
      apiKey = key;
      hasValidApiKey = true;
      hideApiKeyModal();
      showNotification('Clave guardada exitosamente', 'success');
    } else {
      showNotification('Por favor ingresa una API Key válida', 'error');
    }
  } catch (error) {
    showNotification('Error al guardar la API Key', 'error');
  } finally {
    saveApiKey.innerHTML = '<i class="fas fa-save"></i> Guardar y Continuar';
    saveApiKey.disabled = false;
  }
}

// Función para manejar click en botón AI sin API Key
function handleAiWithoutKey() {
  showNotification('Necesitas una API Key de Gemini para usar las funciones de IA', 'info');
  setTimeout(() => {
    showApiKeyModal();
  }, 1000);
}

// Inicialización de la aplicación
function initializeApp() {
  if (!checkApiKey()) {
    setTimeout(() => {
      showApiKeyModal();
    }, 500);
  }
}

// Event listeners para el modal de API Key
saveApiKey.addEventListener('click', saveApiKeyToStorage);
cancelApiKey.addEventListener('click', () => {
  hideApiKeyModal();
  showNotification('Puedes usar la pizarra sin funciones de IA', 'info');
});
toggleApiKey.addEventListener('click', () => {
  const type = apiKeyInput.type === 'password' ? 'text' : 'password';
  apiKeyInput.type = type;
  toggleApiKey.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});
apiKeyInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveApiKeyToStorage();
  }
});

// Funciones de Deshacer/Rehacer y estado del Canvas
function saveCanvasState() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  undoStack.push(imageData);
  if (undoStack.length > maxUndoSteps) {
    undoStack.shift();
  }
  redoStack = [];
  updateUndoRedoButtons();
}
function restoreCanvasState(imageData) {
  ctx.putImageData(imageData, 0, 0);
}
function updateUndoRedoButtons() {
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
}
function undo() {
  if (undoStack.length > 0) {
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoStack.push(currentState);
    const previousState = undoStack.pop();
    restoreCanvasState(previousState);
    updateUndoRedoButtons();
  }
}
function redo() {
  if (redoStack.length > 0) {
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push(currentState);
    const nextState = redoStack.pop();
    restoreCanvasState(nextState);
    updateUndoRedoButtons();
  }
}

function restart() {
  // Pedir confirmación para evitar borrados accidentales
  if (confirm("¿Estás seguro de que quieres borrar todo el lienzo? Podrás deshacer esta acción.")) {
    saveCanvasState();
    const backgroundColor = darkMode ? '#1e293b' : '#fff';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
    
    // Al haber guardado dos veces, el último estado (el borrado) se puede deshacer inmediatamente.
    // Para una mejor experiencia, podemos simplemente eliminar el estado en blanco de la pila.
    undoStack.pop();
    updateUndoRedoButtons();


    selectionRect = null;
    selectionBox.classList.add('hidden');
    updateButtonStates(); // Deshabilitará los botones de Captura y Mover.

    iaOutput.style.display = 'none';
    output.style.display = 'none';

    showNotification('Lienzo reiniciado.', 'success');
  }
}



// Eventos de dibujo y borrado (Mouse y Táctil)
canvas.addEventListener('mousedown', (e) => {
  if (selecting || moving || textMode || shapeMode) return;
  drawing = true;
  [lastX, lastY] = getCanvasCoords(e);
});
canvas.addEventListener('mousemove', (e) => {
  if (!drawing || selecting || moving || textMode || shapeMode) return;
  const [x, y] = getCanvasCoords(e);
  ctx.strokeStyle = erasing ? '#fff' : colorPicker.value;
  ctx.lineWidth = erasing ? 20 : 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
});
canvas.addEventListener('mouseup', () => {
  if (drawing) {
    drawing = false;
    saveCanvasState();
  }
});
canvas.addEventListener('mouseleave', () => {
    if (drawing) {
        drawing = false;
        saveCanvasState();
    }
});
canvas.addEventListener('touchstart', (e) => {
  if (selecting || moving || textMode || shapeMode) return;
  drawing = true;
  const touch = e.touches[0];
  [lastX, lastY] = getCanvasCoords(touch);
});
canvas.addEventListener('touchmove', (e) => {
  if (!drawing || selecting || moving || textMode || shapeMode) return;
  e.preventDefault();
  const touch = e.touches[0];
  const [x, y] = getCanvasCoords(touch);
  ctx.strokeStyle = erasing ? '#fff' : colorPicker.value;
  ctx.lineWidth = erasing ? 20 : 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
}, { passive: false });
canvas.addEventListener('touchend', () => {
  if (drawing) {
    drawing = false;
    saveCanvasState();
  }
});

// Gestión de Herramientas
function updateCanvasCursor() {
  canvas.classList.remove('canvas-pencil', 'canvas-eraser', 'canvas-select', 'canvas-text', 'canvas-move', 'canvas-shape');
  if (textMode) canvas.classList.add('canvas-text');
  else if (moving) canvas.classList.add('canvas-move');
  else if (shapeMode) canvas.classList.add('canvas-shape');
  else if (selecting) canvas.classList.add('canvas-select');
  else if (erasing) canvas.classList.add('canvas-eraser');
  else canvas.classList.add('canvas-pencil');
}
function resetToolStates() {
  erasing = false;
  selecting = false;
  moving = false;
  textMode = false;
  shapeMode = false;
  currentShape = null;
  pencilBtn.classList.remove('active');
  eraserBtn.classList.remove('active');
  selectAreaBtn.classList.remove('active');
  moveBtn.classList.remove('active');
  textBtn.classList.remove('active');
  shapesBtn.classList.remove('active');
  shapesMenu.classList.add('hidden');
}
function updateButtonStates() {
  moveBtn.disabled = !selectionRect;
  captureBtn.disabled = !selectionRect;
}

// Listeners de botones de Herramientas
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
restartBtn.addEventListener('click', restart);

pencilBtn.addEventListener('click', () => {
  resetToolStates();
  pencilBtn.classList.add('active');
  updateCanvasCursor();
});
eraserBtn.addEventListener('click', () => {
  resetToolStates();
  erasing = true;
  eraserBtn.classList.add('active');
  updateCanvasCursor();
});

// Herramienta de Texto
textBtn.addEventListener('click', () => {
  resetToolStates();
  textMode = true;
  textBtn.classList.add('active');
  textPanel.classList.remove('hidden');
  updateCanvasCursor();
});
textSize.addEventListener('input', () => {
  textConfig.size = parseInt(textSize.value);
  textSizeValue.textContent = textSize.value + 'px';
});
textFont.addEventListener('change', () => { textConfig.font = textFont.value; });
textBold.addEventListener('change', () => { textConfig.bold = textBold.checked; });
textItalic.addEventListener('change', () => { textConfig.italic = textItalic.checked; });
applyTextBtn.addEventListener('click', () => {
  textPanel.classList.add('hidden');
  canvas.style.cursor = 'text';
});
cancelTextBtn.addEventListener('click', () => {
  textPanel.classList.add('hidden');
  resetToolStates();
  pencilBtn.classList.add('active');
  updateCanvasCursor();
});
canvas.addEventListener('click', (e) => {
  if (!textMode) return;
  const [x, y] = getCanvasCoords(e);
  const rect = canvas.getBoundingClientRect();
  textInput.style.left = (rect.left + x) + 'px';
  textInput.style.top = (rect.top + y) + 'px';
  textInput.classList.remove('hidden');
  textInput.querySelector('textarea').focus();
  textInput.querySelector('textarea').onblur = function() {
    const text = this.value.trim();
    if (text) {
      drawText(text, x, y);
      saveCanvasState();
    }
    textInput.classList.add('hidden');
    this.value = '';
  };
});
function drawText(text, x, y) {
  ctx.save();
  ctx.fillStyle = colorPicker.value;
  ctx.font = `${textConfig.italic ? 'italic ' : ''}${textConfig.bold ? 'bold ' : ''}${textConfig.size}px ${textConfig.font}`;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Selección de Área
selectAreaBtn.addEventListener('click', () => {
  resetToolStates();
  selecting = true;
  selectAreaBtn.classList.add('active');
  updateButtonStates();
  updateCanvasCursor();
});
canvas.addEventListener('mousedown', (e) => {
  if (!selecting) return;
  [startX, startY] = getCanvasCoords(e);
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
  selectionBox.classList.remove('hidden');
  function onMouseMove(ev) {
    [endX, endY] = getCanvasCoords(ev);
    const rect = getRect(startX, startY, endX, endY);
    selectionBox.style.left = `${rect.x}px`;
    selectionBox.style.top = `${rect.y}px`;
    selectionBox.style.width = `${rect.w}px`;
    selectionBox.style.height = `${rect.h}px`;
  }
  function onMouseUp(ev) {
    [endX, endY] = getCanvasCoords(ev);
    selectionRect = getRect(startX, startY, endX, endY);
    updateButtonStates();
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
  }
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
});

// Herramienta de Mover
moveBtn.addEventListener('click', () => {
  if (!selectionRect) return;
  resetToolStates();
  moving = true;
  moveBtn.classList.add('active');
  updateCanvasCursor();
  canvasImageData = ctx.getImageData(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
});
canvas.addEventListener('mousedown', (e) => {
  if (!moving || !selectionRect || !canvasImageData) return;
  const [x, y] = getCanvasCoords(e);
  if (x >= selectionRect.x && x <= selectionRect.x + selectionRect.w && y >= selectionRect.y && y <= selectionRect.y + selectionRect.h) {
    isMovingSelection = true;
    moveStartX = x - selectionRect.x;
    moveStartY = y - selectionRect.y;
    function onMouseMove(ev) {
      if (!isMovingSelection) return;
      const [currentX, currentY] = getCanvasCoords(ev);
      const newX = currentX - moveStartX;
      const newY = currentY - moveStartY;
      const maxX = canvas.width - selectionRect.w;
      const maxY = canvas.height - selectionRect.h;
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));
      ctx.clearRect(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
      selectionRect.x = clampedX;
      selectionRect.y = clampedY;
      selectionBox.style.left = `${selectionRect.x}px`;
      selectionBox.style.top = `${selectionRect.y}px`;
      ctx.putImageData(canvasImageData, selectionRect.x, selectionRect.y);
    }
    function onMouseUp() {
      isMovingSelection = false;
      saveCanvasState();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
  }
});

// Figuras Geométricas
shapesBtn.addEventListener('click', () => {
  resetToolStates();
  shapeMode = true;
  shapesBtn.classList.add('active');
  if (shapesMenu.classList.contains('hidden')) {
    const rect = shapesBtn.getBoundingClientRect();
    shapesMenu.style.left = rect.left + 'px';
    shapesMenu.style.top = (rect.bottom + 8) + 'px';
    shapesMenu.classList.remove('hidden');
  } else {
    shapesMenu.classList.add('hidden');
  }
  updateCanvasCursor();
});
document.addEventListener('click', (e) => {
  if (!shapesBtn.contains(e.target) && !shapesMenu.contains(e.target)) {
    shapesMenu.classList.add('hidden');
  }
});
shapeOptions.forEach(option => {
  option.addEventListener('click', () => {
    currentShape = option.dataset.shape;
    shapeMode = true;
    shapesMenu.classList.add('hidden');
    updateCanvasCursor();
  });
});
canvas.addEventListener('mousedown', (e) => {
  if (!shapeMode || !currentShape) return;
  [startX, startY] = getCanvasCoords(e);
  // Redibujar canvas temporalmente para ver la figura mientras se dibuja
  function onMouseMove(ev) { /* Lógica de previsualización omitida por simplicidad */ }
  function onMouseUp(ev) {
    [endX, endY] = getCanvasCoords(ev);
    drawShape(currentShape, startX, startY, endX, endY);
    saveCanvasState();
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
  }
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
});
function drawShape(shape, x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = colorPicker.value;
  ctx.fillStyle = colorPicker.value;
  ctx.lineWidth = 2;
  const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  switch(shape) {
    case 'rectangle': ctx.fillRect(x, y, w, h); break;
    case 'circle': const radius = Math.sqrt(w*w + h*h)/2; ctx.beginPath(); ctx.arc(x+w/2, y+h/2, radius, 0, 2*Math.PI); ctx.fill(); break;
    case 'triangle': ctx.beginPath(); ctx.moveTo(x+w/2, y); ctx.lineTo(x, y+h); ctx.lineTo(x+w, y+h); ctx.closePath(); ctx.fill(); break;
    case 'arrow': const head = 10; const angle = Math.atan2(y2-y1, x2-x1); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2-head*Math.cos(angle-Math.PI/6), y2-head*Math.sin(angle-Math.PI/6)); ctx.moveTo(x2, y2); ctx.lineTo(x2-head*Math.cos(angle+Math.PI/6), y2-head*Math.sin(angle+Math.PI/6)); ctx.stroke(); break;
    case 'line': ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); break;
  }
  ctx.restore();
}

// --- INICIO DEL ARCHIVO app.js MODIFICADO Y CORREGIDO ---

// ... (todo el código inicial hasta el listener del captureBtn se mantiene igual)
// ... (asegúrate de pegar todo el código que te pasé en la respuesta anterior, desde el inicio hasta aquí)

// PEGA AQUÍ TODO EL CÓDIGO DE app.js DESDE EL INICIO HASTA LA FUNCIÓN handleAiError

// Función para manejar errores de IA
function handleAiError(error) {
  console.error('Error de IA:', error);
  const errorMessage = `Error al procesar con IA. Verifica tu API Key y conexión.`;
  showNotification(errorMessage, 'error');
  document.getElementById('iaResult').textContent = `${errorMessage} (${error.message})`;
}

// =========================================================================
// ====================== INTEGRACIÓN DE GEMINI AI (CORREGIDA) =============
// =========================================================================

captureBtn.addEventListener('click', () => {
  if (!selectionRect) return;

  if (!hasValidApiKey) {
    handleAiWithoutKey();
    return;
  }

  const { x, y, w, h } = selectionRect;
  const imageData = ctx.getImageData(x, y, w, h);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  tempCanvas.getContext('2d').putImageData(imageData, 0, 0);

  // Generamos la Data URL que usará la clase GeminiImageProcessor
  const dataUrl = tempCanvas.toDataURL('image/png');
  capturedImage.src = dataUrl;
  classOutput.style.display = 'block';

  // --- LÓGICA DE DESCARGA DE ARCHIVO (ELIMINADA) ---
  // El siguiente bloque de código `tempCanvas.toBlob(...)` ha sido eliminado
  // para evitar que la imagen se descargue automáticamente cada vez.
  // La imagen ya existe en memoria como `dataUrl` y eso es suficiente.
  
  // Mostrar área de salida IA y mensaje de carga
  iaOutput.style.display = 'flex';
  document.getElementById('iaResult').textContent = 'Analizando imagen con IA, por favor espera...';

  // --- Inicia el procesamiento con la clase de ai.js ---
  (async () => {
    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
      document.getElementById('iaResult').textContent = 'Error: No se encontró la API Key en localStorage.';
      return;
    }
    
    try {
      // 1. Instanciar el procesador de Gemini
      const geminiProcessor = new GeminiImageProcessor(apiKey);
      
      // 2. Definir el prompt para la IA
      const prompt = "Describe esta captura de pantalla. Si contiene texto, transcríbelo, si contiene una expresión matemática, resuélvela, si es código, busca errores y propone soluciones. Si es un pedido o una pregunta, respóndela";

      // 3. Llamar al método con la Data URL
      const resultText = await geminiProcessor.generateContentFromDataUrl(dataUrl, prompt);
      
      // 4. Mostrar el resultado
      document.getElementById('iaResult').innerHTML = limpiarTextoDeIa(resultText);

    } catch (error) {
      // Usamos la función existente para manejar errores de IA
      handleAiError(error);
    }
  })();
  // --- Fin del procesamiento ---

  // Reset de la interfaz de usuario
  selectionBox.classList.add('hidden');
  selecting = false;
  captureBtn.disabled = true;
  moveBtn.disabled = true;
  selectionRect = null;
  resetToolStates();
  pencilBtn.classList.add('active');
  updateCanvasCursor();
});


// ... (aquí va el resto de tu código de app.js, desde la función showNotification hasta el final)
// ... (asegúrate de pegar todo el código restante de tu archivo original)

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(notification);
  setTimeout(() => { notification.classList.add('show'); }, 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300);
  }, 4000);
}

closeIaOutput.addEventListener('click', () => {
  iaOutput.style.display = 'none';
  output.style.display = 'none';
});

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX ?? e.touches?.[0]?.clientX;
  const clientY = e.clientY ?? e.touches?.[0]?.clientY;
  return [
    Math.round(((clientX - rect.left) / rect.width) * canvas.width),
    Math.round(((clientY - rect.top) / rect.height) * canvas.height)
  ];
}
function getRect(x1, y1, x2, y2) {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    w: Math.abs(x2 - x1),
    h: Math.abs(y2 - y1)
  };
}

// Modo Oscuro
function setDarkMode(enabled) {
  darkMode = enabled;
  document.body.dataset.theme = darkMode ? 'dark' : 'light';
  darkModeBtn.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  const backgroundColor = darkMode ? '#1e293b' : '#fff';
  canvas.style.background = backgroundColor;
  // Guardar estado actual antes de limpiar
  const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Restaurar el dibujo sobre el nuevo fondo
  ctx.putImageData(currentState, 0, 0);
}
darkModeBtn.addEventListener('click', () => {
  setDarkMode(!darkMode);
});

// Inicialización
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
saveCanvasState(); // Guarda el estado inicial en blanco
updateCanvasCursor();
initializeApp();

// Atajos de teclado
window.addEventListener('keydown', (e) => {
  if ((selecting || moving || textMode || shapeMode) && e.key === 'Escape') {
    resetToolStates();
    pencilBtn.classList.add('active');
    selectionBox.classList.add('hidden');
    updateButtonStates();
    textPanel.classList.add('hidden');
    textInput.classList.add('hidden');
    updateCanvasCursor();
  }
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo(); }
  }
});

// --- FIN DEL ARCHIVO app.js ---