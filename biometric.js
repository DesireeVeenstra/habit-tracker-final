// Ensure browser supports WebAuthn
if (!window.PublicKeyCredential) {
    document.getElementById("auth-status").textContent = "Biometric authentication not supported.";
}

// 📌 REGISTER USER (Creates Credential)
document.getElementById("register-btn").addEventListener("click", async () => {
    try {
        const challenge = new Uint8Array(32); // Secure challenge
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: challenge,
                rp: { name: "Habit Tracker Midterm" },
                user: {
                    id: new TextEncoder().encode("user123"), // User ID must be a Uint8Array
                    name: "user@example.com",
                    displayName: "User"
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 }, // ES256
                    { type: "public-key", alg: -257 } // RS256
                ],
                authenticatorSelection: { userVerification: "preferred" },
                timeout: 60000,
                attestation: "direct"
            }
        });

        // Store credential ID for login
        localStorage.setItem("credentialId", btoa(String.fromCharCode(...new Uint8Array(credential.rawId))));

        document.getElementById("auth-status").textContent = "Registration successful!";
        console.log("✅ Credential Registered:", credential);
    } catch (error) {
        console.error("❌ Registration failed:", error);
        document.getElementById("auth-status").textContent = "Registration failed.";
    }
});

// 📌 LOGIN USER (Uses Stored Credential)
document.getElementById("login-btn").addEventListener("click", async () => {
    try {
        const storedCredentialId = localStorage.getItem("credentialId");
        if (!storedCredentialId) {
            document.getElementById("auth-status").textContent = "No registered credentials found.";
            return;
        }

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: challenge,
                allowCredentials: [{
                    id: Uint8Array.from(atob(storedCredentialId), c => c.charCodeAt(0)),
                    type: "public-key"
                }],
                userVerification: "preferred"
            }
        });

        document.getElementById("auth-status").textContent = "Authentication successful!";
        console.log("✅ Authentication Successful:", credential);
    } catch (error) {
        console.error("❌ Authentication failed:", error);
        document.getElementById("auth-status").textContent = "Authentication failed.";
    }
});
