import Phaser from "phaser";
import { generateCosmicTextures } from "./textureGenerator";
import { COSMIC_THEMES } from "./themes";
import { CelestialStats, UniverseConfig } from "../types";
import { spaceSynth } from "../audio/spaceSynthesizer";

interface CelestialEntity {
  sprite:
    | Phaser.GameObjects.Sprite
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Arc;
  layerDepth: number; // 0 (far) to 1 (near)
  baseXRatio: number; // 0.0 to 1.0 (normalized horizontal position across screen)
  baseY: number; // 0 to worldHeight (cosmic vertical coordinate)
  type: "orb" | "star" | "galaxy" | "planet" | "nebula" | "dust";
  pulseSpeed: number;
  pulsePhase: number;
  baseScale: number;
  baseAlpha: number;
  rotationSpeed?: number;
  floatSpeed?: number;
}

interface ShootingStar {
  sprite: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export class UniverseScene extends Phaser.Scene {
  private config: UniverseConfig = {
    driftSpeed: 80,
    driftDirection: "up",
    theme: "aurora",
    density: {
      stars: 1.0,
      glowingOrbs: 1.0,
      nebulae: false,
      galaxies: true,
      planets: false,
      shootingStars: true,
      constellations: false,
    },
    mouseInfluence: 1.0,
    orbGlowIntensity: 1.0,
    soundEnabled: false,
    soundVolume: 0.4,
    soundPreset: "deep_drone",
    breathingGuide: false,
    breathingPace: "calm_4_7_8",
    zenMode: false,
    meditationDuration: 60,
    meditationType: "observer",
    selectedMusicTrack: "stardust",
  };

  private entities: CelestialEntity[] = [];
  private shootingStars: ShootingStar[] = [];
  private constellationGraphics?: Phaser.GameObjects.Graphics;
  private bgGraphics?: Phaser.GameObjects.Graphics;
  private isReady: boolean = false;

  // Camera & Scroll Physics
  private cameraY: number = 0;
  private targetScrollVelocity: number = 0;
  private currentScrollVelocity: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetMouseX: number = 0;
  private targetMouseY: number = 0;

  // Space World vertical loop span for seamless continuous rendering
  private readonly worldHeight: number = 7200;

  // Telemetry
  private totalDistancePixels: number = 0;
  private statsCallback?: (stats: CelestialStats) => void;
  private lastStatsUpdate: number = 0;

  constructor() {
    super({ key: "UniverseScene" });
  }

  public setConfig(newConfig: Partial<UniverseConfig>): void {
    const oldTheme = this.config.theme;
    const oldStars = this.config.density.stars;

    this.config = {
      ...this.config,
      ...newConfig,
      density: { ...this.config.density, ...(newConfig.density || {}) },
    };

    if (this.isReady) {
      if (newConfig.theme && newConfig.theme !== oldTheme) {
        this.updateThemeVisuals();
      }

      if (
        newConfig.density?.stars !== undefined &&
        newConfig.density.stars !== oldStars
      ) {
        this.respawnStars();
      }
    }
  }

  public setStatsCallback(cb: (stats: CelestialStats) => void): void {
    this.statsCallback = cb;
  }

  public preload(): void {
    // Generate all procedural canvas textures directly into Phaser texture manager
    generateCosmicTextures(this);
  }

  public create(): void {
    // 1. Dynamic Gradient Deep Space Sky Background
    this.bgGraphics = this.add.graphics();
    this.drawBackground();

    // 2. Volumetric Ambient Nebulae Layer (Deep background atmospheric gas clouds)
    this.spawnNebulae();

    // 3. Dense, Realistic Multi-Tier Starfields (Micro-stars, mid-field pinpoints, anchor stars)
    this.spawnStarfields();

    // 4. Frequent Spiral Galaxies, Gas Giants, Ringed Planets & Glowing Moons
    this.spawnGalaxiesAndPlanets();

    // 5. Constellations Graphics Layer
    this.constellationGraphics = this.add.graphics();
    this.constellationGraphics.setDepth(15);

    // 6. Glowing Astral Orbs (Prominent celestial light beacons)
    this.spawnNeonOrbs();

    // 7. Subtle Cosmic Dust Motes
    this.spawnCosmicDust();

    // 8. Event Listeners for Smooth Scroll & Mouse Interaction
    this.setupInputHandlers();

    // Handle resize gracefully
    this.scale.on("resize", this.handleResize, this);

    this.isReady = true;
  }

  private drawBackground(): void {
    if (!this.bgGraphics || !this.cameras?.main) return;
    this.bgGraphics.clear();
    const theme = COSMIC_THEMES[this.config.theme] || COSMIC_THEMES.aurora;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const c1 = Phaser.Display.Color.HexStringToColor(theme.bgGradient[0]).color;
    const c2 = Phaser.Display.Color.HexStringToColor(theme.bgGradient[1]).color;
    const c3 = Phaser.Display.Color.HexStringToColor(theme.bgGradient[2]).color;

    this.bgGraphics.fillGradientStyle(c1, c1, c2, c3, 1);
    this.bgGraphics.fillRect(0, 0, width, height);
    this.bgGraphics.setScrollFactor(0);
    this.bgGraphics.setDepth(-100);
  }

  private updateThemeVisuals(): void {
    this.drawBackground();
  }

  private spawnNebulae(): void {
    // Soft, spacious volumetric cosmic gas veils distributed peacefully across the journey
    const nebulaeData = [
      { key: "nebula_cyan", y: 900, xRatio: 0.35, scale: 2.8, alpha: 0.18 },
      { key: "nebula_magenta", y: 2700, xRatio: 0.7, scale: 2.9, alpha: 0.16 },
      { key: "nebula_violet", y: 4500, xRatio: 0.3, scale: 2.8, alpha: 0.18 },
      { key: "nebula_emerald", y: 6300, xRatio: 0.68, scale: 2.8, alpha: 0.16 },
    ];

    nebulaeData.forEach((n) => {
      const sprite = this.add.image(0, 0, n.key);
      sprite.setScale(n.scale);
      sprite.setAlpha(n.alpha);
      sprite.setBlendMode(Phaser.BlendModes.SCREEN);
      sprite.setDepth(2);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: 0.15,
        baseXRatio: n.xRatio,
        baseY: n.y,
        type: "nebula",
        pulseSpeed: 0.0004,
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: n.scale,
        baseAlpha: n.alpha,
        rotationSpeed: 0.00008,
      });
    });
  }

  private spawnStarfields(): void {
    // 1. Distant micro-stars (Crisp, delicate twinkling pinpoints)
    const microStarCount = Math.floor(220 * this.config.density.stars);
    const microStarKeys = [
      "star_dot",
      "star_dot",
      "star_blue",
      "star_gold",
      "star_bright",
    ];

    for (let i = 0; i < microStarCount; i++) {
      const key = Phaser.Utils.Array.GetRandom(microStarKeys);
      const xRatio = Phaser.Math.FloatBetween(0.02, 0.98);
      const y = Phaser.Math.FloatBetween(0, this.worldHeight);
      const scale = Phaser.Math.FloatBetween(0.12, 0.28);
      const alpha = Phaser.Math.FloatBetween(0.35, 0.75);

      const sprite = this.add.image(0, 0, key);
      sprite.setScale(scale);
      sprite.setAlpha(alpha);
      sprite.setBlendMode(Phaser.BlendModes.ADD);
      sprite.setDepth(4);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: 0.15,
        baseXRatio: xRatio,
        baseY: y,
        type: "star",
        pulseSpeed: Phaser.Math.FloatBetween(0.0008, 0.0022),
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: scale,
        baseAlpha: alpha,
      });
    }

    // 2. Mid-field luminous stars (Gentle depth beacons)
    const midStarCount = Math.floor(65 * this.config.density.stars);
    const midStarKeys = ["star_bright", "star_blue", "star_gold", "star_dot"];

    for (let i = 0; i < midStarCount; i++) {
      const key = Phaser.Utils.Array.GetRandom(midStarKeys);
      const xRatio = Phaser.Math.FloatBetween(0.02, 0.98);
      const y = Phaser.Math.FloatBetween(0, this.worldHeight);
      const scale = Phaser.Math.FloatBetween(0.24, 0.42);
      const alpha = Phaser.Math.FloatBetween(0.5, 0.85);

      const sprite = this.add.image(0, 0, key);
      sprite.setScale(scale);
      sprite.setAlpha(alpha);
      sprite.setBlendMode(Phaser.BlendModes.ADD);
      sprite.setDepth(8);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: 0.45,
        baseXRatio: xRatio,
        baseY: y,
        type: "star",
        pulseSpeed: Phaser.Math.FloatBetween(0.001, 0.003),
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: scale,
        baseAlpha: alpha,
      });
    }

    // 3. Foreground prominent anchor stars (Sparse, refined focal stars with delicate spikes)
    const anchorStarCount = Math.floor(9 * this.config.density.stars);
    const anchorKeys = ["star_bright", "star_blue", "star_gold"];

    for (let i = 0; i < anchorStarCount; i++) {
      const key = Phaser.Utils.Array.GetRandom(anchorKeys);
      const xRatio = Phaser.Math.FloatBetween(0.05, 0.95);
      const y = Phaser.Math.FloatBetween(0, this.worldHeight);
      const scale = Phaser.Math.FloatBetween(0.35, 0.52);
      const alpha = Phaser.Math.FloatBetween(0.7, 0.92);

      const sprite = this.add.image(0, 0, key);
      sprite.setScale(scale);
      sprite.setAlpha(alpha);
      sprite.setBlendMode(Phaser.BlendModes.ADD);
      sprite.setDepth(12);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: 0.8,
        baseXRatio: xRatio,
        baseY: y,
        type: "star",
        pulseSpeed: Phaser.Math.FloatBetween(0.0015, 0.0035),
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: scale,
        baseAlpha: alpha,
        rotationSpeed: Phaser.Math.FloatBetween(-0.0002, 0.0002),
      });
    }
  }

  private respawnStars(): void {
    if (!this.isReady) return;
    const nonStars = this.entities.filter((e) => {
      if (e.type === "star") {
        e.sprite.destroy();
        return false;
      }
      return true;
    });
    this.entities = nonStars;
    this.spawnStarfields();
  }

  private spawnGalaxiesAndPlanets(): void {
    // 1. Majestic Spiral Galaxies - Spaced out serenely as grand celestial milestones
    const galaxies = [
      {
        key: "galaxy_spiral_blue",
        y: 1300,
        xRatio: 0.8,
        scale: 0.95,
        alpha: 0.82,
        depth: 0.35,
        rotationSpeed: 0.00025,
      },
      {
        key: "galaxy_spiral_rose",
        y: 3700,
        xRatio: 0.2,
        scale: 0.92,
        alpha: 0.8,
        depth: 0.32,
        rotationSpeed: -0.00025,
      },
      {
        key: "galaxy_spiral_emerald",
        y: 6100,
        xRatio: 0.78,
        scale: 0.96,
        alpha: 0.82,
        depth: 0.36,
        rotationSpeed: 0.00025,
      },
    ];

    galaxies.forEach((g) => {
      const sprite = this.add.image(0, 0, g.key);
      sprite.setScale(g.scale);
      sprite.setAlpha(g.alpha);
      sprite.setBlendMode(Phaser.BlendModes.SCREEN);
      sprite.setDepth(6);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: g.depth,
        baseXRatio: g.xRatio,
        baseY: g.y,
        type: "galaxy",
        pulseSpeed: 0.0005,
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: g.scale,
        baseAlpha: g.alpha,
        rotationSpeed: g.rotationSpeed,
      });
    });

    // 2. Ringed Celestial Gas Giants & Luminous Moons - Interleaved calmly between galaxies
    const planets = [
      {
        key: "planet_ringed_violet",
        y: 2500,
        xRatio: 0.22,
        scale: 0.92,
        alpha: 0.96,
        depth: 0.65,
        rotationSpeed: 0,
      },
      {
        key: "moon_sapphire",
        y: 4900,
        xRatio: 0.76,
        scale: 0.88,
        alpha: 0.92,
        depth: 0.6,
        rotationSpeed: 0,
      },
      {
        key: "planet_ringed_blue",
        y: 7100,
        xRatio: 0.25,
        scale: 0.95,
        alpha: 0.96,
        depth: 0.66,
        rotationSpeed: 0,
      },
    ];

    planets.forEach((p) => {
      const sprite = this.add.image(0, 0, p.key);
      sprite.setScale(p.scale);
      sprite.setAlpha(p.alpha);
      sprite.setBlendMode(Phaser.BlendModes.NORMAL);
      sprite.setDepth(14);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: p.depth,
        baseXRatio: p.xRatio,
        baseY: p.y,
        type: "planet",
        pulseSpeed: 0.0004,
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: p.scale,
        baseAlpha: p.alpha,
        rotationSpeed: p.rotationSpeed,
        floatSpeed: 0.0006,
      });
    });
  }

  private spawnNeonOrbs(): void {
    // Delicate glowing astral beacons spaced peacefully across the voyage
    const orbs = [
      { key: "orb_cyan", y: 650, xRatio: 0.52, scale: 0.7, alpha: 0.88 },
      { key: "orb_gold", y: 1900, xRatio: 0.28, scale: 0.72, alpha: 0.88 },
      { key: "orb_magenta", y: 3150, xRatio: 0.72, scale: 0.72, alpha: 0.88 },
      { key: "orb_emerald", y: 4350, xRatio: 0.25, scale: 0.68, alpha: 0.88 },
      { key: "orb_violet", y: 5550, xRatio: 0.7, scale: 0.72, alpha: 0.88 },
      { key: "orb_white", y: 6750, xRatio: 0.48, scale: 0.74, alpha: 0.9 },
    ];

    orbs.forEach((o) => {
      const sprite = this.add.image(0, 0, o.key);
      sprite.setScale(o.scale);
      sprite.setAlpha(o.alpha);
      sprite.setBlendMode(Phaser.BlendModes.ADD);
      sprite.setDepth(20);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: 0.85,
        baseXRatio: o.xRatio,
        baseY: o.y,
        type: "orb",
        pulseSpeed: 0.0018,
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: o.scale,
        baseAlpha: o.alpha,
        floatSpeed: 0.001,
      });
    });
  }

  private spawnCosmicDust(): void {
    const dustCount = 22;
    for (let i = 0; i < dustCount; i++) {
      const xRatio = Phaser.Math.FloatBetween(0.02, 0.98);
      const y = Phaser.Math.FloatBetween(0, this.worldHeight);
      const scale = Phaser.Math.FloatBetween(0.3, 0.7);
      const alpha = Phaser.Math.FloatBetween(0.15, 0.35);

      const sprite = this.add.image(0, 0, "cosmic_dust");
      sprite.setScale(scale);
      sprite.setAlpha(alpha);
      sprite.setBlendMode(Phaser.BlendModes.ADD);
      sprite.setDepth(22);
      sprite.setVisible(false);

      this.entities.push({
        sprite,
        layerDepth: 0.85,
        baseXRatio: xRatio,
        baseY: y,
        type: "dust",
        pulseSpeed: 0.0015,
        pulsePhase: Math.random() * Math.PI * 2,
        baseScale: scale,
        baseAlpha: alpha,
        floatSpeed: 0.001,
      });
    }
  }

  private setupInputHandlers(): void {
    // Mouse wheel vertical scroll - calm & smooth damping
    this.input.on(
      "wheel",
      (_pointer: Phaser.Input.Pointer, _deltaX: number, deltaY: number) => {
        const impulse = deltaY * 0.45;
        this.targetScrollVelocity += Phaser.Math.Clamp(impulse, -120, 120);
        this.targetScrollVelocity = Phaser.Math.Clamp(
          this.targetScrollVelocity,
          -260,
          260,
        );
      },
    );

    // Pointer move for 3D parallax tilt & interactive cursor aura
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      const cx = this.cameras.main.width / 2;
      const cy = this.cameras.main.height / 2;

      this.targetMouseX = (pointer.x - cx) / cx; // -1 to 1
      this.targetMouseY = (pointer.y - cy) / cy; // -1 to 1
    });

    // Touch / Drag vertical scrolling
    let dragStartY = 0;
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      dragStartY = pointer.y;

      // Create celestial ripple shockwave at click point
      this.triggerCosmicRipple(pointer.x, pointer.y);

      // Synthesizer chime
      const pentatonicNotes = [
        261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
      ];
      const note = Phaser.Utils.Array.GetRandom(pentatonicNotes);
      spaceSynth.playOrbChime(note);
    });

    this.input.on("pointerup", () => {
      dragStartY = 0;
    });

    // Touch drag delta
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && dragStartY !== 0) {
        const delta = dragStartY - pointer.y;
        this.targetScrollVelocity += delta * 0.8;
        dragStartY = pointer.y;
      }
    });

    // Trigger periodic gentle shooting stars
    this.time.addEvent({
      delay: 6500,
      callback: this.maybeSpawnShootingStar,
      callbackScope: this,
      loop: true,
    });
  }

  public triggerCosmicRipple(screenX: number, screenY: number): void {
    const ripple = this.add.image(screenX, screenY, "pulse_ring");
    ripple.setScale(0.1);
    ripple.setAlpha(1.0);
    ripple.setBlendMode(Phaser.BlendModes.ADD);
    ripple.setDepth(40);
    ripple.setScrollFactor(0);

    const theme = COSMIC_THEMES[this.config.theme] || COSMIC_THEMES.aurora;
    ripple.setTint(theme.orbColors[0]);

    this.tweens.add({
      targets: ripple,
      scale: 3.2,
      alpha: 0,
      duration: 1800,
      ease: "Cubic.easeOut",
      onComplete: () => {
        ripple.destroy();
      },
    });
  }

  private maybeSpawnShootingStar(): void {
    if (!this.config.density.shootingStars) return;

    const screenW = this.cameras.main.width;
    const startX = Phaser.Math.Between(50, screenW - 50);
    const startY = Phaser.Math.Between(20, 200);

    const sprite = this.add.image(startX, startY, "star_bright");
    sprite.setScale(0.7, 0.12);
    sprite.setRotation(Phaser.Math.DegToRad(35));
    sprite.setBlendMode(Phaser.BlendModes.ADD);
    sprite.setDepth(30);
    sprite.setScrollFactor(0);

    const angle = Phaser.Math.DegToRad(Phaser.Math.Between(25, 45));
    const speed = Phaser.Math.FloatBetween(280, 480);

    const shootingStar: ShootingStar = {
      sprite,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1.0,
      life: 0,
      maxLife: Phaser.Math.Between(900, 1600),
    };

    this.shootingStars.push(shootingStar);
  }

  public override update(time: number, delta: number): void {
    if (!this.isReady || !this.cameras?.main) return;
    const dt = delta / 1000; // seconds

    // 1. Base Ambient Drift Speed
    let baseSpeed = 0;
    if (this.config.driftDirection === "up") {
      baseSpeed = this.config.driftSpeed;
    } else if (this.config.driftDirection === "down") {
      baseSpeed = -this.config.driftSpeed;
    }

    // 2. Smoothly integrate scroll velocity with viscous friction damping
    this.currentScrollVelocity = Phaser.Math.Linear(
      this.currentScrollVelocity,
      baseSpeed + this.targetScrollVelocity,
      0.06,
    );

    // Dissipate scroll impulses smoothly toward 0
    this.targetScrollVelocity *= 0.94;
    if (Math.abs(this.targetScrollVelocity) < 0.1) {
      this.targetScrollVelocity = 0;
    }

    // Camera vertical translation
    const travelStep = this.currentScrollVelocity * dt;
    this.cameraY += travelStep;
    this.totalDistancePixels += Math.abs(travelStep);

    // 3. Smooth Mouse look-around interpolation
    this.mouseX = Phaser.Math.Linear(this.mouseX, this.targetMouseX, 0.04);
    this.mouseY = Phaser.Math.Linear(this.mouseY, this.targetMouseY, 0.04);

    const viewWidth = this.cameras.main.width;
    const viewHeight = this.cameras.main.height;
    const mouseInfluence = this.config.mouseInfluence;

    const pointer = this.input.activePointer;

    // 4. Update Celestial Entities with Prerendered Seamless Motion
    const visibleStarsForConstellations: { x: number; y: number }[] = [];

    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];

      // Visibility toggles from config
      if (entity.type === "planet" && !this.config.density.planets) {
        entity.sprite.setVisible(false);
        continue;
      }
      if (entity.type === "galaxy" && !this.config.density.galaxies) {
        entity.sprite.setVisible(false);
        continue;
      }
      if (entity.type === "nebula" && !this.config.density.nebulae) {
        entity.sprite.setVisible(false);
        continue;
      }
      if (entity.type === "orb" && this.config.density.glowingOrbs <= 0) {
        entity.sprite.setVisible(false);
        continue;
      }

      // Parallax X/Y shift from mouse look-around
      const mouseShiftX =
        -this.mouseX * 35 * entity.layerDepth * mouseInfluence;
      const mouseShiftY =
        -this.mouseY * 25 * entity.layerDepth * mouseInfluence;

      // Gentle organic sinusoidal floating drift
      let floatX = 0;
      if (entity.floatSpeed) {
        floatX =
          Math.sin(time * entity.floatSpeed + entity.pulsePhase) *
          8 *
          entity.layerDepth;
      }

      const screenX = entity.baseXRatio * viewWidth + mouseShiftX + floatX;

      // Vertical scroll position with layer parallax factor
      const parallaxY = this.cameraY * entity.layerDepth;
      const rawRelY = entity.baseY - parallaxY;

      // Seamless cyclic wrapping around viewport center:
      // Wrapping only occurs at ±worldHeight/2 (3600px away from the screen center),
      // so objects are prerendered thousands of pixels in advance and NEVER pop on screen!
      let dy = (rawRelY - viewHeight / 2) % this.worldHeight;
      if (dy < -this.worldHeight / 2) dy += this.worldHeight;
      if (dy > this.worldHeight / 2) dy -= this.worldHeight;

      const screenY = viewHeight / 2 + dy + mouseShiftY;

      // Prerendering buffer: keep entities active when within 450px above/below viewport
      const cullMargin = 450;
      if (screenY < -cullMargin || screenY > viewHeight + cullMargin) {
        entity.sprite.setVisible(false);
        continue;
      }

      entity.sprite.setVisible(true);
      entity.sprite.setPosition(screenX, screenY);

      // Sinusoidal breathing / twinkling oscillation
      const pulse = Math.sin(time * entity.pulseSpeed + entity.pulsePhase);
      const scaleMultiplier = 1 + pulse * 0.1;

      // Interactive proximity glow to mouse cursor
      let proximityGlow = 0;
      if (
        entity.type === "orb" ||
        (entity.type === "star" && entity.layerDepth > 0.7)
      ) {
        const distToMouse = Phaser.Math.Distance.Between(
          screenX,
          screenY,
          pointer.x,
          pointer.y,
        );
        if (distToMouse < 200) {
          proximityGlow = (1 - distToMouse / 200) * 0.4;
        }
      }

      const glowMultiplier = this.config.orbGlowIntensity;
      const alphaMultiplier = entity.type === "orb" ? glowMultiplier : 1.0;
      entity.sprite.setScale(
        entity.baseScale * scaleMultiplier * (1 + proximityGlow * 0.2),
      );
      entity.sprite.setAlpha(
        Phaser.Math.Clamp(
          (entity.baseAlpha + pulse * 0.06 + proximityGlow) * alphaMultiplier,
          0,
          1,
        ),
      );

      // Slow rotation for celestial bodies
      if (entity.rotationSpeed) {
        entity.sprite.rotation += entity.rotationSpeed;
      }

      // Collect anchor stars for constellation asterisms
      if (
        this.config.density.constellations &&
        entity.type === "star" &&
        entity.layerDepth >= 0.75 &&
        screenY >= 0 &&
        screenY <= viewHeight &&
        screenX >= 0 &&
        screenX <= viewWidth
      ) {
        visibleStarsForConstellations.push({ x: screenX, y: screenY });
      }
    }

    // 5. Draw Ethereal Constellation Lines between nearby anchor stars
    this.drawConstellations(visibleStarsForConstellations);

    // 6. Update Shooting Stars
    this.updateShootingStars(dt);

    // 7. Periodically emit telemetry to React HUD
    if (time - this.lastStatsUpdate > 200) {
      this.lastStatsUpdate = time;
      this.emitStats();
    }
  }

  private drawConstellations(stars: { x: number; y: number }[]): void {
    if (!this.constellationGraphics) return;
    this.constellationGraphics.clear();
    if (!this.config.density.constellations || stars.length < 2) return;

    const maxDistance = 140;
    const theme = COSMIC_THEMES[this.config.theme] || COSMIC_THEMES.aurora;
    const lineColor = theme.starColors[1] || theme.orbColors[0];

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const p1 = stars[i];
        const p2 = stars[j];
        const dist = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.22;
          this.constellationGraphics.lineStyle(1.0, lineColor, alpha);
          this.constellationGraphics.beginPath();
          this.constellationGraphics.moveTo(p1.x, p1.y);
          this.constellationGraphics.lineTo(p2.x, p2.y);
          this.constellationGraphics.strokePath();
        }
      }
    }
  }

  private updateShootingStars(dt: number): void {
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.life += dt * 1000;
      ss.sprite.x += ss.vx * dt;
      ss.sprite.y += ss.vy * dt;

      const progress = ss.life / ss.maxLife;
      if (progress < 0.2) {
        ss.sprite.setAlpha(progress / 0.2);
      } else {
        ss.sprite.setAlpha(1 - (progress - 0.2) / 0.8);
      }

      if (ss.life >= ss.maxLife) {
        ss.sprite.destroy();
        this.shootingStars.splice(i, 1);
      }
    }
  }

  private emitStats(): void {
    if (!this.statsCallback) return;

    // Convert pixel distance to Light Years
    const lightYears = (this.totalDistancePixels / 240) * 0.042;
    const speedKmS = Math.abs(this.currentScrollVelocity) * 1240;

    const sectors = [
      "Andromeda Rift",
      "Cygnus Nebula",
      "Orion Expanse",
      "Pleiades Veil",
      "Cassiopeia Deep",
      "Elysium Void",
    ];
    const sectorIndex = Math.floor(
      (this.totalDistancePixels / 1400) % sectors.length,
    );

    this.statsCallback({
      lightYearsTraveled: Number(lightYears.toFixed(2)),
      speedKmS: Math.floor(speedKmS),
      starsEncountered: Math.floor(this.totalDistancePixels * 0.55) + 1380,
      orbsDiscovered: Math.floor(this.totalDistancePixels * 0.02) + 4,
      currentSector: sectors[sectorIndex],
    });
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    if (!this.isReady || !this.cameras?.main) return;
    const width = gameSize.width;
    const height = gameSize.height;

    this.cameras.main.setSize(width, height);
    this.drawBackground();
  }
}
