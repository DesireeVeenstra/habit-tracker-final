document.getElementById("login-btn").addEventListener("click", async () => {
    if (!window.PublicKeyCredential) {
        document.getElementById("auth-status").textContent = "Biometric authentication not supported.";
        return;
    }

    try {
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: new Uint8Array(32),
                rp: { name: "Habit Tracker" },
                user: { id: new Uint8Array(32), name: "user@example.com", displayName: "User" },
                pubKeyCredParams: [{ type: "public-key", alg: -7 }]
            }
        });

        document.getElementById("auth-status").textContent = "Authentication successful!";
    } catch (error) {
        document.getElementById("auth-status").textContent = "Authentication failed.";
    }
});
