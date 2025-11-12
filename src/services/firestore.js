// File Path: src/services/firestore.js
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
    serverTimestamp,
    getDocs,
    where
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { state } from './state.js';
import { showToast } from './ui.js';
import { t } from './language.js';

export let db;

export function initFirestore(app) {
    if (!app) return;
    db = getFirestore(app);
    state.firebase.db = db;
}

export async function createUserProfileIfNeeded(user) {
    if (!user || !db) return;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
        try {
            await setDoc(userDocRef, {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                createdAt: serverTimestamp(),
                socials: {
                    facebook: '',
                    instagram: '',
                    threads: '',
                    website: ''
                }
            });
        } catch (error) {
            console.error("Error creating user profile:", error);
        }
    }
}

export async function getUserProfile(userId) {
    if (!userId || !db) return null;
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        return userDocSnap.exists() ? userDocSnap.data() : null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

export async function updateUserProfile(userId, data) {
    if (!userId || !db) {
        showToast("You must be logged in.", true);
        return;
    }
    const userDocRef = doc(db, "users", userId);
    try {
        await updateDoc(userDocRef, { socials: data });
        showToast(t('saveChanges'));
    } catch (error) {
        console.error("Error updating profile:", error);
        showToast("Failed to update profile.", true);
    }
}

export async function saveOrUpdateGeneratedRecipe(userId, recipeData) {
    if (!userId || !db) {
        showToast(t('logInToSave'), true);
        return null;
    }

    // UPDATE existing recipe if it has a real Firestore document ID
    if (recipeData.id && !recipeData.id.startsWith('SCL-AI-')) {
        try {
            const recipeDocRef = doc(db, "users", userId, "generatedRecipes", recipeData.id);
            const dataToUpdate = { ...recipeData };
            delete dataToUpdate.id; // Don't save the ID inside the document
            
            await setDoc(recipeDocRef, dataToUpdate, { merge: true });
            showToast(t('recipeUpdatedInLab'));
            return recipeData.id;
        } catch (error) {
            console.error("Error updating generated recipe:", error);
            showToast("Could not update the recipe.", true);
            return null;
        }
    } 
    // ADD new recipe
    else {
        try {
            // Remove any temporary ID before saving as a new document
            const dataToSave = { ...recipeData };
            delete dataToSave.id;

            const recipesColRef = collection(db, "users", userId, "generatedRecipes");
            const docRef = await addDoc(recipesColRef, {
                ...dataToSave,
                savedAt: serverTimestamp()
            });
            showToast(t('recipeSavedToLab'));
            return docRef.id;
        } catch (error) {
            console.error("Error saving new generated recipe:", error);
            showToast("Could not save the recipe.", true);
            return null;
        }
    }
}


export async function getGeneratedRecipes(userId) {
    if (!userId || !db) return [];
    try {
        const recipes = [];
        const recipesColRef = collection(db, "users", userId, "generatedRecipes");
        const q = query(recipesColRef, orderBy("savedAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            recipes.push({ id: doc.id, ...doc.data() });
        });
        return recipes;
    } catch (error) {
        console.error("Error fetching generated recipes:", error);
        return [];
    }
}

export async function submitDemoPhoto(userId, data) {
    if (!userId || !db) {
        showToast('You must be logged in to submit a photo.', true);
        return;
    }
    try {
        const submissionsColRef = collection(db, "demoSubmissions");
        await addDoc(submissionsColRef, {
            ...data,
            userId: userId,
            userName: state.auth.user.displayName,
            userAvatar: state.auth.user.photoURL,
            submittedAt: serverTimestamp(),
            status: 'pending' // for future moderation
        });
        showToast(t('submissionSuccess'));
    } catch (error) {
        console.error("Error submitting demo photo:", error);
        showToast(t('submissionError'), true);
    }
}

export async function getUserDemoPhotos(userId) {
    if (!userId || !db) return [];
    try {
        const photos = [];
        const submissionsColRef = collection(db, "demoSubmissions");
        const q = query(submissionsColRef, where("userId", "==", userId), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            photos.push({ id: doc.id, ...doc.data() });
        });
        return photos;
    } catch (error) {
        console.error("Error fetching user demo photos:", error);
        return [];
    }
}

export async function toggleFavorite(userId, recipeId) {
    if (!userId || !db) {
        showToast(t('logInToSave'), true);
        return;
    }

    const userDocRef = doc(db, "users", userId);
    
    try {
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().favorites?.includes(recipeId)) {
            await updateDoc(userDocRef, { favorites: arrayRemove(recipeId) });
            showToast(t('recipeRemovedFromLab'));
        } else {
            await setDoc(userDocRef, { favorites: arrayUnion(recipeId) }, { merge: true });
            showToast(t('recipeSavedToLab'));
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        showToast(t('couldNotUpdateFavorites'), true);
    }
}

export async function getFavoriteRecipes(userId) {
    if (!userId || !db) return [];
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        return userDocSnap.exists() ? (userDocSnap.data().favorites || []) : [];
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
}

export async function addComment(recipeId, user, text) {
    if (!user || !db || !text.trim()) {
        showToast(t('logInToComment'), true);
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
        showToast(t('couldNotPostComment'), true);
    }
}

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
        callback([]);
    });

    return unsubscribe;
}
