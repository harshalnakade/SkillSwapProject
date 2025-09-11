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

  const refreshUser = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      const authUser = { ...user };

      if (userDocSnap.exists()) {
        authUser.customData = userDocSnap.data();
      }
      
      setCurrentUser(authUser);

    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const authUser = user;
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            authUser.customData = userDocSnap.data();
          }
          
          setCurrentUser(authUser);

        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}