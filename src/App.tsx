import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Info, Palette, Share2, Heart, Search } from 'lucide-react';
import colorData from './assets/data/colors.json';

interface IColor {
  name: string;
  pinyin: string;
  hex: string;
  RGB: [number, number, number];
  CMYK: [number, number, number, number];
}

const App: React.FC = () => {
  const colors: IColor[] = useMemo(() => colorData.colorList as IColor[], []);
  const [selectedColor, setSelectedColor] = useState<IColor>(colors[0] || {
    name: "中国红",
    pinyin: "zhongguohong",
    hex: "#ee1c25",
    RGB: [238, 28, 37],
    CMYK: [0, 95, 95, 0]
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) return colors;
    const query = searchQuery.toLowerCase().trim();
    return colors.filter(color => {
      const nameMatch = color.name.includes(query);
      const pinyinMatch = color.pinyin.toLowerCase().includes(query);
      const hexMatch = color.hex.toLowerCase().includes(query);
      const rgbMatch = color.RGB?.join(',').includes(query);
      return nameMatch || pinyinMatch || hexMatch || rgbMatch;
    });
  }, [colors, searchQuery]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', selectedColor.hex + '15');
  }, [selectedColor]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-serif overflow-hidden">
      {/* Left Section: Hero / Detail */}
      <motion.section 
        className="lg:w-1/2 h-[60vh] lg:h-screen relative flex items-center justify-center p-8 lg:p-16 transition-colors duration-1000"
        style={{ backgroundColor: selectedColor.hex }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <span className="text-[40rem] font-bold absolute -bottom-20 -right-20 leading-none select-none">
            {selectedColor.name[0]}
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-white text-center">
          <motion.div
            key={selectedColor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-8xl lg:text-9xl font-bold tracking-tighter vertical-text mb-8">
              {selectedColor.name}
            </h1>
            <p className="text-xl lg:text-2xl font-light tracking-[0.5em] uppercase opacity-80 mb-12">
              {selectedColor.pinyin}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 text-left border-t border-white/20 pt-8 w-full max-w-md">
            <div className="space-y-4">
              <div className="group cursor-pointer" onClick={() => copyToClipboard(selectedColor.hex, 'hex')}>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2">
                  HEX {copied === 'hex' && <Check size={12} className="text-green-300" />}
                </p>
                <p className="text-2xl font-light tracking-wider group-hover:opacity-100 opacity-90 transition-opacity">
                  {selectedColor.hex.toUpperCase()}
                </p>
              </div>
              <div className="group cursor-pointer" onClick={() => copyToClipboard(`rgb(${selectedColor.RGB?.join(',')})`, 'rgb')}>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2">
                  RGB {copied === 'rgb' && <Check size={12} className="text-green-300" />}
                </p>
                <p className="text-lg font-light tracking-widest group-hover:opacity-100 opacity-90 transition-opacity">
                  {selectedColor.RGB?.join(', ')}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="group cursor-pointer" onClick={() => copyToClipboard(`cmyk(${selectedColor.CMYK?.join(',')})`, 'cmyk')}>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2">
                  CMYK {copied === 'cmyk' && <Check size={12} className="text-green-300" />}
                </p>
                <p className="text-lg font-light tracking-widest group-hover:opacity-100 opacity-90 transition-opacity">
                  {selectedColor.CMYK?.join(', ')}
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                  <Heart size={18} />
                </button>
                <button className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Right Section: Color Grid */}
      <section className="lg:w-1/2 h-[40vh] lg:h-screen bg-white/40 backdrop-blur-xl overflow-y-auto p-6 lg:p-12">
        <header className="mb-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-4xl font-bold text-neutral-800">中国传统色</h2>
              <p className="text-neutral-400 mt-2 tracking-widest uppercase text-xs">Traditional Chinese Colors</p>
            </div>
            <div className="flex gap-4">
              <Palette className="text-neutral-300" />
              <Info className="text-neutral-300 cursor-help" />
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-neutral-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="搜索颜色名称、HEX、RGB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 border-b border-neutral-100 py-4 pl-12 pr-4 focus:outline-none focus:border-neutral-800 transition-all font-light tracking-widest"
            />
          </div>
        </header>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredColors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 10) * 0.05 }}
              onClick={() => setSelectedColor(color)}
              className={`group cursor-pointer flex flex-col items-center transition-all duration-300 ${
                selectedColor.name === color.name ? 'scale-110 z-10' : 'hover:scale-105'
              }`}
            >
              <div 
                className={`w-full aspect-[2/3] rounded-sm mb-2 relative overflow-hidden transition-all duration-500 ${
                  selectedColor.name === color.name ? 'ring-2 ring-offset-4' : 'opacity-80 group-hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: color.hex,
                  boxShadow: selectedColor.name === color.name ? `0 10px 30px -5px ${color.hex}80` : 'none',
                  borderColor: color.hex
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="vertical-text text-white/90 text-sm font-medium tracking-widest">
                    {color.name}
                  </span>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-tighter text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {color.hex}
              </span>
            </motion.div>
          ))}
        </div>

        <footer className="mt-20 pt-12 border-t border-neutral-100 text-center text-neutral-300 text-[10px] tracking-[0.3em] uppercase pb-12">
          &copy; {new Date().getFullYear()} ChinaColor / Heritage of Aesthetics
        </footer>
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-6 py-3 rounded-full text-sm font-light tracking-widest z-[100] shadow-2xl flex items-center gap-3"
          >
            <Check size={16} className="text-green-400" />
            {copied.toUpperCase()} COPIED TO CLIPBOARD
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
