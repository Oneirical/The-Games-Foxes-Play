*"A recent construction devised by Epsilon's new assimilationist doctrine, passively radiating a hypnotic aura inspiring military discipline and the respect of hierarchies. For the uneasily swayed, this chrome mantis's claws help strengthen its arguments."*

-Pulsating Psydrone flavour text

**The Games Foxes Play** ([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [original post](https://www.reddit.com/r/roguelikedev/comments/uzb3iu/sharing_saturday_416/iaa1w3u/) | [play online in browser on itch.io!](https://oneirical.itch.io/tgfp))

For the first time since the very beginning of this entire project, my game is [winnable](https://cdn.discordapp.com/attachments/858587803070627860/1030488587784953886/unknown.png) (yes, this was a legitimate run, start to finish!). There is a beginning, there is an end - and in between, a dastardly obstacle course with numerous challenges, ample quantities of explosions and lasers, and already some various competitive-yet-distinct "builds" emerging. I will admit that it is outstandingly hard (but dangerously addictive to the point where my own creation threatens development productivity) - I expect to nerf the difficulty a bit at some point by giving the player additional tools, but I can get to level 10+ consistently. In level 17 awaits the final trial, now properly completed:

**Epsilon, Supreme Ordered General**

* He's got friends, now. 4 Automaton Mobilizers periodically summon various drones at Epsilon's aid, and risk flooding the screen if they are not dealt with. They all die in one hit, except one, which dies in two.

* The **Paradox Teledrone** periodically blinks around, and will also blink the player alongside it on a fun ride if they land a hit.

* The **Binary Duodrone** has 2 HP, and doesn't do much... while it is alone. If it shares the same line or column with another Duodrone, they begin channelling a high damage laser between the two of them!

* The **Titanic Gravidrone** does not hesitate to assert dominance by trampling the player back 1 tile on each hit it scores.

* Finally, the **Pulsating Psydrone** periodically emanates an auditory pulse, which will permanently roboticize one of your Souls. The resulting Ordered Soul is a good defensive asset, but having all your metaphorical swords progressively turned into shields can yield unfortunate results.

* All Cores of Epsilon now have a specific weakness. The **Red Core** will malfunction after forcing Epsilon to dash into a narrow alcove, the **White Core** (which quadruples the spawn rate of Drones, aaaaa!) glitches out once 20 Drones are flooding the screen, the **Cyan Core** can be hacked by Harmonic summons the player may call to their aid, and the **Pink Core** becomes vulnerable after the player has been subjected to its hallucinogenic effect for 5 turns in a row.

* Cores can be pushed and pulled around. They can even be placed on top of Automaton Mobilizers to block them... though that will make the Core a bit harder to access when you require it the most.

* After all 4 cores have been installed, Epsilon enters HASTA LA VISTA mode, becomes permanently vulnerable to damage, but also uses two abilities instead of one on every casting turn. This is very much a sudden death mode - in playtesting, it's rare that things actually escalate this far, but at this point, the screen becomes [truly insane](https://cdn.discordapp.com/attachments/504088568084561930/1030625988662525962/unknown.png) with Drones and lasers and explosions everywhere.

* There is a COOL-ASS boss bar at the bottom of the screen tracking how close you are to triumphing over Epsilon.

I was wondering why I hadn't seen many multi-segment snake or worm enemies in roguelikes. Now I know. Coding in Epsilon's AI was a SPECIAL kind of hell. Constantly, he would love to cheat, crunch into a single tile, phase through walls, softlock himself in the ourobouros position, [spin his tail around like it's a hula hoop](https://youtu.be/WhNuAptmVSY), or shove the player in a 1-tile gap and just sit there camping the entrance forever.

What's interesting is how strong AOE abilities are against Epsilon - they hit all the segments at once and can deal fat damage very fast. However, if you have an AOE arsenal, you are probably also a glass cannon, and your run can be ended if the drone swarm consumes you while you are unloading all the big guns on our snake robot friend. On the other hand, a careful, defensive playstyle can endure Epsilon for a very long time, and sneak in little stabs occasionally to eventually puncture the beast down. Certain core weaknesses try to emphasize certain playstyles - for example, the Cyan Core is much easier to exploit if you have a batch of summons or allies to bash Epsilon after you've snuck a Harmonizer in to trigger the vulnerability.

**Balance & Tweaks**

* My game's core design evolved a lot, and some of the abilities that were good in my original vision had now been rendered utter trash and basically fuel for rerolling in Harmonic Relays. I've gone ahead and buffed a batch of these unfortunate abilities being overshadowed by more recent implementations.

* As a general player buff, you get +1 free turn to act upon entering a new room. Hopefully that cuts down on the "who starts a fight like that? I literally just arrived here" million-of-enemies syndrome.

* The Hover modulator item, which was previously garbage, now has a cool stealth-and-stab ability only usable on the first turn of entering new rooms. Hopefully it's not too OP.

**UI**

* Click/mouse support for everything Harmonic Modulator-related!

* A particularly unnerving status effect of the game (applied by Epsilon's Cyan Core) now makes itself really obvious by applying a cyan filter over the whole screen and temporarily changing the player sprite.

**Future**

I believe the next piece of content I will be tackling will be expanding the whole Harmonic faction-themed side of the game, with new Harmonic enemies in their dedicated branch, the **Serene Spire**, as well as a player-infection mechanic that can come as a side effect of relying too much on the Harmony's gifts. I also want to add a UI feature that lets the player properly view the contents of their inventory as Spellweaver once suggested - it’s not as important as it sounds like, but its absence can lead to frustrating moments. Not certain if I’ll have a lot of free time next week, though. Stay tuned!