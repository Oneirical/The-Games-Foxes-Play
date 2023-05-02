*""*

- 

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

After completing a few quests for the Plane Where Grass Is Touched last week, I was able to free up a lot of time this week to return to my cyber-grimoire. Here are the incantations I have concocted this time:

# Rethink Patterns of Thought

The previous spell-crafting algorithm had... its share of problems. The main one being that it was possible to make patterns out of other patterns. This meant that the structure:

* O O O

Contained simultaneously the patterns:

* O
* O O
* O O O

with each one of these three being an unique spell component. Most of the time, this flaw caused random status effects to insert themselves unexpectedly in the player's crafted spells, resulting in "interesting" gameplay such as laser beams that make your enemies invincible or placing traps on top of yourself that instantly explode you to bits. In the worst cases, massive patterns could contain 12+ copies of many components, resulting in ridiculous oneshots, nukes and even an infinite loop softlock somewhere in there.

Chaos is fun, but there are limits. I have *completely overhauled* the pattern locator algorithm - now, if you want a specific pattern, it must be built without any adjacent Souls of the same type interfering. O O O creates *only* O O O, and nothing else. O O F creates both O O and F. An inattentive player can still craft hilarious suicide spells, but at the very least, it should now never happen to someone who carefully constructs their build.

This does make it more difficult to cram a lot of components in your limited 3x3 Soul Cage, but I have nerfed a couple of patterns to require less Souls to compensate. It will also be a bonus reason to upgrade yourself and get a bigger Cage later when I get around to making that!

