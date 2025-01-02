const MODULE_ID = 'automatic-initiative'

const dialogGenerator = async (combatant) => {
  const initiativeDialog = new Dialog({
    title: 'roll for initiative',
    content: "<p>we don't got all day</p>",
    buttons: {
      roll: {
        label: 'roll',
        callback: async () => {
          const roll = await combatant.getInitiativeRoll();
          await roll.toMessage();
          await game.combat.setInitiative(combatant.id, roll.total);
        },
      },
      cancel: {
        label: "don't tell me what to do",
        callback: () => {return null}, 
      },
    },
    default: 'roll',
  })
  initiativeDialog.render(true);
};

const rollNPC = async (combatant) => {
  try {
    const result =  await combatant.rollInitiative?.();
  } catch (error) {
    console.log('error rolling npc initiative: ', error)
  }
};

const rollPlayers = async (combatant) => {
  try {
    await dialogGenerator(combatant);
  } catch (error) {
    console.log('error rolling player initiative: ', error)
  }
};

// When combatant created
Hooks.on("createCombatant", async (combatant) => {
  // If combatant is NPC and doesn't have initiative
  if (combatant.isNPC == true && !combatant.initiative && game.user === game.users.activeGM) {
    // Roll initiative for NPC as the GM
    rollNPC(combatant);
  } else if (combatant.actor?.hasPlayerOwner && !combatant.initiative) {
    let player = game.users.players.find(
      p => p.character?.id === combatant.actor.id
    );
    if (player && player.active && player.id == game.userId) {
      try {
        rollPlayers(combatant);
      } catch (error) {
        console.log("error rolling for player: ", error);
      }
    }
  }
});