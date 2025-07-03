// src/data/gameData.js

export const foodHealthBoost = 2;
export const steroidStrengthBoost = 2;
export const scrapBoost = 2;
export const potIodideBoost = 2;
export const maxRadiationPunishment = 50;
export const maxExploreEventsPerDay = 2;

const shelterFortificationBoost = 10;
const medKitBoost = 20;
const strengthBoosterBoost = 15;
const radiationShieldBoost = 15;
const energyBarHealthBoost = 5;
const energyBarStrengthBoost = 5;

export const statBounds = {
  health: { min: 0, max: 1000 },
  strength: { min: 0, max: 100 },
  radiation: { min: 0, max: 50 },
  shelterStrength: { min: 0, max: Infinity },
  sillyCaterpillar: { min: 0, max: 1 },
  enlightened: { min: 0, max: 1 },
};

export const statKeys = Object.keys(statBounds);

export const consumableActions = {
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

export const craftingRecipes = {
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

export const inventoryKeys = [
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

export const inventoryDisplayNames = {
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

export const exploreEvents = {
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

export const restEvents = {
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

export const initialState = {
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
