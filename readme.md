# Pizarra Inteligente con IA
### Importante: 
Para usar las funciones de IA, se necesita una API de Gemini  (vamos, que te dan un mes gratis)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una pizarra digital interactiva y herramienta de captura de pantalla que funciona 100% en tu navegador, potenciada por la API de Google Gemini. Dibuja, escribe, selecciona un área de tu lienzo y hazle preguntas a la IA sobre tu captura.




## 🚀 Demo en Vivo

**Prueba la aplicación directamente en tu navegador:**
**👉 [https://vicanmendez.github.io/pizarra/](https://vicanmendez.github.io/pizarra/)**
(Link arreglado porque obviamente me ayudé de la IA hasta para hacer el readme.md, hay que ser vago, he?)
---

## ✨ Características Principales

-   **Herramientas de Dibujo Completas:** Lápiz, borrador, figuras geométricas, texto y selector de color.
-   **Lienzo Infinito (Whiteboard):** Un espacio para plasmar tus ideas, tomar notas o resolver problemas.
-   **Selección y Captura:** Selecciona cualquier área de tu lienzo con precisión.
-   **Integración con IA (Google Gemini):**
    -   **Análisis Visual:** Pide a la IA que describa lo que ve en tu captura.
    -   **Resolución de Problemas:** Captura una operación matemática y pide la solución.
    -   **Transcripción de Texto:** Extrae y transcribe cualquier texto de una imagen.
    -   **Asistente Interactivo:** ¡Haz cualquier pregunta sobre la imagen capturada!
-   **100% del Lado del Cliente:** Todo el código se ejecuta localmente en tu navegador. Rápido, privado y seguro.
-   **Modo Oscuro:** Interfaz cómoda para trabajar de noche.
-   **Deshacer y Rehacer:** No temas equivocarte.

---

## ⚙️ Cómo Funciona

Esta herramienta está construida con HTML, CSS y JavaScript puro, sin necesidad de un backend. Utiliza el modelo **"Trae Tu Propia Clave" (BYOK - Bring Your Own Key)**.

Esto significa que la aplicación usa **tu propia clave de API de Google Gemini** para realizar las peticiones. La clave se guarda de forma segura en el `localStorage` de tu navegador y nunca se expone ni se envía a ningún servidor que no sea el de Google.

---

## 👨‍💻 Guía de Inicio Rápido

1.  **Abre la [Demo en Vivo](https://vicanmendez.github.io/pizarra/).**
2.  La aplicación te pedirá una clave de API de Google Gemini la primera vez que la uses.
3.  **Obtén tu clave de API gratuita:** Ve a [**Google AI Studio**](https://aistudio.google.com/app/apikey) y crea tu clave.
4.  **Pega la clave en el modal** que aparece en la aplicación y guárdala.
5.  ¡Listo! Ya puedes empezar a usar las funciones de IA.

**Flujo de trabajo de ejemplo:**
1.  Dibuja o escribe algo en la pizarra (ej. `2+2=?`).
2.  Usa la herramienta de selección para dibujar un cuadro alrededor de tu dibujo.
4.  Haz clic en el botón **"Capturar y Analizar IA"**.
5.  ¡Observa la respuesta de la IA en el panel de resultados!

---

## 🛡️ Seguridad y Privacidad

La transparencia es fundamental. Queremos que uses esta herramienta con total confianza.

-   ✅ **Tu Clave de API es Tuya:** La clave se guarda **únicamente en el `localStorage` de tu navegador**. No se almacena en ninguna base de datos ni se envía a nuestros servidores (porque no tenemos).
-   ✅ **Sin Servidores, Sin Seguimiento:** Esta aplicación no tiene un backend. No hay registro de usuarios, seguimiento de actividad ni recolección de datos.
-   ✅ **Comunicación Directa:** Tu navegador se comunica directamente con la API de Google. Nosotros no actuamos como intermediarios.
-   ✅ **Código Abierto para la Transparencia:** Te animamos a inspeccionar el código fuente de este repositorio para verificar todo lo anterior. ¡La confianza se gana con la transparencia!

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación, has encontrado un bug o quieres añadir una nueva funcionalidad, por favor:

1.  Abre un **"Issue"** para discutir el cambio que te gustaría hacer.
2.  Haz un **"Fork"** del repositorio.
3.  Crea tu rama de funcionalidad (`git checkout -b feature/AmazingFeature`).
4.  Realiza tus cambios y haz "commit" (`git commit -m 'Add some AmazingFeature'`).
5.  Haz "push" a tu rama (`git push origin feature/AmazingFeature`).
6.  Abre un **"Pull Request"**.

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
*Este proyecto no está afiliado oficialmente con Google.*
