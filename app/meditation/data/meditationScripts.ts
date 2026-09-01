import { MeditationDuration, MeditationScript, MeditationTypeId } from '../types';

export interface MeditationTypeInfo {
  id: MeditationTypeId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
}

export const MEDITATION_TYPES: Record<MeditationTypeId, MeditationTypeInfo> = {
  observer: {
    id: 'observer',
    name: 'Observer',
    subtitle: 'Cognitive Defusion & Mindfulness',
    description:
      "This stance comes from mindfulness and what therapists call cognitive defusion: instead of taking a thought like 'I'm a failure' as fact, you watch it pass like a cloud. You don't have to argue with it or believe it, and seeing it arrive and leave is proof that a thought is temporary and doesn't define you.",
    icon: '🧘',
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic',
    subtitle: 'Universal Perspective & Expansive Calm',
    description:
      'This perspective draws from cosmic stillness: seeing our worries framed against billions of stars and billions of years. In the vastness of the universe, our heavy burdens become weightless specks of stardust that can be peacefully released into infinity.',
    icon: '🌌',
  },
};

/**
 * 4 Complete Guided Scripts:
 * 1. Observer - 60s (1 min)
 * 2. Observer - 120s (2 min)
 * 3. Cosmic - 60s (1 min)
 * 4. Cosmic - 120s (2 min)
 */
