import React, { useContext, useEffect, useState } from 'react'
import {auth} from '../../firebase/firebase'
import 'firebase/auth'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [applicationList, setApplicationList] = useState([]); // Initialize as empty array
    const [isLoaded, setIsLoaded] = useState(false);

    function signup(Email, password, FirstName, LastName) {
        const db = getFirestore();
    
        return createUserWithEmailAndPassword(auth, Email, password).then(async (cred) => {
            const user = cred.user;
            const userId = user.uid;
    
            const userRef = doc(db, 'users', userId);
            
            await setDoc(userRef, {
                email: Email,
                firstName: FirstName,
                lastName: LastName,
            });
            console.log("User data added to Firestore!");
    
            // Add initial application data
            const applicationListCollectionRef = collection(db, `users/${userId}/applicationList`);
            await addDoc(applicationListCollectionRef, {
                status: 'pending',
                date: new Date(),
            });
            console.log("Application data added to Firestore!");
    
            setIsAuthenticated(true);
            setCurrentUser(user);
        }).catch((error) => {
            console.error("Error during signup:", error);
        });
    }
    

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        setCurrentUser();
        return signOut(auth);
    }

    async function addApplication(data){
        const db = getFirestore();
        if (!currentUser) {
            console.error("User not authenticated");
            return;
        }
    
        try {
            // Reference to the applicationList subcollection
            const applicationListCollectionRef = collection(db, `users/${currentUser.uid}/applicationList`);
            
            const docRef = await addDoc(applicationListCollectionRef, data);
            console.log("Application added successfully");

            // Update the local application list
            const newApplication = { id: docRef.id, ...data };
            setApplicationList((prevList) => [...prevList, newApplication]);

            return newApplication;
        } catch (e) {
            console.error("Error adding data", e);
        }
    }

    async function updateApplication(applicationId, updatedData) {
        const db = getFirestore();
        if (!currentUser) {
            console.error("User not authenticated");
            return;
        }
    
        try {
            const applicationDocRef = doc(db, `users/${currentUser.uid}/applicationList`, applicationId);
            await updateDoc(applicationDocRef, updatedData);
            console.log("Application updated successfully");

            // Update local state to reflect the change
            setApplicationList((prev) =>
                prev.map((application) =>
                    application.id === applicationId ? { ...application, ...updatedData } : application
                )
            );
        } catch (error) {
            console.error("Error updating application:", error);
        }
    }

    async function deleteApplication(applicationId) {
        const db = getFirestore();
        if (!currentUser) {
            console.error("User not authenticated");
            return;
        }
    
        // Construct the document reference
        const applicationDocPath = `users/${currentUser.uid}/applicationList/${applicationId}`;
        console.log("Attempting to delete document at path:", applicationDocPath);
    
        try {
            const applicationDocRef = doc(db, applicationDocPath);
            await deleteDoc(applicationDocRef);
            console.log("Application deleted successfully");
    
            // Update local state
            setApplicationList((prev) =>
                prev.filter((application) => application.id !== applicationId)
            );
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    }
    

    // const getApplication = async () => {
    //     if (isLoaded) {
    //       // Skip fetching if data is already loaded
    //       return applicationList;
    //     }
    //     console.log("called");
    //     try {
    //       const db = getFirestore();
    //       const userId = auth.currentUser?.uid;
    //       if (!userId) throw new Error("User not authenticated");
    
    //       const applicationListCollectionRef = collection(db, `users/${userId}/applicationList`);
    //       const querySnapShot = await getDocs(applicationListCollectionRef);
    
    //       // Map through documents to extract data
    //       const applications = querySnapShot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...doc.data(),
    //       }));
    
    //       setApplicationList(applications);
    //       setIsLoaded(true); // Mark data as loaded
    //       return applications;
    //     } catch (error) {
    //       console.error("Error fetching applications:", error);
    //       return [];
    //     }
    // };

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         getApplication(); // Fetch data only if the user is authenticated
    //     }
    // }, [isAuthenticated]);
    
    
    useEffect(()=> {

        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setIsAuthenticated(true);
        })
        
        return unsubscribe;
    }, [])

    // Export the functions
    const value = {
        currentUser,
        isAuthenticated,
        applicationList,
        updateApplication, 
        deleteApplication, 
        addApplication,
        signup,
        login,
        logout
    }

  return (
    <AuthContext.Provider value={value}>
        {isAuthenticated && children}
    </AuthContext.Provider>
  )
}
