// "use client";
// import React, { useEffect, useRef } from "react";
// import Phaser from "phaser";
// import { UniverseScene } from "../game/UniverseScene";
// import { CelestialStats, UniverseConfig } from "../types";

// interface CosmicCanvasProps {
//   config: UniverseConfig;
//   onStatsUpdate: (stats: CelestialStats) => void;
// }

// export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
//   config,
//   onStatsUpdate,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const gameRef = useRef<Phaser.Game | null>(null);
//   const sceneRef = useRef<UniverseScene | null>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const scene = new UniverseScene();
//     sceneRef.current = scene;
//     scene.setStatsCallback(onStatsUpdate);

//     const phaserConfig: Phaser.Types.Core.GameConfig = {
//       type: Phaser.AUTO,
//       parent: containerRef.current,
//       width: window.innerWidth,
//       height: window.innerHeight,
//       backgroundColor: "#010206",
//       transparent: false,
//       scale: {
//         mode: Phaser.Scale.RESIZE,
//         autoCenter: Phaser.Scale.CENTER_BOTH,
//       },
//       render: {
//         antialias: true,
//         powerPreference: "high-performance",
//         clearBeforeRender: true,
//         premultipliedAlpha: false,
//       },
//       audio: {
//         noAudio: true,
//       },
//       scene: [scene],
//     };

//     const game = new Phaser.Game(phaserConfig);
//     gameRef.current = game;

//     return () => {
//       game.destroy(true);
//       gameRef.current = null;
//       sceneRef.current = null;
//     };
//   }, []);

//   // Update scene config dynamically when React props change
//   useEffect(() => {
//     if (sceneRef.current) {
//       sceneRef.current.setConfig(config);
//     }
//   }, [config]);

//   return (
//     <div
//       ref={containerRef}
//       id="cosmic-canvas-container"
//       className="fixed inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
//     />
//   );
// };

"use client";

import React, { useEffect, useRef } from "react";
import type Phaser from "phaser";
import type { UniverseScene } from "../game/UniverseScene";
import type { CelestialStats, UniverseConfig } from "../types";

interface CosmicCanvasProps {
  config: UniverseConfig;
  onStatsUpdate: (stats: CelestialStats) => void;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  config,
  onStatsUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<UniverseScene | null>(null);

  useEffect(() => {
    let destroyed = false;
    let game: Phaser.Game | null = null;

    const initializePhaser = async () => {
      if (!containerRef.current) return;

      // IMPORTANT:
      // Phaser must only be imported in the browser.
      const PhaserModule = await import("phaser");
      const { UniverseScene: UniverseSceneClass } =
        await import("../game/UniverseScene");

      if (destroyed || !containerRef.current) return;

      const scene = new UniverseSceneClass();

      if (destroyed) {
        return;
      }

      sceneRef.current = scene;
      scene.setStatsCallback(onStatsUpdate);

      const phaserConfig: Phaser.Types.Core.GameConfig = {
        type: PhaserModule.AUTO,

        parent: containerRef.current,

        width: window.innerWidth,
        height: window.innerHeight,

        backgroundColor: "#010206",

        transparent: false,

        scale: {
          mode: PhaserModule.Scale.RESIZE,
          autoCenter: PhaserModule.Scale.CENTER_BOTH,
        },

        render: {
          antialias: true,
          powerPreference: "high-performance",
          clearBeforeRender: true,
          premultipliedAlpha: false,
        },

        audio: {
          noAudio: true,
        },

        scene: [scene],
      };

      game = new PhaserModule.Game(phaserConfig);

      gameRef.current = game;
    };

    initializePhaser();

    return () => {
      destroyed = true;

      if (game) {
        game.destroy(true);
      }

      gameRef.current = null;
      sceneRef.current = null;
    };
  }, [onStatsUpdate]);

  // Update scene config dynamically when React props change
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setConfig(config);
    }
  }, [config]);

  return (
    <div
      ref={containerRef}
      id="cosmic-canvas-container"
      className="fixed inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
    />
  );
};
