import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page_styles/Game2.module.css";

function ActionButton({ text, func, disabled }) {
  return (
    <div className={styles.actionButton}>
      <button
        onClick={func}
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        {text}
      </button>
    </div>
  );
}

const gameItems = {
  food: {
    displayName: "Food",
    description: "Reduces hunger and boosts health",
    craftingRecipe: {},
    effect: { health: +2, hunger: -10 },
  },
  water: {
    displayName: "Water",
    description: "Reduces thirst and boosts health",
    craftingRecipe: {},
    effect: { health: +2, thirst: -10 },
  },
  bandage: {
    displayName: "bandage",
    description: "Reduces bleed and improves health",
    craftingRecipe: {},
    effect: { health: +3, bleed: -10 },
  },
  medkit: {
    displayName: "Med kit",
    description: "Greatly improves health and removes bleed",
    craftingRecipe: { bandage: 2, food: 1, water: 1 },
    effect: { health: +3, bleed: -100 },
  },
  scrap: {
    displayName: "Scrap",
    description: "Improve shelter strength, and use to build tools",
    craftingRecipe: {},
    effect: { shelterStrength: +5 },
  },
  vicodin: {
    displayName: "vicodin",
    description: "Improve strength",
    craftingRecipe: {},
    effect: { strength: +5 },
  },
  radx: {
    displayName: "RAD-X",
    description: "Reduce radiation sickness",
    craftingRecipe: {},
    effect: { radiation: -10 },
  },
  shelterFortifications: {
    displayName: "Shelter Fortifications",
    description: "Greatly improve shelter strength",
    craftingRecipe: { scrap: 5 },
    effect: { shelterStrength: +20 },
    statusEffects: { shelterStrength: +1 },
  },
  radShield: {
    displayName: "Radiation Shield",
    description: "Greatly reduce radiation effect",
    craftingRecipe: { scrap: 5, radx: 5 },
    effect: { radiation: -20 },
    statusEffects: { radiation: +1 },
  },
  timeMachine: {
    displayName: "Time Machine",
    description: "Go back in time and prevent the nuke",
    craftingRecipe: {
      scrap: 100,
      radx: 50,
      radShield: 10,
      vicodin: 50,
      bandage: 50,
      shelterFortifications: 50,
    },
    effect: {},
  },
};

const initialStatusEffects = {
  shelterStrength: {
    displayName: "Permanent Shelter Strength Boost",
    effectOn: "shelter strength",
    description: "Permanently reduce future impact on shelter",
    boost: 0.1,
  },
  enlightened: {
    displayName: "Enlightened Status",
    effectOn: "intelligence",
    description: "Permanently improve luck on future explorations",
    boost: 1,
  },
  radiation: {
    displayName: "Permanent Radiation Effect Reduction",
    effectOn: "radiation impact",
    description: "Permanently reduce the effects of radiation",
    boost: -0.1,
  },
  health: {
    displayName: "Permanent Health Improvements",
    effectOn: "health",
    description: "Permanently reduce the effects of health damage",
    boost: 0.1,
  },
};

const initialGameState = {
  day: 1,
  health: 100,
  hunger: 0,
  thirst: 0,
  radiation: 0,
  bleed: 0,
  strength: 5,
  shelterStrength: 5,
  logs: [
    "You take shelter in a bunker after the nuclear fallout. Everything is silent...",
  ],
  inventory: Object.fromEntries(Object.keys(gameItems).map((key) => [key, 0])),
  statusEffects: Object.fromEntries(
    Object.keys(initialStatusEffects).map((key) => [key, 0])
  ),
};

const gameRules = {
  maxDailyExplorations: 3,
  maxRadiationPunishment: 30,
  maxHungerPunishment: 10,
  maxThirstPunishment: 10,
  nightlyHungerIncrease: 5,
  nightlyThirstIncrease: 5,
  baseRestEventChances: {
    negativeShelterEvents: 0.35,
    positiveShelterEvents: 0.1,
    invadeEvents: 0.35,
    randomWorldEvents: 0.15,
    rareEvents: 0.05,
  },
  bounds: {
    strength: { min: 0, max: 100 },
    shelterStrength: { min: 0, max: 100 },
    health: { min: 0, max: 100 },
  },
  statusEffectBounds: {
    radiation: { min: 0, max: 10 },
    enlightened: { min: 0, max: 1 },
    shelterStrength: { min: 0, max: 10 },
    health: { min: 0, max: 10 },
  },
};

