// 🔒 SISTEMA DE PROTECCIÓN - MODSLJAK
// ⚠️ NO REMOVER ESTE CÓDIGO - LICENCIA REQUERIDA
(function() {
    'use strict';
    
    // Configuración
    const CONFIG = {
        proyectoId: 'modsljak_victor',
        urlControl: 'https://torhshwvve.github.io/panel-control/proyectos.json',
        mensajePersonalizado: true,
        verificarCadaMinutos: 5
    };

    // Función principal de verificación
    function verificarLicencia() {
        fetch(CONFIG.urlControl + '?t=' + Date.now())
            .then(response => {
                if (!response.ok) throw new Error('Error de conexión');
                return response.json();
            })
            .then(data => {
                const proyecto = data[CONFIG.proyectoId];
                
                // Verificar si el proyecto existe
                if (!proyecto) {
                    mostrarPantallaBloqueo('Licencia no encontrada', 'Este sitio no tiene una licencia válida registrada.');
                    return;
                }
                
                // Verificar si está activo
                if (!proyecto.activo) {
                    mostrarPantallaBloqueo(
                        'Sitio Desactivado',
                        'Este sitio ha sido desactivado temporalmente. Por favor, contacte al propietario.'
                    );
                    return;
                }
                
                // Verificar fecha de expiración
                const expira = new Date(proyecto.expira);
                const hoy = new Date();
                
                if (hoy > expira) {
                    mostrarPantallaBloqueo(
                        'Licencia Expirada',
                        `La licencia de este sitio expiró el ${expira.toLocaleDateString('es-ES')}.`
                    );
                    return;
                }
                
                // Verificar estado de pago
                if (!proyecto.pagado) {
                    mostrarAdvertenciaPago(expira);
                }
                
                // Todo OK - programar siguiente verificación
                setTimeout(verificarLicencia, CONFIG.verificarCadaMinutos * 60 * 1000);
            })
            .catch(error => {
                console.warn('⚠️ No se pudo verificar la licencia:', error.message);
                // En caso de error de red, permitir el acceso pero intentar de nuevo pronto
                setTimeout(verificarLicencia, 30000); // Reintentar en 30 segundos
            });
    }

    // Mostrar pantalla de bloqueo
    function mostrarPantallaBloqueo(titulo, mensaje) {
        document.body.innerHTML = `
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    overflow: hidden;
                }
                
                .bloqueo-container {
                    text-align: center;
                    padding: 60px 40px;
                    background: rgba(26, 26, 46, 0.95);
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(189, 0, 255, 0.3);
                    max-width: 500px;
                    animation: fadeIn 0.5s ease-in;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .bloqueo-icono {
                    font-size: 80px;
                    margin-bottom: 20px;
                    filter: drop-shadow(0 0 20px rgba(189, 0, 255, 0.5));
                }
                
                .bloqueo-titulo {
                    font-size: 2.5rem;
                    color: #bd00ff;
                    margin-bottom: 20px;
                    font-weight: bold;
                    text-shadow: 0 0 20px rgba(189, 0, 255, 0.5);
                }
                
                .bloqueo-mensaje {
                    font-size: 1.2rem;
                    color: #ccc;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                
                .bloqueo-info {
                    font-size: 0.9rem;
                    color: #888;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .bloqueo-footer {
                    margin-top: 30px;
                    font-size: 0.85rem;
                    color: #666;
                }
            </style>
            <div class="bloqueo-container">
                <div class="bloqueo-icono">🔒</div>
                <h1 class="bloqueo-titulo">${titulo}</h1>
                <p class="bloqueo-mensaje">${mensaje}</p>
                <div class="bloqueo-info">
                    <strong>Información:</strong><br>
                    Este es un sitio protegido con licencia.<br>
                    Contacte al administrador del sitio para más información.
                </div>
                <div class="bloqueo-footer">
                    MODSLJAK © ${new Date().getFullYear()}<br>
                    Sistema de protección activo
                </div>
            </div>
        `;
    }

    // Mostrar advertencia de pago pendiente (sin bloquear)
    function mostrarAdvertenciaPago(expira) {
        const diasRestantes = Math.ceil((expira - new Date()) / (1000 * 60 * 60 * 24));
        
        const banner = document.createElement('div');
        banner.id = 'advertencia-pago';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #bd00ff, #ff006e);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 999999;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        `;
        banner.innerHTML = `
            <strong>⚠️ AVISO:</strong> Pago pendiente. 
            El sitio expira en ${diasRestantes} días. 
            Contacte al desarrollador.
        `;
        document.body.insertBefore(banner, document.body.firstChild);
    }

    // Protección contra manipulación del código
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    
    // Detectar intentos de deshabilitar el verificador
    Object.defineProperty(window, 'setTimeout', {
        value: function(...args) {
            return originalSetTimeout.apply(this, args);
        },
        writable: false,
        configurable: false
    });

    // Iniciar verificación inmediatamente
    verificarLicencia();

    // Protección adicional: verificar periódicamente que el código no fue removido
    setInterval(function() {
        if (!document.querySelector('script[src*="verificador"]') && 
            !document.currentScript) {
            console.warn('🔒 Sistema de protección activo');
        }
    }, 60000);

})();

// Marca de agua en consola
console.log('%c🔒 MODSLJAK - Sistema Protegido', 'color: #bd00ff; font-size: 16px; font-weight: bold;');
console.log('%c⚠️ Este sitio está protegido con licencia. Cualquier intento de manipulación será detectado.', 'color: #ff006e; font-size: 12px;');
