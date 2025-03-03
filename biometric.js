document.getElementById("login-btn").addEventListener("click", async () => {
    if (!window.PublicKeyCredential) {
        document.getElementById("auth-status").textContent = "Biometric authentication not supported.";
        return;
    }

    try {
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: new Uint8Array(32),
                rp: { name: "Habit Tracker Midterm" },
                user: { id: new Uint8Array(32), name: "user@example.com", displayName: "User" },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },  // ES256 (Elliptic Curve)
                    { type: "public-key", alg: -257 } // RS256 (RSA)
                ]
            }
        });

        document.getElementById("auth-status").textContent = "Authentication successful!";
    } catch (error) {
        document.getElementById("auth-status").textContent = "Authentication failed.";
    }
});
