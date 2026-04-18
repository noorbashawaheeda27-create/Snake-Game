import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus, Point } from '../types';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const MOVE_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food consumption
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = window.setInterval(moveSnake, MOVE_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setStatus(GameStatus.PLAYING);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex justify-between w-full max-w-[400px] items-end px-4">
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase text-neon-cyan/60 tracking-widest">Score</p>
          <p className="text-5xl font-digital text-neon-cyan leading-none animate-glitch glitch-cyan">{score.toString().padStart(4, '0')}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-mono uppercase text-white/40 tracking-widest flex items-center justify-end gap-1">
            <Trophy size={10} /> High Score
          </p>
          <p className="text-2xl font-digital text-white/60 leading-none animate-glitch">{highScore.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <div className="relative p-1 neon-border-cyan rounded-xl bg-black/40 overflow-hidden">
        <div 
          className="grid gap-[1px] bg-white/5" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1.25rem)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1.25rem)` 
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-5 h-5 rounded-sm transition-all duration-200 ${
                  isHead ? 'bg-neon-cyan shadow-[0_0_15px_#00f3ff]' : 
                  isSnake ? 'bg-neon-cyan/40 shadow-[0_0_5px_#00f3ff]' : 
                  isFood ? 'bg-neon-ruby animate-pulse shadow-[0_0_10px_#e0115f]' : 
                  'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
            >
              {status === GameStatus.GAME_OVER && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8"
                >
                    <h2 className="text-4xl font-display text-neon-ruby mb-2 uppercase tracking-tighter">System Failure</h2>
                    <p className="text-white/60 font-mono text-sm uppercase">Snake segment collision detected.</p>
                </motion.div>
              )}
              
              <button
                onClick={startGame}
                className={`group flex items-center gap-3 px-8 py-4 rounded-full font-display uppercase tracking-widest text-lg transition-all duration-300 ${
                    status === GameStatus.GAME_OVER 
                    ? 'bg-transparent border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-neon-cyan' 
                    : 'bg-neon-cyan text-black hover:scale-105 shadow-neon-cyan'
                }`}
              >
                {status === GameStatus.GAME_OVER ? (
                    <>
                        <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        Reboot Simulation
                    </>
                ) : (
                    <>
                        <Play fill="currentColor" size={20} />
                        Initiate Snake.core
                    </>
                )}
              </button>

              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <div className="flex justify-between gap-4"><span>WASD</span> <span>Move</span></div>
                <div className="flex justify-between gap-4"><span>ARROWS</span> <span>Move</span></div>
                <div className="flex justify-between gap-4 col-span-2"><span>EAT RUBY</span> <span>+10 PTS</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
