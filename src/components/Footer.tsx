import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="main-footer" className="w-full bg-zinc-950 text-zinc-400 font-sans border-t border-zinc-900 mt-auto">
      {/* Attractive Follow Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-b border-zinc-900 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.25em] font-semibold">Join The GM Club</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-headline uppercase tracking-tight">
            For More Shopping Follow Us
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
            Get early access to festive collections, limited-edition flash combos, and exclusive style guides. Stay connected with us across our social spaces.
          </p>

          {/* Social Icons Container with Premium Hover Effects */}
          <div className="flex justify-center items-center gap-6 pt-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-600 text-white transition-all duration-300 shadow-md"
              title="Follow GM on Instagram"
            >
              <Instagram size={20} className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 hover:bg-blue-600 text-white transition-all duration-300 shadow-md"
              title="Follow GM on Facebook"
            >
              <Facebook size={20} className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 hover:bg-sky-500 text-white transition-all duration-300 shadow-md"
              title="Follow GM on Twitter"
            >
              <Twitter size={20} className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 hover:bg-rose-600 text-white transition-all duration-300 shadow-md"
              title="Subscribe to GM on YouTube"
            >
              <Youtube size={20} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Bottom Footer Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-base font-black text-white tracking-tighter font-headline">GM FASHION</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px]">
          <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Sustainability <ArrowUpRight size={10} /></a>
          <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Shipping & Returns <ArrowUpRight size={10} /></a>
          <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Contact Us <ArrowUpRight size={10} /></a>
          <a className="hover:text-white transition-colors duration-300 flex items-center gap-0.5" href="#">Privacy <ArrowUpRight size={10} /></a>
        </div>
        
        <div className="text-[10px] text-zinc-600 font-light text-center md:text-right">
          © {new Date().getFullYear()} GM FASHION. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}

