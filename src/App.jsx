import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from './firebaseConfig';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Importamos el Router

// COMPONENTES
import Landing from './components/Landing';
import AdminDashboard from './components/AdminDashboard';
import PublicScan from './components/PublicScan'; // El componente que creamos antes

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
        if (ADMIN_EMAILS.includes(u.email)) {
          setUser(u);
        } else {
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
    if (!user) {
      setNinos([]);
      return;
    }
    const unsubData = onSnapshot(query(collection(db, "niños")), (snap) => {
      const docs = [];
      snap.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
      setNinos(docs);
    }, (error) => {
      console.error("Error en Firebase:", error);
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
    <BrowserRouter>
      <Routes>
        {/* RUTA PRINCIPAL: Landing o Admin */}
        <Route path="/" element={
          !showAdmin ? (
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
          )
        } />

        {/* RUTA PÚBLICA DE ESCANEO: Atrapa el ID del link admin-cuida-nino.vercel.app/scan/ID */}
        <Route path="/scan/:id" element={<PublicScan />} />

        {/* REDIRECCIÓN: Si escriben cualquier otra cosa, al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}