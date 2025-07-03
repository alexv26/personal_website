import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Game2.module.css";

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

import gameItems from "../items_and_effects/gameItems.json";
import initialStatusEffects from "../items_and_effects/initialStatusEffects.json";

import initialGameState from "../state/initialGameState.json";
import gameRules from "../rules/gameRules.json";

import explorationEvents from "../events/explorationEvents.json";

import restEvents from "../events/restEvents.json";

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

  const applyChoiceEffect = (effect, isStatusEffect, logText) => {
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

        if (!isStatusEffect) {
          if (key in updatedState) {
            updatedState[key] += value;
            // impose bounds
            if (gameRules.bounds[key]) {
              const { min, max } = gameRules.bounds[key];
              updatedState[key] = Math.max(
                min,
                Math.min(max, updatedState[key])
              );
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
          }
        }
        if (isStatusEffect && key in newStatusEffects) {
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
      applyChoiceEffect(effects, false, `You used a ${item.displayName}`);
    }
    if (statusEffects) {
      console.log(statusEffects);
      applyChoiceEffect(statusEffects, true, "");
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
                      false,
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
      false,
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
