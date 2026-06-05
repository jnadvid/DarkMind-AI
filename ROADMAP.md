# Hoja de ruta / Ayuda buscada

DarkMind-AI está en marcha, pero aún no ha llegado a puerto. Funciona genial para mí (lol), pero este barco va rápido y se agradecen comentarios y ayuda. (No sé muy bien lo que estoy haciendo, ayuda).

Si ves CSS extraño, comportamiento de diseño raro o un rincón sospechosamente oscuro del código, probablemente tengas razón en mantenerte alejado.

## Alta Prioridad

- APLASTAR ERRORES
- Pruebas de humo de instalación limpia en Linux, macOS y Windows. Python nativo y WSL necesitan cobertura.

- Auditoría de integraciones: ¿funcionan siquiera las integraciones? Confirmar qué funciona, qué necesita documentación de configuración y qué debería eliminarse u ocultarse.
- Manual de solución de problemas de autoalojamiento. Documenta las correcciones raras de 30 segundos que de otro modo se convierten en búsquedas de 30 minutos: autenticación en texto claro de Dovecot para pilas locales, Entrega Instantánea de Android de ntfy para servidores no-ntfy.sh, límites del portapapeles en URLs de Tailscale sobre HTTP plano, URLs de colección de Radicale, y trampas similares.
- Fiabilidad de Cookbook en otros ordenadores. Es probablemente el área que más trabajo puede necesitar en distintas máquinas, GPUs, drivers, shells y entornos Python.
- Soporte de SGLang en Cookbook entre plataformas. Asegurarse de que la configuración/servicio de SGLang funcione de forma predecible en Linux, Windows/WSL, macOS donde sea posible, y rutas de hardware NVIDIA/AMD comunes.
- Preajustes de modelo para Investigación Profunda según hardware. Recomendar perfiles aprobados de modelo/parámetros para configuraciones locales pequeñas, medianas y grandes, para que personas con diferente hardware puedan usar la Investigación Profunda sin tener que adivinar. Mostrar esto en la configuración de Investigación Profunda o como sugerencia de escaneo/desplegable en Cookbook.
- Clasificación del escaneo/descarga de modelos en Cookbook. Priorizar arquitecturas más recientes y modelos con mejor ajuste al hardware en lugar de puntuar casi todos igual. La clasificación debe tener en cuenta la antigüedad de la arquitectura, el formato de cuantización, el ajuste de VRAM/RAM, el soporte del backend, los requisitos de visión/mmproj y la fiabilidad probable del servicio.
- Retroalimentación de errores y registro en Cookbook. Los errores de descarga, instalación de dependencias, comprobaciones previas y trabajos de servicio deberían mostrar el comando/salida/error real en la interfaz, con registros copiables y pasos claros a seguir, en lugar de solo «bloqueado».
- Sobrecarga de contexto en el agente. El modo agente es demasiado pesado para modelos locales más pequeños: los esquemas de herramientas, habilidades, memoria, documentos e instrucciones pueden agotar el contexto antes de que la solicitud del usuario realmente comience. Se necesitan instrucciones más ligeras, mejor selección de herramientas, conjuntos de herramientas predeterminados más pequeños y orientación más clara para modelos con ventanas de contexto de 4k/8k/16k.
- Auditoría de inyección en instrucciones de habilidades/herramientas. Las habilidades editables por el usuario, notas, documentos, páginas obtenidas y memorias deben tratarse como datos no confiables. Sigue probando si los modelos siguen instrucciones maliciosas procedentes de esas superficies.
- Mejor informe de estado degradado para ChromaDB, SearXNG, correo, ntfy y sondas de proveedor.
- Auditoría de rendimiento del correo electrónico. Obtener, buscar, abrir, eliminar y enviar correos puede sentirse lento, especialmente con proveedores IMAP/SMTP de alta latencia. Se necesita alguien que conozca el rendimiento del correo para perfilar el flujo actual, identificar si el cuello de botella está en la selección/obtención de carpetas IMAP, la invalidación de caché, la carga de adjuntos/cuerpo, los handshakes SMTP o el comportamiento de actualización del frontend, y luego proponer caché/prefetch/procesamiento por lotes más seguros sin romper el estado de múltiples cuentas.
- Auditoría de configuración/sondeo de proveedores para Anthropic, Gemini, Groq, xAI, OpenRouter, OpenAI y DeepSeek.

## Objetivos de Refactorización
- Limpieza de CSS. `static/style.css` básicamente es la isla de Calipso en este momento.
- Ayudante principal de tour. Los tours de incorporación tienen demasiado andamiaje copiado y pegado; crea un ayudante compartido `tour-core.js` antes de añadir más tours.
- Limpieza del posicionamiento de ventanas/modales. Algunos controles de ventana han mejorado, pero el comportamiento subyacente de popup/dropdown/posición-fija sigue siendo demasiado frágil.
- Descubribilidad de anulaciones de medios en móvil. Muchos errores de «el CSS no se movió» son anulaciones de `@media` en móvil del mismo selector; comentarios o comprobaciones en torno a reglas emparejadas escritorio/móvil ayudarían.
- Pasada de código muerto para rutas antiguas, indicadores de características obsoletos y estados de interfaz sin usar.

## Frontend

- Ampliar el Editor para un uso diario más rápido y robusto. Mejor manejo de archivos/documentos, comportamiento de ventana más fluido, flujos de guardado/exportación más claros, mejores capacidades de edición de imágenes y menos casos límite frágiles.
- Mejor integración de IA para Notas y Tareas. Las notas deberían ser más fáciles de leer, actualizar, resumir y convertir en acciones para el agente. Las tareas deberían poder asignarse a un agente desde la interfaz, posiblemente mediante un botón, acción de tarea o flujo de habilidad/herramienta dedicado.
- Pulido de galería/editor en móvil. Más fácil de lanzar/descargar el modelo de inpainting o las piezas que falten.
- Pasada de accesibilidad: navegación por teclado, estados de foco, contraste, movimiento reducido.
- Mejorar los estados vacíos y los mensajes de error en instalaciones nuevas.
- Ajustar la configuración inicial, los consejos y los tours para que no se repitan ni entren en conflicto.
- Incluir activos CDN eventualmente para un modo más completamente autoalojado/sin conexión.

## Backend

- Más pruebas en torno al sondeo de endpoints y la configuración de proveedores.
- Mejores valores predeterminados y visibilidad del programador de tareas.
- Guía de copia de seguridad/restauración y flujo auxiliar para `data/`.
- Refuerzo de seguridad en torno a las herramientas de solo administrador y documentación clara de sus riesgos.

## No es la Prioridad Ahora Mismo

Probablemente no debería añadir más temas.
