/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-magenta/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="text-neon-cyan" size={20} fill="#00f3ff" />
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase italic">
            Neon <span className="text-neon-cyan">Snake</span>
          </h1>
        </div>
        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <Music size={12} /> Synthwave Hybrid OS v2.4 <Gamepad2 size={12} />
        </p>
      </motion.header>

      <main className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10 max-w-7xl mx-auto">
        <motion.section 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0"
        >
          <SnakeGame />
        </motion.section>

        <motion.section 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md lg:absolute lg:right-4 lg:bottom-4"
        >
          <MusicPlayer />
        </motion.section>
      </main>

      <footer className="mt-8 text-[10px] font-mono text-white/20 uppercase tracking-widest relative z-10">
        &copy; 2026 AI Studio Build &bull; Neural Generated Audio Active
      </footer>
    </div>
  );
}

