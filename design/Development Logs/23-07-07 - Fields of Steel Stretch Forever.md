*"And yet. I know so much, and care so little. Defeaned by chatter, weighed down by revelations - I am all, but wish to be none."*

- Terminal getting pensive about their quest

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Hiding behind a crevice to escape a passing-by patrol of robots in Cogmind, taking two steps forward and one step backwards to clear the Elven Halls in DCSS... There's a lot to like about sprawling roguelike maps, with their many twists and turns presenting opportunity for crafty adventurers.

So, when I looked at my own game, and considered the loop of "clear square room of all enemies" -> "move to next room" -> "repeat", I couldn't help but feel something was wasted. Due to the structure of [the tutorial](https://nluqo.github.io/broughlike-tutorial/) I initially built my game from, when a room was left, it ceased to exist and entered a state of stasis until the player visited it again. 

I couldn't tolerate this any longer.

# Fields of Steel Stretch Forever

This has been quite the neuron-frying rework, but TGFP now has [full-floor, interconnected maps](https://vid.puffyan.us/embed/X0H_527_edQ)! The layout is still based off square rooms linked with each other, but the most important feature is that **entities other than the player can now move wherever they please**.

The implementation proved quite challenging. First, to properly generate a unified map, I randomly generate a 9x9 grid of "walls" and "floors" with no isolated floors, then pave each "floor" with a prefabricated vault, chosen at random among multiple possibilities. Finally, I scrape the data from each "vault" and build a single giga-room (>6000 tiles!) from the extracted data. I was expecting this process to turn my 128 MB VRAM, 8 GB RAM laptop into a miniaturized sun, but everything somehow remained perfectly fluid!

Then, to actually display the giga-map, I thought "let us just render every single tile and move the whole map around when the player moves". Bad idea. There was the miniaturized sun I was after.

Finally, I settled for a 30x30 grid of "projectors" which dynamically update every turn to reflect all tiles in range 15 of the player. It's just like DCSS - the player always remains at the centre, fully enabling any narcissistic tendencies the user may have!

Following this implementation, I struggled very hard to bring back the zooming animation from last week. Initially, it was skewed and caused an annoying lag spike at the end. I worked 5 hours to fix it, butchered my game completely beyond repair and had to undo all changes. Fun. 

In the end, some performance testing revealed that the big memory-hog was the function assigning sprites to every single tile, *including the black space between the rooms*. All it took to fix the lag was a single line of code in the graphics engine: "if tile is not in play area, return".

# Cyan Suns Burn the Horizon

The scope for the coming months is... a little imposing. I have a significant addition I wish to add to the core gameplay loop, and I also want to overhaul the pathfinding algorithms from basic-baby Greedy Manhattan Distance to something a little more appropriate for a 81x81 map. So far, the *only* things tanking my performance have been graphical issues - the back end has never caused any problems. From what I've read about the nightmare A* & friends can be, I expect this may change soon.

I sometimes regret a little choosing JavaScript to get started (but I think harder languages would have demotivated April 2022 me, even though I would be able to handle them now). I am getting frequently trolled by "undefined" types parasiting my data and coming out 5 minutes later to break everything. But, on the other hand, I am massively benefiting from the lack of compile times (offset a little UI element by 3 pixels and instantly see the difference!).

These next weeks will either be glorious or a train wreck. No in between.

