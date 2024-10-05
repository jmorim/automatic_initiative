import {initConfig} from "./config.js";
import { registerSettings } from "./settings.js";

export const MODULE_ID = "automatic-initiative";

Hooks.on("init", () => {
    initConfig();
    registerSettings();
    console.log('automatic-initiative | initialized poopoopeepee')
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(MODULE_ID)
});

Hooks.on('createCombatant', async (combatant) => {
 //   if (combatant.actor?.hasPlayerOwner || combatant.isNPC === false) return;
    console.log(MODULE_ID, ` | rolling initiative for ${combatant.name}`);
    console.log(combatant.actor?.hasPlayerOwner) // true
    console.log(!combatant.initiative) // true
    if (combatant.isNPC === true) {
        await combatant.rollInitiative();
    } else if (combatant.actor?.hasPlayerOwner && !combatant.initiative) {
        let player = game.users.players.find(p => p.character?.id === combatant.actor.id);
        console.log(MODULE_ID, ' | hit else if conditions')
        console.log(MODULE_ID, ' | player & player.isActive')
        console.log(player, player.isActive)

        game.socket.emit(`module.${MODULE_ID}`, {
            userId: player.id,
            combatantId: combatant.id
        })

            Dialog.prompt({
                title: "roll initiative",
                content: `<p>we don't got all day</p>`,
                label: 'Roll',
                callback: () => combatant.rollInitiative(),
                rejectClose:false
            })
    }
})

//Hooks.once('read', () => {
//    game.socket.on(`module.${MODULE_ID}`, data => {
//        if (game.user.id === data.userId) {
//            const combatant = game.combat.combatants.get(data.combatantId);
//            if (!combatant.initiative) {
//                console.log('combatant doesnt have initiative')
//                Dialog.prompt({
//                    title: 'roll initiative',
//                    content:`<p>we don't got all day</p>`,
//                    label: 'roll',
//                    callback: () => combatant.rollInitiative(),
//                    rejectClose: false
//                })
//            }
//        }
//    })
//})

//Hooks.on('combatStart', async (combat) => {
//    console.log('automatic initiative | createCombatant hook pee pee')
////    game.combat.rollNPC()
//    // prompts all players, not the ones selected for combat
////    game.users.players.forEach(player => {
////        ChatMessage.create({
////            user: player.id,
////            content: `${player.name}, roll initiative, dummy`
////        });
////        ui.notifications.info(`${player.name}, roll initiative, dummy`)
////    });
//    for (const combatant of combat.combatants) {
//        const actor = combatant.actor;
//
//        if (actor?.hasPlayerOwner && !combatant.initiative) {
//            const activePlayer = game.users.players.find(player => player.active && actor.isOwner);
//            if (activePlayer) {
//                await combatant.rollInitiative([combatant.id], {messageOptions: {
//                    create: false
//                }})
//            }
//        }
//    }