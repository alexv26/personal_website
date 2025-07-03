import { useEffect, useState } from "react";
import styles from "./page_styles/Game.module.css";
// src/data/gameData.js

const foodHealthBoost = 2;
const steroidStrengthBoost = 2;
const scrapBoost = 2;
const potIodideBoost = 2;
const maxRadiationPunishment = 50;
const maxExploreEventsPerDay = 2;

const shelterFortificationBoost = 10;
const medKitBoost = 20;
const strengthBoosterBoost = 15;
const radiationShieldBoost = 15;
const energyBarHealthBoost = 5;
const energyBarStrengthBoost = 5;

const statBounds = {
  health: { min: 0, max: 1000 },
  strength: { min: 0, max: 100 },
  radiation: { min: 0, max: 50 },
  shelterStrength: { min: 0, max: Infinity },
  sillyCaterpillar: { min: 0, max: 1 },
  enlightened: { min: 0, max: 1 },
};

const statKeys = Object.keys(statBounds);

const consumableActions = {
  food: {
    label: `Eat Food (+${foodHealthBoost} health)`,
    changes: { food: -1, health: +foodHealthBoost },
  },
  steroids: {
    label: `Use Steroids (+${steroidStrengthBoost} strength)`,
    changes: { steroids: -1, strength: +steroidStrengthBoost },
  },
  scrap: {
    label: `Use Scrap (+${scrapBoost} shelter strength)`,
    changes: { scrap: -1, shelterStrength: +scrapBoost },
  },
  potIodide: {
    label: `Use Potassium Iodide (-${potIodideBoost} radiation)`,
    changes: { potIodide: -1, radiation: -potIodideBoost },
  },
  medKit: {
    label: `Use Med Kit (+${medKitBoost} health)`,
    changes: { medKit: -1, health: +medKitBoost },
  },
  shelterFortifications: {
    label: `Use Shelter Fortifications (+${shelterFortificationBoost} shelter strength)`,
    changes: {
      shelterFortifications: -1,
      shelterStrength: +shelterFortificationBoost,
    },
  },
  strengthBooster: {
    label: `Use Strength Booster (+${strengthBoosterBoost} strength)`,
    changes: { strengthBooster: -1, strength: +strengthBoosterBoost },
  },
  radiationShield: {
    label: `Use Radiation Shield (-${radiationShieldBoost} radiation)`,
    changes: { radiationShield: -1, radiation: -radiationShieldBoost },
  },
  energyBar: {
    label: `Eat Energy Bar (+${energyBarHealthBoost} health, +${energyBarStrengthBoost} strength)`,
    changes: {
      energyBar: -1,
      health: +energyBarHealthBoost,
      strength: +energyBarStrengthBoost,
    },
  },
  sillyCaterpillar: {
    label: `Read the silly caterpillar`,
    changes: { sillyCaterpillar: -1, enlightened: 1 },
  },
};

const craftingRecipes = {
  shelterFortifications: {
    label: `Shelter Fortifications (+${scrapBoost} shelter strength)`,
    requires: { scrap: 5, potIodide: 2 },
    applyChanges: { shelterFortifications: 1 },
  },
  medKit: {
    label: `Craft Med Kit (+${medKitBoost} health)`,
    requires: { food: 3, potIodide: 1, scrap: 1 },
    applyChanges: { medKit: 1 },
  },
  strengthBooster: {
    label: `Make Strength Booster (+${strengthBoosterBoost} strength)`,
    requires: { steroids: 5, scrap: 3 },
    applyChanges: { strengthBooster: 1 },
  },
  radiationShield: {
    label: `Build Radiation Shield (-${radiationShieldBoost} radiation)`,
    requires: { scrap: 5, potIodide: 3 },
    applyChanges: { radiationShield: 1 },
  },
  energyBar: {
    label: `Make Energy Bar (+${energyBarHealthBoost} health, +${energyBarStrengthBoost} strength)`,
    requires: { food: 2, steroids: 1 },
    applyChanges: { energyBar: 1 },
  },
  rocketShip: {
    label: "Make Rocket Ship (escape)",
    requires: {
      scrap: 50,
      food: 50,
      potIodide: 10,
      shelterFortifications: 5,
      radiationShield: 1,
    },
    applyChanges: { rocketShip: 1 },
  },
  nuke: {
    label: "Develop a nuclear bomb",
    requires: {
      scrap: 100,
      potIodide: 100,
      radiationShield: 100,
    },
  },
};

