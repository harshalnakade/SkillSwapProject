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
  const [loading, setLoading] = useState(true); // To check if auth state is loaded

  useEffect(() => {
    // This listener runs whenever the user's login state changes.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is logged in. Fetch their custom data from Firestore.
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            // Combine the auth data with the firestore data
            setCurrentUser({ ...user, ...userDocSnap.data() });
          } else {
            // This can happen with social logins for the first time
            setCurrentUser(user);
          }
        } else {
          // User is signed out
          setCurrentUser(null);
        }
      } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null); // Log out user on error to be safe
      } finally {
          // THE FIX: This block will run regardless of success or failure,
          // ensuring the loading state is always turned off.
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

  // We always render children now. The ProtectedRoute will handle the loading UI.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}