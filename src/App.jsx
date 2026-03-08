import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from './firebaseConfig';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Landing from './components/Landing';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [ninos, setNinos] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // 🛡️ LISTA BLANCA DE ADMINISTRADORES
  const ADMIN_EMAILS = ["tobaralexis.89@gmail.com"];

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        // Si el usuario se loguea, verificamos si es admin
        if (ADMIN_EMAILS.includes(u.email)) {
          setUser(u);
        } else {
          // Si no es admin, lo sacamos de inmediato
          handleSignOut();
          alert("Acceso denegado: No tienes permisos de administrador.");
        }
      } else {
        setUser(null);
        setShowAdmin(false);
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    // Solo cargamos datos si hay un usuario validado
    if (!user) {
      setNinos([]);
      return;
    }

    const unsubData = onSnapshot(query(collection(db, "niños")), (snap) => {
      const docs = [];
      snap.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
      setNinos(docs);
    }, (error) => {
      console.error("Error en Snapshot (posibles reglas de Firebase):", error);
    });

    return () => unsubData();
  }, [user]);

  const handleAuth = async () => {
    try {
      setIsAuthorizing(true);
      const result = await signInWithPopup(auth, googleProvider);
      const loggedEmail = result.user.email;

      if (ADMIN_EMAILS.includes(loggedEmail)) {
        setShowAdmin(true);
      } else {
        await handleSignOut();
        alert("Tu cuenta no está autorizada.");
      }
    } catch (e) {
      console.error("Login Error", e);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setShowAdmin(false);
  };

  return (
    <>
      {!showAdmin ? (
        <Landing 
          onEnterAdmin={handleAuth} 
          user={user} 
          isAuthorizing={isAuthorizing} 
        />
      ) : (
        <AdminDashboard 
          user={user} 
          ninos={ninos} 
          onBack={() => setShowAdmin(false)} 
        />
      )}
    </>
  );
}