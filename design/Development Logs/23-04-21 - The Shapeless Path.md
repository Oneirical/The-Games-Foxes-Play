*"Where the Ordered forces do not have soldiers, they have traps. A careless step, and would-be looters become the looted, their every memory sold to the highest bidder on the hivemind's network."*

- Flavour text of A Click, Then a Flash, mutator component

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.2 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

*So* many changes. It is utterly insane how I either can't think about anything else but my game or can't bring myself to write a single line of code on any given day, no in between. I'm glad I can keep up the pace now, because The Plane Where Grass Is Touched has some exciting but time-consuming advancements in store for me in the coming weeks.

# Steps Shift The Mind

There are two new types of spell-crafting blocks: Mutators and Contingencies. This means that the structure of a spell is now as follows:

* **Contingency**: When [SOMETHING] happens...
* **Form**: ...target all [THESE] tiles...
* **Mutator**: ...make some [CHANGES] to the spell...
* **Function**: ...and unleash all kinds of [EFFECTS].

As an example, the following spell:

* **Contingency**: On taking a step...
* **Form**: ...target the tile in front of you...
* **Mutator**: ...set down a trap on the target with the following effect...
* **Function**: ...teleport the target away and deal damage where it lands.

does [exactly what it says on the tin.]()

Mutators and Contingencies are optional. Contingencies in particular tend to induce sacrifices and costs, as you are basically turning an active ability into a passive one - a very powerful thing.

Additionally, all spells now have a Potency rating dependent on which components constitute it. Power up GYVJI (a Function) with 4 Potency, and unleash shockwaves on impact! Increase the duration of applied status effects from SENET or KASHIA! There is also a potential Cost, most often found on Contingency blocks. Each time the spell is cast in any way, you will lose an X amount of Shattered Souls until you can no longer power the Contingency. How to get these Shattered Souls? By failing challenges and losing encounters, of course. In my game, failure is simply a different kind of step forward.

Maybe this is a bit complicated, but only a fool would settle out into a traditional roguelike journey with the goal of mass market appeal.

# Laws of Soul and Spirit

As the old burns to feed the new, many UI elements have been added and removed:

* There is a new [minimap]() viewable in the lower right corner, which dynamically updates every turn. The way it is rendered in the backend is... a bit gory (it is actually rendering outside of its frame, so I draw black rectangles to cover the overextending bits), but it *works* and I have noticed no performance issues.

* In the Legendary Soul menu, the minimap is replaced by a new display which contains all relevant information about your crafted spells: its Potency (blue number), its Cost (purple number), its Caste (colored symbol), its [Contingencies]() (yellow row), its [Forms]() (green row), its [Mutators]() (pink row) and its [Functions]() (orange row).

* There is now support for paragraphs and colored text in all text functions. This sounds so simple, but it was easily the most nightmarish thing on this list. Yet the result is [so glorious]()! Yes, Ulfsire, I have stolen the way you describe your powers in your game (Path of Achra) because I find the systematic layout to be very apt for a synergy-based game.

* The "Resolve", "Ipseity" and "Harmonic Relays" mechanics (and associated UI elements) have been all shown the door. A tragic thing, considering how I was really imagining the final product to include all of these as major mechanics, but as Souls shift and change, so does my game.

# Unlocking Memories of the Old World

There is now a "drawback" to crafting spells - each pattern used will now *permanently* [add a new feature]() used in the map generation of future Visions (dungeons). Most of the time, this is a creature. Can that charming spell component deal with the swathes of Felidols it just added to the monster pool? I say "drawback" in quotation marks, because it is basically the whole point of the game - you are adding more diversified creatures in your ultimate quest to recreate the Old World as it once was, with all its weird denizens.

The Faith's End facility (where the player begins the game) has also received a slight [touch-up]() for thematic purposes. Your existence is confined to only 5 vertical rooms, with the Saints' Voice hologram as your sole company. [Reinforced windows]() scattered across the corridor allowed the (now-long vanished) wardens to document your every motion. At the end of your containment chamber, an access gate with a few drawbridges allow access in and out of your cell - a privilege which is naturally not yours to choose.

Spoiler alert: those drawbridges won't stay locked for long. The cataclysm still rages outside the facility, and its perpetrators know you're trapped in there - your mind teeming with memories and an identity ripe for claiming. That will be something for a future week.

# Bonus: Tighten Your Seat-Belts

Oh, as I was tinkering around with some potentially fun spell combinations, here is a particularly hilarious one I stumbled upon:

* The EGO Form targets yourself (+4 Potency).
* The GYVJI Function causes all targets to be brutally punched backwards, until they collide with an object, at which point they take massive damage and emit a damaging shockwave (at 4 Potency or more).
* The PARACEON Function causes all targets to gain temporary invincibility for Potency x 1 turns.

This means:

* EGO-PARACEON: You become temporarily invincible. Neat but boring.
* EGO-GYVJI: You launch yourself into a wall and perish pathetically.
* EGO-PARACEON-GYVJI: You BLAST OUT like a ROCKET LAUNCHER and EXTERMINATE every bystander with the shockwave, and leave COMPLETELY UNHARMED.

For bonus fun, add a good Contingency, like the "on Step" one I mentioned above.

[Demonstration.]()