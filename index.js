const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: puppeteer.executablePath(), // Usar la versión de Chromium de puppeteer
        headless: false, // Cambia a true si no quieres ver la ventana del navegador
        timeout: 60000 // Aumentar el tiempo de espera si es necesario
    }
});

// Mapa para asociar opciones de menú con números de teléfono o grupos
const serviceRouting = {
    '1': '5491135665266@c.us',  // Número para Hosting en formato correcto
    '2': '5491126674285@c.us',  // Número para Soporte en formato correcto
    '3': '5491126674285@c.us'   // Número para ventas en formato correcto
};

// Genera el código QR para la autenticación inicial
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea el QR con tu aplicación de WhatsApp.');
});

// Mensaje en consola cuando el cliente está autenticado
client.on('ready', () => {
    console.log('Cliente está listo y autenticado!');
});

// Manejo de mensajes entrantes
client.on('message', (message) => {
    const userNumber = message.from;  // Número del cliente que envía el mensaje

    // Verificar si el usuario ha seleccionado una opción
    if (serviceRouting[message.body]) {
        const destinationNumber = serviceRouting[message.body];
        message.reply(`Te estamos redirigiendo al servicio seleccionado. Por favor espera...`);

        // Redirigir el mensaje al número correspondiente
        client.sendMessage(destinationNumber, `Mensaje de ${userNumber}: ${message.body}`);
    } else {
        // Si el usuario no ha seleccionado una opción válida, se muestra el menú inicial
        message.reply('👋 ¡Bienvenido a nuestro servicio de Kaizen2B! Por favor selecciona una opción:\n\n1️⃣ *Hosting* 🌐\n2️⃣ *Soporte* 🛠️\n3️⃣ *Ventas* 🛒');
    }
});

// Inicializar el cliente de WhatsApp
client.initialize();