const explorationEvents = {
  burntLibrary: {
    id: "burntLibrary",
    text: "A half-collapsed library smolders nearby.",
    choices: [
      {
        text: "Search the ruins",
        effect: { radiation: 5, scrap: 3 },
        logText: "Books are gone, but broken tech litters the floor.",
      },
      {
        text: "Rest in the shade",
        effect: { health: +5, thirst: +5 },
        logText: "The cool shadow helps you rest, but you grow thirstier.",
      },
    ],
  },

  rustedTruck: {
    id: "rustedTruck",
    text: "A rusted military truck sits half-buried in sand.",
    choices: [
      {
        text: "Pop open the back",
        effect: { vicodin: 1, health: -5 },
        logText: "You cut yourself, but find vicodin in a crate.",
      },
      {
        text: "Search under the hood",
        effect: { scrap: 4 },
        logText: "You yank out wires and panels.",
      },
    ],
  },

  collapsedShack: {
    id: "collapsedShack",
    text: "A wooden shack leans dangerously to one side.",
    choices: [
      {
        text: "Enter cautiously",
        effect: { bandage: 1, health: -3 },
        logText: "A beam falls — but you salvage some bandages.",
      },
      {
        text: "Take the door off its hinges",
        effect: { scrap: 3 },
        logText: "The wood's rotted, but still usable as material.",
      },
    ],
  },

  boneField: {
    id: "boneField",
    text: "An open field is littered with sun-bleached bones.",
    choices: [
      {
        text: "Dig around",
        effect: { food: 1, radiation: 3 },
        logText: "A can of rations lies buried near a corpse.",
      },
      {
        text: "Use it as a shortcut",
        effect: { strength: +2, radiation: +5 },
        logText: "You power through but inhale radioactive dust.",
      },
    ],
  },

  brokenElevator: {
    id: "brokenElevator",
    text: "A mall elevator shaft lies open before you.",
    choices: [
      {
        text: "Climb down the cables",
        effect: { health: -5, radx: 1 },
        logText: "It was risky, but you find RAD-X in a storage room.",
      },
      {
        text: "Search the lobby",
        effect: { food: 1, water: 1 },
        logText: "The food court is looted, but scraps remain.",
      },
    ],
  },

  dryWell: {
    id: "dryWell",
    text: "An old well stands cracked and empty.",
    choices: [
      {
        text: "Shout into the well",
        effect: { strength: +1 },
        logText: "You scream your frustrations into the void. It helps.",
      },
      {
        text: "Climb inside",
        effect: { radiation: 7, scrap: 2 },
        logText: "A small stash was hidden inside — and so was mold.",
      },
    ],
  },

  skeletonWithNote: {
    id: "skeletonWithNote",
    text: "A skeleton sits against a tree, clutching a faded note.",
    choices: [
      {
        text: "Read the note",
        effect: { enlightened: 1 },
        logText: "The final words shift something in you. You feel wiser.",
      },
      {
        text: "Check its pockets",
        effect: { food: 1, water: 1 },
        logText: "You find half a protein bar and a water flask.",
      },
    ],
  },

  floodedBasement: {
    id: "floodedBasement",
    text: "A building basement is flooded with murky water.",
    choices: [
      {
        text: "Wade through it",
        effect: { water: 2, radiation: 10 },
        logText: "You collect some contaminated bottles.",
      },
      {
        text: "Siphon water from the surface",
        effect: { water: 1 },
        logText: "Still gross, but safer than diving in.",
      },
    ],
  },

  lockedLocker: {
    id: "lockedLocker",
    text: "You find a locker sealed shut.",
    choices: [
      {
        text: "Force it open",
        effect: { health: -3, scrap: 2, bandage: 1 },
        logText: "You bust it open with effort — and injure yourself.",
      },
      {
        text: "Leave it be",
        effect: { hunger: +5 },
        logText: "You leave it behind, but the missed opportunity stings.",
      },
    ],
  },

  factoryYard: {
    id: "factoryYard",
    text: "A sprawling factory yard creaks in the wind.",
    choices: [
      {
        text: "Climb the scaffolding",
        effect: { strength: +3, health: -5 },
        logText: "You strengthen your arms — and twist your ankle.",
      },
      {
        text: "Search the dumpsters",
        effect: { scrap: 3, radx: 1 },
        logText: "Rotting metal... and a vial of RAD-X underneath.",
      },
    ],
  },

  scorchedTree: {
    id: "scorchedTree",
    text: "A tree is blackened and twisted from fallout.",
    choices: [
      {
        text: "Collect bark",
        effect: { food: 1 },
        logText: "The bark burns oddly — but it’s edible in a pinch.",
      },
      {
        text: "Rest under it",
        effect: { radiation: 5 },
        logText: "The roots still glow. Not safe at all.",
      },
    ],
  },

  rooftopGarden: {
    id: "rooftopGarden",
    text: "You spot a rooftop garden hidden among debris.",
    choices: [
      {
        text: "Harvest what’s left",
        effect: { food: 2 },
        logText: "A few carrots and herbs are still alive.",
      },
      {
        text: "Dig in the dirt",
        effect: { radx: 1, scrap: 1 },
        logText: "A buried stash contains a single RAD-X dose.",
      },
    ],
  },

  smashedConsole: {
    id: "smashedConsole",
    text: "A glowing console lies cracked in the road.",
    choices: [
      {
        text: "Touch the panel",
        effect: { radiation: 10, vicodin: 1 },
        logText: "Pain shoots through you, but you black out holding vicodin.",
      },
      {
        text: "Smash it further",
        effect: { scrap: 4 },
        logText: "You bash it apart and grab the pieces.",
      },
    ],
  },

  barricadedDoor: {
    id: "barricadedDoor",
    text: "A door is nailed shut with planks and barbed wire.",
    choices: [
      {
        text: "Rip it open",
        effect: { health: -7, food: 2 },
        logText: "You’re bleeding... but there's food inside.",
      },
      {
        text: "Peek through a crack",
        effect: { hunger: +2 },
        logText: "You see supplies, but can't reach them.",
      },
    ],
  },

  powerStation: {
    id: "powerStation",
    text: "A busted power station buzzes with residual energy.",
    choices: [
      {
        text: "Search the control room",
        effect: { radiation: 6, scrap: 5 },
        logText: "You fry your Geiger counter but leave with scrap.",
      },
      {
        text: "Wait for it to cool down",
        effect: { nothing: true },
        logText: "It never does. You waste precious time.",
      },
    ],
  },
};

