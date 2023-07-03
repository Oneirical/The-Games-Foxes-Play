*""*

- 

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Hiding behind a crevice to escape a passing-by patrol of robots in Cogmind, taking two steps forward and one step backwards to clear the Elven Halls in DCSS... There's a lot to like about sprawling roguelike maps, with their many twists and turns presenting opportunity for crafty adventurers.

So, when I looked at my own game, and considered the loop of "clear square room of all enemies" -> "move to next room" -> "repeat", I couldn't help but feel something was wasted. Due to the structure of the tutorial I initially built my game from, when a room was left, it ceased to exist and entered a state of stasis until the player visited it again. 

I couldn't tolerate this any longer.

# Fields of Steel Stretch Forever

This has been quite the neuron-frying rework, but TGFP now has full-floor, interconnected maps! The layout is still based off square rooms linked with each other, but the most important feature is that **entities other than the player can now move wherever they please**.

The implementation proved quite challenging. First, to properly generate a unified map, I simply generate my regular dungeon with all of the "separated" rooms, then scrape the data from each one and build a single giga-room (>6000 tiles!) from the extracted information. I was expecting this process to turn my 128 MB VRAM, 8 GB RAM laptop into a miniaturized sun, but everything somehow remained perfectly fluid!

Then, to actually display the giga-map, I thought "let us just render every single tile and move the whole map around when the player moves". Bad idea. There was the miniaturized sun I was after.

Finally, I settled for a 30x30 grid of "projectors" which dynamically update every turn to reflect all tiles in range 15 of the player.

