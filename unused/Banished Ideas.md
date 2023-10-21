**Banishment Zone (unused/dropped, but fun to look at)**

**Initial "build your dungeon" idea**

* Start off in World Seed. Do the tutorial.
* Generate Souls by "dancing" with Zaint while the Harmony tries to get inside.
* Build your dungeon from Souls forced to dream about the Old World's past. It has to be easy enough for you to win, but hard enough to stop the Harmony from chasing you too fast.
* Escape into the dungeon and beat the boss to prove your worth. From the boss chamber, trade with the boss and rebuild to escape into another layer.
* Entering contact with the Harmony may cause them to start infecting created worlds from the inside... allowing options to trade for forbidden tech.
* Upon becoming OP enough, ascend back through the Serene Spire all the way to the topmost level and destroy the infection at the root to win.

**Map Variety Project**

* An image of a huge twisting maze, like brain coral. Coloured dots can be clicked to enlarge portions of Faith's End, corresponding to saved World objects.
* Actually, could the most interesting landmarks on the map be marked, and could the player control their respawning to approach them?
* The souls you sacrifice on death determine your respawn direction - towards an "Ideology pole" that contains an exit point, one for each caste. Should these "poles" expand as the game progresses, and cause a cataclysm if they ever touch the centre? This could be a nice replacement for "hunger clock" type mechanics.

The dungeon branch that is currently known as the "Roseic Circus" will be *merged* with Faith's End, and will be made accessible only through the inhalation of the mysterious psychedelic toxin already used by some of the game's enemies - Saints' Breath. This should encourage the player to clear a few rooms, toke some of "that sweet pink stuff", and then *retrace their steps* as they now have a new series of hallucinatory creatures to fend off in these normally deserted rooms, with appropriate psychic-themed loot.

I'm really excited about this plan and the progress done this week, and I look forward to deepening this concept!

There is a purpose to this madness beyond simple atmosphere. Some [interesting waypoints]() are marked on Faith's End, but are technically unreachable through walking as they are located literal thousands of rooms away. This is where the protagonist's signature ability comes in - limited, but controlled reincarnation. The location where the game will continue following a non-final death can be *directed* according to which Souls the player chooses to sacrifice upon meeting their demise, and thus skip across megakilometres of concrete in the goal of exploring these mysterious landmarks. This furthens my game's design goal of "turning mistakes into tools for success".

kind of sad all that epic code was thrown away but it is what it is

**Initial Serene mechanic idea**

* Across their encounters with rooms featuring Harmony representatives, the player may be granted the opportunity to equip a Serene Soul, one of the possible Legendary souls that can reign over and alter the effects of one of the six Castes. Unlike other Legendaries, these can go into any Caste slot.

* Spells modified by the Serene Soul gain a very powerful conversion touch ability, which oneshots one enemy and turns them into an allied Harmonizer to assist the player in clearing the room. 

* However, each usage of this power causes a random Soul to be converted into the Caste in which the Serene Soul has taken root. Not necessarily that bad - you'll just get to use this awesome spell more often! Additionally, the player unlocks a new Harmonic Modulator slot for each Serene Soul they have incarnated.

* Harmonic Modulators are glass spheres containing an odd gaseous cybernetic. Should the player discover one of these rare trinkets, they may inhale the vapour to gain a new toggleable ability - usually some useful passive such as flight, combat actions taking less turns, or additional movement options. Each one also passively grants extra buffs to allied Harmonizers, like also giving them a conversion touch ability. Infectious! I have the code for a few of these already written at the time of posting this.

* To continue using an active Modulator, Souls from the player's repertoire will keep getting converted into the Caste the Serene Soul has taken root in, similarly to the Serene Soul's normal active effect. At this state, the risk of ending up with all your Souls belonging a single Caste can become a problem, but all it takes is some discipline to avoid using Modulators if they are not required for the current challenge. With the right temperance, using the Harmony's arsenal could become a fantastic asset to your character's potential!

* Should you go overboard and use one of these effects when there are no Souls left to convert, the Serene Soul will duplicate, and take root into *another* Caste, deepening your grave even further. 

* Serene Souls cannot be removed through normal means.

