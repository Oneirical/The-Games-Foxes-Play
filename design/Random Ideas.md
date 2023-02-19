## This is a chaotic canvas on which I launch all the random things I come up with while going about my day and bugs I notice throughout playtesting. It is not meant to be comprehensible.

Terminal > Universe > World > Room > Terminal

**Re-thinking the Scope**

* Start off in World Seed. Do the tutorial.
* Generate Souls by "dancing" with Zaint while the Harmony tries to get inside.
* Build your dungeon from Souls forced to dream about the Old World's past. It has to be easy enough for you to win, but hard enough to stop the Harmony from chasing you too fast.
* Escape into the dungeon and beat the boss to prove your worth. From the boss chamber, trade with the boss and rebuild to escape into another layer.
* Entering contact with the Harmony may cause them to start infecting created worlds from the inside... allowing options to trade for forbidden tech.

* Upon becoming OP enough, ascend back through the Serene Spire all the way to the topmost level and destroy the infection at the root to win.

* A possible structure could be

World Seed

Epsilon / Senet

Purpizug / Ronin

Rose / Zenith

* If the player gets infected, the Harmony rejoices as they believe all traces of ruffians have been assimilated. However, ascending back reveals that Rose is high on Glamorous Toxin and is trying to trap the Harmony down the column of worlds.

**Current Tasks - Tutorial**

* Make it so Zaint doesn't actually move or attack.
* Mouseover descriptions on sidebar
* Stage 8 Zaint boss

**Map Variety Project**

* An image of a huge twisting maze, like brain coral. Coloured dots can be clicked to enlarge portions of Faith's End, corresponding to saved World objects.
* Actually, could the most interesting landmarks on the map be marked, and could the player control their respawning to approach them?
* The souls you sacrifice on death determine your respawn direction - towards an "Ideology pole" that contains an exit point, one for each caste. Should these "poles" expand as the game progresses, and cause a cataclysm if they ever touch the centre? This could be a nice replacement for "hunger clock" type mechanics.

**Serene Project**

* Make Relays more difficult by making sacrificial souls fight you.
* Buying Modulators costs your least populated Castes, in order. Unequipping them (only possible at a cyberneticist) instantly triggers their conversion effect. Not being able to pay means one must spread the Serene Soul.
* Maybe a Senet room can offer a loan.
* Combined Modulators: find an "If" piece and a "Then" piece. For example:
- When moving right... (harmonize towards 3 Ordered per activation)
- Lay down a landmine. (harmonize towards 2 Artistic per activation)
The final modulator has a 3 O + 2 A conversion cost.
If both pieces are the same Caste, gain a Concordance bonus that lets your Serene summons share the effect.
Unlock an extra slot per Serene Soul incarnated. Also get discounts on Modulator usage if more are equipped at the same time.
Offer premade Modulators, like "when moving, dash without doing damage" with reduced costs.
Make modulators composed of a prefix and a suffix, for example, "Hyper-Kinetic" for "when moving..." and "Collectivist Thrusters" for "dash without doing damage".
Serene Souls, when used, convert 1 Soul towards the most common caste.
Harmonic Cyberneticists spawn when the player has no Souls left, and offers to explode your extremely populated caste into varied Castes in exchange for spreading the Serene Soul.
If fully Harmonized, Modulators are always Concordant and have no cost. All damage dealt is converted to Influence.

* Change back the "bonus trinket" dialogue line when modulators are implemented.
* Serene Souls should change their name with each added Serene Soul into increasingly positive titles.
* Make Harmonic Relays less easy.

- When moving up... (3 Saintly)
- When moving down... (3 Vile)
- When moving left... (3 Unhinged)
- When moving... (5 Feral)
- When moving in a circle... (1 Artistic)
- When breathing a Soul... (3 Saintly)
- After using all six Castes (without repeats)... (1 Random)
- When a turn passes while having 5 or less Value remaining... (1 Unhinged)

**Minor Bugs**

* Creatures can overflow in small rooms.
* Gyvji kills things multiple times over.
* Lashol has some weird thing going on with its bonus damage.
* Aube has no texture.
* Falling in the Serene Spire can be ignored with mouse movement.

**Low priority nitpicks**

* Epsilon's vulnerability markings cause confusion.
* Dynamic updating of the current room of the map.
* Shizapis speaks when she is used, which is not faithful to the lore.
* Naia is too OP vs Epsilon. Make Epsilon knockback the player and gain invulnerability if he loses more than 33% of his HP in a single turn.
* In fact, Epsilon needs buffs in general: make the dash leave behind flames, make the lasers do damage.
* When the player respawns, their lastMove is right by default, which is kind of weird.
* Double speed enemies still seem to occasionally return to their previous tile.
* Psychodrones risk being grindy if they let you farm Ordered souls. Find a way to avoid this.
* Lag on low-end devices. Slow down draw calls for the HUD.

**UI**

