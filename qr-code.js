import QRCode from 'https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js';

new QRCode(document.getElementById("qr-code"), {
    text: window.location.href,
    width: 128,
    height: 128
});
