document.addEventListener("DOMContentLoaded", () => {
    const status = document.getElementById("auth-status");

    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
        status.textContent = "❌ Biometric authentication not supported in this browser.";
        console.warn("WebAuthn not supported.");
        return;
    }

    status.textContent = "✅ Biometric authentication is supported. You may register or log in.";
    console.log("WebAuthn is supported.");
});

// REGISTER BIOMETRICS
document.getElementById("register-btn").addEventListener("click", async () => {
    const status = document.getElementById("auth-status");
    try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: challenge,
                rp: { name: "Habit Tracker Midterm" },
                user: {
                    id: new Uint8Array(16),
                    name: "user@example.com",
                    displayName: "Habit Tracker User"
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },   // ECDSA w/ SHA-256
                    { type: "public-key", alg: -257 }  // RSA w/ SHA-256
                ],
                authenticatorSelection: {
                    userVerification: "preferred"
                },
                timeout: 60000,
                attestation: "direct"
            }
        });

        if (credential) {
            const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
            localStorage.setItem("credentialId", credentialId);

            status.textContent = "✅ Registration successful!";
            console.log("✅ Credential Registered:", credential);
        } else {
            status.textContent = "❌ Registration failed.";
            console.warn("Credential creation returned null.");
        }
    } catch (error) {
        console.error("❌ Registration failed:", error.name, error.message);
        status.textContent = `❌ Registration error: ${error.message}`;
    }
});

// LOGIN BIOMETRICS
document.getElementById("login-btn").addEventListener("click", async () => {
    const status = document.getElementById("auth-status");
    try {
        const storedCredentialId = localStorage.getItem("credentialId");

        if (!storedCredentialId) {
            status.textContent = "⚠️ No registered credentials found. Please register first.";
            console.warn("No credential found in localStorage.");
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
            status.textContent = "✅ Authentication successful!";
            console.log("✅ Authentication Successful:", credential);
        } else {
            status.textContent = "❌ Authentication failed.";
            console.warn("Authentication returned null.");
        }
    } catch (error) {
        console.error("❌ Authentication failed:", error.name, error.message);
        status.textContent = `❌ Login error: ${error.message}`;
    }
});
