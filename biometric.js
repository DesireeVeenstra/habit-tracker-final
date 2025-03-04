// Ensure browser supports WebAuthn
document.addEventListener("DOMContentLoaded", () => {
    if (!window.PublicKeyCredential) {
        document.getElementById("auth-status").textContent = "❌ Biometric authentication not supported.";
        return;
    }
});

// 📌 REGISTER USER (Creates WebAuthn Credential)
document.getElementById("register-btn").addEventListener("click", async () => {
    try {
        const challenge = new Uint8Array(32); // Secure challenge
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: challenge,
                rp: { name: "Habit Tracker Midterm" },
                user: {
                    id: new Uint8Array(16),  // Randomly generated user ID
                    name: "user@example.com",
                    displayName: "Habit Tracker User"
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },  // ES256 (Elliptic Curve)
                    { type: "public-key", alg: -257 } // RS256 (RSA)
                ],
                authenticatorSelection: { userVerification: "preferred" },
                timeout: 60000,
                attestation: "direct"
            }
        });

        if (credential) {
            // Convert credential ID to base64 for storage
            const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
            localStorage.setItem("credentialId", credentialId);

            document.getElementById("auth-status").textContent = "✅ Registration successful!";
            console.log("✅ Credential Registered:", credential);
        } else {
            document.getElementById("auth-status").textContent = "❌ Registration failed.";
        }
    } catch (error) {
        console.error("❌ Registration failed:", error);
        document.getElementById("auth-status").textContent = "❌ Registration failed. Please try again.";
    }
});

// 📌 LOGIN USER (Authenticate with Stored WebAuthn Credential)
document.getElementById("login-btn").addEventListener("click", async () => {
    try {
        const storedCredentialId = localStorage.getItem("credentialId");
        if (!storedCredentialId) {
            document.getElementById("auth-status").textContent = "⚠️ No registered credentials found. Please register first.";
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

        if (credential) {
            document.getElementById("auth-status").textContent = "✅ Authentication successful!";
            console.log("✅ Authentication Successful:", credential);
        } else {
            document.getElementById("auth-status").textContent = "❌ Authentication failed.";
        }
    } catch (error) {
        console.error("❌ Authentication failed:", error);
        document.getElementById("auth-status").textContent = "❌ Authentication failed. Please try again.";
    }
});
