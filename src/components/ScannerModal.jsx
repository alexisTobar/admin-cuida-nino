import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ajusta la ruta a tu config
import { X, Phone, HeartPulse, ShieldCheck, Activity } from 'lucide-react';

export default function ScannerModal({ isOpen, onClose }) {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const LOGO_URL = "https://i.postimg.cc/kg7yX89x/unnamed.png";

  useEffect(() => {
    let scanner = null;
    if (isOpen && !scannedData) {
      // Retraso mínimo para asegurar que el div 'reader' existe en el DOM
      setTimeout(() => {
        scanner = new Html5QrcodeScanner("reader", { 
          fps: 10, 
          qrbox: { width: 250, height: 250 } 
        });

        scanner.render(async (data) => {
          scanner.clear();
          setLoading(true);
          try {
            const docRef = doc(db, "niños", data);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setScannedData({ ...docSnap.data(), id: data });
            } else {
              alert("ERROR: Código no registrado en AVISTO");
              onClose();
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        });
      }, 100);
    }
    return () => { if (scanner) scanner.clear(); };
  }, [isOpen, scannedData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/95 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <Activity className="text-[#007AFF] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Escáner de Identificación</span>
          </div>
          <button onClick={() => { setScannedData(null); onClose(); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20}/>
          </button>
        </div>

        <div className="p-8">
          {!scannedData ? (
            <div className="space-y-6">
              <div id="reader" className="overflow-hidden rounded-2xl border-2 border-[#007AFF]/20 shadow-inner"></div>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apunte al código QR de la pulsera</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-[#007AFF] p-1 mb-4 shadow-xl">
                  <img src={scannedData.fotoUrl || LOGO_URL} className="w-full h-full object-cover rounded-full bg-slate-100" alt="Perfil" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#0F172A]">{scannedData.nombre}</h3>
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2">UID: #{scannedData.id}</span>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-5 rounded-2xl border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2 text-red-600">
                    <HeartPulse size={18}/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Información Crítica</span>
                  </div>
                  <p className="text-lg font-bold text-red-900 leading-tight">{scannedData.alergias || "SIN OBSERVACIONES"}</p>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border-l-4 border-[#00D2FF]">
                  <div className="flex items-center gap-2 mb-4 text-[#00D2FF]">
                    <Phone size={18}/>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Contactos de Emergencia</span>
                  </div>
                  <div className="space-y-3">
                    {(Array.isArray(scannedData.contactos) ? scannedData.contactos : [scannedData.contacto]).map((tel, i) => (
                      <a key={i} href={`tel:${tel}`} className="flex justify-between items-center bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-all group">
                        <span className="text-white font-mono font-bold text-lg">{tel}</span>
                        <span className="bg-[#007AFF] text-white p-2 rounded-md group-hover:scale-110 transition-transform"><Phone size={14}/></span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setScannedData(null)}
                className="mt-8 w-full py-4 bg-[#0F172A] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#007AFF] transition-all rounded-xl"
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