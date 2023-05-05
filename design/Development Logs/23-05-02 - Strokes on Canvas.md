*"To walk and let the mind wander is a dangerous thing. A thought pulls harder than the rest, one's gait softens into the grace of a Saint, tears turn to bright smiles, and before one knows it, one is no more."*

- Flavour text of Steps Shift The Mind, contingency component

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

After completing a few quests for the Plane Where Grass Is Touched last week, I was able to free up a lot of time this week to return to my cyber-grimoire. Here are the incantations I have concocted this time:

# Strokes on the Canvas of Dreams

A major flaw in the spell crafting system was just how *tedious* it was to extract exactly the Soul type you wanted for a given recipe. If you needed just one more Unhinged Soul for your spell but it was hidden underneath a pile of 50 Ordered Souls, it meant you had to mash your Q key 51 times. Not exactly engaging gameplay.

I have introduced a new thematic "brush" system - it causes your Soul wheel on the sidebar to become a palette with every Caste represented on it. This is only available in Soul Cage rooms, but it lets the player pick out a "color", and, well, draw. The mouse control is easier (just drag and drop, like Minecraft's crafting), but keyboard is also an option, requiring the player to walk over the cage to place their payload drive-by style.

This UI update comes with many quality-of-life additions related to the spell crafting system - including a complete catalogue at the bottom with every unlocked pattern (and its recipe), and a display predicting the outcome of the crafting recipe (with dynamic highlighting of where each component is found inside your Soul Cage).

Here is a complete [clip](https://youtu.be/8fUOl_JD-y4) of me assembling "BEAM-JOLTZAZON-RASEL-GYVJI", an interesting spell combination which fires a laser beam towards one target, spreads to all creatures adjacent to the target, then causes all the affected to: 

1. Get a status effect that will revive them on death as a friendly undead.
2. Get brutally punched backwards, probably killing them.

Using this combination, clearing [this room](https://youtu.be/IcC39rGpwqc) proves easy!

# Thought-Pattern Interference

Another flaw in the spell-crafting algorithm was the possibility of smaller patterns inserting themselves unexpectedly in bigger patterns. This meant that the structure:

* O O O

Contained simultaneously the patterns:

* O
* O O
* O O O

with each one of these three being an unique spell component. Most of the time, this flaw caused random status effects to appear unprompted in the player's crafted spells, resulting in "interesting" gameplay such as laser beams that make your enemies invincible or placing traps on top of yourself that instantly explode you to bits. In the worst cases, massive patterns could contain 12+ copies of many components, resulting in ridiculous oneshots, nukes and even an infinite loop softlock somewhere in there.

Chaos is fun, but there are limits. I have *completely overhauled* the pattern locator algorithm - now, if you want a specific pattern, it must be built without any adjacent Souls of the same type interfering. O O O creates *only* O O O, and nothing else. O O F creates both O O and F. An inattentive player can still craft hilarious suicide spells, but at the very least, it should now never happen to someone who carefully constructs their build.

This does make it more difficult to cram a lot of components in your limited 3x3 Soul Cage, but I have nerfed a couple of patterns to require less Souls to compensate. It will also be a bonus reason to upgrade yourself and get a bigger Cage later when I get around to making that!

# Sentries and Husks Surge Back

Finally, some old spells from version 0.2 have found their way back in, adapted and revised to fit the new spell-component system. "Joltzazon", for example, is now a very powerful Mutator that lets spells "spread" across adjacent targets, resulting in [amusing effects](https://youtube.com/shorts/Fp63Jid-aNo?feature=share). Abazon and Rasel have also returned.

I predict that next week will haul me back screaming into the abyss of responsibilities and will devour a significant chunk of my free time. I will still see if I can cook up something for next Saturday, my motivation levels are through the roof! I have some fine ideas cooked up...