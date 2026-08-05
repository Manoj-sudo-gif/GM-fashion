import React from 'react';
import { useLocation } from 'react-router-dom';
import { Instagram, Facebook, Youtube, ArrowUpRight, MapPin, Store } from 'lucide-react';

export default function Footer() {
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }

  const branches = [
    { name: 'Thiruchengode', url: 'https://maps.app.goo.gl/uDWn4hpvu5ii28Cd7' },
    { name: 'Salem', url: 'https://maps.app.goo.gl/KcnNwJUcEJj5E2Nw5' },
    { name: 'Namakkal', url: 'https://maps.app.goo.gl/ZAuZbpgXohAVYv8t9' },
    { name: 'Karur', url: 'https://maps.app.goo.gl/DS1RtkaYLBZNMMnP6' },
    { name: 'Mallur', url: 'https://maps.app.goo.gl/yxVdtR4ptpku1qev5' },
    { name: 'Kumbakonam', url: 'https://maps.app.goo.gl/p4UCqJyuquB78QRk6' },
    { name: 'Thiruvannamalai', url: 'https://maps.app.goo.gl/RXeekj3pC4yWa3YLA' }
  ];

  return (
    <footer id="main-footer" className="w-full bg-zinc-950 text-zinc-400 font-sans border-t border-zinc-900 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Compact Section: Social Follow & Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-zinc-900">
          <div className="text-center md:text-left space-y-1">
            <span className="text-amber-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold">Join The GM Club</span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white font-headline uppercase tracking-tight">
              Follow Us For Exclusive Deals
            </h2>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com/gmfashion" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-600 text-white transition-all duration-300 shadow-xs"
              title="Follow GM on Instagram"
            >
              <Instagram size={17} className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://facebook.com/gmfashion" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 hover:bg-blue-600 text-white transition-all duration-300 shadow-xs"
              title="Follow GM on Facebook"
            >
              <Facebook size={17} className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://youtube.com/@G.M.Fashions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 hover:bg-rose-600 text-white transition-all duration-300 shadow-xs"
              title="Subscribe to GM on YouTube"
            >
              <Youtube size={17} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Our 7 Store Branches Section */}
        <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-zinc-900">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] uppercase tracking-wider font-bold">
            <Store size={14} />
            <span>OUR 7 BRANCHES IN TAMIL NADU</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 max-w-3xl">
            {branches.map((branch) => (
              <a 
                key={branch.name}
                href={branch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-zinc-900 hover:bg-amber-950/40 text-zinc-300 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-200 text-xs font-semibold group cursor-pointer"
                title={`Open ${branch.name} branch location on Google Maps`}
              >
                <MapPin size={13} className="text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>{branch.name}</span>
                <ArrowUpRight size={11} className="text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Main Bottom Footer Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-zinc-500 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm sm:text-base font-black text-white tracking-tighter font-headline">GM FASHIONS</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px]">
            <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Sustainability <ArrowUpRight size={10} /></a>
            <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Shipping & Returns <ArrowUpRight size={10} /></a>
            <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Contact Us <ArrowUpRight size={10} /></a>
            <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Privacy <ArrowUpRight size={10} /></a>
          </div>
          
          <div className="text-[10px] text-zinc-600 font-light text-center md:text-right">
            © {new Date().getFullYear()} GM FASHIONS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}

