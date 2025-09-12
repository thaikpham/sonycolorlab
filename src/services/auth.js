// File Path: thaikpham/sonycolorlab/sonycolorlab-new-features/src/services/auth.js
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { state } from './state.js';
import { renderHeader } from './ui.js';
import { getFavoriteRecipes } from './firestore.js';

let auth;

export function initAuth(app) {
    if (!app) return;
    auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
        state.auth.user = user;
        state.auth.isLoggedIn = !!user;
        
        if (user) {
            // User is signed in, fetch their favorites and cache them
            state.auth.favorites = await getFavoriteRecipes(user.uid);
        } else {
            // User is signed out, clear favorites
            state.auth.favorites = [];
        }
        
        console.log("Auth state changed: ", user ? `Logged in as ${user.displayName}`: 'Logged out');
        renderHeader(); // Re-render header to show login/logout state
        
        // If user logs in/out while on recipe list, re-render it to show/hide "My Lab"
        if (state.ui.currentView === 'recipeFormulas') {
            const { renderLibraryList, renderLibraryDetails } = await import('../components/recipe-list/recipe-list-ui.js');
            // If they were viewing favorites and logged out, switch to 'all'
            if (!user && state.ui.filter === 'favorites') {
                state.ui.filter = 'all';
            }
            renderLibraryList();
            renderLibraryDetails();
        }
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


