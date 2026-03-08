import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Users, MapPin, 
  Lock, BarChart3, Mail, QrCode, Menu, X, LogIn, ShieldCheck
} from 'lucide-react';
import ScannerModal from './ScannerModal';

export default function Landing({ onEnterAdmin, user, isAuthorizing }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const LOGO_URL = "https://i.postimg.cc/kg7yX89x/unnamed.png";

  const images = [
    "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=1470&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1438&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 relative">
      
      {/* COMPONENTE DEL ESCÁNER */}
      <ScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* --- BOTÓN FLOTANTE MÓVIL (Fijo en la parte inferior central) --- */}
      <div className="md:hidden fixed bottom-8 left-0 right-0 flex justify-center z-[60] px-6">
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="bg-[#007AFF] text-white flex items-center gap-3 px-10 py-5 rounded-full shadow-[0_20px_50px_rgba(0,122,255,0.4)] active:scale-95 transition-transform border-2 border-white/20"
        >
          <QrCode size={26} className="animate-pulse" />
          <span className="font-black uppercase tracking-[0.2em] text-sm">Escanear</span>
        </button>
      </div>

      {/* 1. NAVBAR: LOGO GIGANTE + MENÚ */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100 h-24 md:h-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex justify-between items-center">
          
          <div className="flex items-center gap-4 md:gap-6">
            <img src={LOGO_URL} alt="Logo AVISTO" className="w-16 h-16 md:w-24 md:h-24 object-contain shadow-sm rounded-xl" />
            <div className="flex flex-col justify-center border-l-2 border-slate-100 pl-4">
              <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none text-[#0F172A]">AVISTO</span>
              <span className="text-[10px] md:text-[12px] font-bold text-[#007AFF] uppercase tracking-[0.3em] mt-1">Seguridad</span>
            </div>
          </div>

          <button 
            className="md:hidden p-3 text-slate-900 bg-slate-50 rounded-2xl transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setIsScannerOpen(true)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#007AFF] hover:scale-110 transition-transform">
              <QrCode size={20} /> Escanear
            </button>
            <a href="#propuesta" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#007AFF]">Sistema</a>
            <button 
              onClick={onEnterAdmin}
              disabled={isAuthorizing}
              className="bg-[#0F172A] text-white px-8 py-4 text-[11px] font-black tracking-widest hover:bg-[#007AFF] transition-all uppercase flex items-center gap-2 rounded-xl shadow-lg"
            >
              {isAuthorizing ? '...' : user ? 'Panel Admin' : 'Acceso Admin'} <LogIn size={16} />
            </button>
          </div>
        </div>

        {/* MENÚ MÓVIL */}
        {isMenuOpen && (
          <div className="absolute top-24 left-0 w-full bg-white border-b border-slate-200 flex flex-col p-8 gap-6 md:hidden shadow-2xl animate-in slide-in-from-top duration-300 z-50">
            <button onClick={() => { onEnterAdmin(); setIsMenuOpen(false); }} className="flex items-center justify-center gap-3 w-full py-5 border-2 border-[#0F172A] text-[#0F172A] font-black uppercase text-sm tracking-widest rounded-2xl">
              <LogIn size={24} /> {user ? 'Ver Panel' : 'Ingreso Admin'}
            </button>
            <div className="flex justify-around pt-4 border-t border-slate-100 uppercase text-[11px] font-black text-slate-400">
               <a href="#propuesta" onClick={() => setIsMenuOpen(false)}>Propuesta</a>
               <a href="#beneficios" onClick={() => setIsMenuOpen(false)}>Beneficios</a>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-24">
        <div className="relative h-[90vh] md:h-[850px] w-full overflow-hidden bg-[#0F172A]">
          {images.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}>
              <img src={img} className="w-full h-full object-cover" alt="Banner" />
            </div>
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6">
            <img src={LOGO_URL} alt="Logo" className="w-32 h-32 md:w-48 md:h-48 mb-8 animate-pulse shadow-2xl rounded-3xl" />
            <span className="bg-[#FF8C00] text-white px-5 py-1.5 text-[10px] font-black tracking-[0.3em] uppercase mb-6 rounded-full">Operación 2026</span>
            <h1 className="text-5xl md:text-9xl font-black text-white mb-6 md:mb-8 leading-[1] md:leading-[0.85] tracking-tighter uppercase">
              AVISTO<br /><span className="text-[#00D2FF] italic text-3xl md:text-7xl">Protocolo SOS.</span>
            </h1>
            <p className="text-slate-200 max-w-2xl text-base md:text-xl mb-12 md:mb-16 font-medium leading-relaxed px-4">
              Identificación inmediata y geolocalización satelital para la seguridad infantil en eventos masivos.
            </p>
            <div className="hidden sm:flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsScannerOpen(true)} className="bg-[#007AFF] text-white px-10 py-5 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-[#FF8C00] rounded-xl shadow-xl">
                <QrCode size={22} /> Iniciar Escaneo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROPUESTA TÉCNICA */}
      <section className="py-24 md:py-32 bg-slate-50" id="propuesta">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 lg:order-1 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] mb-8 uppercase tracking-tighter leading-none">Tecnología que salva momentos.</h2>
              <p className="text-slate-600 text-lg md:text-xl mb-10 leading-relaxed italic">El personal escanea la pulsera QR y envía automáticamente la ubicación GPS a los padres mediante WhatsApp.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border-l-4 border-[#FF8C00] pl-6 py-4 bg-white shadow-sm rounded-xl">
                  <h4 className="font-black text-xs uppercase tracking-widest mb-1 text-[#0F172A]">Hallazgo Live</h4>
                  <p className="text-slate-500 text-xs uppercase font-bold text-left">Sincronización total.</p>
                </div>
                <div className="border-l-4 border-[#00D2FF] pl-6 py-4 bg-white shadow-sm rounded-xl">
                  <h4 className="font-black text-xs uppercase tracking-widest mb-1 text-[#0F172A]">Seguridad Pro</h4>
                  <p className="text-slate-500 text-xs uppercase font-bold text-left">Nodo Talagante 2026.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-square bg-[#0F172A] shadow-2xl relative overflow-hidden rounded-[3rem] border-8 border-white">
                <img src="https://i.postimg.cc/Pqf5NVp9/balance-por-fiestas-patrias-solo-tres-detenidos-en-el-marco-de-las-celebraciones-en-talagante-e-isla.jpg" className="w-full h-full object-cover opacity-80" alt="Seguridad" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENEFICIOS (Recuperado) */}
      <section className="py-24 md:py-32 bg-white" id="beneficios">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16 md:mb-20">
          <span className="text-[#007AFF] font-black tracking-[0.3em] text-[10px] uppercase">Ventajas Operativas</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 text-[#0F172A]">Ecosistema Eficiente</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <BenefitCard icon={<Users size={36} />} title="Gestión Staff" desc="Monitoreo centralizado de cada escaneo realizado en terreno." />
          <BenefitCard icon={<BarChart3 size={36} />} title="Métricas" desc="Reportes en vivo sobre menores identificados y alertas resueltas." />
          <BenefitCard icon={<Lock size={36} />} title="Privacidad" desc="Datos encriptados bajo protocolos de seguridad internacional." />
        </div>
      </section>

      {/* 5. FOOTER COMPLETO */}
      <footer className="bg-[#0F172A] text-white py-24 pb-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 text-center md:text-left">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-5 mb-8">
              <img src={LOGO_URL} alt="Logo" className="w-16 h-16 object-contain" />
              <span className="text-3xl font-black italic uppercase tracking-tighter">AVISTO</span>
            </div>
            <p className="max-w-sm text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-loose">Ecosistema desarrollado para la gestión de seguridad civil. Talagante, Chile 2026.</p>
          </div>
          
          <div>
            <h4 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-[#007AFF]">Sistema</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <li>Términos de Operación</li>
              <li>Privacidad de Datos</li>
              <li>Manual de Staff</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-[#FF8C00]">Contacto</h4>
            <ul className="space-y-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <li className="flex items-center justify-center md:justify-start gap-2 font-mono"><Mail size={12}/> tobaralexis.89@gmail.com</li>
              <li className="flex items-center justify-center md:justify-start gap-2"><MapPin size={12}/> Talagante, RM</li>
              <li className="pt-4 text-slate-600 font-mono italic">© 2026 AVISTO v2.4</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-50 p-10 md:p-14 border border-slate-100 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 rounded-[3rem] flex flex-col items-center text-center group">
      <div className="mb-6 text-[#007AFF] group-hover:scale-125 transition-transform">{icon}</div>
      <h3 className="text-xl font-black uppercase tracking-widest mb-4 text-[#0F172A]">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed italic">{desc}</p>
    </div>
  );
}