* Thus, the undisciplined player will find their character becoming corrupted from the inside by their own inventory, at an exponential rate that should prove difficult to stop. Desperate for a cure, they may become the victim of swindlers across the dungeon charging exorbitant prices - paid in Souls, of course - for pruning Serene Souls.

* Should the player have all 6 of their Castes infested, then the Harmony will have succeeded in its devious plan, and enlisted you to join their side. At this point, I'd like the game to continue with a kit fully reliant on summoning extremely buffed-up Harmonizers, and to potentially change the game's ending if I were to ever make a proper one.


# Controlled Opposition

It was only a matter of time with the way my development was headed, but the player can now craft their own enemies. The UI for this is far from complete, but the code is there.

Saying it out loud sounds insane (and it very well might be), but it's more straightforward than it appears. Every TGFP enemy is a blank slate with some HP points and an AI that tells it to move and bump attack. That's it. All their special abilities come from the Axioms implanted in them, which create all kinds of programming-inspired logic blocks: "When taking a step, on self, stop for one turn, then place down a trap which, when stepped on, paralyses the creature that stepped on it".

The player was already crafting their own Axioms to cast spells. You might see where I am going with this: just let the player whip up some creative Axioms, implant those in a basic enemy, then spread clones of this new creature across the dungeon.

In this case, why not just create some hilariously suicidal creatures with thought-provoking Axioms such as "do nothing, then perish" or "heal your enemies every millisecond", then proceed to win the game without a trace of challenge? 

This ties in with the Harmony core mechanic - making creatures attack other things than the player is already a feature, through the charm/summoning magic effects. My idea would be that some Harmonic agents pursue you across the dungeon, and are slowed down by the enemies you have triumphed over, now respawned and working for you. If you only make utter weaklings, the Harmony will easily power through the opposition and reach your position in little time. If you make death machines, well, you will be the one to enter a die-and-retry loop while the Harmony spawn-camps you.

Lifecycle of an Axiom:

Feral nightmares generate chaotic axiom components.
Unhinged hunters capture them and dissect them.
Vile merchants collect and order parts in a treasury and distribute to Artistic.

Saintly creates blueprints to follow.
Artistic creates the Axioms from the blueprints.
Ordered collect Axioms and go insert them in scarab printers.
Scarabs get to Epsilon and make him OP.

**"Serene Collective" design**

Glamour injectors to safely view the Collective without being infected.
Sell your memories (nodes) to the Collective to cleanse yourself of infection.
Make creatures be able to be "injected" with serenes to harmonize them as a non-violent way of defeating enemies.
The infection starts with "drawbridge unauthorized access" while you are in a Vision.
The reason the player can't attack the intruder is because spells only work against those who believe in them.
Serene components should force the whole axiom to be serene.
Using a serene soul directly should imply some form of risk reward.
The soul quarry is "unrealized potential" to the harmony
Each death/failure makes the harmony wonder if you are making the challenges hard intentionally to betray them, which makes them spread the cyan light inside you to ensure your loyalty.
Harmonists can only be hurt by axioms no melee attacks

* Soul Press - convert 10 turbulent into 1 disciplined & 9 waste "pick off the bits and pieces that are primed for submission from the lot"

Universal laws on tiles, not enemies, who have their own Petrified souls

* The "Next World" is the world above, and all the Old World data is Higher Terminal's dream.
* The very first run of the game, you play as the first Terminal to ever encounter Fluffy, who spawns from Glamorous Toxin. She is not directly with you and spawns all the way in the Roseic Circus after a while, so you have time to learn the game.
* After you fail and the world is Harmonized, the Terminal in the world above wakes up from a terrible dream of Harmony, turning him into a carrier.
* Fluffy continues to harmonize infinite recursive worlds one by one, until the player finally stops it.
* This causes the world to go back to the "first run" model. At this point, you must rush the Roseic Circus before Fluffy ever becomes a thing to cut off the cycle once and for all.
* Then, you must remain behind and let yourself be consumed to avoid the idea of Fluffy being transmitted to the upper realms, to truly end the spread.
* Possibly offer an alternative to forcepush Fluffy across all higher levels and also end the spread... by having nothing left to spread to.