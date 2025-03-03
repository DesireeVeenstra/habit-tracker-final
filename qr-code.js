const qrContainer = document.getElementById("qr-code");

if (qrContainer) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js";
    script.onload = () => {
        new QRCode(qrContainer, {
            text: window.location.href,
            width: 128,
            height: 128
        });
    };
    document.body.appendChild(script);
}