const restEvents = {
  negativeShelterEvents: {
    waterLeak: {
      id: "waterLeak",
      text: "It rains and irradiated water leaks into your shelter. You are cold and sick.",
      effect: { health: -5, radiation: +5 },
    },
    highWind: {
      id: "highWind",
      text: "High winds blow away parts of your shelter.",
      effect: { shelterStrength: -5 },
    },
    rodentInfestation: {
      id: "rodentInfestation",
      text: "You wake up to find rats chewing your supplies.",
      effect: { food: -2, health: -3 },
    },
    moldOutbreak: {
      id: "moldOutbreak",
      text: "The shelter walls grow slimy with mold.",
      effect: { health: -4 },
    },
    roofCollapse: {
      id: "roofCollapse",
      text: "A section of the ceiling collapses in the night.",
      effect: { shelterStrength: -10, health: -3 },
    },
    gasLeak: {
      id: "gasLeak",
      text: "A chemical smell fills the bunker. You feel dizzy.",
      effect: { health: -6, thirst: +3 },
    },
    bugBiteInfection: {
      id: "bugBiteInfection",
      text: "Something bit you. It's swelling fast.",
      effect: { health: -4, bleed: +2 },
    },
  },
  positiveShelterEvents: {
    wokenByStorm: {
      id: "wokenByStorm",
      text: "Thunder shakes your shelter. You barely sleep.",
      effect: { strength: -2 },
    },
    sleepwalkingAccident: {
      id: "sleepwalkingAccident",
      text: "You wake up with a bruised leg and no memory.",
      effect: { health: -2 },
    },
    calmNight: {
      id: "calmNight",
      text: "Nothing happens. For once, you rest well.",
      effect: { health: +5 },
    },
  },
  invadeEvents: {
    mutantRaid: {
      id: "mutantRaid",
      text: "Something claws at the bunker door. You brace it shut.",
      effect: { shelterStrength: -10, health: -2 },
    },
    scavengerBreakIn: {
      id: "scavengerBreakIn",
      text: "A figure breaks in and grabs supplies before fleeing.",
      effect: { food: -2, water: -2 },
    },
    wildDogAttack: {
      id: "wildDogAttack",
      text: "A pack of wild dogs gnaws at the shelter entrance.",
      effect: { health: -3, shelterStrength: -5 },
    },
    intruderWarning: {
      id: "intruderWarning",
      text: "Footsteps pass near your shelter. You hold your breath.",
      effect: { strength: -1 },
    },
    suppliesPoisoned: {
      id: "suppliesPoisoned",
      text: "A raider slipped something into your food.",
      effect: { food: -1, health: -6 },
    },
    noiseDistraction: {
      id: "noiseDistraction",
      text: "A loud bang outside keeps you awake.",
      effect: { strength: -2 },
    },
    camperDispute: {
      id: "camperDispute",
      text: "Someone demands more food. Tension rises.",
      effect: { food: -1, strength: -1 },
    },
    airFilterFailure: {
      id: "airFilterFailure",
      text: "Your filter malfunctions. You cough through the night.",
      effect: { radiation: +5 },
    },
  },
  randomWorldEvents: {
    tickleMonster: {
      id: "tickleMonster",
      text: "You are visited by the ticklemonster. He is harmless.",
      effect: {},
    },
    radioStatic: {
      id: "radioStatic",
      text: "Faint radio static echoes. You can’t sleep.",
      effect: { strength: -1 },
    },
    strangeDreams: {
      id: "strangeDreams",
      text: "You dream of green fields and blue skies.",
      effect: { health: +2 },
    },
    meteorShower: {
      id: "meteorShower",
      text: "You watch streaks of fire paint the sky.",
      effect: { radiation: +2 },
    },
    coldSnap: {
      id: "coldSnap",
      text: "The temperature drops suddenly. You shiver all night.",
      effect: { health: -5 },
    },
    cometGlimpse: {
      id: "cometGlimpse",
      text: "You glimpse a comet. You feel lucky.",
      effect: { strength: +1 },
    },
    nightWhispers: {
      id: "nightWhispers",
      text: "You hear whispers in the dark. You're unsure if they're real.",
      effect: { strength: -1, enlightened: +1 },
    },
    oldMemories: {
      id: "oldMemories",
      text: "You find a photo from before. It breaks you.",
      effect: { strength: -2 },
    },
    hopefulBirdsong: {
      id: "hopefulBirdsong",
      text: "You hear birds. Maybe life will return.",
      effect: { strength: +2 },
    },
    eerieSilence: {
      id: "eerieSilence",
      text: "Not a sound all night. It's unnerving.",
      effect: { strength: -1 },
    },
  },
  rareEvents: {
    giftFromStranger: {
      id: "giftFromStranger",
      text: "You wake to find a medkit and some food outside.",
      effect: { medkit: +1, food: +3 },
    },
    travelersDiary: {
      id: "travelersDiary",
      text: "You find a hidden journal. It changes your outlook.",
      effect: { enlightened: +1 },
    },
    fungusBloom: {
      id: "fungusBloom",
      text: "Bioluminescent fungus grows on the wall. You harvest it.",
      effect: { food: +2, radiation: +1 },
    },
    ancientTechCache: {
      id: "ancientTechCache",
      text: "You find a sealed crate of pre-war tech.",
      effect: { vicodin: +1, radx: +1, scrap: +2 },
    },
    guardianSpirit: {
      id: "guardianSpirit",
      text: "You feel watched... but protected.",
      effect: { permaShelterStrengthBoost: +1 },
    },
  },
};

