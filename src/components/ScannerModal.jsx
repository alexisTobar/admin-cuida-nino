import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { X, Phone, HeartPulse, Activity, Camera } from 'lucide-react';

export default function ScannerModal({ isOpen, onClose }) {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const LOGO_URL = "https://i.postimg.cc/kg7yX89x/unnamed.png";

  const handleScan = async (err, result) => {
    if (result && !scannedData && !loading) {
      setLoading(true);
      try {
        const data = result.text;
        const docRef = doc(db, "niños", data);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setScannedData({ ...docSnap.data(), id: data });
        } else {
          setError("Código no registrado en AVISTO");
          setTimeout(() => setError(null), 3000);
        }
      } catch (e) {
        setError("Error de conexión con la base de datos");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/98 backdrop-blur-lg p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <Activity className="text-[#007AFF] animate-pulse" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Escáner de Identificación</span>
          </div>
          <button 
            onClick={() => { setScannedData(null); setError(null); onClose(); }} 
            className="p-2 bg-slate-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!scannedData ? (
            <div className="space-y-4">
              {/* VISTA DE CÁMARA OPTIMIZADA */}
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-black border-4 border-[#007AFF]/20 shadow-2xl">
                <BarcodeScannerComponent
                  width="100%"
                  height="100%"
                  onUpdate={handleScan}
                  facingMode="environment" // FUERZA CÁMARA TRASERA
                />
                
                {/* MIRA DEL ESCÁNER */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white/50 rounded-3xl border-dashed animate-pulse flex items-center justify-center">
                    <div className="w-full h-1 bg-[#007AFF]/50 absolute shadow-[0_0_15px_#007AFF]"></div>
                  </div>
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-[#0F172A]/70 flex items-center justify-center">
                    <Activity className="text-white animate-spin" size={40} />
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-500 text-white text-[10px] font-black py-3 px-4 rounded-xl text-center uppercase tracking-widest">
                  {error}
                </div>
              )}

              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-2 flex items-center justify-center gap-2">
                <Camera size={14} /> Apunte al código QR
              </p>
            </div>
          ) : (
            /* FICHA DE RESULTADO (Igual a la que te gustaba) */
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center mb-6">
                <div className="w-28 h-28 rounded-full border-4 border-[#007AFF] p-1 mb-4">
                  <img src={scannedData.fotoUrl || LOGO_URL} className="w-full h-full object-cover rounded-full bg-slate-100" alt="Perfil" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0F172A]">{scannedData.nombre}</h3>
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2">ID: #{scannedData.id}</span>
              </div>

              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-2xl border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-1 text-red-600">
                    <HeartPulse size={16}/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Alerta Médica</span>
                  </div>
                  <p className="text-base font-bold text-red-900 leading-tight">{scannedData.alergias || "SIN OBSERVACIONES"}</p>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border-l-4 border-[#00D2FF]">
                  <div className="flex items-center gap-2 mb-3 text-[#00D2FF]">
                    <Phone size={16}/>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Contactos Emergencia</span>
                  </div>
                  { (Array.isArray(scannedData.contactos) ? scannedData.contactos : [scannedData.contacto]).map((tel, i) => (
                    <a key={i} href={`tel:${tel}`} className="flex justify-between items-center bg-white/5 p-3 rounded-lg mb-2">
                      <span className="text-white font-mono font-bold">{tel}</span>
                      <Phone size={14} className="text-[#007AFF]"/>
                    </a>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setScannedData(null)}
                className="mt-6 w-full py-4 bg-[#0F172A] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl"
              >
                Nuevo Escaneo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}