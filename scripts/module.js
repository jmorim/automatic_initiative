const MODULE_ID = 'automatic-initiative'
let socket;

Hooks.once('init', async () => {
  console.log('poo poo pee pee')
});

Hooks.once('socketlib.ready', () => {
  socket = socketlib.registerModule('automatic-initiative-2');
  socket.register('rollNPC', rollNPC)
  socket.register('rollPlayers', rollPlayers)
});

Hooks.once('ready', async () => {
  console.log('pee pee poo poo')
});

const dialogGenerator = async (combatant) => {
  console.log('combatant at dialogGenerator: ', combatant)
  const initiativeDialog = new Dialog({
    title: 'roll for initiative',
    content: "<p>we don't got all day</p>",
    buttons: {
      roll: {
        label: 'roll',
        callback: async () => {
          console.log('combatant at callback: ', combatant);
          const result = await combatant.rollInitiative();
          console.log('result: ', result);
          console.log(result.id, ' rolled ', result.initiative);
          console.log('combatant getInitiativeRoll: ', result.getInitiativeRoll())
          result.getInitiativeRoll().toMessage({
            speaker: { alias: result.name}
          })
//          result.toMessage({
//            speaker: { alias: combatant.name },
//            content: `rolled ${result.initiative}`
//          })
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
  console.log('combatant at rollNPC: ', combatant);
  try {
    const result =  await combatant.rollInitiative?.();
    console.log(combatant.id, ' rolled ', result.initiative);
  } catch (error) {
    console.log('error rolling npc initiative: ', error)
  }
};

const rollPlayers = async (combatant) => {
  console.log('combatant at rollPlayers: ', combatant);
  try {
    await dialogGenerator(combatant);
  } catch (error) {
    console.log('error rolling player initiative: ', error)
  }
};

let hookFire = 0;
// When combatant created
Hooks.on("createCombatant", async (combatant) => {
  hookFire++;
  console.log('hook fired this many times: ', hookFire)
  console.log(MODULE_ID, ` | rolling initiative for ${combatant.name}`);
  console.log(MODULE_ID, ` | combatant: `, combatant);
  // If combatant is NPC and doesn't have initiative
  if (combatant.isNPC == true && !combatant.initiative && game.user === game.users.activeGM) {
    // Roll initiative for NPC as the GM
//    await socket.executeAsGM("rollNPC", combatant);
    rollNPC(combatant);
//    rollNPC(combatant);
  } else if (combatant.actor?.hasPlayerOwner && !combatant.initiative) {
    console.log('users: ', game.users);
    console.log('current user: ', User.current);
    let player = game.users.players.find(
      (p) => p.character?.id === combatant.actor.id
    );
    console.log("player at createCombatant hook: ", player);
    if (player && player.active && player.id == game.userId) {
      try {
//        rollPlayers(combatant);
//        await socket.executeAsUser("rollPlayers", player.id, combatant);
        rollPlayers(combatant);
      } catch (error) {
        console.log("error executing user socket: ", error);
      }
    }
  }
});