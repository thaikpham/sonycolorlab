// File Path: thaikpham/sonycolorlab/sonycolorlab-new-features/src/services/firestore.js
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { state } from './state.js';
import { showToast } from './ui.js';

let db;

export function initFirestore(app) {
    db = getFirestore(app);
    state.firebase.db = db;
}

export async function isRecipeFavorited(userId, recipeId) {
    if (!userId) return false;
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() && userDocSnap.data().favorites?.includes(recipeId);
}

export async function toggleFavorite(userId, recipeId) {
    if (!userId || !db) {
        showToast("You need to be logged in to save recipes.", true);
        return;
    }

    const userDocRef = doc(db, "users", userId);
    
    try {
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().favorites?.includes(recipeId)) {
            // Recipe is already favorited, so remove it
            await updateDoc(userDocRef, {
                favorites: arrayRemove(recipeId)
            });
            showToast("Recipe removed from My Lab");
        } else {
            // Recipe is not favorited, so add it
            await setDoc(userDocRef, { 
                favorites: arrayUnion(recipeId) 
            }, { merge: true });
            showToast("Recipe saved to My Lab!");
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        showToast("Could not update favorites. Please try again.", true);
    }
}

export async function getFavoriteRecipes(userId) {
    if (!userId || !db) return [];

    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data().favorites || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
}

