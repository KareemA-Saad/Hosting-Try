//this file is used to manage user data in Firebase Firestore and store 
// it to be easier to access and deal with

import { db } from './firebase-config.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

class UserDataService {
    constructor() {
        this.currentUser = null;
        this.userData = null;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        return this.saveUserData(user.uid, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString()
        });
    }

    async getUserData(userId) {
        try {
            const userRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    

    async saveUserData(userId, userData) {
        if (!userId || !userData) {
            console.error('Missing userId or userData');
            return null;
        }

        try {
            const userRef = doc(db, 'users', userId);
            const existingData = await this.getUserData(userId);
            
            const dataToSave = {
                ...existingData,
                ...userData,
                updatedAt: new Date().toISOString()
            };

            await setDoc(userRef, dataToSave, { merge: true });
            this.userData = dataToSave;
            console.log('User data saved successfully:', dataToSave);
            return dataToSave;
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }

    async updateUserField(userId, field, value) {
        try {
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, { [field]: value }, { merge: true });
            if (this.userData && this.userData.uid === userId) {
                this.userData[field] = value;
            }
        } catch (error) {
            console.error('Error updating user field:', error);
            throw error;
        }
    }
}

export const userDataService = new UserDataService();

export function getCurrentUserUid() {
    return userDataService.currentUser ? userDataService.currentUser.uid : null;
}

