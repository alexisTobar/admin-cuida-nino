import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Smartphone, Users, MapPin, 
  Lock, BarChart3, Mail, ShieldCheck 
} from 'lucide-react';

export default function Landing({ onEnterAdmin, user }) {
  const [currentSlide, setCurrentSlide] = useState(0);
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
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. NAV INSTITUCIONAL AVISTO */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Logo AVISTO" className="w-16 h-16 object-contain" />
            <div className="leading-none">
              <span className="text-2xl font-black tracking-tighter uppercase block text-[#0F172A]">AVISTO</span>
              <span className="text-[10px] font-bold text-[#007AFF] uppercase tracking-[0.2em]">Seguridad en Terreno</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#propuesta" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#007AFF] transition-colors">Sistema</a>
            <a href="#beneficios" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#007AFF] transition-colors">Capacidades</a>
            <button 
              onClick={onEnterAdmin}
              className="bg-[#0F172A] text-white px-8 py-3 text-[11px] font-black tracking-widest hover:bg-[#007AFF] transition-all uppercase rounded-sm"
            >
              {user ? 'Panel de Control' : 'Acceso Operativo'}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-24">
        <div className="relative h-[750px] w-full overflow-hidden bg-[#0F172A]">
          {images.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}>
              <img src={img} className="w-full h-full object-cover" alt="Banner" />
            </div>
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <img src={LOGO_URL} alt="Logo" className="w-32 h-32 mb-8 animate-pulse" />
            <span className="bg-[#FF8C00] text-white px-4 py-1 text-[10px] font-black tracking-[0.3em] uppercase mb-6 rounded-full">Operación Eventos Masivos 2026</span>
            <h1 className="text-6xl md:text-9xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
              AVISTO<br /><span className="text-[#00D2FF] italic">Protocolo SOS.</span>
            </h1>
            <p className="text-slate-200 max-w-2xl text-lg mb-12 font-medium leading-relaxed">
              La plataforma definitiva para la protección infantil en ferias, conciertos y espacios públicos. Identificación inmediata y geolocalización en segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onEnterAdmin} className="bg-[#007AFF] text-white px-10 py-5 font-black text-xs tracking-widest uppercase flex items-center gap-3 hover:bg-[#FF8C00] transition-all shadow-xl shadow-blue-500/20">
                Iniciar Monitor Live <ChevronRight size={18} />
              </button>
              <a href="#propuesta" className="border border-white/30 text-white px-10 py-5 font-black text-xs tracking-widest uppercase hover:bg-white/10 transition-all">
                Ver Ficha Técnica
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROPUESTA TÉCNICA */}
      <section className="py-32 bg-slate-50" id="propuesta">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-8 uppercase tracking-tighter leading-none">
                Tecnología que <br /> salva momentos <br /> de crisis.
              </h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                AVISTO permite al staff de seguridad escanear una pulsera QR y obtener instantáneamente los datos de contacto, alergias y foto del menor, enviando una alerta GPS al padre en tiempo real.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="border-l-4 border-[#FF8C00] pl-6">
                  <h4 className="font-black text-xs uppercase tracking-widest mb-2 text-[#0F172A]">Respuesta Inmediata</h4>
                  <p className="text-slate-500 text-xs">Acceso a la información en menos de 3 segundos tras el escaneo.</p>
                </div>
                <div className="border-l-4 border-[#00D2FF] pl-6">
                  <h4 className="font-black text-xs uppercase tracking-widest mb-2 text-[#0F172A]">Precisión GPS</h4>
                  <p className="text-slate-500 text-xs">Ubicación exacta del nodo que realizó el hallazgo enviada vía WhatsApp.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-[#0F172A] shadow-2xl relative overflow-hidden group rounded-3xl border-8 border-white">
                <img 
                  src="https://i.postimg.cc/Pqf5NVp9/balance-por-fiestas-patrias-solo-tres-detenidos-en-el-marco-de-las-celebraciones-en-talagante-e-isla.jpg" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
                  alt="Seguridad AVISTO"
                />
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md p-8 border border-white/20">
                  <p className="text-[10px] font-black text-[#00D2FF] uppercase tracking-widest mb-2">Estado del Nodo</p>
                  <p className="text-2xl font-black text-white tracking-tight leading-none uppercase">Conectividad total en entornos de alta concurrencia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENEFICIOS */}
      <section className="py-32 bg-white" id="beneficios">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <span className="text-[#007AFF] font-black tracking-[0.3em] text-[10px] uppercase">Ventajas Operativas</span>
          <h2 className="text-4xl font-black uppercase tracking-tighter mt-4 text-[#0F172A]">Eficiencia en Seguridad Masiva</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard 
            icon={<Users className="text-[#007AFF]" size={32} />}
            title="Monitoreo Central"
            desc="Visualiza desde la base de mando todos los escaneos realizados por el staff en terreno."
          />
          <BenefitCard 
            icon={<BarChart3 className="text-[#FF8C00]" size={32} />}
            title="Métricas en Vivo"
            desc="Reportes en tiempo real sobre la cantidad de menores protegidos y alertas resueltas."
          />
          <BenefitCard 
            icon={<Lock className="text-[#00D2FF]" size={32} />}
            title="Nube Encriptada"
            desc="Gestión de datos segura mediante Firebase, garantizando privacidad total según ley vigente."
          />
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#0F172A] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <img src={LOGO_URL} alt="Logo" className="w-12 h-12 object-contain" />
              <span className="text-3xl font-black italic uppercase tracking-tighter">AVISTO</span>
            </div>
            <p className="max-w-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
              Ecosistema de seguridad desarrollado para la gestión de eventos de alta concurrencia y protección civil. Talagante, 2026.
            </p>
          </div>
          
          <div>
            <h4 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-[#007AFF]">Sistema</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Términos de Operación</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad de Datos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Manual de Uso Staff</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-[#FF8C00]">Soporte</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <li className="flex items-center gap-2"><Mail size={12}/> tobaralexis.89@gmail.com</li>
              <li className="flex items-center gap-2"><MapPin size={12}/> Talagante, Chile</li>
              <li className="pt-4 text-slate-500 italic">© 2026 AVISTO CORE v2.0</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-50 p-12 border border-slate-100 hover:shadow-2xl transition-all duration-500 rounded-2xl">
      <div className="mb-6">{icon}</div>
      <h3 className="text-lg font-black uppercase tracking-widest mb-4 text-[#0F172A]">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}