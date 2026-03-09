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
  const [editChild, setEditChild] = useState(null); // Para el modal de edición
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
      `¿DESEA BORRAR EL REGISTRO ${id} DE FORMA PERMANENTE?`,
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
        nombre: editChild.nombre.toUpperCase(),
        alergias: editChild.alergias.toUpperCase(),
        contacto: editChild.contacto,
        contactos: Array.isArray(editChild.contactos) ? editChild.contactos : [editChild.contacto]
      });
      setEditChild(null);
      showAlert("ÉXITO", "REGISTRO ACTUALIZADO", null, 'success');
    } catch (error) {
      showAlert("ERROR", "NO SE PUDO EDITAR", null, 'danger');
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
          <img src={LOGO_URL} className="w-8 h-8 object-contain" alt="Logo" />
          <span className="font-black text-sm tracking-tighter uppercase">Avisto.Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* --- MODAL: EDICIÓN --- */}
      <AnimatePresence>
        {editChild && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1A1D23] border border-white/10 w-full max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Editar Perfil</h3>
                <button onClick={() => setEditChild(null)} className="text-slate-500"><X size={20}/></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[8px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Nombre</label>
                  <input className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm outline-none focus:border-blue-600" value={editChild.nombre} onChange={(e)=>setEditChild({...editChild, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Contacto</label>
                  <input className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm outline-none focus:border-blue-600 font-mono" value={editChild.contacto} onChange={(e)=>setEditChild({...editChild, contacto: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-slate-500 mb-1 block tracking-widest">Información Médica</label>
                  <textarea className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm outline-none focus:border-blue-600 h-20 resize-none" value={editChild.alergias} onChange={(e)=>setEditChild({...editChild, alergias: e.target.value})} />
                </div>
              </div>
              <button onClick={handleGuardarEdicion} className="w-full mt-6 bg-blue-600 py-3 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 rounded-lg"><Save size={14}/> Guardar Registro</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: FICHA COMPLETA --- */}
      <AnimatePresence>
        {selectedChild && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#16191F] border border-white/10 w-full h-full md:h-auto md:max-w-4xl max-h-[100vh] md:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-black/20 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <img src={LOGO_URL} className="w-6 h-6 object-contain" />
                  <span>Expediente de Seguridad AVISTO</span>
                </div>
                <button onClick={() => setSelectedChild(null)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 md:border-8 border-blue-600/20 p-1 md:p-2 mb-4 md:mb-8">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-2 border-blue-600">
                      {selectedChild.fotoUrl ? <img src={selectedChild.fotoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-700"><Users size={60} /></div>}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">{selectedChild.nombre}</h2>
                  <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-1 text-blue-500 font-mono text-[10px] md:text-xs">ID: #{selectedChild.id}</div>
                </div>
                <div className="space-y-6 md:space-y-10">
                  <section>
                    <label className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase block mb-4">Información Médica</label>
                    <div className={`p-4 md:p-6 border-l-4 ${selectedChild.alergias && selectedChild.alergias !== "NINGUNA" ? 'bg-red-500/5 border-red-500' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <HeartPulse size={18} className={selectedChild.alergias && selectedChild.alergias !== "NINGUNA" ? 'text-red-500' : 'text-slate-500'} />
                        <span className="text-[10px] font-black text-white uppercase">Alertas Críticas</span>
                      </div>
                      <p className="text-sm font-bold text-slate-300 uppercase leading-relaxed">{selectedChild.alergias || "SIN OBSERVACIONES"}</p>
                    </div>
                  </section>
                  <section>
                    <label className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase block mb-4">Frecuencias de Contacto</label>
                    <div className="space-y-3">
                      {(Array.isArray(selectedChild.contactos) ? selectedChild.contactos : [selectedChild.contacto]).map((tel, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
                           <div className="flex items-center gap-4">
                             <div className="p-2 bg-blue-600/20 text-blue-500"><Phone size={14}/></div>
                             <span className="text-sm font-mono font-bold text-white">{tel}</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
              <div className="p-6 bg-black/40 border-t border-white/5 text-right"><button onClick={() => setSelectedChild(null)} className="w-full md:w-auto px-10 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Finalizar Vista</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR RESPONSIVO */}
      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex fixed md:relative inset-0 z-[100] md:z-auto w-full md:w-64 bg-black border-r border-white/5 flex-col shrink-0 transition-all`}>
        <div className="p-8 mb-4 flex items-center justify-between md:justify-start gap-4">
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
        <div className="p-6 bg-white/5 mt-auto border-t border-white/5 text-center">
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
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mt-4 italic">AVISTO SECURE NODE // 2026</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
              <CardStat label="Unidades Protegidas" val={registrados.length} icon={<CheckCircle2 className="text-blue-500"/>} />
              <CardStat label="QR en Bodega" val={disponibles.length} icon={<Clock className="text-slate-700"/>} />
              <button onClick={generarLote} className="bg-white p-10 flex flex-col items-center justify-center gap-4 group hover:bg-blue-600 transition-all">
                <Plus className="text-black group-hover:text-white" size={32} />
                <span className="text-black group-hover:text-white text-[10px] font-black tracking-[0.3em] uppercase">Generar Lote</span>
              </button>
            </div>
          </motion.div>
        )}

        {tab === 'gestion' && (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest text-sm">Monitor de Seguridad</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sincronización en tiempo real</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16}/>
                <input type="text" placeholder="FILTRAR..." className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 text-white text-xs tracking-widest uppercase focus:border-blue-600 outline-none w-full transition-all" onChange={(e) => setFiltro(e.target.value)} />
              </div>
            </div>

            {/* TABLA ESCRITORIO */}
            <div className="hidden md:block border border-white/5 bg-[#16191F]">
              <table className="w-full text-left">
                <thead className="bg-black/40 border-b border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">UID</th>
                    <th className="px-8 py-5">Perfil del Menor</th>
                    <th className="px-8 py-5">Contacto</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrados.filter(n => n.nombre.toLowerCase().includes(filtro.toLowerCase())).map(n => (
                    <tr key={n.id} className="hover:bg-white/[0.02] transition-colors group text-sm font-bold uppercase">
                      <td className="px-8 py-6 font-mono text-blue-500 text-xs">#{n.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-slate-800 shrink-0">
                            {n.fotoUrl ? <img src={n.fotoUrl} className="w-full h-full object-cover" /> : <Users size={16} className="m-3 text-slate-600" />}
                          </div>
                          <span>{n.nombre}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-mono">{Array.isArray(n.contactos) ? n.contactos[0] : n.contacto}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-4">
                          <button onClick={() => setSelectedChild(n)} className="text-slate-600 hover:text-blue-500"><Eye size={18}/></button>
                          <button onClick={() => setEditChild(n)} className="text-slate-600 hover:text-green-500"><Edit3 size={18}/></button>
                          <button onClick={() => handleEliminar(n.id)} className="text-slate-800 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LISTA MÓVIL (Restaura la foto que habías pedido) */}
            <div className="md:hidden space-y-4">
              {registrados.filter(n => n.nombre.toLowerCase().includes(filtro.toLowerCase())).map(n => (
                <div key={n.id} className="bg-[#16191F] border border-white/5 p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-white/10">
                        {n.fotoUrl ? <img src={n.fotoUrl} className="w-full h-full object-cover" /> : <Users size={20} className="m-3 text-slate-600" />}
                      </div>
                      <div>
                        <p className="text-white font-black text-sm uppercase">{n.nombre}</p>
                        <p className="text-blue-500 font-mono text-[10px]">#{n.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setEditChild(n)} className="text-slate-400"><Edit3 size={18}/></button>
                       <button onClick={() => handleEliminar(n.id)} className="text-red-500/40"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <button onClick={() => setSelectedChild(n)} className="w-full py-3 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-lg">Ver Expediente SOS</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'inventario' && (
          <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-print">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Bodega QR</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Impresión para pulseras físicas</p>
              </div>
              <button onClick={() => window.print()} className="w-full md:w-auto bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white flex items-center justify-center gap-3 transition-all rounded-lg"><Printer size={14}/> Imprimir Etiquetas</button>
            </header>
            <div id="printable-area" className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-6">
              {disponibles.map(p => (
                <div key={p.id} className="bg-white p-4 md:p-8 flex flex-col items-center group relative border border-slate-100 shadow-sm rounded-xl">
                  <QRCodeSVG value={p.id} size={80} className="md:w-[110px] md:h-[110px]" level="H" />
                  <p className="mt-4 text-black font-black text-[10px] md:text-[12px] tracking-[0.5em] uppercase font-mono">{p.id}</p>
                  {/* MEJORA: ELIMINAR QR DISPONIBLE */}
                  <button onClick={() => handleEliminar(p.id)} className="absolute top-2 right-2 text-red-500 no-print md:opacity-0 group-hover:opacity-100 transition-opacity p-2"><Trash2 size={16}/></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1A1D23] p-8 max-w-sm w-full border-t-4 border-blue-600 rounded-2xl">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase mb-4">{alert.title}</h3>
              <p className="text-slate-500 text-[10px] uppercase leading-relaxed mb-8">{alert.message}</p>
              <div className="flex gap-2">
                <button onClick={() => setAlert({...alert, show:false})} className="flex-1 py-3 text-[10px] font-black text-slate-600 uppercase">Cerrar</button>
                {alert.onConfirm && <button onClick={alert.onConfirm} className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase rounded-lg">Confirmar</button>}
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