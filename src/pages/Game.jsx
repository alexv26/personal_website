import { useEffect, useState } from "react";
import styles from "./page_styles/Game.module.css";

import {
  foodHealthBoost,
  steroidStrengthBoost,
  exploreEvents,
  restEvents,
  initialState,
  statBounds,
  inventoryKeys,
  scrapBoost,
  potIodideBoost,
  maxRadiationPunishment,
  consumableActions,
  maxExploreEventsPerDay,
  craftingRecipes,
  inventoryDisplayNames,
} from "../game/gameData";

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