const getRandomExplorationEvent = () => {
  const values = Object.values(explorationEvents); // convert object to array
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
};

const getRandomRestEvent = (gameState) => {
  const { strength, shelterStrength } = gameState;

  const base = gameRules.baseRestEventChances;

  // Adjust negative and positive shelter events based on shelterStrength
  const negShelterFactor = 1 - shelterStrength / 100; // Decrease with higher shelter
  const posShelterFactor = 1 + shelterStrength / 100; // Increase with higher shelter

  let negativeShelterChance = base.negativeShelterEvents * negShelterFactor;
  let positiveShelterChance = base.positiveShelterEvents * posShelterFactor;

  // Adjust invade and random based on strength and shelterStrength (strength weighted more)
  const defenseScore = 0.7 * (strength / 100) + 0.3 * (shelterStrength / 100);
  const invadeFactor = 1 - defenseScore;
  const randomFactor = 1 + defenseScore;

  let invadeChance = base.invadeEvents * invadeFactor;
  let randomChance = base.randomWorldEvents * randomFactor;

  // Rare events remain constant
  let rareChance = base.rareEvents;

  // Normalize probabilities
  const total =
    negativeShelterChance +
    positiveShelterChance +
    invadeChance +
    randomChance +
    rareChance;

  negativeShelterChance /= total;
  positiveShelterChance /= total;
  invadeChance /= total;
  randomChance /= total;
  rareChance /= total;

  // Weighted selection
  const roll = Math.random();
  let category;
  if (roll < negativeShelterChance) {
    category = "negativeShelterEvents";
  } else if (roll < negativeShelterChance + positiveShelterChance) {
    category = "positiveShelterEvents";
  } else if (
    roll <
    negativeShelterChance + positiveShelterChance + invadeChance
  ) {
    category = "invadeEvents";
  } else if (
    roll <
    negativeShelterChance + positiveShelterChance + invadeChance + randomChance
  ) {
    category = "randomWorldEvents";
  } else {
    category = "rareEvents";
  }

  console.log("Category:", category);
  console.log(
    "Probabilities:",
    negativeShelterChance,
    positiveShelterChance,
    invadeChance,
    randomChance,
    rareChance
  );

  const eventPool = Object.values(restEvents[category]);
  return eventPool[Math.floor(Math.random() * eventPool.length)];
};

