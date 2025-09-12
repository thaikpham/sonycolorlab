// File Path: thaikpham/sonycolorlab/sonycolorlab-new-features/src/services/firestore.js
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { state } from './state.js';
import { showToast } from './ui.js';

let db;

export function initFirestore(app) {
    if (!app) return;
    db = getFirestore(app);
    state.firebase.db = db;
}

export async function isRecipeFavorited(userId, recipeId) {
    if (!userId || !db) return false;
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


// === COMMENTS ===

/**
 * Adds a new comment to a recipe.
 * @param {string} recipeId - The ID of the recipe being commented on.
 * @param {object} user - The authenticated user object from Firebase Auth.
 * @param {string} text - The comment text.
 */
export async function addComment(recipeId, user, text) {
    if (!user || !db || !text.trim()) {
        showToast("You must be logged in to comment.", true);
        return;
    }

    try {
        const commentsColRef = collection(db, "recipes", recipeId, "comments");
        await addDoc(commentsColRef, {
            userId: user.uid,
            userName: user.displayName,
            userAvatar: user.photoURL,
            text: text.trim(),
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding comment: ", error);
        showToast("Could not post comment. Please try again.", true);
    }
}

/**
 * Listens for real-time updates to a recipe's comments.
 * @param {string} recipeId - The ID of the recipe.
 * @param {function} callback - The function to call with the comments array.
 * @returns {function} An unsubscribe function for the listener.
 */
export function onCommentsSnapshot(recipeId, callback) {
    if (!db) return () => {};

    const commentsColRef = collection(db, "recipes", recipeId, "comments");
    const q = query(commentsColRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        callback(comments);
    }, (error) => {
        console.error("Error fetching comments: ", error);
        callback([]); // Return empty array on error
    });

    return unsubscribe;
}

