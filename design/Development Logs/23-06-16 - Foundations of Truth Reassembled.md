*"When a new thoughtform births, it already prods at the world around it before its first breath, latching onto symbols and patterns. Such primordial ideas are a delicacy among the upper castes."*

- flavour text introducing the player to the Feral caste

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

All this mind-numbing UI work was starting to take its toll. Last weekend, I was feeling so, *so* burnt out from all those pesky dancing pixels all over my screen trolling me and refusing to know their place. 

I even played some Cogmind for, ahem, game development research purposes, yes. I got to Access-1 for the first time! (and promptly got clapped). Above all, I couldn't stop being amazed at all the little touches to make the UI feel more computer-like - all of that must have taken months.

# Reassemble the Foundations of Truth

Something very ironic about my ["research web"](https://cdn.discordapp.com/attachments/504088568084561930/1119416024106795098/rWBIjpR.png) is how much it helps me develop my game. Every time I am wondering what to work on next, I just play my game filling it out until I hit a void of incomplete content preventing me from progressing in it. Then, I fill in the gap with Content™ and proceed to the next node. It really makes me feel like I am learning the arts of soul-weaving alongside my protagonist.

This time, the aforementioned gap required me to redirect my current focus towards a more fun part of programming than UI design: awesome spells. First things first, all of the 6 starter spells offered to the player were still running on the old system - just a big block of code working through arbitrary effects. This is simply unacceptable: I *must* show new players a glimpse of all the reality-shattering incantations they might be able to build with some creativity.

I removed all of that chaff. For context, my game revolves around crafting spells out of components like "select all targets near walls", "on all targets, apply a status effect" or "when a step is taken, automatically cast this spell". I expected to just slap together some of the components I had already made to give 6 examples of cool combos and call it a day.

Of course, I ended up remaking a huge chunk of my magic system in the process. It was simply inevitable. Such is the Onei way.

Before, the 4 categories of spell components (Contingencies, Forms, Mutators and Functions) were tangled in a whole package of obscure, arbitrary and hard-coded rules. To make this system even more ~~chaotic~~ flexible, I have completely done away with all these weird requirements. Each spell is now just an ordered list of components!

If I make "EGO, CLICK, EGO, PLUSCROSS, HARM", it will always have the same effect:

* EGO: Select the tile you are standing on.
* CLICK: Set down a trap on all selected tiles (in this case, just one). Push all following components in that trap's mechanism, then stop the spell.

So, the spell just plops down a trap under your feet with "EGO, PLUSCROSS, HARM" on it, and that's it. But what happens when something actually steps on it?

* EGO: Select the trap tile.
* PLUSCROSS: Also select all tiles in a cross formation, like firing a laser beam in all 4 cardinal directions.
* HARM: Deal damage to all entities in selected tiles.

So, not only does the trap damage the one who steps on it, it also explodes and deals significant collateral damage! 

What I just described is the Artistic starter spell (or "Axiom", as they are called in game). I have made 5 others, all with their own themed sequences. Let me show you the Feral one:

*deep breath* - "EGO", "TRAIL", "BLINK", "SPREAD", "IGNORECASTER", "HARM".

Let's work this through step by step. 

* EGO: Select the tile you are standing on.
* TRAIL: From now on, all entities on selected tiles will leave behind a "trail" that selects tiles as they move.
* BLINK: On all selected tiles (in this case, just you), the entity there dashes in the direction of its last move.
* The player dashes, and TRAIL is triggered, selecting all tiles they pass through.
* SPREAD: All selected tiles spread out to all adjacent tiles, selecting them as well.
* IGNORECASTER: From now on, the caster of this Axiom will not be affected by any effects of this Axiom.
* HARM: All entities on selected tiles take damage (except the caster, due to IGNORECASTER).

Simply put, dash, then strike all creatures near the dash!

Here's how [both of these spells look](https://vid.puffyan.us/embed/M-IFFOaRxxo) in game!

There are now 30 different Axiom components (named "Praxes" in game) available for mix-and-matching, with many more already designed and coming along. So many exciting contraptions await...! I've already started reworking the spell crafting room with a whole new algorithm, but that is unfinished and will be featured in next week's post.

# Thick Smoke Shrouds Understanding

I'm aware that all of this is pretty dense. I don't expect everyone to enjoy this type of gameplay, but I personally like it and I am making this game for myself first and foremost. However, I do understand that 3 trillion Axioms constantly firing over the place could become a clarity problem. The enemies have them too, after all.

I've noticed that many roguelikes operate with an "animation queue" - on your screen, you see the player fire their spell, then the spell travelling across the screen, then things exploding, then very unpleased archers firing back a volley at the player. In TGFP, right now, everything happens simultaneously, which does not aid comprehension in the slightest. 

However, Rift Wizard has an animation queue and its turns can last upwards of 15 seconds just because of it. I always played it on "XtraSpeed" mode where everything was instant.

For a compromise, I think I might add an option like this in my game, but also make it so entering a keypress while the animations are executing would instantly skip them and proceed to the next turn. I would show the tiles getting selected one-by-one by each component, then the effects occuring, and so on...

Well. Later. I don't want to touch the front-end code for a little while. In a perfect world, my game would be beamed directly into the player's consciousness without petty needs for "graphics" or "interface", but as I am shackled by my frail corporeal form, I suppose I must make do with making shiny buttons.

What an unfortunate fate.