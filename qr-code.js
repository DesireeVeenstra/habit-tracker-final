document.addEventListener("DOMContentLoaded", () => {
    const qrContainer = document.getElementById("qr-code");

    if (qrContainer) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js";

        script.onload = () => {
            const liveUrl = "https://DesireeVeenstra.github.io/habit-tracker-final/"; // ✅ change this
            console.log("✅ QRCode.js loaded. Generating QR for:", liveUrl);
            new QRCode(qrContainer, {
                text: liveUrl,
                width: 128,
                height: 128
            });
        };

        document.body.appendChild(script);
    }
});
