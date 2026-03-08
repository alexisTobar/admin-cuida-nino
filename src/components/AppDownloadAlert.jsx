import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X } from 'lucide-react';

export default function AppDownloadAlert({ visible, onClose }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[2rem] shadow-2xl z-[100]"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white"><X size={16}/></button>
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30">
              <Smartphone size={20} color="white" />
            </div>
            <div>
              <p className="text-white font-bold text-xs uppercase tracking-widest">App Disponible</p>
              <p className="text-white/50 text-[10px] mt-1">Descarga en Google Play</p>
            </div>
          </div>
          <button className="w-full mt-4 bg-white text-black text-[9px] font-black py-3 rounded-xl tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all">
            INSTALAR AHORA
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}