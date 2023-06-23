*"As the Vile found out, the simplest way to exclude oneself from a rule was to be the one to write it. All it took was a couple of souls who loved the feeling of subservience, and the gears of oppression had already started to turn."*

- flavour text of Law Stands Above Law, Vile Mutator (forces spell effects to ignore the caster even if they are in the blast zone)

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

More remaking of old features to fit the PIXI.js rendering library, more toiling in the UI mines. Gah! At least I may have something more interesting to look forward to in the near future.

Reddit continues to implode into a fine nugget as large as the attention span of its new target audience, it seems. Things might get heated next week. I'm glad that I am hosting all these posts I make on my git repositories.

# Perfectly Planned Paintings

The Soul Cage room, where TGFP's core crafting mechanic takes stage, has regained all of its auxiliary UI panels! The player may view all kinds of craftable Praxes in a sidebar catalogue, consult the current state of the Axiom being crafted, and pinpoint the location of all placed patterns. [Demonstration!]().

After an Axiom has been crafted, it may be equipped in this work-in-progress but overhauled [inventory screen](). On the sidebar, all Praxes inside each Axiom are listed, and can be described on a simple mouseover.

The Soul Cage room has also received this curious panel in the bottom left with a lot of numbers - it is a primitive implementation of my new Influence mechanic, which should be a dynamic way to scale both player power and encounter difficulty together.

I've only just started implementing this latter mechanic - so far, there are 8 different "Influence" pools, which can be incremented by unlocking research nodes and subduing Souls attributed to each Caste. My goal is to make a sort of "point shop" for the game itself, in which Influence will be spent automatically to purchase challenges and enemies relevant to what the player is doing. An adaptative dungeon, if you will! This is in the experiment stage and will be discussed more next week.