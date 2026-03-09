import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  LayoutDashboard, Printer, Users, LogOut, X, 
  Trash2, Plus, Search, CheckCircle2, Clock, 
  AlertTriangle, Shield, Check, Phone, Eye, 
  HeartPulse, MapPin, Calendar, Menu, Edit3, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function AdminDashboard({ user, ninos, onBack }) {
  const [tab, setTab] = useState('dashboard');
  const [filtro, setFiltro] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [editChild, setEditChild] = useState(null); // Estado para el modal de edición
  const [alert, setAlert] = useState({ show: false, title: '', message: '', onConfirm: null, type: 'info' });

  const LOGO_URL = "https://i.postimg.cc/kg7yX89x/unnamed.png";

  const registrados = ninos.filter(n => n.nombre && n.nombre !== "");
  const disponibles = ninos.filter(n => !n.nombre || n.nombre === "");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onBack) onBack();
    } catch (error) { console.error("Error al cerrar sesión", error); }
  };

  const showAlert = (title, message, onConfirm, type = 'info') => {
    setAlert({ show: true, title, message, onConfirm, type });
  };

  const handleEliminar = (id) => {
    showAlert(
      "CONFIRMAR ELIMINACIÓN",
      `¿DESEA BORRAR EL REGISTRO ${id} permanentemente?`,
      async () => {
        await deleteDoc(doc(db, "niños", id));
        setAlert({ ...alert, show: false });
      },
      'danger'
    );
  };

  const handleGuardarEdicion = async () => {
    if (!editChild) return;
    try {
      const docRef = doc(db, "niños", editChild.id);
      await updateDoc(docRef, {
        nombre: editChild.nombre,
        alergias: editChild.alergias,
        contacto: editChild.contacto,
        // Si tienes múltiples contactos:
        contactos: Array.isArray(editChild.contactos) ? editChild.contactos : [editChild.contacto]
      });
      setEditChild(null);
      showAlert("ÉXITO", "REGISTRO ACTUALIZADO CORRECTAMENTE", null, 'success');
    } catch (error) {
      console.error(error);
      showAlert("ERROR", "NO SE PUDO ACTUALIZAR EL REGISTRO", null, 'danger');
    }
  };

  const generarLote = async () => {
    for (let i = 0; i < 8; i++) {
      const id = Math.random().toString(36).substring(2, 8).toUpperCase();
      await setDoc(doc(db, "niños", id), { 
        estado: "DISPONIBLE", nombre: "", contacto: "", alergias: "",
        fechaCreacion: new Date().toISOString()
      });
    }
    showAlert("NÚCLEO ACTUALIZADO", "8 CÓDIGOS INYECTADOS.", null, 'success');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0F1115] text-slate-300 font-sans overflow-hidden">
      
      {/* HEADER MÓVIL */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} className="w-10 h-10 object-contain" alt="Logo" />
          <span className="font-black text-sm tracking-tighter">AVISTO.ADMIN</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* --- MODAL: EDICIÓN DE NIÑO --- */}
      <AnimatePresence>
        {editChild && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1A1D23] border border-white/10 w-full max-w-lg p-8 rounded-3xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">Editar Registro</h3>
                <button onClick={() => setEditChild(null)} className="text-slate-500 hover:text-white"><X size={20}/></button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-500 mb-2 block">Nombre Completo</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm outline-none focus:border-blue-600 transition-all"
                    value={editChild.nombre}
                    onChange={(e) => setEditChild({...editChild, nombre: e.target.value.toUpperCase()})}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-500 mb-2 block">Contacto Emergencia</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm outline-none focus:border-blue-600 transition-all font-mono"
                    value={editChild.contacto}
                    onChange={(e) => setEditChild({...editChild, contacto: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-500 mb-2 block">Alergias / Médicos</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm outline-none focus:border-blue-600 transition-all h-24 resize-none"
                    value={editChild.alergias}
                    onChange={(e) => setEditChild({...editChild, alergias: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>

              <button 
                onClick={handleGuardarEdicion}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white py-4 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all rounded-xl"
              >
                <Save size={16}/> Guardar Cambios
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: FICHA VISTA (TU ORIGINAL RESPONSIVO) --- */}
      <AnimatePresence>
        {selectedChild && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#16191F] border border-white/10 w-full h-full md:h-auto md:max-w-4xl max-h-[100vh] md:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase">Expediente AVISTO</span>
                <button onClick={() => setSelectedChild(null)} className="p-2 text-slate-500"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-blue-600/20 p-1 mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-2 border-blue-600">
                      {selectedChild.fotoUrl ? <img src={selectedChild.fotoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-700"><Users size={60} /></div>}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">{selectedChild.nombre}</h2>
                  <div className="mt-2 bg-blue-600/10 px-4 py-1 text-blue-500 font-mono text-[10px]">ID: #{selectedChild.id}</div>
                </div>
                <div className="space-y-6">
                  <div className="p-4 border-l-4 border-red-500 bg-white/5 uppercase">
                    <p className="text-[8px] font-black text-slate-500 mb-1">Alertas Médicas</p>
                    <p className="text-sm font-bold text-white leading-tight">{selectedChild.alergias || "Ninguna"}</p>
                  </div>
                  <div className="p-4 border-l-4 border-blue-500 bg-white/5">
                    <p className="text-[8px] font-black text-slate-500 mb-1">Contacto</p>
                    <p className="text-sm font-bold text-white font-mono">{Array.isArray(selectedChild.contactos) ? selectedChild.contactos[0] : selectedChild.contacto}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-black/40 text-right"><button onClick={() => setSelectedChild(null)} className="w-full md:w-auto px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest">Cerrar</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR RESPONSIVO */}
      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex fixed md:relative inset-0 z-[100] md:z-auto w-full md:w-64 bg-black border-r border-white/5 flex-col transition-all`}>
        <div className="p-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-white font-black tracking-[0.1em] text-lg uppercase italic">AVISTO<span className="text-blue-500">.APP</span></h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white"><X /></button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavBtn active={tab==='dashboard'} onClick={()=>{setTab('dashboard'); setIsSidebarOpen(false);}} icon={<LayoutDashboard size={16}/>} label="DASHBOARD" />
          <NavBtn active={tab==='gestion'} onClick={()=>{setTab('gestion'); setIsSidebarOpen(false);}} icon={<Users size={16}/>} label="MONITOR LIVE" />
          <NavBtn active={tab==='inventario'} onClick={()=>{setTab('inventario'); setIsSidebarOpen(false);}} icon={<Printer size={16}/>} label="BODEGA QR" />
        </nav>
        <div className="p-6 bg-white/5 border-t border-white/5 text-center">
          <button onClick={handleLogout} className="w-full py-3 text-[9px] font-black text-white/20 hover:text-red-500 border border-white/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
            <LogOut size={12}/> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 bg-[#0F1115]">
        
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
            <header className="mb-12 border-l-4 border-blue-600 pl-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight">Estado de Operación</h2>
              <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em] mt-2 italic">TALAGANTE 2026</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              <CardStat label="Protegidas" val={registrados.length} icon={<CheckCircle2 className="text-blue-500"/>} />
              <CardStat label="Bodega" val={disponibles.length} icon={<Clock className="text-slate-700"/>} />
              <button onClick={generarLote} className="bg-white p-10 flex flex-col items-center justify-center gap-4 group hover:bg-blue-600 transition-all">
                <Plus className="text-black group-hover:text-white" size={32} />
                <span className="text-black group-hover:text-white text-[9px] font-black uppercase tracking-[0.3em]">Nuevos QR</span>
              </button>
            </div>
          </motion.div>
        )}

        {tab === 'gestion' && (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Monitor Live</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16}/>
                <input type="text" placeholder="FILTRAR..." className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] w-full outline-none" onChange={(e) => setFiltro(e.target.value)} />
              </div>
            </div>

            {/* TABLA (Escritorio) */}
            <div className="hidden md:block border border-white/5 bg-[#16191F]">
              <table className="w-full text-left">
                <thead className="bg-black/40 uppercase text-[9px] font-black text-slate-500 border-b border-white/5">
                  <tr><th className="px-8 py-5">UID</th><th className="px-8 py-5">Perfil</th><th className="px-8 py-5">Contacto</th><th className="px-8 py-5 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrados.filter(n => n.nombre.toLowerCase().includes(filtro.toLowerCase())).map(n => (
                    <tr key={n.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 font-mono text-blue-500">#{n.id}</td>
                      <td className="px-8 py-6 uppercase font-black text-sm text-white">{n.nombre}</td>
                      <td className="px-8 py-6 text-xs font-mono">{Array.isArray(n.contactos) ? n.contactos[0] : n.contacto}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setSelectedChild(n)} className="text-slate-600 hover:text-white"><Eye size={18}/></button>
                          <button onClick={() => setEditChild(n)} className="text-slate-600 hover:text-blue-500"><Edit3 size={18}/></button>
                          <button onClick={() => handleEliminar(n.id)} className="text-slate-800 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARDS (Móvil) */}
            <div className="md:hidden space-y-4">
              {registrados.filter(n => n.nombre.toLowerCase().includes(filtro.toLowerCase())).map(n => (
                <div key={n.id} className="bg-[#16191F] border border-white/5 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-black text-sm uppercase">{n.nombre}</p>
                      <p className="text-blue-500 font-mono text-[10px]">#{n.id}</p>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setEditChild(n)} className="text-blue-500/60"><Edit3 size={20}/></button>
                       <button onClick={() => handleEliminar(n.id)} className="text-red-500/40"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <button onClick={() => setSelectedChild(n)} className="w-full py-3 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">Ver Expediente</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'inventario' && (
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-print">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Bodega QR</h2>
              <button onClick={() => window.print()} className="w-full md:w-auto bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"><Printer size={14}/> Imprimir Etiquetas</button>
            </header>
            <div id="printable-area" className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {disponibles.map(p => (
                <div key={p.id} className="bg-white p-4 flex flex-col items-center group relative border border-slate-100 shadow-sm rounded-xl">
                  <QRCodeSVG value={p.id} size={80} className="md:w-[110px] md:h-[110px]" level="H" />
                  <p className="mt-4 text-black font-black text-[10px] tracking-[0.5em] uppercase font-mono">{p.id}</p>
                  <button onClick={() => handleEliminar(p.id)} className="absolute top-2 right-2 text-red-500 no-print md:opacity-0 group-hover:opacity-100 transition-opacity p-2"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ALERTAS GENERALES */}
      <AnimatePresence>
        {alert.show && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1A1D23] p-8 max-w-sm w-full border-t-4 border-blue-600">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase mb-4">{alert.title}</h3>
              <p className="text-slate-500 text-[10px] uppercase leading-relaxed mb-8">{alert.message}</p>
              <div className="flex gap-2">
                <button onClick={() => setAlert({...alert, show:false})} className="flex-1 py-3 text-[10px] font-black text-slate-600 uppercase">Cerrar</button>
                {alert.onConfirm && <button onClick={alert.onConfirm} className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase">Confirmar</button>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-5 md:py-4 text-[10px] font-black tracking-[0.3em] transition-all border-b border-white/5 ${active ? 'bg-white text-black shadow-lg shadow-black/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      {icon} {label}
    </button>
  );
}

function CardStat({ label, val, icon }) {
  return (
    <div className="bg-white p-8 md:p-12 flex items-center justify-between group border-r border-white/5">
      <div>
        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none">{val}</p>
      </div>
      <div className="p-3 md:p-4 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{icon}</div>
    </div>
  );
}