import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { 
  Phone, HeartPulse, Activity, 
  ShieldAlert, Building2, AlertTriangle, ArrowLeft
} from 'lucide-react';

export default function PublicScan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nino, setNino] = useState(null);
  const [loading, setLoading] = useState(true);

  const LOGO_URL = "https://i.postimg.cc/kg7yX89x/unnamed.png";
  const NUMERO_CARABINEROS = "229223340";

  useEffect(() => {
    const fetchNino = async () => {
      try {
        const docRef = doc(db, "niños", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNino(docSnap.data());
        }
      } catch (error) {
        console.error("Error Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNino();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <Activity className="animate-spin text-[#007AFF]" size={48} />
    </div>
  );

  if (!nino || !nino.nombre) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <AlertTriangle size={80} className="text-red-500 mb-6" />
      <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Código no activo</h1>
      <p className="text-slate-500 mt-4 max-w-xs font-medium">Este brazalete no tiene un perfil asignado en el sistema AVISTO.</p>
      <button onClick={() => navigate('/')} className="mt-10 px-8 py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-xl">Volver al Inicio</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10">
      {/* HEADER DE ESTADO CRÍTICO */}
      <div className="bg-red-600 p-4 text-white flex items-center justify-center gap-3 shadow-lg">
        <ShieldAlert size={20} className="animate-pulse" />
        <span className="font-black uppercase text-[10px] tracking-[0.3em]">Protocolo SOS Talagante</span>
      </div>

      <div className="max-w-md mx-auto mt-6 px-4">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white">
          
          {/* PERFIL */}
          <div className="p-8 flex flex-col items-center border-b border-slate-50">
            <div className="w-44 h-44 rounded-full border-8 border-slate-50 shadow-xl overflow-hidden mb-6">
              <img 
                src={nino.fotoUrl || LOGO_URL} 
                className="w-full h-full object-cover"
                alt="Perfil"
              />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter text-center leading-none">
              {nino.nombre}
            </h1>
            <div className="mt-3 bg-blue-50 text-[#007AFF] px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-100">
              ID SEGURO: {id}
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* ALERTA MÉDICA */}
            <div className="bg-red-50 p-6 rounded-[2rem] border-l-8 border-red-500 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <HeartPulse size={24} className="text-red-600" />
                <span className="font-black uppercase text-xs text-red-600 tracking-widest">Información Vital</span>
              </div>
              <p className="text-xl font-bold text-red-900 uppercase leading-tight">
                {nino.alergias || "SIN OBSERVACIONES MÉDICAS"}
              </p>
            </div>

            {/* CONTACTOS DE EMERGENCIA */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Llamada Directa a Padres</h3>
              {(Array.isArray(nino.contactos) ? nino.contactos : [nino.contacto]).map((tel, index) => (
                <a 
                  key={index}
                  href={`tel:${tel}`}
                  className="flex items-center justify-between bg-[#0F172A] text-white p-6 rounded-[2rem] hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-[#007AFF] p-2 rounded-xl"><Phone size={24} color="white" /></div>
                    <span className="text-2xl font-black font-mono tracking-tighter">{tel}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase bg-white/10 px-3 py-1 rounded-lg">Llamar</span>
                </a>
              ))}

              <a 
                href={`tel:${NUMERO_CARABINEROS}`}
                className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 p-5 rounded-[2rem] text-slate-600 font-black uppercase text-[10px] tracking-widest active:bg-slate-50 transition-all"
              >
                <Building2 size={18} />
                23ª Comisaría Talagante
              </a>
            </div>
          </div>

          <div className="p-8 pt-0 text-center">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">AVISTO SECURE CORE v2.4</p>
          </div>
        </div>
      </div>
    </div>
  );
}