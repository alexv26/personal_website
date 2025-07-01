// src/data/gameData.js

export const foodHealthBoost = 3;
export const steroidStrengthBoost = 5;
export const scrapBoost = 3;
export const potIodideBoost = 5;
export const maxRadiationPunishment = 30;
export const maxExploreEventsPerDay = 3;

export const statBounds = {
  health: { min: 0, max: 1000 },
  strength: { min: 0, max: 100 },
  radiation: { min: 0, max: Infinity },
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
    label: `Use Med Kit (+20 health)`,
    changes: { medKit: -1, health: +20 },
  },
  shelterFortifications: {
    label: `Use Shelter Fortifications (+10 shelter strength)`,
    changes: { shelterFortifications: -1, shelterStrength: +10 },
  },
  strengthBooster: {
    label: `Use Strength Booster (+15 strength)`,
    changes: { strengthBooster: -1, strength: +15 },
  },
  radiationShield: {
    label: `Use Radiation Shield (-30 radiation)`,
    changes: { radiationShield: -1, radiation: -30 },
  },
  energyBar: {
    label: `Eat Energy Bar (+8 health, +5 strength)`,
    changes: { energyBar: -1, health: +8, strength: +5 },
  },
  sillyCaterpillar: {
    label: `Read the silly caterpillar`,
    changes: { sillyCaterpillar: -1, enlightened: 1 },
  },
};