const inventoryKeys = [
  "food",
  "steroids",
  "scrap",
  "potIodide",
  "medKit",
  "shelterFortifications",
  "strengthBooster",
  "radiationShield",
  "energyBar",
  "rocketShip",
  "sillyCaterpillar",
  "nuke",
];

const inventoryDisplayNames = {
  food: "Food",
  steroids: "Steroids",
  scrap: "Scrap",
  potIodide: "Potassium Iodide",
  medKit: "Med Kit",
  shelterFortifications: "Shelter Fortifications",
  strengthBooster: "Strength Booster",
  radiationShield: "Radiation Shield",
  energyBar: "Energy Bar",
  rocketShip: "Rocket Ship",
  sillyCaterpillar: "The Silly Caterpillar (book)",
  nuke: "Nuclear Bomb",
};

const exploreEvents = {
  good: [
    {
      description: "You find a hidden toolbox filled with useful scrap.",
      changes: { scrap: +2 },
    },
    {
      description:
        "You come across a clinic and salvage potassium iodide pills.",
      changes: { potIodide: +2 },
    },
    {
      description: "A collapsed bunker yields canned food and scrap.",
      changes: { food: +2, scrap: +1 },
    },
    {
      description: "You find a water purifier! No more sickness… for now.",
      changes: { health: +4, radiation: -2 },
    },
    {
      description: "You discover solar panels and reinforce your shelter.",
      changes: { shelterStrength: +3 },
    },
    {
      description:
        "You find a stash of emergency supplies and food in a fridge.",
      changes: { food: +2, potIodide: +1 },
    },
    {
      description: "A kind man named Nicky gifts you scrap and meds.",
      changes: { scrap: +1, medKit: +1 },
    },
    {
      description: "You stumble on a makeshift lab and pocket some supplies.",
      changes: { steroids: +2, potIodide: +1 },
    },
    {
      description:
        "A kind stranger helps patch your wounds and reinforce your shelter.",
      changes: { health: +3, shelterStrength: +2 },
    },
    {
      description:
        "You discover a pre-apocalypse vending machine still operational.",
      changes: { food: +3, scrap: +1 },
    },
    {
      description:
        "A ghost leads you to a hidden cache of supplies before disappearing.",
      changes: { potIodide: +1, steroids: +2 },
    },
    {
      description: "You find a body holding a backpack filled with gear.",
      changes: { medKit: +1, scrap: +1 },
    },
    {
      description:
        "You find an abandoned shelter, and scavenge its scrap and fortifications.",
      changes: { shelterFortifications: +2, scrap: +3 },
    },
    {
      description:
        "You find blueprints for advanced shelter designs, boosting your shelter strength.",
      changes: { shelterStrength: +2 },
    },
    {
      description: "You find a friendly drone who delivers aid packages.",
      changes: { food: +1, radiation: -3, medKit: +1 },
    },
    {
      description: "You find an abandoned lab fridge still humming.",
      changes: { steroids: +1, food: +1 },
    },
  ],
  bad: [
    {
      description: "You walk through irradiated ruins. You feel sick.",
      changes: { radiation: +8 },
    },
    {
      description: "A gang steals your scrap while you're distracted.",
      changes: { scrap: -2 },
    },
    {
      description:
        "You venture out to find some scraps, but are forced to seek shelter in a leaky shelter along your journey. You find nothing.",
      changes: { health: -8, shelterStrength: -5 },
    },
    {
      description: "You cut yourself on radiated metal and get an infection.",
      changes: { health: -8, radiation: +7 },
    },
    {
      description: "A windstorm tears through, damaging your gear.",
      changes: { shelterStrength: -8 },
    },
    {
      description: "You fall into a shallow pit and twist your ankle.",
      changes: { health: -8 },
    },
    {
      description: "You walk into a radiation hotspot. Your dosimeter screams.",
      changes: { radiation: +15 },
    },
    {
      description: "A pack of feral dogs chases you down an alley.",
      changes: { health: -12, food: -2 },
    },
    {
      description: "You are forced to use a med kit to survive a collapse.",
      changes: { medKit: -1 },
    },
    {
      description: "You are attacked by a hobo.",
      changes: { health: -5 },
    },
    {
      description:
        "You're mugged at knifepoint. He asked for all your V-Bucks but you don't have any left, so he took everything from you.",
      changes: {
        food: -100,
        shelterFortifications: -100,
        medKit: -100,
        radiationShield: -100,
        energyBar: -100,
        strengthBooster: -100,
      },
    },
    {
      description: "You're ambushed and injected with an unknown chemical.",
      changes: { radiation: +8, strength: -3 },
    },
    {
      description: "You inject an old vial labeled 'RAD-X'. Unclear effect.",
      changes: { radiation: +3 },
    },
    {
      description: "You wake up in an irradiated zone with no memory.",
      changes: { radiation: +8 },
    },
  ],
  tradeoff: [
    {
      description: "You find potassium iodide — but it's irradiated.",
      changes: { potIodide: +2, radiation: +4 },
    },
    {
      description: "You collect useful scrap from a wreck... full of spores.",
      changes: { scrap: +3, health: -11 },
    },
    {
      description: "You tear down a part of your shelter for scrap",
      changes: { scrap: +3, shelterStrength: -10 },
    },
    {
      description: "You drink sus water — feel strong, but nauseous.",
      changes: { strength: +4, radiation: +8 },
    },
    {
      description: "You cross a river to reach a supply crate but get soaked.",
      changes: { scrap: +5, food: +1, health: -5 },
    },
    {
      description: "You find an old energy bar. It smells funny.",
      changes: { energyBar: +1, health: -4 },
    },
    {
      description: "You scavenge a tech lab, but the radiation is heavy.",
      changes: { strengthBooster: +1, radiation: +10, radiationShield: +1 },
    },
    {
      description:
        "You enter a locked vault. You must use scrap to open it. Inside, you find steroids.",
      changes: { scrap: -3, steroids: +2 },
    },
    {
      description: "You trade a med kit for fuel to light a fire tonight.",
      changes: { medKit: -1, shelterStrength: +2 },
    },
  ],
  rare: [
    {
      description:
        "You come across a mysterious book, titled `The Silly Caterpillar`. Is this thing valuable?",
      changes: { sillyCaterpillar: +1 },
    },
  ],
};

