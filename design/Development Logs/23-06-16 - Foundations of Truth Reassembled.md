*""*

- 

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Something very ironic about my ["research web"]() is how much it helps me develop my game. Every time I am wondering what to work on next, I just play my game filling it out until I hit a void of incomplete content preventing me from progressing in it. Then, I fill in the gap with Content™ and proceed to the next node. It really makes me feel like I am learning the arts of soul-weaving alongside my protagonist.

# Reassemble the Foundations of Truth

All this mind-numbing UI work was starting to take its toll. Last weekend, I was feeling so, *so* burnt out from all those pesky dancing pixels all over my screen trolling me and refusing to know their place. I even played some Cogmind for, ahem, game development research purposes, yes. I got to Research for the first time! (and promptly got clapped). Above all, I couldn't stop being amazed at all the little touches to make the UI feel more computer-like - all of that must have taken months.

After some sulking, I grabbed my courage and decided to redirect my current focus on a more fun part of programming: awesome spells. First things first, all of the 6 starter spells offered to the player were still running on the old system - just a big block of code working through arbitrary effects. This is simply unacceptable: I *must* show new players a glimpse of all the reality-shattering incantations they might be able to build with some creativity.

I removed all of that chaff. For context, my game revolves around crafting spells out of components like "select all targets near walls", "on all targets, apply a status effect" or "when a step is taken, automatically cast this spell". I expected to just slap together some of the components I had already made to give 6 examples of cool combos and call it a day.

Of course, I ended up remaking a huge chunk of my magic system in the process. It was simply inevitable. Such is the Onei way.

Before, the 4 categories of spell components (Contingencies, Forms, Mutators and Functions) were being arbitrarily sorted to have Functions always be last and Contingencies always be first, alongside a whole package of obscure hard-coded rules. To make this system even more ~~chaotic~~ flexible, I have completely done away with all these weird requirements. Each spell is now just an ordered list of components!

If I make "EGO, CLICK, EGO, PLUSCROSS, HARM", it will always have the same effect:

* EGO: Select the tile you are standing on.
* CLICK: Set down a trap on all selected tiles (in this case, just one). Push all following components in that trap's mechanism, then stop the spell.

So, the spell just plops down a trap under your feet with "EGO, PLUSCROSS, HARM" on it, and that's it. But what happens when something actually steps on it?

* EGO: Select the trap tile.
* PLUSCROSS: Also select all tiles in a cross formation, like firing a laser beam in all 4 cardinal directions.
* HARM: Deal damage to all entities in selected tiles.

So, not only does the trap damage the one who steps on it, it also explodes and deals significant collateral damage!

Some are very straightforward: the Saintly axiom is composed of "PLUS, HEAL". This means, in a plus-shaped cross, heal all entities.

Some spice things up a little: the Vile axiom is composed of "SMOOCH, ATKDELAY, HARM". SMOOCH hits only the tile in the direction of the caster's last move or attack, and HARM does exactly what it says on the tin. However, the Mutator component ATKDELAY forces this Axiom to only execute on the player's next attack. All of it combined makes it so the player's next attack does massive damage!

Finally, some are just wild like the Feral axiom, composed of - *deep breath* - "EGO, BLINK, TRAIL, SPREAD, IGNORECASTER, HARM".

Let's work this through step by step. First, it's important to note that Axioms are composed of Praxes, which always begin with a Form and end with a Function. The Forms here are EGO and TRAIL. So, the two Praxes are:

* EGO, BLINK
* TRAIL, SPREAD, IGNORECASTER, HARM

First, EGO and BLINK is quite simple: on self, blink in the direction of the caster's last move until an obstacle is met.

Then, TRAIL draws a line between the original and new position of every creature that moved (in this case, only yourself), and makes all of those tiles on the line Targets. SPREAD makes every adjacent tile to those Targets also become Targets.

Finally, IGNORECASTER prevents the spell from backfiring, and HARM damages everything in the vicinity of the player's blink.

In short, dash in the direction of your last move, and hit everything that stood close to the path of that dash!

All these components can be used to make all kinds of ridiculous combos. I quite like this one here: BEAM, ASPHA, TRAIL, SPREAD, BLINK, GYVJI.

# Thick Smoke Shrouds Understanding

I'm aware that all of this is pretty dense. I don't expect everyone to enjoy this type of gameplay, but I personally like it and I am making this game for myself first and foremost. However, I see that the 3 trillion axioms simultaneously firing over the place could become a clarity problem. The enemies have them too, after all.

I've noticed that many roguelikes operate with an "animation queue" - on your screen, you see the player fire their spell, then the spell travelling across the screen, then things exploding, then very unpleased archers firing back a volley at the player. In TGFP, right now, everything happens simultaneously, which does not aid comprehension in the slightest. 

However, Rift Wizard has an animation queue and its turns can last upwards of 15 seconds just because of it. I always played it on "XtraSpeed" mode where everything was instant.

For a compromise, I think I might add an option like this in my game, but also make it so entering a keypress while the animations are executing would instantly skip them and proceed to the next turn.

Well. Later. I don't want to touch the frontend for a little while. In a perfect world, my game would be beamed directly into the player's consciousness without petty needs for "graphics" or "interface", but as I am shackled by my frail corporeal form, I suppose I must make do with making shiny buttons. What an unfortunate fate.