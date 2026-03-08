import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  LayoutDashboard, Printer, Users, LogOut, X, 
  Trash2, Plus, Search, CheckCircle2, Clock, 
  AlertTriangle, Shield, Check, Phone, Eye, 
  HeartPulse, MapPin, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';

export default function AdminDashboard({ user, ninos, onBack }) {
  const [tab, setTab] = useState('dashboard');
  const [filtro, setFiltro] = useState('');
  const [selectedChild, setSelectedChild] = useState(null); // Para el Modal de la Ficha
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
      `¿DESEA BORRAR EL REGISTRO ${id}? ESTA ACCIÓN ES IRREVERSIBLE.`,
      async () => {
        await deleteDoc(doc(db, "niños", id));
        setAlert({ ...alert, show: false });
      },
      'danger'
    );
  };

  const generarLote = async () => {
    for (let i = 0; i < 8; i++) {
      const id = Math.random().toString(36).substring(2, 8).toUpperCase();
      await setDoc(doc(db, "niños", id), { 
        estado: "DISPONIBLE", nombre: "", contacto: "", alergias: "",
        fechaCreacion: new Date().toISOString()
      });
    }
    showAlert("NÚCLEO ACTUALIZADO", "8 CÓDIGOS INYECTADOS CON ÉXITO.", null, 'success');
  };

  return (
    <div className="flex h-screen bg-[#0F1115] text-slate-300 font-sans overflow-hidden">
      
      {/* --- MODAL: FICHA COMPLETA AVISTO --- */}
      <AnimatePresence>
        {selectedChild && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#16191F] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-blue-500/10"
            >
              {/* Header Modal con Logo */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-3">
                  <img src={LOGO_URL} className="w-8 h-8 object-contain" alt="Logo" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase">Expediente de Seguridad AVISTO</span>
                </div>
                <button onClick={() => setSelectedChild(null)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Columna Izquierda: Foto y Nombre */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-64 h-64 rounded-full border-8 border-blue-600/20 p-2 mb-8 shadow-2xl shadow-blue-500/20">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-2 border-blue-600">
                      {selectedChild.fotoUrl ? (
                        <img src={selectedChild.fotoUrl} className="w-full h-full object-cover" alt="Perfil" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700"><Users size={80} /></div>
                      )}
                    </div>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{selectedChild.nombre}</h2>
                  <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-1 inline-block">
                    <span className="text-blue-500 font-mono text-xs font-bold tracking-widest">ID: #{selectedChild.id}</span>
                  </div>
                </div>

                {/* Columna Derecha: Datos */}
                <div className="space-y-10">
                  <section>
                    <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase block mb-4">Información Médica</label>
                    <div className={`p-6 border-l-4 ${selectedChild.alergias && selectedChild.alergias !== "NINGUNA" ? 'bg-red-500/5 border-red-500' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <HeartPulse size={18} className={selectedChild.alergias && selectedChild.alergias !== "NINGUNA" ? 'text-red-500' : 'text-slate-500'} />
                        <span className="text-[10px] font-black text-white uppercase">Alertas Críticas</span>
                      </div>
                      <p className="text-sm font-bold text-slate-300 uppercase leading-relaxed">
                        {selectedChild.alergias || "SIN OBSERVACIONES REPORTADAS"}
                      </p>
                    </div>
                  </section>

                  <section>
                    <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase block mb-4">Frecuencias de Contacto</label>
                    <div className="space-y-3">
                      {(Array.isArray(selectedChild.contactos) ? selectedChild.contactos : [selectedChild.contacto]).map((tel, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
                           <div className="flex items-center gap-4">
                             <div className="p-2 bg-blue-600/20 text-blue-500"><Phone size={14}/></div>
                             <span className="text-sm font-mono font-bold text-white">{tel}</span>
                           </div>
                           <span className="text-[8px] font-black text-slate-600 uppercase">Apoderado {i+1}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="pt-8 border-t border-white/5 flex gap-8">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-700" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nodo: Talagante Central</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-700" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Alta: {selectedChild.fechaCreacion?.split('T')[0] || '2026'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="p-8 bg-black/40 border-t border-white/5 text-right">
                <button 
                  onClick={() => setSelectedChild(null)}
                  className="px-10 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                >
                  Finalizar Vista
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ALERTAS GENERALES */}
      <AnimatePresence>
        {alert.show && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1A1D23] border-t-2 border-blue-600 p-8 max-w-sm w-full">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 ${alert.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {alert.type === 'danger' ? <AlertTriangle size={24} /> : <Check size={24} />}
                </div>
                <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase">{alert.title}</h3>
              </div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest leading-relaxed mb-8">{alert.message}</p>
              <div className="flex gap-2">
                <button onClick={() => setAlert({...alert, show:false})} className="flex-1 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">Cerrar</button>
                {alert.onConfirm && <button onClick={alert.onConfirm} className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Confirmar</button>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR AVISTO */}
      <aside className="w-64 bg-black border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8 mb-4 flex items-center gap-4">
          <img src={LOGO_URL} alt="AVISTO Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-white font-black tracking-[0.1em] text-lg uppercase italic">AVISTO<span className="text-blue-500">.APP</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavBtn active={tab==='dashboard'} onClick={()=>setTab('dashboard')} icon={<LayoutDashboard size={16}/>} label="DASHBOARD" />
          <NavBtn active={tab==='gestion'} onClick={()=>setTab('gestion')} icon={<Users size={16}/>} label="MONITOR LIVE" />
          <NavBtn active={tab==='inventario'} onClick={()=>setTab('inventario')} icon={<Printer size={16}/>} label="BODEGA QR" />
        </nav>
        <div className="p-6 bg-white/5 mt-auto border-t border-white/5 text-center">
          <img src={user?.photoURL} className="w-12 h-12 border-2 border-blue-600/30 p-0.5 rounded-full mx-auto mb-3 grayscale" alt="Admin" />
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">{user?.displayName}</p>
          <button onClick={handleLogout} className="mt-6 w-full py-3 text-[9px] font-black text-white/20 hover:text-red-500 border border-white/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
            <LogOut size={12}/> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-12 bg-[#0F1115]">
        
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
            <header className="mb-12 border-l-4 border-blue-600 pl-8">
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-tight">Estado de <br /> Operación</h2>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mt-4 italic">AVISTO SECURE NODE // TALAGANTE 2026</p>
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
          <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Monitor de Seguridad</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sincronización en tiempo real con sistema AVISTO</p>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16}/>
                <input 
                  type="text" placeholder="FILTRAR POR NOMBRE O ID..." 
                  className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 text-white text-xs tracking-widest uppercase focus:border-blue-600 outline-none w-80 transition-all"
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>

            <div className="border border-white/5 overflow-hidden bg-[#16191F] shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-black/40 border-b border-white/10">
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">UID</th>
                    <th className="px-8 py-5">Perfil del Menor</th>
                    <th className="px-8 py-5">Contacto Apoderado</th>
                    <th className="px-8 py-5">Info Médica</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrados
                    .filter(n => n.nombre.toLowerCase().includes(filtro.toLowerCase()) || n.id.toLowerCase().includes(filtro.toLowerCase()))
                    .map(n => (
                    <tr key={n.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-mono text-blue-500 text-[11px] bg-blue-500/5 px-2 py-1 border border-blue-500/10">#{n.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden bg-slate-800 shrink-0">
                            {n.fotoUrl ? <img src={n.fotoUrl} alt={n.nombre} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><Users size={20} /></div>}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{n.nombre}</p>
                            <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest italic">Protegido</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          {(Array.isArray(n.contactos) ? n.contactos : [n.contacto]).map((c, i) => (
                            <p key={i} className="text-slate-400 text-[11px] font-mono flex items-center gap-2">
                              <Phone size={10} className="text-slate-700"/> {c}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`p-3 rounded border text-[10px] font-bold uppercase ${n.alergias && n.alergias !== "NINGUNA" ? 'bg-red-500/5 border-red-500/20 text-red-500' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                          {n.alergias || "SIN OBSERVACIONES"}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setSelectedChild(n)} className="text-slate-600 hover:text-blue-500 transition-colors">
                            <Eye size={20}/>
                          </button>
                          <button onClick={() => handleEliminar(n.id)} className="text-slate-800 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'inventario' && (
          <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-8 no-print">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Bodega de Códigos</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Impresión masiva para pulseras físicas</p>
              </div>
              <button onClick={() => window.print()} className="bg-white text-black px-10 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white flex items-center gap-3 transition-all"><Printer size={14}/> Imprimir Etiquetas</button>
            </header>
            <div id="printable-area" className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {disponibles.map(p => (
                <div key={p.id} className="bg-white p-8 flex flex-col items-center group relative border border-slate-100 hover:border-blue-600 transition-all shadow-sm">
                  <QRCodeSVG value={p.id} size={110} level="H" />
                  <p className="mt-4 text-black font-black text-[12px] tracking-[0.5em] uppercase">{p.id}</p>
                  <button onClick={() => handleEliminar(p.id)} className="absolute top-2 right-2 text-red-500 no-print opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                  <p className="hidden print:block text-[8px] font-black text-slate-300 mt-3 tracking-widest uppercase">AVISTO PROTECTED</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black tracking-[0.3em] transition-all border-b border-white/5 ${active ? 'bg-white text-black shadow-lg shadow-black/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      {icon} {label}
    </button>
  );
}

function CardStat({ label, val, icon }) {
  return (
    <div className="bg-white p-12 flex items-center justify-between group">
      <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p><p className="text-7xl font-black text-black tracking-tighter leading-none">{val}</p></div>
      <div className="p-4 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{icon}</div>
    </div>
  );
}