const restEvents = {
  good: [
    {
      description: "You repair the shelter during the night.",
      changes: { shelterStrength: +5 },
    },
    {
      description: "A trader leaves a gift outside your camp: food and meds.",
      changes: { food: +2, potIodide: +1 },
    },
    {
      description: "Rainwater collects cleanly. You feel healthier.",
      changes: { health: +5, radiation: -4 },
    },
    {
      description: "You listen to static on the radio all night. It calms you.",
      changes: { radiation: -2 },
    },
    {
      description: "A dog curls up beside you. You feel safe.",
      changes: { health: +4 },
    },
    {
      description: "You dream of a better world and awaken refreshed.",
      changes: { health: +6, strength: +3 },
    },
    {
      description:
        "A nearby generator powers on briefly, heating your shelter.",
      changes: { radiation: -3, shelterStrength: +3 },
    },
    {
      description:
        "You listen to music on an old cassette. It lifts your spirits.",
      changes: { strength: +2 },
    },
    {
      description: "A convoy drops aid during the night.",
      changes: { food: +2, potIodide: +2, scrap: +3 },
    },
  ],
  bad: [
    {
      description: "Your shelter leaks and you get sick.",
      changes: { health: -15, radiation: +5 },
    },
    {
      description: "A thief steals your potassium iodide and scrap.",
      changes: { potIodide: -2, scrap: -2 },
    },
    {
      description: "A radiation spike hits while you sleep.",
      changes: { radiation: +12 },
    },
    {
      description: "You roll over and crush a can of food.",
      changes: { food: -1 },
    },
    {
      description: "Rats chew through your shelter walls.",
      changes: { shelterStrength: -16 },
    },
    {
      description: "You sleep through a storm — your shelter floods.",
      changes: { shelterStrength: -6, health: -4 },
    },
    {
      description:
        "You are forced to use potassium iodide to survive a radiation spike.",
      changes: { potIodide: -1, radiation: +4 },
    },
    {
      description: "Something drips from the ceiling onto your food stash.",
      changes: { food: -5 },
    },
    {
      description: "You inhale moldy air while sleeping. Your health suffers.",
      changes: { health: -16 },
    },
    {
      description: "A looter breaks in and you must fight them off.",
      changes: { health: -20, scrap: -2 },
    },
  ],
  tradeoff: [
    {
      description: "You spend the night reinforcing shelter with scrap.",
      changes: { scrap: -2, shelterStrength: +3 },
    },
    {
      description: "You take a risk and burn iodide for warmth.",
      changes: { potIodide: -2, health: +2, shelterStrength: +1 },
    },
    {
      description: "You sleep exposed to the elements but regain health.",
      changes: { health: +4, radiation: +6 },
    },
    {
      description: "You take potassium iodide to reduce radiation.",
      changes: { potIodide: -1, radiation: -potIodideBoost },
    },
    {
      description: "You use steroids to stay alert and guard your camp.",
      changes: { steroids: -1, shelterStrength: +5 },
    },
    {
      description: "You spend the night fortifying the door.",
      changes: { scrap: -3, shelterStrength: +8 },
    },
    {
      description: "You burn food to stay warm through the cold night.",
      changes: { food: -1, health: +2 },
    },
    {
      description: "You decide to test an unlabelled syringe in desperation.",
      changes: { health: +6, radiation: +5 },
    },
    {
      description: "You reinforce shelter by tearing down inner walls.",
      changes: { shelterStrength: +5, health: -4 },
    },
  ],
  rare: [
    {
      description: "You wake up and your house is gone",
      changes: { shelterStrength: -1000 },
    },
  ],
};

