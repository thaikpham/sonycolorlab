// File Path: thaikpham/sonycolorlab/sonycolorlab-new-features/src/services/auth.js
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { state } from './state.js';
import { renderHeader } from './ui.js';

let auth;

export function initAuth(app) {
    auth = getAuth(app);
    onAuthStateChanged(auth, user => {
        state.auth.user = user;
        state.auth.isLoggedIn = !!user;
        console.log("Auth state changed: ", user ? `Logged in as ${user.displayName}`: 'Logged out');
        renderHeader(); // Re-render header to show login/logout state
    });
}

async function handleSignIn(provider) {
    if (!auth) {
        console.error("Auth is not initialized.");
        return;
    }
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error(`Sign in failed: ${error.message}`);
        // Handle specific errors like popup blocked
    }
}

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    handleSignIn(provider);
}

export function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    handleSignIn(provider);
}

export function handleSignOut() {
    if (!auth) return;
    signOut(auth);
}

