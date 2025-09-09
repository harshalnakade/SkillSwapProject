import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the context easily
export function useAuth() {
  return useContext(AuthContext);
}

// Create the provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is logged in. Keep the original Firebase user object.
          // This object has all the necessary auth methods like getIdToken().
          const authUser = user;

          // Now, fetch their custom data from Firestore.
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Attach the Firestore data as a new property.
            // This avoids destroying the original authUser object.
            authUser.customData = userDocSnap.data();
          }
          
          // Set the complete user object (with auth methods and custom data) in state.
          setCurrentUser(authUser);

        } else {
          // User is signed out
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCurrentUser(null); // Log out user on error to be safe
      } finally {
        setLoading(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