const initialState = {
  day: 1,
  health: 50,
  strength: 10,
  radiation: 20,
  shelterStrength: 10,
  enlightened: 0,
  logs: ["You emerge from the bunker. The wasteland is silent..."],
  inventory: Object.fromEntries(inventoryKeys.map((key) => [key, 0])),
  restEventLikelihoods: { good: 0.3, bad: 0.45, tradeoff: 0.24, rare: 0.01 },
  exploreEventLikelihoods: { good: 0.3, bad: 0.45, tradeoff: 0.23, rare: 0.02 },
};

export default function Game() {
  const [state, setState] = useState(initialState);
  const [checkingInventory, setCheckingInventory] = useState(false);
  const [crafting, setCrafting] = useState(false);
  const [readingInfo, setReadingInfo] = useState(false);
  const [exploreEventsInDay, setExploreEventsInDay] = useState(0);
  const [wonGame, setWonGame] = useState(false);
  const [launchedNuke, setLaunchedNuke] = useState(false);
  const [secretEnding, setSecretEnding] = useState(false);

  const addLog = (message) => {
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs.slice(-5), `${message}`],
    }));
  };

  const nextDay = () =>
    setState((prev) => ({
      ...prev,
      day: prev.day + 1,
    }));

  function scaleToIncludeRare(weights, rare) {
    const total = weights.good + weights.bad + weights.tradeoff;
    const scale = (1 - rare) / total;

    return {
      good: weights.good * scale,
      bad: weights.bad * scale,
      tradeoff: weights.tradeoff * scale,
    };
  }

  function adjustWeightsByStrength(
    baseWeights,
    strength,
    maxStrength = 100,
    eventGroups
  ) {
    const hasRare = eventGroups.rare && eventGroups.rare.length > 0;
    const rare = hasRare ? baseWeights.rare : 0;

    // Enlightened players get better odds
    if (state.enlightened == 1) {
      const enlightenedWeights = {
        good: 0.8,
        bad: 0.1,
        tradeoff: 0.1,
      };

      const scaled = scaleToIncludeRare(enlightenedWeights, rare);
      return hasRare ? { ...scaled, rare } : scaled;
    }

    // Normal adjustment based on strength
    const strengthRatio = Math.min(
      Math.max((strength - 10) / (maxStrength - 10), 0),
      1
    );

    const adjusted = {
      good: baseWeights.good + strengthRatio * 0.3,
      bad: baseWeights.bad - strengthRatio * 0.3,
      tradeoff: baseWeights.tradeoff,
    };

    const scaled = scaleToIncludeRare(adjusted, rare);
    return hasRare ? { ...scaled, rare } : scaled;
  }

  function randomFromCategory(eventGroups, weights) {
    const rand = Math.random();
    let cumulative = 0;

    for (const category of ["rare", "good", "bad", "tradeoff"]) {
      if (!weights[category]) continue;
      cumulative += weights[category];
      if (rand <= cumulative) {
        const events = eventGroups[category];
        return events[Math.floor(Math.random() * events.length)];
      }
    }

    // Fallback in case of rounding error
    const all = [
      ...(eventGroups.good || []),
      ...(eventGroups.bad || []),
      ...(eventGroups.tradeoff || []),
      ...(eventGroups.rare || []),
    ];
    return all[Math.floor(Math.random() * all.length)];
  }

  function applyEventChanges(prev, changes) {
    const newState = { ...prev };
    const newInventory = { ...prev.inventory };

    for (const key in changes) {
      const value = changes[key];

      if (inventoryKeys.includes(key)) {
        newInventory[key] = Math.max((newInventory[key] ?? 0) + value, 0);
      } else if (Object.keys(statBounds).includes(key)) {
        const bounds = statBounds[key];
        newState[key] = Math.min(
          Math.max((newState[key] ?? 0) + value, bounds.min),
          bounds.max
        );
      } else {
        console.warn(`Unhandled change key: ${key}`);
      }
    }

    return {
      ...newState,
      inventory: newInventory,
    };
  }

  const explore = () => {
    if (maxExploreEventsPerDay == exploreEventsInDay) {
      addLog(`You are tired. You must rest.`);
    } else {
      setExploreEventsInDay((prev) => prev + 1);

      const adjustedWeights = adjustWeightsByStrength(
        state.exploreEventLikelihoods,
        state.strength,
        100,
        exploreEvents
      );

      console.log(adjustedWeights);
      const randomEvent = randomFromCategory(exploreEvents, adjustedWeights);
      addLog(randomEvent.description);
      setState((prev) => applyEventChanges(prev, randomEvent.changes));
    }
  };

  const rest = () => {
    setExploreEventsInDay(0);
    const adjustedWeights = adjustWeightsByStrength(
      state.restEventLikelihoods,
      state.shelterStrength,
      100,
      restEvents
    );
    const randomNum = Math.random();
    if (randomNum > 0.7) {
      const randomEvent = randomFromCategory(restEvents, adjustedWeights);
      addLog(`Night ${state.day}: ${randomEvent.description}`);
      setState((prev) => applyEventChanges(prev, randomEvent.changes));
    } else {
      addLog(`Night ${state.day}: You rested. No events.`);
    }
    nextDay();
  };

  const status = () => {
    const inv = inventoryKeys
      .map((k) => `${k}: ${state.inventory[k]}`)
      .join(", ");
    addLog(
      `Status — HP: ${state.health}, Strength: ${state.strength}, ${inv}, Day: ${state.day}`
    );
  };

  const toggleInventory = () => {
    setCheckingInventory(!checkingInventory);
  };

  const toggleCrafting = () => {
    setCrafting(!crafting);
  };

  const useItem = (itemKey) => {
    const { label, changes } = consumableActions[itemKey];
    if (itemKey === "sillyCaterpillar") {
      setState((prev) => ({
        ...prev,
        enlightened: 1,
      }));
      addLog(
        "After reading The Silly Caterpillar, a strange clarity settles over you. Somehow, you feel wiser — more attuned to danger, more drawn to opportunity. Your future choices feel... sharper."
      );
      setState((prev) => applyEventChanges(prev, changes));
      return;
    }
    if ((state.inventory[itemKey] ?? 0) === 0) {
      addLog(`Cannot use ${itemKey} - you've run out`);
    } else {
      addLog(label);
      setState((prev) => applyEventChanges(prev, changes));
    }
  };

  const craftItem = (key) => {
    const recipe = craftingRecipes[key];
    if (!recipe) return;

    // Check if enough inventory to craft
    const canCraft = Object.entries(recipe.requires).every(
      ([item, qty]) => (state.inventory[item] ?? 0) >= qty
    );

    if (!canCraft) {
      addLog(`Cannot craft ${recipe.label} — not enough resources.`);
      return;
    }

    // Subtract required resources
    const resourceChanges = {};
    for (const [item, qty] of Object.entries(recipe.requires)) {
      resourceChanges[item] = -qty;
    }

    // Add crafted items to inventory (only inventory keys)
    const inventoryAdditions = {};
    for (const [invKey, val] of Object.entries(recipe.applyChanges)) {
      if (inventoryKeys.includes(invKey)) {
        inventoryAdditions[invKey] = val;
      } else {
        console.warn(
          `Crafting recipe tried to add non-inventory stat '${invKey}', ignoring`
        );
      }
    }

    const allChanges = {
      ...resourceChanges,
      ...inventoryAdditions,
    };

    addLog(`Crafted ${recipe.label}.`);
    setState((prev) => applyEventChanges(prev, allChanges));
  };

  useEffect(() => {
    if (state.radiation >= statBounds.radiation.max) {
      addLog(
        `You have high radiation. -${maxRadiationPunishment} health. Radiation is reset.`
      );
      setState((prev) => ({
        ...prev,
        radiation: 0,
        health: state.health - maxRadiationPunishment,
        inventory: { ...prev.inventory },
      }));
    }
  }, [state.radiation]);

  const restartGame = () => {
    setState(initialState);
    setWonGame(false);
    setLaunchedNuke(false);
    setSecretEnding(false);
  };

  const launchRocketShip = () => {
    setWonGame(true);
  };

  const launchNuke = () => {
    setLaunchedNuke(true);
  };

  const handleSecretEnding = () => {
    setSecretEnding(true);
  };

  function renderActions() {
    if (state.health <= 0) {
      // When player is dead, only show a Restart or similar button
      return (
        <>
          <button onClick={restartGame}>Restart Game</button>
        </>
      );
    }

    if (wonGame) {
      return (
        <>
          <button onClick={restartGame}>Restart Game</button>
        </>
      );
    }

    if (launchedNuke) {
      return (
        <>
          <button onClick={restartGame}>Restart Game</button>
        </>
      );
    }

    if (secretEnding) {
      return (
        <>
          <button onClick={restartGame}>Restart Game</button>
        </>
      );
    }

    // When alive, show the normal buttons
    return (
      <>
        <button onClick={explore}>Explore</button>
        <button onClick={rest}>Rest</button>
        <button onClick={toggleInventory}>Open Inventory</button>
        {!crafting && (
          <button onClick={toggleCrafting}>Open Crafting Bench</button>
        )}
        <button
          onClick={() => {
            setReadingInfo(!readingInfo);
          }}
        >
          {readingInfo ? "Close Instructions" : "Open Instructions"}
        </button>
        {state.inventory.rocketShip > 0 && (
          <button onClick={launchRocketShip} className={styles.launchButton}>
            Launch Rocket Ship
          </button>
        )}
        {state.inventory.nuke >= 1 && state.radiation >= 40 && (
          <>
            <button
              onClick={launchNuke}
              style={{ color: "red", borderColor: "red" }}
            >
              Launch Nuke
            </button>
          </>
        )}
        {state.inventory.nuke >= 1 &&
          state.radiation >= 40 &&
          state.inventory.sillyCaterpillar >= 1 && (
            <>
              <button
                onClick={handleSecretEnding}
                style={{ color: "cyan", borderColor: "cyan" }}
              >
                Launch Nuke with The Silly Caterpillar inside
              </button>
            </>
          )}
      </>
    );
  }

  function renderScreen() {
    if (wonGame) {
      return (
        <div className={styles.won}>
          <p>
            Congratulations! By crafting and launching the rocket ship, you have
            successfully began your journey to a new, less-horrifying world.
          </p>
        </div>
      );
    }
    if (state.health <= 0) {
      return (
        <div className={styles.died}>
          <p>
            You have died. There is nobody left to save the human race.
            Congratulations, you killed them all.{" "}
          </p>
        </div>
      );
    }

    if (readingInfo) {
      return (
        <div className={styles.stats}>
          <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
            How to play
          </p>
          <p>
            Goal: survive this post-apocalyptic nightmare, and find a way to
            escape
          </p>
          <p>
            Collect items by exploring, but be careful: the lower your strength
            the more likely you are to get hurt, or worse.
          </p>
          <p>
            Increase your shelter strength to prevent bad things from happening
            during the night.
          </p>
          <p>
            To escape, you must build a rocket by collect 50 scrap, 50 food, 5
            shelter fortifications, 1 radiation shield, and 10 potassium iodide
            tablets.
          </p>
          <p>And be sure to keep an eye out for some hidden secrets!</p>
          <p>Thank you for playing!</p>
        </div>
      );
    }

    if (launchedNuke) {
      return (
        <div className={styles.died}>
          <p>
            Congratulations. You successfully killed everyone AGAIN! And this
            time, you didnt manage to survive either. Womp womp! Why would you
            even do that? You don't even deserve the chance to restart. But, I
            guess I'll let you do it anyway.
          </p>
        </div>
      );
    }

    if (secretEnding) {
      return (
        <div className={styles.won}>
          <p>
            Congratulations! By attaching The Silly Caterpillar to the nuclear
            warhead you launched, you've brought upon a new era. Thanks to your
            creativity society was able to rebuild.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.stats}>
        <p>🧍 Health: {state.health}</p>
        <p>💪 Strength: {state.strength}</p>
        <p>☢️ Radiation: {state.radiation}</p>
        <p>🏚️ Shelter Strength: {state.shelterStrength}</p>
        <p>📅 Day: {state.day}</p>
      </div>
    );
  }

  return (
    <div className={styles.terminal}>
      <h1 className={styles.title}>☢️ POST-NUKE SURVIVAL TERMINAL ☢️</h1>

      <div className={styles.screens}>
        <div className={styles.infoScreen}>{renderScreen()}</div>
        <div className={styles.log}>
          {state.logs.map((log, i) => (
            <p key={i}>{log}</p>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        {crafting && (
          <div className={styles.craftingMenu}>
            <h2>Crafting Bench</h2>
            {Object.entries(craftingRecipes).map(([key, recipe]) => {
              const canCraft = Object.entries(recipe.requires).every(
                ([item, qty]) => (state.inventory[item] ?? 0) >= qty
              );

              return (
                <div key={key} className={styles.craftingItem}>
                  <p>{recipe.label}</p>
                  <p>
                    Requires:{" "}
                    {Object.entries(recipe.requires).map(([item, qty]) => (
                      <span key={item}>
                        {qty} {item}
                        {", "}
                      </span>
                    ))}
                  </p>
                  <button disabled={!canCraft} onClick={() => craftItem(key)}>
                    Craft
                  </button>
                </div>
              );
            })}
            <button onClick={toggleCrafting}>Close Crafting Bench</button>
          </div>
        )}

        {checkingInventory ? (
          <div className={styles.inventoryMenu}>
            <h2>Your Inventory</h2>
            {Object.entries(consumableActions)
              .filter(([key]) => (state.inventory[key] ?? 0) > 0)
              .map(([key, { label }]) => (
                <div key={key} className={styles.inventoryItem}>
                  <span>
                    {inventoryDisplayNames[key] || key}:{"  "}
                    {state.inventory[key]}
                  </span>
                  <button onClick={() => useItem(key)}>{label}</button>
                </div>
              ))}
            {Object.entries(consumableActions).every(
              ([key]) => (state.inventory[key] ?? 0) <= 0
            ) && <p>You have no usable items in inventory.</p>}
            <button onClick={toggleInventory} className={styles.closeButton}>
              Close Inventory
            </button>
          </div>
        ) : (
          renderActions()
        )}
      </div>
    </div>
  );
}
