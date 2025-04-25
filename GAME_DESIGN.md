# Spell Drawing Game - Design Document

## 1. Core Concept

A mobile game built with React Native and Expo where players cast magic spells by drawing shapes and symbols on the screen. The core mechanic involves analyzing the geometry and motion of the user's drawing to determine the type, power, and characteristics of the resulting spell. The system aims to provide players with a high degree of freedom and expressiveness in spell creation.

## 2. Target Platform & Key Technologies

- **Platform:** Mobile (iOS & Android) via React Native / Expo
- **Rendering & VFX:** `@shopify/react-native-skia` (for drawing input feedback, dynamic spell visuals, shaders, particles)
- **Animation:** `react-native-reanimated` (for spell animations, UI effects, potentially game loop)
- **Input & Gestures:** `react-native-gesture-handler` (for capturing drawing input, detecting multi-touch, gesture states)
- **State Management:** Zustand or React Context + `useReducer` (for game state like mana, cooldowns, encounter status)
- **Physics (Optional):** `matter-js` (if complex physics interactions are needed later)
- **Game Loop:** Custom loop via `useFrameCallback` (Reanimated) or `react-native-game-engine` (especially if ECS becomes beneficial)
- **Navigation:** `react-navigation` or `expo-router`
- **Audio:** `expo-av`

## 3. Proposed Project Structure

your-spell-game/
├── assets/
│ ├── images/ # Spell icons, particle textures, enemy sprites, hand animations
│ ├── sounds/ # Spell sounds, impacts, UI sounds
│ ├── skia/ # Pre-compiled shaders (.glsl), Skia-specific assets
│ └── data/ # Spell definitions, enemy stats, encounter data
├── src/
│ ├── components/
│ │ ├── ui/ # Buttons, HUD elements (mana bar, health bar)
│ │ ├── game/ # PlayerHandDisplay, EnemyDisplay, SpellCastButton
│ │ ├── vfx/ # Reusable Skia components (ParticleEmitter, ShaderEffect, DynamicPathRenderer)
│ │ └── input/ # DrawingInputArea.tsx (integrates gesture + skia canvas)
│ ├── core/
│ │ ├── drawing/ # Core drawing analysis logic
│ │ │ ├── path-processor.ts # Simplification, smoothing, stroke management
│ │ │ ├── feature-extractor.ts # Length, corners, curvature, speed, bbox, retracing detection etc.
│ │ │ ├── shape-recognizer.ts # ($1/$N recognizer or similar - optional)
│ │ │ ├── multi-touch-processor.ts # Handles two-finger input analysis
│ │ │ └── spell-generator.ts # Maps features to SpellDefinition
│ │ ├── encounters/ # Logic for managing enemy encounters
│ │ ├── spells/ # Base spell definitions, effect logic
│ │ └── engine/ # Game loop logic / System management (if using game-engine)
│ ├── hooks/ # useDrawingInput, useSpellGeneration, useGameLoop, useCooldown
│ ├── navigation/
│ ├── screens/ # EncounterScreen, SpellbookScreen, MainMenuScreen
│ ├── services/ # External API calls (if any)
│ ├── state/ # Zustand store or Context providers/reducers
│ ├── types/ # PathData, Stroke, DrawingFeatures, SpellDefinition, GameState interfaces
│ ├── utils/ # Helper functions, constants
│ └── config/ # Game balance constants, animation durations, thresholds
├── App.tsx # Main entry point
├── .cursorrules # Cursor configuration
├── GAME_DESIGN.md # This file
├── babel.config.js
├── package.json
└── tsconfig.json

## 4. Core Mechanic: Spell Drawing Input

### 4.1. Input Capture & Feedback

- Use `PanGestureHandler` to capture continuous touch points.
- Use `@shopify/react-native-skia` (`Canvas`, `Path`) to render the user's drawing path(s) live for immediate visual feedback.

### 4.2. Path Processing Pipeline

1. **Capture Points:** Store raw points from gesture events. Manage multiple strokes if the user lifts their finger. Handle simultaneous paths for multi-touch.
2. **Simplify Path:** Use algorithms like Ramer-Douglas-Peucker (`simplify-js`) to reduce noise and irrelevant points while preserving shape.
3. **Feature Extraction:** Analyze the simplified path(s) to calculate:
   - **Basic Metrics:** Total length, bounding box (size, aspect ratio), duration, average/peak speed.
   - **Shape Properties:** Number of corners/vertices, average/max curvature, self-intersections.
   - **Stroke Properties:** Number of strokes, start/end points per stroke.
   - **Retracing Detection:** Identify and quantify segments drawn over previous parts of the _same_ stroke.
   - **Multi-Touch Features:** Number of active pointers, distance/relation between simultaneous paths.
