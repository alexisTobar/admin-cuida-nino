import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { 
  X, Phone, HeartPulse, Activity, Camera, 
  MapPin, MessageCircle, ShieldAlert, Building2 
} from 'lucide-react';

export default function ScannerModal({ isOpen, onClose }) {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const LOGO_URL = "https://i.postimg.cc/kg7yX89x/unnamed.png";
  const NUMERO_CARABINEROS = "229223340"; 

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(pos.coords),
        (err) => console.log("Error GPS:", err),
        { enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  // --- LÓGICA PARA EXTRAER EL ID DEL LINK ---
  const handleScan = async (err, result) => {
    if (result && !scannedData && !loading) {
      setLoading(true);
      try {
        let rawData = result.text;
        let cleanId = rawData;

        // Si el QR contiene un link, extraemos solo el ID del final
        if (rawData.includes('/')) {
          const parts = rawData.split('/');
          cleanId = parts[parts.length - 1];
        }

        const docRef = doc(db, "niños", cleanId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setScannedData({ ...docSnap.data(), id: cleanId });
        } else {
          setError(`ID ${cleanId} no registrado`);
          setTimeout(() => setError(null), 3000);
        }
      } catch (e) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }
  };

  const enviarAlertaPadres = () => {
    const tel = Array.isArray(scannedData.contactos) ? scannedData.contactos[0] : scannedData.contacto;
    const mapsUrl = location 
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : "Ubicación no disponible";

    const msg = `🚨 *ALERTA AVISTO* 🚨\n\nHola, hemos identificado a *${scannedData.nombre}* en nuestro punto de control.\n\n📍 *Ubicación del hallazgo:* ${mapsUrl}\n\nPor favor, acérquese al personal de seguridad más cercano.`;
    
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/98 backdrop-blur-lg p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative my-8">
        
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-[#007AFF]" size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Protocolo de Hallazgo</span>
          </div>
          <button 
            onClick={() => { setScannedData(null); setError(null); onClose(); }} 
            className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!scannedData ? (
            <div className="space-y-4 text-center">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-black border-4 border-[#007AFF]/20 shadow-2xl">
                <BarcodeScannerComponent
                  width="100%"
                  height="100%"
                  onUpdate={handleScan}
                  facingMode="environment"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-white/50 rounded-3xl border-dashed animate-pulse" />
                </div>
                {loading && (
                  <div className="absolute inset-0 bg-[#0F172A]/70 flex items-center justify-center">
                    <Activity className="text-white animate-spin" size={40} />
                  </div>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                Escaneando entorno seguro...
              </p>
              {error && <div className="text-red-600 font-bold text-xs uppercase">{error}</div>}
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300 space-y-6">
              
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-[#007AFF] p-1 shadow-xl overflow-hidden">
                  <img src={scannedData.fotoUrl || LOGO_URL} className="w-full h-full object-cover rounded-full bg-slate-100" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#0F172A] mt-4">{scannedData.nombre}</h3>
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 tracking-widest">UID: #{scannedData.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={enviarAlertaPadres}
                  className="bg-[#25D366] flex flex-col items-center justify-center py-4 rounded-3xl shadow-lg active:scale-95 transition-all group"
                >
                  <MessageCircle color="white" size={28} className="mb-2" />
                  <span className="text-white text-[8px] font-black uppercase tracking-widest text-center">Enviar GPS<br/>Padres</span>
                </button>

                <a 
                  href={`tel:${NUMERO_CARABINEROS}`}
                  className="bg-[#0F172A] flex flex-col items-center justify-center py-4 rounded-3xl shadow-lg active:scale-95 transition-all"
                >
                  <Building2 color="white" size={28} className="mb-2" />
                  <span className="text-white text-[8px] font-black uppercase tracking-widest text-center">Carabineros<br/>Talagante</span>
                </a>
              </div>

              <div className="bg-red-50 p-5 rounded-3xl border-l-8 border-red-500">
                <div className="flex items-center gap-2 mb-2 text-red-600">
                  <HeartPulse size={20}/>
                  <span className="text-xs font-black uppercase tracking-widest">Alerta Médica</span>
                </div>
                <p className="text-lg font-bold text-red-900 leading-tight">
                  {scannedData.alergias || "SIN OBSERVACIONES MÉDICAS"}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Llamada de Emergencia</p>
                {(Array.isArray(scannedData.contactos) ? scannedData.contactos : [scannedData.contacto]).map((tel, i) => (
                  <a key={i} href={`tel:${tel}`} className="flex justify-between items-center bg-slate-900 p-5 rounded-2xl hover:bg-slate-800 transition-colors shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-2 rounded-lg"><Phone size={18} className="text-[#00D2FF]" /></div>
                      <span className="text-white font-mono font-black text-xl tracking-tighter">{tel}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-500" />
                  </a>
                ))}
              </div>

              <button 
                onClick={() => setScannedData(null)}
                className="w-full py-4 border-2 border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-50 transition-colors"
              >
                Volver al Escáner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}