export const MEDITATION_SCRIPTS: Record<`${MeditationTypeId}_${MeditationDuration}`, MeditationScript> = {
  // 1. Observer 60s
  observer_60: {
    typeId: 'observer',
    duration: 60,
    title: 'Observer • 1 Minute Defusion',
    steps: [
      {
        atSecond: 0,
        text: 'Take a deep breath in....',
        subText: 'Fill your lungs gently with calm air',
        breathPhase: 'inhale',
        orbScale: 1.0,
        orbAlpha: 1.0,
      },
      {
        atSecond: 6,
        text: '....and breathe out',
        subText: 'Release any physical tension from your shoulders',
        breathPhase: 'exhale',
        orbScale: 0.95,
        orbAlpha: 0.98,
      },
      {
        atSecond: 13,
        text: 'Notice your thought sitting inside the star',
        subText: 'You are not your thought. You are the observer aware of it.',
        breathPhase: 'reflect',
        orbScale: 0.82,
        orbAlpha: 0.95,
      },
      {
        atSecond: 22,
        text: 'Take another slow breath in....',
        subText: 'Watching the thought without judgment or struggle',
        breathPhase: 'inhale',
        orbScale: 0.68,
        orbAlpha: 0.90,
      },
      {
        atSecond: 28,
        text: '....and gently let it go',
        subText: 'As you exhale, notice the star gently drifting further away',
        breathPhase: 'exhale',
        orbScale: 0.52,
        orbAlpha: 0.85,
      },
      {
        atSecond: 37,
        text: 'Thoughts come, and thoughts go.',
        subText: 'Like clouds in the sky, or stars in the endless night.',
        breathPhase: 'reflect',
        orbScale: 0.36,
        orbAlpha: 0.75,
      },
      {
        atSecond: 46,
        text: 'Take a gentle breath in....',
        subText: 'Feeling your own grounded presence right now',
        breathPhase: 'inhale',
        orbScale: 0.22,
        orbAlpha: 0.65,
      },
      {
        atSecond: 52,
        text: '....and breathe out peacefully',
        subText: 'Watching the star shrink to a quiet speck of light',
        breathPhase: 'exhale',
        orbScale: 0.08,
        orbAlpha: 0.40,
      },
      {
        atSecond: 58,
        text: 'Your thought dissolves into the cosmos.',
        subText: 'You are calm, free, and present.',
        breathPhase: 'reflect',
        orbScale: 0.0,
        orbAlpha: 0.0,
      },
    ],
  },

  // 2. Observer 120s
  observer_120: {
    typeId: 'observer',
    duration: 120,
    title: 'Observer • 2 Minute Deep Defusion',
    steps: [
      {
        atSecond: 0,
        text: 'Take a deep, slow breath in....',
        subText: 'Let your chest and belly expand with ease',
        breathPhase: 'inhale',
        orbScale: 1.0,
        orbAlpha: 1.0,
      },
      {
        atSecond: 8,
        text: '....and gently breathe out',
        subText: 'Let your body soften into the moment',
        breathPhase: 'exhale',
        orbScale: 0.96,
        orbAlpha: 0.98,
      },
      {
        atSecond: 16,
        text: 'Look at the thought resting inside the star',
        subText: 'Acknowledge it simply as mental activity, nothing more.',
        breathPhase: 'reflect',
        orbScale: 0.90,
        orbAlpha: 0.96,
      },
      {
        atSecond: 26,
        text: 'Take a calm breath in....',
        subText: 'Creating space around this thought',
        breathPhase: 'inhale',
        orbScale: 0.82,
        orbAlpha: 0.94,
      },
      {
        atSecond: 34,
        text: '....and breathe out smoothly',
        subText: 'You do not have to fight this thought or believe it.',
        breathPhase: 'exhale',
        orbScale: 0.74,
        orbAlpha: 0.90,
      },
      {
        atSecond: 44,
        text: 'You are the sky, not the weather.',
        subText: 'The sky remains untouched by whatever clouds pass through.',
        breathPhase: 'reflect',
        orbScale: 0.65,
        orbAlpha: 0.86,
      },
      {
        atSecond: 55,
        text: 'Breathe in peace....',
        subText: 'Drawing in stillness from the quiet space around you',
        breathPhase: 'inhale',
        orbScale: 0.55,
        orbAlpha: 0.80,
      },
      {
        atSecond: 63,
        text: '....and breathe out release',
        subText: 'Notice how the star is now noticeably smaller in distance.',
        breathPhase: 'exhale',
        orbScale: 0.45,
        orbAlpha: 0.75,
      },
      {
        atSecond: 74,
        text: 'This thought does not control you.',
        subText: 'It is simply a temporary event in your awareness.',
        breathPhase: 'reflect',
        orbScale: 0.35,
        orbAlpha: 0.68,
      },
      {
        atSecond: 86,
        text: 'Take a deep breath in....',
        subText: 'Feeling the clarity and space in your mind',
        breathPhase: 'inhale',
        orbScale: 0.25,
        orbAlpha: 0.60,
      },
      {
        atSecond: 94,
        text: '....and let it all go',
        subText: 'The star is becoming a tiny twinkling light in the vast field.',
        breathPhase: 'exhale',
        orbScale: 0.16,
        orbAlpha: 0.50,
      },
      {
        atSecond: 106,
        text: 'A thought is only a thought.',
        subText: 'It has no weight here in the infinite quiet.',
        breathPhase: 'reflect',
        orbScale: 0.06,
        orbAlpha: 0.30,
      },
      {
        atSecond: 116,
        text: 'The star vanishes into the cosmos.',
        subText: 'Rest here in this peaceful stillness.',
        breathPhase: 'reflect',
        orbScale: 0.0,
        orbAlpha: 0.0,
      },
    ],
  },

  // 3. Cosmic 60s
  cosmic_60: {
    typeId: 'cosmic',
    duration: 60,
    title: 'Cosmic • 1 Minute Perspective',
    steps: [
      {
        atSecond: 0,
        text: 'Take a deep breath in....',
        subText: 'You are breathing in stardust billions of years old',
        breathPhase: 'inhale',
        orbScale: 1.0,
        orbAlpha: 1.0,
      },
      {
        atSecond: 6,
        text: '....and breathe out into the dark',
        subText: 'Letting your focus expand outward to the stars',
        breathPhase: 'exhale',
        orbScale: 0.95,
        orbAlpha: 0.98,
      },
      {
        atSecond: 13,
        text: 'This Earth has existed for 4.5 billion years.',
        subText: 'It has held trillions of moments and countless quiet days.',
        breathPhase: 'reflect',
        orbScale: 0.82,
        orbAlpha: 0.94,
      },
      {
        atSecond: 22,
        text: 'Take another slow breath in....',
        subText: 'In a galaxy of 200 billion stars',
        breathPhase: 'inhale',
        orbScale: 0.66,
        orbAlpha: 0.88,
      },
      {
        atSecond: 28,
        text: '....and breathe out',
        subText: 'In an observable universe of 2 trillion galaxies',
        breathPhase: 'exhale',
        orbScale: 0.50,
        orbAlpha: 0.82,
      },
      {
        atSecond: 37,
        text: 'This worry is so small against eternity.',
        subText: 'It does not define the greatness of your life.',
        breathPhase: 'reflect',
        orbScale: 0.34,
        orbAlpha: 0.70,
      },
      {
        atSecond: 46,
        text: 'Inhale deep universal calm....',
        subText: 'You are a tiny, precious part of something magnificent',
        breathPhase: 'inhale',
        orbScale: 0.20,
        orbAlpha: 0.55,
      },
      {
        atSecond: 52,
        text: '....and exhale smoothly',
        subText: 'Watching the thought shrink into the cosmic void',
        breathPhase: 'exhale',
        orbScale: 0.06,
        orbAlpha: 0.35,
      },
      {
        atSecond: 58,
        text: 'Life is much bigger than this moment.',
        subText: 'Everything is okay. You are here.',
        breathPhase: 'reflect',
        orbScale: 0.0,
        orbAlpha: 0.0,
      },
    ],
  },

  // 4. Cosmic 120s
  cosmic_120: {
    typeId: 'cosmic',
    duration: 120,
    title: 'Cosmic • 2 Minute Deep Perspective',
    steps: [
      {
        atSecond: 0,
        text: 'Take a deep breath in....',
        subText: 'The atoms in your body were forged inside dying stars',
        breathPhase: 'inhale',
        orbScale: 1.0,
        orbAlpha: 1.0,
      },
      {
        atSecond: 8,
        text: '....and exhale slowly into space',
        subText: 'Surrender this moment to the stillness of the cosmos',
        breathPhase: 'exhale',
        orbScale: 0.96,
        orbAlpha: 0.98,
      },
      {
        atSecond: 16,
        text: 'Consider the ancient silence of the stars',
        subText: 'They have shone quietly for eons, undisturbed by human worry.',
        breathPhase: 'reflect',
        orbScale: 0.88,
        orbAlpha: 0.95,
      },
      {
        atSecond: 26,
        text: 'Take a slow, deep breath in....',
        subText: 'Expanding your awareness across millions of light-years',
        breathPhase: 'inhale',
        orbScale: 0.80,
        orbAlpha: 0.92,
      },
      {
        atSecond: 34,
        text: '....and gently release',
        subText: 'Watch your thought begin its journey into deep space',
        breathPhase: 'exhale',
        orbScale: 0.70,
        orbAlpha: 0.88,
      },
      {
        atSecond: 44,
        text: 'Our planet is a pale blue dot in a vast cosmic sea.',
        subText: 'Every triumph, every heartache, every burden resides on this tiny speck.',
        breathPhase: 'reflect',
        orbScale: 0.60,
        orbAlpha: 0.82,
      },
      {
        atSecond: 56,
        text: 'Breathe in the calm of deep space....',
        subText: 'Feel how spacious and quiet the universe truly is',
        breathPhase: 'inhale',
        orbScale: 0.50,
        orbAlpha: 0.76,
      },
      {
        atSecond: 64,
        text: '....and breathe out',
        subText: 'The thought is shrinking, surrounded by billions of gentle stars.',
        breathPhase: 'exhale',
        orbScale: 0.40,
        orbAlpha: 0.70,
      },
      {
        atSecond: 75,
        text: 'Whatever felt insurmountable is only a passing speck of time.',
        subText: 'You have survived every hard day before this one.',
        breathPhase: 'reflect',
        orbScale: 0.30,
        orbAlpha: 0.62,
      },
      {
        atSecond: 87,
        text: 'Take a gentle, nourishing breath in....',
        subText: 'Filling yourself with lightness and quiet strength',
        breathPhase: 'inhale',
        orbScale: 0.20,
        orbAlpha: 0.52,
      },
      {
        atSecond: 95,
        text: '....and let your breath drift away',
        subText: 'The star is now barely a flicker in the vast cosmic background.',
        breathPhase: 'exhale',
        orbScale: 0.12,
        orbAlpha: 0.40,
      },
      {
        atSecond: 107,
        text: 'You are whole, you are safe, and you are held by the universe.',
        subText: 'Let the final trace of tension dissolve into stardust.',
        breathPhase: 'reflect',
        orbScale: 0.04,
        orbAlpha: 0.25,
      },
      {
        atSecond: 116,
        text: 'The thought has dissolved into infinity.',
        subText: 'Carry this quiet space with you into the rest of your day.',
        breathPhase: 'reflect',
        orbScale: 0.0,
        orbAlpha: 0.0,
      },
    ],
  },
};

export function getMeditationScript(
  typeId: MeditationTypeId,
  duration: MeditationDuration
): MeditationScript {
  const key = `${typeId}_${duration}` as const;
  return MEDITATION_SCRIPTS[key] || MEDITATION_SCRIPTS.observer_60;
}