export default function Game2() {
  const terminalRef = useRef(null);
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem("myGameState");
    return saved ? JSON.parse(saved) : initialGameState;
  });

  const [viewingRules, setViewingRules] = useState(() => {
    const saved = localStorage.getItem("viewingRules");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [viewingInventory, setViewingInventory] = useState(() => {
    const saved = localStorage.getItem("viewingInventory");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isCrafting, setIsCrafting] = useState(() => {
    const saved = localStorage.getItem("isCrafting");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isExploring, setIsExploring] = useState(() => {
    const saved = localStorage.getItem("isExploring");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [exploreItem, setExploreItem] = useState(() => {
    const saved = localStorage.getItem("exploreItem");
    return saved !== null ? JSON.parse(saved) : null;
  });

  const [won, setWon] = useState(() => {
    const saved = localStorage.getItem("won");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [restartingGame, setRestartingGame] = useState(() => {
    const saved = localStorage.getItem("restartingGame");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [explorationsToday, setExplorationsToday] = useState(() => {
    const saved = localStorage.getItem("explorationsToday");
    return saved !== null ? JSON.parse(saved) : 0;
  });

  const [died, setDied] = useState(() => {
    const saved = localStorage.getItem("died");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("myGameState", JSON.stringify(gameState));
    localStorage.setItem("viewingRules", JSON.stringify(viewingRules));
    localStorage.setItem("viewingInventory", JSON.stringify(viewingInventory));
    localStorage.setItem("isCrafting", JSON.stringify(isCrafting));
    localStorage.setItem("isExploring", JSON.stringify(isExploring));
    localStorage.setItem("exploreItem", JSON.stringify(exploreItem));
    localStorage.setItem("won", JSON.stringify(won));
    localStorage.setItem("restartingGame", JSON.stringify(restartingGame));
    localStorage.setItem(
      "explorationsToday",
      JSON.stringify(explorationsToday)
    );
    localStorage.setItem("died", JSON.stringify(died));
  }, [
    gameState,
    viewingRules,
    viewingInventory,
    isCrafting,
    isExploring,
    exploreItem,
    won,
    restartingGame,
    explorationsToday,
    died,
  ]);

  useEffect(() => {
    if (gameState.radiation == 100) {
      addLog(
        `Your radiation has reached dangerous levels. You have lost ${gameRules.maxRadiationPunishment} health`
      );
      setGameState((prev) => ({
        ...prev,
        radiation: 0,
        health: prev.health - gameRules.maxRadiationPunishment,
      }));
    }
  }, [gameState.radiation]);

  useEffect(() => {
    if (gameState.health <= 0) {
      addLog(`You have died. Humanity is dead because of you. Nice going.`);
      setRestartingGame(true);
      setDied(true);
    }
  }, [gameState.health]);

  useEffect(() => {
    if (gameState.bleed >= 100) {
      const interval = setInterval(() => {
        setGameState((prev) => {
          if (prev.health <= 0) return prev; // Prevent going below zero
          const newHealth = Math.max(prev.health - 1, 0);
          return {
            ...prev,
            health: newHealth,
            logs: [
              ...prev.logs.slice(-4),
              "You're bleeding out... (-1 health)",
            ],
          };
        });
      }, 10000); // 10 seconds

      return () => clearInterval(interval); // Clean up if bleed drops or component unmounts
    }
  }, [gameState.bleed]);

  function resetGame() {
    localStorage.clear(); // or selectively remove keys
    setGameState(initialGameState);
    setViewingRules(true);
    setViewingInventory(false);
    setIsCrafting(false);
    setIsExploring(false);
    setExploreItem(null);
    setWon(false);
    setRestartingGame(false);
    setExplorationsToday(0);
    setDied(false);
  }

  const addLog = (newLog) => {
    setGameState((prev) => ({
      ...prev,
      logs: [...prev.logs.slice(-4), newLog], // Keep last 4 + new one,
    }));
  };

  const renderTerminal = () => {
    if (viewingInventory || isCrafting) {
      return (
        <>
          <p
            style={{
              textDecoration: "underline",
              marginTop: "5px",
              fontWeight: "bold",
              color: "lightblue",
            }}
          >
            <strong>Inventory</strong>
          </p>
          {Object.entries(gameState.inventory).map(([item, count]) => {
            const gameItem = gameItems[item];
            if (!gameItem) {
              console.warn(`Unknown item in inventory: ${item}`);
              return null;
            }
            return (
              <div key={item}>
                <p>
                  <strong>
                    {gameItem.displayName}:{" "}
                    <span style={{ color: "gold" }}>{count}</span>
                  </strong>
                </p>
                {Object.keys(gameItem.effect || {}).length > 0 && (
                  <p
                    style={{
                      color: "lightgreen",
                      marginTop: "0",
                      paddingTop: "0",
                    }}
                  >
                    Effect:{" "}
                    {Object.entries(gameItem.effect)
                      .map(([k, v]) => `${v > 0 ? "+" : ""}${v} ${k}`)
                      .join(", ")}
                  </p>
                )}
                <br />
              </div>
            );
          })}

          <p
            style={{
              textDecoration: "underline",
              marginTop: "5px",
              fontWeight: "bold",
              color: "lightblue",
            }}
          >
            <strong>Item Boosts</strong>
          </p>
          {Object.entries(gameItems)
            .filter(([_, item]) => item.statusEffects)
            .map(([key, item]) => (
              <p key={key} style={{ marginBottom: "10px" }}>
                <strong>{item.displayName}:</strong>
                {Object.entries(item.statusEffects).map(
                  ([effectKey, value], i, arr) => {
                    const effectDescription =
                      initialStatusEffects[effectKey]?.effectOn || effectKey;
                    return (
                      <span key={effectKey} style={{ color: "gold" }}>
                        {"  "}
                        {value * 10}% {effectDescription} boost
                        {i < arr.length - 1 ? ", " : ""}
                      </span>
                    );
                  }
                )}
              </p>
            ))}
        </>
      );
    }

    return (
      <>
        {gameState.logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </>
    );
  };

  const renderScreen = () => {
    if (viewingRules) {
      return (
        <div className={styles.instructions}>
          <h3 style={{ color: "gold" }}>
            Welcome to Nuclear Fallout: The Survival Game
          </h3>

          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Objective
          </p>
          <p>
            Survive in a harsh post-apocalyptic world. Keep your{" "}
            <strong>health</strong> above zero and outlast the dangers of each
            day and night. Your ultimate goal:{" "}
            <strong>build a time machine</strong> and travel back to prevent the
            nuclear disaster.
          </p>

          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Core Stats
          </p>
          <p>
            - <strong>Health:</strong> If this reaches zero, you die. Events
            while resting or exploring can reduce it.
            <br />- <strong>Hunger & Thirst:</strong> If either reaches 100,
            you'll lose health every time you rest.
            <br />- <strong>Radiation:</strong> At 100 radiation, you'll suffer
            a major health loss due to radiation sickness. Radiation resets
            after this event.
            <br />- <strong>Bleed:</strong>At 100 bleed, you'll slowly bleed
            out, and lose 1 health every 10 seconds. Bleed can be stopped by
            using a bandage or a medkit.
          </p>

          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Exploration
          </p>
          <p>
            Explore the wasteland to find <strong>food, water, scrap</strong>,
            and other useful resources. But beware—many events are dangerous,
            and some choices could cost you.
          </p>

          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Crafting
          </p>
          <p>
            Use items to craft powerful upgrades. For example, crafting a{" "}
            <strong>Radiation Shield</strong> grants a permanent 10% resistance
            to radiation damage. Effects can stack—collect up to five of each
            upgrade!
          </p>

          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Resting
          </p>
          <p>
            Resting isn't always safe. You might face{" "}
            <strong>invasions, theft, shelter damage</strong>, and other
            threats. Improve your odds by increasing your{" "}
            <strong>personal strength</strong> and upgrading your{" "}
            <strong>shelter</strong>.
          </p>

          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Victory
          </p>
          <p>
            To win, collect rare components and craft a{" "}
            <strong>Time Machine</strong>. Escape the cycle by undoing the
            nuclear fallout itself.
          </p>

          <p>
            <em>Good luck… and stay alive.</em>
          </p>
        </div>
      );
    }
    if (isCrafting) {
      return (
        <>
          <p
            style={{
              textDecoration: "underline",
              marginTop: "5px",
              fontWeight: "bold",
              color: "lightblue",
            }}
          >
            Crafting Recipes
          </p>

          {Object.entries(gameItems)
            .filter(([_, item]) => Object.keys(item.craftingRecipe).length > 0)
            .map(([key, item]) => (
              <div key={key}>
                <p>
                  <strong>{item.displayName}</strong>
                </p>
                <p
                  style={{
                    color: "lightgreen",
                    marginTop: "0",
                    paddingTop: "0",
                  }}
                >
                  {Object.entries(item.craftingRecipe)
                    .map(
                      ([ingredient, amount]) =>
                        `${amount}x ${gameItems[ingredient].displayName}`
                    )
                    .join(", ")}
                </p>
                <br />
              </div>
            ))}
        </>
      );
    }

    // Fields to exclude
    const exclude = new Set(["inventory", "logs", "statusEffects", "day"]);

    return (
      <>
        <p style={{ color: "gold" }}>
          <strong>Day {gameState.day}</strong>
        </p>
        <p
          style={{
            textDecoration: "underline",
            marginTop: "5px",
            fontWeight: "bold",
            color: "lightblue",
          }}
        >
          Health Status
        </p>
        {Object.entries(gameState)
          .filter(([key]) => !exclude.has(key))
          .map(([key, value]) => (
            <p key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
              <span style={{ color: "gold" }}>{value}</span>
            </p>
          ))}
        <p
          style={{
            textDecoration: "underline",
            marginTop: "5px",
            fontWeight: "bold",
            color: "lightblue",
          }}
        >
          Status Effects
        </p>
        {Object.entries(gameState.statusEffects).map(([key, value]) => (
          <div key={key}>
            <p>
              <strong>{initialStatusEffects[key].displayName}: </strong>
              <span style={{ color: "gold" }}>
                {value * initialStatusEffects[key].boost * 100}%
              </span>
            </p>
          </div>
        ))}
      </>
    );
  };

  const canCraftItem = (itemKey) => {
    const item = gameItems[itemKey];
    const recipe = item.craftingRecipe;

    // First, check if you have enough ingredients
    const hasIngredients = Object.entries(recipe).every(
      ([ingredient, amount]) => gameState.inventory[ingredient] >= amount
    );

    if (!hasIngredients) return false;

    // Then, check if crafting this item would exceed any statusEffect bounds
    const statusEffects = item.statusEffects || {};
    const currentStatus = gameState.statusEffects;
    console.log(gameState.statusEffects);

    const withinStatusEffectBounds = Object.entries(statusEffects).every(
      ([statusKey, addedValue]) => {
        const currentValue = currentStatus[statusKey] ?? 0;
        const max = gameRules.statusEffectBounds[statusKey]?.max ?? Infinity;
        return currentValue + addedValue <= max;
      }
    );

    return withinStatusEffectBounds;
  };

  const craftItem = (itemKey) => {
    const item = gameItems[itemKey];
    const recipe = item.craftingRecipe;

    if (!canCraftItem(itemKey)) return; // Prevent crafting if insufficient items

    setGameState((prev) => {
      // Deduct ingredients
      const newInventory = { ...prev.inventory };
      Object.entries(recipe).forEach(([ingredient, amount]) => {
        newInventory[ingredient] -= amount;
      });

      // Add crafted item
      newInventory[itemKey] += 1;

      // Add log entry
      const newLog = `You crafted ${item.displayName}.`;

      return {
        ...prev,
        inventory: newInventory,
        logs: [...prev.logs.slice(-19), newLog],
      };
    });
  };

  const applyChoiceEffect = (effect, logText) => {
    setGameState((prev) => {
      const newInventory = { ...prev.inventory };
      const newStatusEffects = { ...prev.statusEffects };
      const updatedState = { ...prev };

      const effectSummary = [];

      Object.entries(effect).forEach(([key, val]) => {
        let adjustedValue;
        if (key in newStatusEffects) {
          // Compute the multiplier
          const boostPerLevel = initialStatusEffects[key]?.boost ?? 0;
          const totalBoost = boostPerLevel * (newStatusEffects[key] ?? 0);
          const multiplier = val > 0 ? totalBoost : totalBoost * -1;
          adjustedValue = val + val * multiplier;
        }
        const value = adjustedValue ?? val;

        if (key in updatedState) {
          updatedState[key] += value;
          // impose bounds
          if (gameRules.bounds[key]) {
            const { min, max } = gameRules.bounds[key];
            updatedState[key] = Math.max(min, Math.min(max, updatedState[key]));
          }
          effectSummary.push(`${value >= 0 ? "+" : ""}${value} ${key}`);
        } else if (key in newInventory) {
          newInventory[key] += value;
          // apply item bounds
          if (gameRules.bounds[key]) {
            const { min, max } = gameRules.bounds[key];
            newInventory[key] = Math.max(
              min,
              Math.min(max, updatedInventory[key])
            );
          } else if (newInventory[key] < 0) newInventory[key] = 0;

          effectSummary.push(
            `${value >= 0 ? "+" : ""}${value} ${gameItems[key].displayName}`
          );
        } else if (key in newStatusEffects) {
          newStatusEffects[key] += value;
          if (gameRules.statusEffectBounds[key]) {
            const { min, max } = gameRules.statusEffectBounds[key];
            newStatusEffects[key] = Math.max(
              min,
              Math.min(max, newStatusEffects[key])
            );
          }
          const displayName = initialStatusEffects[key]?.displayName || key;
          effectSummary.push(`${value >= 0 ? "+" : ""}${value} ${displayName}`);
        }
        if (isExploring) {
          setIsExploring(false);
        }
      });

      const fullLog = `${logText} (${effectSummary.join(", ")})`;

      return {
        ...updatedState,
        inventory: newInventory,
        statusEffects: newStatusEffects,
        logs: [...prev.logs.slice(-4), fullLog],
      };
    });
  };

  const useItem = (item) => {
    const effects = item.effect;
    const statusEffects = item.statusEffects;

    console.log(effects);
    console.log(statusEffects);
    if (effects) {
      applyChoiceEffect(effects, `You used a ${item.displayName}`);
    }
    if (statusEffects) {
      console.log(statusEffects);
      applyChoiceEffect(statusEffects, "");
    }

    setGameState((prev) => {
      const newInventory = { ...prev.inventory };
      const itemKey = Object.keys(gameItems).find(
        (key) => gameItems[key] === item
      );

      if (itemKey && newInventory[itemKey] > 0) {
        newInventory[itemKey] -= 1;
      }

      return {
        ...prev,
        inventory: newInventory,
      };
    });
  };

  const useTimeMachine = () => {
    setGameState((prev) => ({
      ...prev,
      logs: [
        "Congratjulations, you have powered on the time machine and are ready to go back and start over again. Lets start this thing up!",
      ],
    }));
    setWon(true);
  };

  const goHome = () => {
    navigate("/");
  };

  const renderButtons = () => {
    if (viewingRules) {
      return (
        <>
          <ActionButton
            text={"Play Game"}
            func={() => setViewingRules(false)}
          />
        </>
      );
    }
    if (won) {
      return (
        <>
          <ActionButton text={"Enter Time Machine"} func={goHome} />
        </>
      );
    }
    if (isExploring && exploreItem) {
      return (
        <>
          <div className={styles.buttonAndText}>
            <p>{exploreItem.text}</p>
            <div className={styles.buttons}>
              {exploreItem.choices.map((choice, index) => (
                <ActionButton
                  key={index}
                  text={choice.text}
                  func={() =>
                    applyChoiceEffect(
                      choice.effect || {},
                      choice.logText || "You chose an action."
                    )
                  }
                />
              ))}
            </div>
          </div>
        </>
      );
    }
    if (isCrafting) {
      return (
        <>
          {Object.entries(gameItems)
            .filter(([_, item]) => Object.keys(item.craftingRecipe).length > 0)
            .map(([key, item]) => (
              <ActionButton
                key={key}
                text={`Craft ${item.displayName}`}
                func={() => craftItem(key)}
                disabled={!canCraftItem(key)} // you'll need to add this prop
              />
            ))}
          <ActionButton
            text={"Toggle Crafting Bench"}
            func={() => {
              setIsCrafting(!isCrafting);
            }}
          />
        </>
      );
    }

    if (viewingInventory) {
      return (
        <>
          {Object.entries(gameState.inventory)
            .filter(([_, count]) => count > 0)
            .map(([key, count]) => (
              <ActionButton
                key={key}
                text={`Use ${gameItems[key].displayName}`}
                func={() => useItem(gameItems[key])}
                disabled={
                  (!gameItems[key].effect && !!gameItems[key].statusEffects) ||
                  count <= 0
                }
              />
            ))}

          <ActionButton
            text={"Toggle Inventory"}
            func={() => {
              setViewingInventory(false);
            }}
          />
        </>
      );
    }

    if (restartingGame) {
      return (
        <>
          {!died && (
            <>
              <p style={{ marginRight: "15px" }}>
                Are you sure you want to reset the game?
              </p>

              <ActionButton
                text={"No"}
                func={() => {
                  setRestartingGame(false);
                }}
              />
            </>
          )}
          {!died ? (
            <ActionButton
              text={"Yes"}
              func={() => {
                resetGame();
              }}
            />
          ) : (
            <ActionButton
              text={"Restart Game"}
              func={() => {
                resetGame();
              }}
            />
          )}
        </>
      );
    }

    return (
      <>
        <ActionButton
          text={"Toggle Inventory"}
          func={() => {
            setViewingInventory(!viewingInventory);
          }}
        />
        <ActionButton
          text={"Toggle Crafting Bench"}
          func={() => {
            setIsCrafting(!isCrafting);
          }}
        />
        <ActionButton text={"Rest"} func={rest} />
        <ActionButton text={"Explore"} func={explore} />
        {gameState.inventory.timeMachine >= 1 && (
          <ActionButton text={"Turn on Time Machine"} func={useTimeMachine} />
        )}
        <ActionButton
          text={"How To Play"}
          func={() => setViewingRules(!viewingRules)}
        />
        <ActionButton
          text={"Restart Game"}
          func={() => setRestartingGame(true)}
        />
      </>
    );
  };

  const rest = () => {
    const event = getRandomRestEvent(gameState);
    applyChoiceEffect(
      event.effect || {},
      `Night ${gameState.day}. ${event.text}`
    );

    let hungerThirstHealthDepletion = 0;

    if (gameState.hunger == 100) {
      hungerThirstHealthDepletion =
        hungerThirstHealthDepletion + gameRules.maxHungerPunishment;
    }
    console.log(hungerThirstHealthDepletion);
    if (gameState.thirst == 100) {
      hungerThirstHealthDepletion =
        hungerThirstHealthDepletion + gameRules.maxThirstPunishment;
    }
    console.log(hungerThirstHealthDepletion);

    setGameState((prev) => ({
      ...prev,
      day: prev.day + 1,
      thirst: prev.thirst + gameRules.nightlyThirstIncrease,
      hunger: prev.hunger + gameRules.nightlyHungerIncrease,
      health: prev.health - hungerThirstHealthDepletion,
    }));

    setExplorationsToday(0);
  };

  const explore = () => {
    console.log(explorationsToday);
    if (explorationsToday < gameRules.maxDailyExplorations) {
      setIsExploring(true);
      const exploreEvent = getRandomExplorationEvent();
      setExploreItem(exploreEvent);
      setExplorationsToday(explorationsToday + 1);
    } else {
      addLog(`You are to tired to explore. You must rest.`);
    }
  };

  useEffect(() => {
    if (terminalRef.current && !viewingInventory && !isCrafting) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [gameState.logs]);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Nuclear Fallout Game</h1>
        <div className={styles.terminal}>
          <div className={styles.terminalTile}>
            <h3>Info Screen</h3>
            <div className={styles.infoScreen}>{renderScreen()}</div>
          </div>
          <div className={styles.terminalTile}>
            <h3>Terminal Output</h3>
            <div className={styles.terminalOutput} ref={terminalRef}>
              {renderTerminal()}
            </div>
          </div>
        </div>
        <div className={styles.buttons}>{renderButtons()}</div>
      </div>
    </>
  );
}
