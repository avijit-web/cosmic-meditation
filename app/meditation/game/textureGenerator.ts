import Phaser from 'phaser';

/**
 * Generates all custom procedural high-resolution textures needed for the realistic universe.
 */
export function generateCosmicTextures(scene: Phaser.Scene): void {
  const textures = scene.textures;

  // 1. Neon Glowing Light Orbs (Various sizes and styles)
  createNeonOrbTexture(textures, 'orb_cyan', 140, 0, 245, 255);
  createNeonOrbTexture(textures, 'orb_magenta', 140, 255, 20, 210);
  createNeonOrbTexture(textures, 'orb_violet', 140, 180, 50, 255);
  createNeonOrbTexture(textures, 'orb_emerald', 140, 0, 255, 180);
  createNeonOrbTexture(textures, 'orb_gold', 140, 255, 210, 50);
  createNeonOrbTexture(textures, 'orb_white', 140, 255, 255, 255);

  // 2. Realistic Stars with Softened Diffraction Spikes
  createDiffractionStarTexture(textures, 'star_bright', 80, 255, 255, 255);
  createDiffractionStarTexture(textures, 'star_blue', 80, 160, 230, 255);
  createDiffractionStarTexture(textures, 'star_gold', 80, 255, 225, 140);
  createSoftStarDotTexture(textures, 'star_dot', 36);

  // 3. Volumetric Nebula Cloud Puffs (Vivid cosmic gases)
  createNebulaCloudTexture(textures, 'nebula_cyan', 280, 0, 220, 255);
  createNebulaCloudTexture(textures, 'nebula_violet', 280, 170, 40, 255);
  createNebulaCloudTexture(textures, 'nebula_magenta', 280, 255, 30, 180);
  createNebulaCloudTexture(textures, 'nebula_emerald', 280, 0, 255, 160);
  createNebulaCloudTexture(textures, 'nebula_amber', 280, 255, 150, 30);

  // 4. Spiral Galaxies with Brilliant Luminous Cores
  createSpiralGalaxyTexture(textures, 'galaxy_spiral_blue', 280, 0x00f0ff, 0xa855f7);
  createSpiralGalaxyTexture(textures, 'galaxy_spiral_rose', 280, 0xff2a85, 0xffbe76);
  createSpiralGalaxyTexture(textures, 'galaxy_spiral_emerald', 280, 0x00f5d4, 0x70e000);
  createSpiralGalaxyTexture(textures, 'galaxy_spiral_gold', 280, 0xffd166, 0xff007f);
  createSpiralGalaxyTexture(textures, 'galaxy_spiral_violet', 280, 0xd946ef, 0x3b82f6);

  // 5. Ringed Celestial Gas Giants with Atmospheric Cloud Bands & Vivid Halos (Generous 280px canvas ensuring zero clipping)
  createRingedPlanetTexture(textures, 'planet_ringed_blue', 280, '#0a2342', '#0077b6', '#00f0ff', '#90e0ef');
  createRingedPlanetTexture(textures, 'planet_ringed_violet', 280, '#2e1065', '#7c3aed', '#f43f5e', '#c084fc');
  createRingedPlanetTexture(textures, 'planet_ringed_amber', 280, '#451a03', '#ea580c', '#fbbf24', '#fde047');
  createRingedPlanetTexture(textures, 'planet_ringed_emerald', 280, '#022c22', '#059669', '#34d399', '#a7f3d0');

  // 6. Terrestrial & Luminous Moons with Surface Textures
  createLuminousMoonTexture(textures, 'moon_ethereal', 150, '#ecfdf5', '#10b981', '#064e3b');
  createLuminousMoonTexture(textures, 'moon_sapphire', 150, '#e0f2fe', '#0ea5e9', '#0369a1');
  createLuminousMoonTexture(textures, 'moon_golden', 150, '#fef9c3', '#eab308', '#854d0e');
  createLuminousMoonTexture(textures, 'moon_crimson', 150, '#ffe4e6', '#f43f5e', '#9f1239');

  // 7. Interactive Starlight Pulse / Ripple Ring
  createRippleRingTexture(textures, 'pulse_ring', 140);

  // 8. Cosmic Dust Particle
  createCosmicDustTexture(textures, 'cosmic_dust', 16);

  // 9. Pulsar Radiation Beam
  createPulsarBeamTexture(textures, 'pulsar_beam', 32, 200);
}

function createNeonOrbTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number,
  r: number,
  g: number,
  b: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const radius = size / 2;

  // 1. Broad vibrant ambient aura
  const outerGrad = ctx.createRadialGradient(center, center, 0, center, center, radius);
  outerGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.95)`);
  outerGrad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 0.65)`);
  outerGrad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.25)`);
  outerGrad.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, 0.05)`);
  outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Concentric radiant neon corona rings
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = `rgba(255, 255, 255, 0.75)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.38, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Brilliant white-hot stellar core
  const coreGrad = ctx.createRadialGradient(center, center, 0, center, center, radius * 0.34);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.35, '#ffffff');
  coreGrad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.95)`);
  coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(center, center, radius * 0.34, 0, Math.PI * 2);
  ctx.fill();

  textures.addCanvas(key, canvas);
}

function createDiffractionStarTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number,
  r: number,
  g: number,
  b: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;

  // Soft spherical glow
  const grad = ctx.createRadialGradient(center, center, 0, center, center, size * 0.42);
  grad.addColorStop(0, `rgba(255, 255, 255, 1)`);
  grad.addColorStop(0.12, `rgba(${r}, ${g}, ${b}, 0.85)`);
  grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.25)`);
  grad.addColorStop(0.70, `rgba(${r}, ${g}, ${b}, 0.05)`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Soft, refined 4-point primary diffraction spikes with tapered alpha (stops short of edges)
  const spikeGradH = ctx.createLinearGradient(size * 0.15, center, size * 0.85, center);
  spikeGradH.addColorStop(0, 'rgba(255, 255, 255, 0)');
  spikeGradH.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.3)`);
  spikeGradH.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
  spikeGradH.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.3)`);
  spikeGradH.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.strokeStyle = spikeGradH;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, center);
  ctx.lineTo(size * 0.85, center);
  ctx.stroke();

  const spikeGradV = ctx.createLinearGradient(center, size * 0.15, center, size * 0.85);
  spikeGradV.addColorStop(0, 'rgba(255, 255, 255, 0)');
  spikeGradV.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.3)`);
  spikeGradV.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
  spikeGradV.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.3)`);
  spikeGradV.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.strokeStyle = spikeGradV;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(center, size * 0.15);
  ctx.lineTo(center, size * 0.85);
  ctx.stroke();

  textures.addCanvas(key, canvas);
}

function createSoftStarDotTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const grad = ctx.createRadialGradient(center, center, 0, center, center, size / 2);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, 'rgba(230, 245, 255, 0.95)');
  grad.addColorStop(0.65, 'rgba(180, 220, 255, 0.45)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, size / 2, 0, Math.PI * 2);
  ctx.fill();

  textures.addCanvas(key, canvas);
}

function createNebulaCloudTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number,
  r: number,
  g: number,
  b: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;

  // Composite organic rich volumetric cloud puffs
  for (let i = 0; i < 5; i++) {
    const ox = center + (Math.sin(i * 1.3) * size * 0.18);
    const oy = center + (Math.cos(i * 1.3) * size * 0.18);
    const rad = size * (0.38 + (i * 0.04));

    const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.42)`);
    grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.28)`);
    grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.10)`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ox, oy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  textures.addCanvas(key, canvas);
}

function createSpiralGalaxyTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number,
  primaryColor: number,
  secondaryColor: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const maxRadius = size * 0.46;

  const pHex = Phaser.Display.Color.IntegerToColor(primaryColor);
  const sHex = Phaser.Display.Color.IntegerToColor(secondaryColor);

  // 1. Radiant luminous galactic bulge & core
  const coreGrad = ctx.createRadialGradient(center, center, 0, center, center, maxRadius * 0.32);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.2, '#ffffff');
  coreGrad.addColorStop(0.45, `rgba(${pHex.red}, ${pHex.green}, ${pHex.blue}, 0.95)`);
  coreGrad.addColorStop(0.75, `rgba(${sHex.red}, ${sHex.green}, ${sHex.blue}, 0.55)`);
  coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(center, center, maxRadius * 0.32, 0, Math.PI * 2);
  ctx.fill();

  // 2. Dense, swirling spiral arms with multi-colored stardust clusters
  const arms = 2;
  const pointsPerArm = 550;

  for (let arm = 0; arm < arms; arm++) {
    const armAngleOffset = (arm * Math.PI * 2) / arms;

    for (let i = 0; i < pointsPerArm; i++) {
      const progress = i / pointsPerArm;
      const angle = armAngleOffset + progress * Math.PI * 3.6;
      const distance = Math.pow(progress, 0.82) * maxRadius;

      // Add radial scatter to give volume to arms
      const scatterX = (Math.random() - 0.5) * distance * 0.38;
      const scatterY = (Math.random() - 0.5) * distance * 0.38;

      const px = center + Math.cos(angle) * distance + scatterX;
      const py = center + Math.sin(angle) * distance * 0.68 + scatterY; // slight elliptical perspective tilt

      const alpha = Math.max(0.08, (1 - progress * 0.75) * 0.85);
      const dotSize = Math.max(0.6, (1 - progress) * 2.6 + Math.random() * 1.5);

      const colorRoll = Math.random();
      let color = pHex;
      if (colorRoll > 0.6) {
        color = sHex;
      } else if (colorRoll > 0.4) {
        color = { red: 255, green: 255, blue: 255, alpha: 1 } as Phaser.Display.Color;
      }

      ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  textures.addCanvas(key, canvas);
}

function createRingedPlanetTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number,
  colorDark: string,
  colorMid: string,
  colorBright: string,
  glowColor: string
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const planetRadius = size * 0.22;
  const ringTilt = -0.30; // ~17 degree elegant astronomical tilt
  const ringSquash = 0.28; // 3D perspective foreshortening

  // --- Helper to draw complete Saturn-style concentric ring system ---
  const drawRings = (startAngle: number, endAngle: number, isFront: boolean) => {
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(ringTilt);
    ctx.scale(1, ringSquash);

    // 1. Broad Outer Ring A
    ctx.beginPath();
    ctx.arc(0, 0, planetRadius * 2.25, startAngle, endAngle);
    ctx.lineWidth = planetRadius * 0.32;
    ctx.strokeStyle = isFront ? 'rgba(215, 225, 245, 0.65)' : 'rgba(180, 195, 220, 0.50)';
    ctx.stroke();

    // 2. Cassini Division Gap (subtle dark line in between A and B)
    ctx.beginPath();
    ctx.arc(0, 0, planetRadius * 1.96, startAngle, endAngle);
    ctx.lineWidth = planetRadius * 0.08;
    ctx.strokeStyle = isFront ? 'rgba(10, 14, 26, 0.70)' : 'rgba(5, 8, 15, 0.85)';
    ctx.stroke();

    // 3. Dense, Brilliant Main Ring B
    ctx.beginPath();
    ctx.arc(0, 0, planetRadius * 1.70, startAngle, endAngle);
    ctx.lineWidth = planetRadius * 0.40;
    ctx.strokeStyle = isFront ? 'rgba(255, 255, 255, 0.85)' : 'rgba(230, 235, 250, 0.70)';
    ctx.stroke();

    // 4. Delicate Inner Crepe Ring C
    ctx.beginPath();
    ctx.arc(0, 0, planetRadius * 1.32, startAngle, endAngle);
    ctx.lineWidth = planetRadius * 0.22;
    ctx.strokeStyle = isFront ? 'rgba(190, 210, 240, 0.40)' : 'rgba(150, 175, 210, 0.30)';
    ctx.stroke();

    ctx.restore();
  };

  // 1. BACK RINGS (Angles from PI to 2*PI: top half of ellipse behind the planet)
  drawRings(Math.PI, Math.PI * 2, false);

  // Soft shadow cast by planet onto the back rings
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(ringTilt);
  ctx.scale(1, ringSquash);
  const shadowGrad = ctx.createLinearGradient(0, 0, planetRadius * 1.6, -planetRadius * 1.8);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, planetRadius * 2.45, Math.PI * 1.05, Math.PI * 1.55);
  ctx.lineTo(0, 0);
  ctx.fill();
  ctx.restore();

  // 2. PLANET SPHERE (Solid 3D body with aligned atmospheric bands)
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, planetRadius, 0, Math.PI * 2);
  ctx.clip();

  // 3D Sphere Spherical Illumination Gradient (Light source from top-left)
  const sphereGrad = ctx.createRadialGradient(
    center - planetRadius * 0.38,
    center - planetRadius * 0.38,
    planetRadius * 0.04,
    center,
    center,
    planetRadius
  );
  sphereGrad.addColorStop(0, '#ffffff');
  sphereGrad.addColorStop(0.22, colorBright);
  sphereGrad.addColorStop(0.58, colorMid);
  sphereGrad.addColorStop(0.85, colorDark);
  sphereGrad.addColorStop(1, '#02040a');

  ctx.fillStyle = sphereGrad;
  ctx.fillRect(center - planetRadius, center - planetRadius, planetRadius * 2, planetRadius * 2);

  // Atmospheric bands aligned with the ring tilt angle
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(ringTilt);
  ctx.globalAlpha = 0.22;
  const bandCount = 8;
  for (let b = 0; b < bandCount; b++) {
    const bandY = -planetRadius + (b / bandCount) * planetRadius * 2;
    ctx.fillStyle = b % 2 === 0 ? colorBright : colorDark;
    ctx.fillRect(-planetRadius * 1.2, bandY, planetRadius * 2.4, planetRadius * 0.24);
  }
  ctx.restore();

  ctx.restore();

  // 3. ATMOSPHERIC LIMB / CORONA GLOW
  ctx.save();
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(center, center, planetRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. FRONT RINGS (Angles from 0 to PI: bottom half of ellipse in front of the planet)
  drawRings(0, Math.PI, true);

  textures.addCanvas(key, canvas);
}

function createLuminousMoonTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number,
  colorHighlight: string,
  colorMid: string,
  colorShadow: string
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const radius = size * 0.38;

  // 1. Outer radiant lunar halo
  const auraGrad = ctx.createRadialGradient(center, center, radius * 0.7, center, center, size / 2);
  auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  auraGrad.addColorStop(0.5, 'rgba(200, 240, 255, 0.15)');
  auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(center, center, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // 2. High-contrast 3D Lunar Sphere
  const moonGrad = ctx.createRadialGradient(
    center - radius * 0.35,
    center - radius * 0.35,
    radius * 0.05,
    center,
    center,
    radius
  );
  moonGrad.addColorStop(0, colorHighlight);
  moonGrad.addColorStop(0.45, colorMid);
  moonGrad.addColorStop(0.85, colorShadow);
  moonGrad.addColorStop(1, '#02050b');

  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  // 3. Crisp atmospheric rim
  ctx.strokeStyle = colorHighlight;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();

  textures.addCanvas(key, canvas);
}

function createRippleRingTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const radius = size * 0.44;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Soft secondary outer halo
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();

  textures.addCanvas(key, canvas);
}

function createCosmicDustTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  size: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const grad = ctx.createRadialGradient(center, center, 0, center, center, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(180, 230, 255, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, size / 2, 0, Math.PI * 2);
  ctx.fill();

  textures.addCanvas(key, canvas);
}

function createPulsarBeamTexture(
  textures: Phaser.Textures.TextureManager,
  key: string,
  width: number,
  height: number
): void {
  if (textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const grad = ctx.createLinearGradient(width / 2, 0, width / 2, height);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.6)');
  grad.addColorStop(0.8, 'rgba(138, 43, 226, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(width * 0.4, 0);
  ctx.lineTo(width * 0.6, 0);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  textures.addCanvas(key, canvas);
}