* Inspect elements in the sidebar to know what they do.
* Add tile abilties. Like "opens on room clear". Maybe make returnExits different too.
* Cool sliding animation in Inventory/Modules.
* Bring back the glamour counter. Make the filter scale with glamour level too.
* Make mouse movement follow Terminal.
* A confirm prompt if you draw after 0 resolve.
* numeric system based on basic castes.

**Rooms & Creatures**

* The Vile Ideology Pole should be full of Felidols of all flavours, always immobile. There are conveyor belts and water currents to push the toys/statues around to stop them from being extremely overpowered despite never actually moving.
* Roseic gas should interact more directly with inhaling, and give a lower glamour score if only standing in it.
* Add more Epsilon cores to vary the runs. Massive tongue-whip with interesting pathfinding, shockwave that causes kerosene explosions.
* lotus incense. sacrifice a legendary to mark the room with a respawn/recall point.
* a gardener room that is completely peaceful but gets ridiculously hectic if the player dares step on a flower.
* A peaceful lake that becomes sinister while using roseic toxin.
* A massive enemy over 9 tiles, composed of combined textures. Maybe in the Spire. Alpha, Ordered champion?
* A joke room where a Harmonizer insists on the purity and the Sameness of the roguelike genre. Mention that all roguelikes are theoretically real-time due to the player having a limited mortal lifespan, which the Harmony is exempt from. Only the Harmony can play true roguelikes.
* Sugcha statues, that cause psychic damage when broken.
* Pressurized glamorous toxin behind breakable glass that spreads through the room.
* Turn anisychia into an anxiety-flavoured encounter, reflavour Oracles.

**Lore & Writing**

* Fluffy should be warm instead of cold, because she is a being of infinite complexity.
* "Enemies" might not be the correct term to describe the world's entities...
* Make InvTutorial sound less like a marketing pitch.
* Rename Ipseity to Complexity/Value.
* Harmonizers are invincible and ethereal outside the spire, because they can only harm their own. In the Spire you have a bit more power over them, as the influence of the environment makes you a little bit more like them.
* Make it clearer why enemies attack the player - they are desperate for a ride and are also testing to see if Terminal is their true saviour. Maybe add dialogue upon entering random rooms that highlights this. Clarify that the reason enemies are weak and never back down is because they *want* to die to Terminal to board the train to the Next World.
* The reason the game is in glyphs is because it must be "censored" as some creatures are cognitohazardous. The Harmonizers/Roseic Servants in particular.
* Zaint's philosophy is apathy and detatchment. This makes sense, because altruism has no place in a world where literally everyone is a god with unlimited resources.
* Also his name is just zaint because he started with a Z, but never finished out of laziness and just kept calling himself "saint" after his noble title.
* He should be placed in the title screen and talk to new players. And also go blehh a lot. While the player is slightly translucent.
* If Fluffy is Pride incarnate, Terminal is Envy incarnate - gnawing, coveting value. It is only right that it would be put against a being of infinite value...
* Rewrite Warpwisp lore about Terminal seeing the world in glyphs as a ward against mind control.

**Souls**

* Shizapis, aster, borerora, aube.
* Buff purpizug.
* Ordered Harmony Soul.
* A passive Soul that does something cool when the deck is reshuffled. Maybe something to do with Serenes to make them less of a chore... Good synergy with purpizug.
* A soul that places a recall point when equipped, and teleports you back there when unequipped.
* A weird soul that induces a positive effect if your room path is executed in a certain way? This used to be rooms superposing each other...
* Non-serenes with effects on modulators.
* Cool soul that lets you swap the effects of two castes that sandwich the legendary in question.
* A soul that occasionally gives difficult "Simon Says" rules to follow. The player is rewarded for not transgressing.
* A Soul that freezes time in an area, and damages everything not frozen.
* Something that lets you use Glamorous or Harmonized versions of their souls outside their normal branches. - this might be managing to pull out a serene or a roseic out of the slot it's stuck to, leaving it influenced.
* Keep the invtree texture, use it as a cool legendary soul effect that has something to do with the inventory.
* probably terrible. cast empty soul slots on the wheel to lose them forever with a deranged legendary.

* Should extra inventory slots be unlockable throughout a run to scale player power?

**Insane/overly ambitious stuff**

*absolute madness below*

* The "Next World" is the world above, and all the Old World data is Higher Terminal's dream.
* The very first run of the game, you play as the first Terminal to ever encounter Fluffy, who spawns from Glamorous Toxin. She is not directly with you and spawns all the way in the Roseic Circus after a while, so you have time to learn the game.
* After you fail and the world is Harmonized, the Terminal in the world above wakes up from a terrible dream of Harmony, turning him into a carrier.
* Fluffy continues to harmonize infinite recursive worlds one by one, until the player finally stops it.
* This causes the world to go back to the "first run" model. At this point, you must rush the Roseic Circus before Fluffy ever becomes a thing to cut off the cycle once and for all.
* Then, you must remain behind and let yourself be consumed by the Old World's downfall to avoid the idea of Fluffy being transmitted to the upper realms, to truly end the spread.
* Possibly offer an alternative to forcepush Fluffy across all higher levels and also end the spread... by having nothing left to spread to.