export const craftingRecipes = {
  shelterFortifications: {
    label: "Reinforce Shelter",
    requires: { scrap: 5, potIodide: 2 },
    applyChanges: { shelterFortifications: 1 },
  },
  medKit: {
    label: "Craft Med Kit",
    requires: { food: 3, potIodide: 1, scrap: 1 },
    applyChanges: { medKit: 1 },
  },
  strengthBooster: {
    label: "Make Strength Booster",
    requires: { steroids: 2, scrap: 2 },
    applyChanges: { strengthBooster: 1 },
  },
  radiationShield: {
    label: "Build Radiation Shield",
    requires: { scrap: 3, potIodide: 3 },
    applyChanges: { radiationShield: 1 },
  },
  energyBar: {
    label: "Make Energy Bar",
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
};

export const exploreEvents = {
  good: [
    {
      description: "You find a hidden toolbox filled with useful scrap.",
      changes: { scrap: +3 },
    },
    {
      description:
        "You come across a clinic and salvage potassium iodide pills.",
      changes: { potIodide: +2 },
    },
    {
      description: "A collapsed bunker yields canned food and scrap.",
      changes: { food: +4, scrap: +2 },
    },
    {
      description: "You find a water purifier! No more sickness… for now.",
      changes: { health: +8, radiation: -5 },
    },
    {
      description: "You discover solar panels and reinforce your shelter.",
      changes: { shelterStrength: +6 },
    },
    {
      description: "You find a stash of emergency supplies in a fridge.",
      changes: { food: +4, potIodide: +2 },
    },
    {
      description: "A fellow survivor gifts you scrap and meds.",
      changes: { scrap: +4, health: +4 },
    },
    {
      description: "You stumble on a makeshift lab and pocket some supplies.",
      changes: { steroids: +3, potIodide: +1 },
    },
    {
      description:
        "A kind stranger helps patch your wounds and reinforce your shelter.",
      changes: { health: +10, shelterStrength: +4 },
    },
    {
      description: "You discover a pre-war vending machine still operational.",
      changes: { food: +5, scrap: +1 },
    },
    {
      description:
        "A child leads you to a hidden cache of supplies before disappearing.",
      changes: { potIodide: +3, steroids: +2 },
    },
    {
      description: "You find a body holding a backpack filled with gear.",
      changes: { medKit: +1, scrap: +3, food: +2 },
    },
    {
      description:
        "An old shelter collapses — but you salvage valuable components.",
      changes: { scrap: +6, shelterStrength: +3 },
    },
    {
      description: "You find blueprints for advanced shelter designs.",
      changes: { shelterStrength: +8 },
    },
    {
      description: "You find a friendly drone who delivers aid packages.",
      changes: { food: +3, radiation: -3 },
    },
    {
      description: "You find an abandoned lab fridge still humming.",
      changes: { steroids: +4, radiationShield: +1 },
    },
  ],
  bad: [
    {
      description: "You walk through irradiated ruins. You feel sick.",
      changes: { radiation: +10 },
    },
    {
      description: "A gang steals your scrap while you're distracted.",
      changes: { scrap: -2 },
    },
    {
      description: "You take shelter in a leaky shack and it collapses.",
      changes: { health: -6, shelterStrength: -5 },
    },
    {
      description: "You cut yourself on rusty metal and get an infection.",
      changes: { health: -10 },
    },
    {
      description: "A windstorm tears through, damaging your gear.",
      changes: { shelterStrength: -7 },
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
      description: "You are forced to use your med kit to survive a collapse.",
      changes: { medKit: -1 },
    },
    {
      description: "You’re mugged at knifepoint. They take everything useful.",
      changes: { food: -2, potIodide: -2, steroids: -2 },
    },
    {
      description: "You’re ambushed and injected with an unknown chemical.",
      changes: { radiation: +8, strength: -3 },
    },
  ],
  tradeoff: [
    {
      description: "You find potassium iodide — but it's irradiated.",
      changes: { potIodide: +2, radiation: +4 },
    },
    {
      description: "You collect useful scrap from a wreck... full of spores.",
      changes: { scrap: +6, health: -5 },
    },
    {
      description: "You scavenge broken machines for parts.",
      changes: { scrap: +5, shelterStrength: -3 },
    },
    {
      description: "You drink questionable water — feel strong, but nauseous.",
      changes: { strength: +4, radiation: +6 },
    },
    {
      description: "You inject an old vial labeled 'RAD-X'. Unclear effect.",
      changes: { radiation: -8, health: -3 },
    },
    {
      description:
        "You find an energy bar and duct tape — win some, lose some.",
      changes: { food: +2, scrap: +1, health: -2 },
    },
    {
      description: "You cross a river to reach a supply crate but get soaked.",
      changes: { scrap: +5, health: -5 },
    },
    {
      description: "You find an old energy bar. It smells funny.",
      changes: { energyBar: +1, health: -2 },
    },
    {
      description: "You scavenge a tech lab, but the radiation is heavy.",
      changes: { strengthBooster: +1, radiation: +10 },
    },
    {
      description: "You enter a locked vault. You must use scrap to open it.",
      changes: { scrap: -3, steroids: +2 },
    },
    {
      description: "You wake up in an irradiated zone with no memory.",
      changes: { radiation: +12, food: +1, scrap: +1 },
    },
    {
      description:
        "You trade your last med kit for fuel to light a fire tonight.",
      changes: { medKit: -1, shelterStrength: +5 },
    },
  ],
  rare: [
    {
      description:
        "You come across a mysterious book, titled `The Silly Caterpillar`. You read it, and are somewhat horrified. Is this thing valuable?",
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
      changes: { radiation: -3, shelterStrength: +4 },
    },
    {
      description:
        "You listen to music on an old cassette. It lifts your spirits.",
      changes: { strength: +4 },
    },
    {
      description: "A convoy drops aid during the night.",
      changes: { food: +3, potIodide: +2, scrap: +3 },
    },
  ],
  bad: [
    {
      description: "Your shelter leaks and you get sick.",
      changes: { health: -5, radiation: +5 },
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
      changes: { shelterStrength: -4 },
    },
    {
      description: "You sleep through a storm — your shelter floods.",
      changes: { shelterStrength: -6, health: -4 },
    },
    {
      description:
        "You are forced to use potassium iodide to survive a radiation spike.",
      changes: { potIodide: -1, radiation: -10 },
    },
    {
      description: "Something drips from the ceiling onto your food stash.",
      changes: { food: -2 },
    },
    {
      description: "You inhale moldy air while sleeping. Your health suffers.",
      changes: { health: -6 },
    },
    {
      description: "A looter breaks in and you must fight them off.",
      changes: { health: -10, scrap: -2 },
    },
  ],
  tradeoff: [
    {
      description: "You spend the night reinforcing shelter with scrap.",
      changes: { scrap: -2, shelterStrength: +6 },
    },
    {
      description: "You take a risk and burn iodide for warmth.",
      changes: { potIodide: -1, health: +3 },
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
      changes: { health: +10, radiation: +5 },
    },
    {
      description: "You reinforce shelter by tearing down inner walls.",
      changes: { shelterStrength: +5, health: -4 },
    },
  ],
};

export const initialState = {
  day: 1,
  health: 100,
  strength: 10,
  radiation: 0,
  shelterStrength: 10,
  enlightened: 0,
  logs: ["You emerge from the bunker. The wasteland is silent..."],
  inventory: Object.fromEntries(inventoryKeys.map((key) => [key, 0])),
  restEventLikelihoods: { good: 0.2, bad: 0.6, tradeoff: 0.2 },
  exploreEventLikelihoods: { good: 0.2, bad: 0.1, tradeoff: 0.2, rare: 0.01 },
};
