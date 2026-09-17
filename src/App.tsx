import { useEffect, useRef, useState } from 'react';
import { GameEngine, GameStats, getSavedProgress, resetSavedProgress } from './game/engine';
import { sound } from './game/audio';
import { GameHUD } from './components/GameHUD';
import { VirtualControls } from './components/VirtualControls';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { GameWinModal } from './components/GameWinModal';
import { VanillaExportModal } from './components/VanillaExportModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { MainMenu } from './components/MainMenu';
import { PauseModal } from './components/PauseModal';
import { LevelProgress } from './game/types';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [stats, setStats] = useState<GameStats>({
    coins: 0,
    totalCoins: 15,
    lives: 3,
    timeSeconds: 0,
    score: 0,
    gameState: 'START',
    currentLevelId: 1,
    levelName: 'Level 1 — Lavender Meadows',
    levelSubtitle: 'Padang Rumput Lavender',
    levelBadge: '🌸',
    isLastLevel: false,
  });

  const [progress, setProgress] = useState<LevelProgress>(getSavedProgress);
  const [isMuted, setIsMuted] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Initialize Canvas & Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Measure initial container size
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const initialW = rect.width > 0 ? Math.round(rect.width * dpr) : 960;
    const initialH = rect.height > 0 ? Math.round(rect.height * dpr) : 540;
    canvas.width = initialW;
    canvas.height = initialH;

    const initialProgress = getSavedProgress();
    setProgress(initialProgress);

    const engine = new GameEngine(
      canvas,
      (newStats) => {
        setStats({ ...newStats });
        // Whenever a level completes or is won, refresh saved progress
        if (newStats.gameState === 'LEVEL_COMPLETE' || newStats.gameState === 'GAME_WIN') {
          setProgress(getSavedProgress());
        }
      },
      1
    );
    engine.resize(initialW, initialH, dpr);
    engineRef.current = engine;

    // Responsive Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current || !engineRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      const currentDpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cRect.width * currentDpr);
      const h = Math.round(cRect.height * currentDpr);
      if (w > 0 && h > 0 && (canvasRef.current.width !== w || canvasRef.current.height !== h)) {
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        engineRef.current.resize(w, h, currentDpr);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Keyboard handlers
    const onKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on space / arrow keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      engine.handleKeyDown(e.code);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      engine.handleKeyUp(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      engine.stop();
    };
  }, []);

  const handleStartGame = () => {
    if (engineRef.current) {
      engineRef.current.loadLevel(1, true);
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.restart();
    }
  };

  const handleTogglePause = () => {
    if (engineRef.current) {
      engineRef.current.togglePause();
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.resume();
    }
  };

  const handleGoToMainMenu = () => {
    setProgress(getSavedProgress());
    if (engineRef.current) {
      engineRef.current.goToMainMenu();
    }
  };

  const handleNextLevel = () => {
    if (engineRef.current) {
      engineRef.current.nextLevel();
    }
  };

  const handleSelectLevel = (levelId: number) => {
    if (engineRef.current) {
      engineRef.current.loadLevel(levelId, true);
    }
    setShowLevelSelect(false);
  };

  const handleResetProgress = () => {
    const reset = resetSavedProgress();
    setProgress(reset);
    if (engineRef.current) {
      engineRef.current.goToMainMenu();
    }
  };

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setIsMuted(!enabled);
  };

  // Controls (← → and LOMPAT) are visible ONLY when a level is actively being played
  const isGameplayActive =
    stats.gameState === 'PLAYING' &&
    !showLevelSelect &&
    !showHowToPlay &&
    !showExportModal;

  // Release any active virtual controls when gameplay becomes inactive (e.g. Pause, Level Complete, Game Over)
  useEffect(() => {
    if (!isGameplayActive && engineRef.current) {
      engineRef.current.setVirtualKey('left', false);
      engineRef.current.setVirtualKey('right', false);
      engineRef.current.setVirtualKey('jump', false);
    }
  }, [isGameplayActive]);

  const handleVirtualPress = (action: 'left' | 'right' | 'jump', pressed: boolean) => {
    if (engineRef.current && isGameplayActive) {
      engineRef.current.setVirtualKey(action, pressed);
    }
  };

  return (
    <div
      id="bunny-run-app"
      className="h-screen w-full bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col text-white font-sans overflow-hidden select-none"
    >
      {/* HUD Header */}
      <GameHUD
        stats={stats}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onRestart={handleRestart}
        onTogglePause={handleTogglePause}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenLevelSelect={() => setShowLevelSelect(true)}
        onGoToMainMenu={handleGoToMainMenu}
      />

      {/* Main Game Stage Area - Full Width */}
      <main className="w-full flex-1 min-h-0 flex flex-col px-1 sm:px-2 md:px-3 pt-1 pb-1 box-border">
        <div
          ref={containerRef}
          id="game-viewport"
          className="relative w-full flex-1 min-h-0 bg-purple-950 rounded-xl sm:rounded-2xl border-2 border-purple-500/60 shadow-[0_12px_40px_rgba(76,29,149,0.5)] overflow-hidden flex items-center justify-center"
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            id="game-canvas"
            className="w-full h-full block select-none"
          />

          {/* Main Menu Overlay */}
          {stats.gameState === 'START' && (
            <MainMenu
              progress={progress}
              onStartGame={handleStartGame}
              onOpenLevelSelect={() => setShowLevelSelect(true)}
              onOpenHowToPlay={() => setShowHowToPlay(true)}
              onResetProgress={handleResetProgress}
              isMuted={isMuted}
              onToggleSound={handleToggleSound}
            />
          )}

          {/* Pause Modal Overlay */}
          {stats.gameState === 'PAUSED' && (
            <PauseModal
              stats={stats}
              onResume={handleResume}
              onRestart={handleRestart}
              onOpenLevelSelect={() => setShowLevelSelect(true)}
              onGoToMainMenu={handleGoToMainMenu}
            />
          )}

          {/* Level Complete Modal */}
          {stats.gameState === 'LEVEL_COMPLETE' && (
            <LevelCompleteModal
              stats={stats}
              onNextLevel={handleNextLevel}
              onReplay={handleRestart}
              onOpenLevelSelect={() => setShowLevelSelect(true)}
              onGoToMainMenu={handleGoToMainMenu}
            />
          )}

          {/* Game Over Modal */}
          {stats.gameState === 'GAME_OVER' && (
            <GameOverModal
              stats={stats}
              onRetry={() => {
                if (engineRef.current) engineRef.current.retry();
              }}
              onRestart={handleRestart}
              onOpenLevelSelect={() => setShowLevelSelect(true)}
              onGoToMainMenu={handleGoToMainMenu}
            />
          )}

          {/* Game Win / Game Completed Modal */}
          {stats.gameState === 'GAME_WIN' && (
            <GameWinModal
              stats={stats}
              onRestartAll={() => handleSelectLevel(1)}
              onOpenLevelSelect={() => setShowLevelSelect(true)}
              onGoToMainMenu={handleGoToMainMenu}
            />
          )}
        </div>

        {/* Gameplay Control Buttons (← → and LOMPAT 🐰) - ONLY visible during active gameplay */}
        {isGameplayActive && (
          <div className="w-full shrink-0 pt-1 sm:pt-1.5">
            <VirtualControls onPress={handleVirtualPress} visible={isGameplayActive} />
          </div>
        )}
      </main>

      {/* Footer info */}
      {!isGameplayActive && (
        <footer className="w-full shrink-0 py-0.5 text-center text-[10px] sm:text-[11px] text-purple-400/80 select-none">
          Bunny Run: Purple Adventure • 10 Level Platformer • 100% Vanilla Canvas & Web Audio
        </footer>
      )}

      {/* Level Select Modal */}
      {showLevelSelect && (
        <LevelSelectModal
          currentLevelId={stats.currentLevelId}
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelSelect(false)}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* Modals */}
      <VanillaExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
}