* Inhalable Glamorous Toxin that transforms the current room into a hallucinatory version. Maybe Rose's soul does this.
* Rose himself should be found at the very bottom of hallucinations within hallucinations.
* The final boss being inspired by M. Industries. Inside Ronin's spaceship (built out of negentropic force), farm tokens on 4 plates while being assailed by the Harmony, and buy upgrades in the form of pushable boxes to give more firepower to Ronin's squad.
* Ronin's weapon should be a big-ass war vacuum.
* Also look into a possible internet component to this encounter.
* If a trailer is ever made it should not be a trailer, but rather pure boss battle footage with Zaint who criticizes the concept of trailers. After all, if an image is worth a thousand words, surely a video must be worth a million. Maybe put regular game footage in generic trailer format, with the Harmony subtly replacing elements here and there, or even pausing the music and showing off one of their rooms before the video switches to something else like nothing happened. Have them take over the footage progressively.
* Bringing Sugcha all the way to the end of the game should result in something funny.
* A Zaint-themed room that makes you forgo ever getting achievements to cleanse your mind of external motivation.
* Zaint should open a joke metaprogression shop that does something ridiculously insignificant, like 1/1 million chance of gaining 1 bonus damage per hit or changing the colour of something in the GUI.

**To use later**

**NOTE: If a wanderer of the Internet stumbles upon this log, the features mentioned in it are not finished yet and the text below may change. The reason I write these in advance is because pretending that I made great progress inspires me to actually make great progress. Fake it til' you make it. Everything I post in Sharing Saturday - that means, all previous devlog entries in this folder - are completed, of course.**

* Across their encounters with rooms featuring Harmony representatives, the player may be granted the opportunity to equip a Serene Soul, one of the possible Legendary souls that can reign over and alter the effects of one of the six Castes. Unlike other Legendaries, these can go into any Caste slot.

* Spells modified by the Serene Soul gain a very powerful conversion touch ability, which oneshots one enemy and turns them into an allied Harmonizer to assist the player in clearing the room. 

* However, each usage of this power causes a random Soul to be converted into the Caste in which the Serene Soul has taken root. Not necessarily that bad - you'll just get to use this awesome spell more often! Additionally, the player unlocks a new Harmonic Modulator slot for each Serene Soul they have incarnated.

* Harmonic Modulators are glass spheres containing an odd gaseous cybernetic. Should the player discover one of these rare trinkets, they may inhale the vapour to gain a new toggleable ability - usually some useful passive such as flight, combat actions taking less turns, or additional movement options. Each one also passively grants extra buffs to allied Harmonizers, like also giving them a conversion touch ability. Infectious! I have the code for a few of these already written at the time of posting this.

* To continue using an active Modulator, Souls from the player's repertoire will keep getting converted into the Caste the Serene Soul has taken root in, similarly to the Serene Soul's normal active effect. At this state, the risk of ending up with all your Souls belonging a single Caste can become a problem, but all it takes is some discipline to avoid using Modulators if they are not required for the current challenge. With the right temperance, using the Harmony's arsenal could become a fantastic asset to your character's potential!

* Should you go overboard and use one of these effects when there are no Souls left to convert, the Serene Soul will duplicate, and take root into *another* Caste, deepening your grave even further. 

* Serene Souls cannot be removed through normal means.

* Thus, the undisciplined player will find their character becoming corrupted from the inside by their own inventory, at an exponential rate that should prove difficult to stop. Desperate for a cure, they may become the victim of swindlers across the dungeon charging exorbitant prices - paid in Souls, of course - for pruning Serene Souls.

* Should the player have all 6 of their Castes infested, then the Harmony will have succeeded in its devious plan, and enlisted you to join their side. At this point, I'd like the game to continue with a kit fully reliant on summoning extremely buffed-up Harmonizers, and to potentially change the game's ending if I were to ever make a proper one.

*"A glass canister filled with wispy, pink vapour. The label reads, 'Once the fluorescent tubes' buzzing becomes unbearable, break immediately and inhale contents. May induce ego death.'"*

- Saints' Breath description

The dungeon branch that is currently known as the "Roseic Circus" will be *merged* with Faith's End, and will be made accessible only through the inhalation of the mysterious psychedelic toxin already used by some of the game's enemies - Saints' Breath. This should encourage the player to clear a few rooms, toke some of "that sweet pink stuff", and then *retrace their steps* as they now have a new series of hallucinatory creatures to fend off in these normally deserted rooms, with appropriate psychic-themed loot.

I'm really excited about this plan and the progress done this week, and I look forward to deepening this concept!

There is a purpose to this madness beyond simple atmosphere. Some [interesting waypoints]() are marked on Faith's End, but are technically unreachable through walking as they are located literal thousands of rooms away. This is where the protagonist's signature ability comes in - limited, but controlled reincarnation. The location where the game will continue following a non-final death can be *directed* according to which Souls the player chooses to sacrifice upon meeting their demise, and thus skip across megakilometres of concrete in the goal of exploring these mysterious landmarks. This furthens my game's design goal of "turning mistakes into tools for success".