4. **Shape Recognition (Optional):** Use algorithms like `$1` or `$N` recognizer to classify the drawing into predefined basic shapes or symbols (line, circle, triangle, etc.).

### 4.3. Input Variations & Detection

- **Single Stroke:** Standard continuous drawing until `State.END`.
- **Multi-Stroke:** Detect `State.END` followed by `State.BEGIN` within a timeout. Store strokes as an array. Analyze individually and/or combined.
- **Retracing:** During a single stroke, check if recent segments are close to and moving opposite to previous segments. Quantify the length/duration of retracing.
- **Two Fingers:** Check `event.numberOfPointers`. Track and analyze two paths simultaneously, including their spatial relationship.

## 5. Core Mechanic: Geometry-to-Spell Mapping

Translate extracted geometric features and input variations into spell characteristics. This requires significant tuning and design.

### 5.1. General Principles

- **Shape/Symbol -> Base Type:** Basic recognized shapes or overall path characteristics (jagged, smooth, closed) determine the spell category (e.g., bolt, shield, wave).
- **Size/Length -> Magnitude/Area:** Larger drawings generally mean bigger effects or more power.
- **Speed/Acceleration -> Intensity/Element:** Drawing speed can influence power or elemental affinity (e.g., fast = lightning/fire).
- **Complexity/Strokes -> Mana Cost/Modifiers:** More complex drawings (more points, strokes, intersections) increase cost or add secondary effects.
- **Retracing -> Charging/Modification:** Going over lines can amplify effects, change properties, or increase cost.
- **Multi-Touch -> Amplification/Combination:** Two-finger input can create powerful combined effects or significantly amplify single effects.

### 5.2. Spell Category Examples

- **Elemental (Fire, Water, Air, Earth, Lightning, Ice):**
  - _Fire:_ Sharp angles, jagged, fast. Retracing = intensity.
  - _Water:_ Smooth curves, flowing. Loops = area effect.
  - _Air:_ Open curves, spirals, very fast, possibly disconnected strokes.
  - _Earth:_ Straight lines, right angles, slow speed. Retracing = density.
  - _Lightning:_ Very fast, sharp zigzags. Multi-touch = forked.
  - _Ice:_ Smooth curves ending sharp, or slow retracing on water path.
- **Illusion:**
  - _Complexity:_ High intersections, many strokes.
  - _Instability:_ High variance in speed, near-miss connections, imperfect retracing.
  - _Symbolism:_ Recognized shapes (eye, mirror).
  - _Asymmetry (Multi-Touch):_ Deliberately mismatched shapes.
- **Raw Magic (Energy):**
  - _Simplicity & Speed:_ Fast, straight lines or basic shapes.
  - _Scale:_ Size directly determines power/area.
  - _Retracing:_ Amplifies power significantly, adds cost/instability.
  - _Multi-Touch:_ Converging lines or shapes = focused power.
- **Fear / Psychic:**
  - _Chaos:_ Erratic, jagged, inconsistent speed.
  - _Symbolism:_ Aggressively drawn sharp shapes (claws, spikes).
  - _Directionality:_ Drawing _towards_ the target.
  - _Abruptness:_ Sudden stops or changes in direction.
- **Barrier / Abjuration:**
  - _Enclosure:_ Closed shapes (circle, square, loop). Accuracy matters.
  - _Size & Location:_ Determines barrier placement/size.
  - _Strength/Duration:_ Slow drawing speed or retracing boundary increases HP/duration.
  - _Wall (Multi-Touch):_ Parallel lines drawn simultaneously.
  - _Layering (Multi-Stroke):_ Concentric closed shapes.

## 6. Visual Feedback

- **Crucial:** Provide immediate visual feedback during drawing.
  - Render the path live using Skia.
  - Potentially change path color/thickness based on detected speed or element affinity in real-time.
  - Show visual cues for retracing or multi-touch detection.
  - Clear VFX upon spell generation/casting.

## 7. Challenges & Considerations

- **Performance:** Real-time path analysis and Skia rendering must be optimized. Offload work from the JS thread where possible (Reanimated Worklets).
- **Tuning & Balancing:** Defining the rules mapping geometry to spells requires extensive iteration and playtesting.
- **Learnability:** The system needs to be discoverable. How will players learn to create specific effects? (e.g., spellbook, tutorials, intuitive feedback).
- **Recognition Ambiguity:** How to handle drawings that are unclear or could match multiple spell types? Prioritize? Allow player choice? Default to raw magic?
- **Input Precision:** Touch input isn't perfectly precise. Algorithms need to be robust against minor variations and jitter.

---

_This document should be updated as development progresses and design decisions evolve._
