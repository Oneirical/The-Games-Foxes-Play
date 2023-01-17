*"TODO"*

- TODO

## The Games Foxes Play
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play online in browser on itch.io! - does not feature this week's additions](https://oneirical.itch.io/tgfp))*

My neurons are fuming and my grey matter has been crushed into a viscous slimy paste. But at last, it is done.

[BEHOLD.]() My brand new, 100% organic, GMO-free random dungeon generator. Fully featured with 2x2 rooms, corridors, dynamic paths that never create isolated areas and prefab vaults.

If I took a time machine and showed this to myself from May 2022, he would ask, bewildered, "Wow, Onei, how did you become so good at programming?" My esteemed clone, it is all artifice and illusion. For starters, the function that decides where rooms are allowed to spawn in the first place is the *exact same* as the one that used to choose where to build walls in a given square room. In fact, when I generate a new dungeon, I am *generating a room that does not exist* with assorted walls and floors. Then, I replace all the floor tiles with rooms, each one containing walls and floors. A dungeon is basically a room built out of rooms. Meta.

Then, with the assistance of a couple of [capital crimes against the very concept of programming](), I look for sets of 4 1x1 small rooms and replace them with a single 2x2 big room, I turn rooms with exactly 2 neighbours into corridors, and I sprinkle in some pre-defined structures here and there that I talked about more in my last Sharing Saturday. Finally, I place exits on every single possible connection and call it a day.

It is unholy. It is abject. It is vile.

But it *works*.

## Rooms Within Rooms Within Rooms

Naturally, after completing this atrocity, I had the thought any sane man should have in my place: ["Why stop there?"]() Each and every single white pixel of this twisted maze contains *one entire* dungeon. Considering that the average dungeon map is composed of 9x9 rooms and that the maze is composed of 72x72 pixels, that makes for a grand total of 648x648 rooms' worth of space, or approximately 420 000 rooms. The universe is therefore a room, made out of rooms, which are also made out of rooms. The glorified calculator that serves as my computer would not be very happy at the thought of generating each and every single dust speck of this complex, so dungeons are only generated if the player visits them by exiting from the extremity of a previous white pixel.

Yes, the maze is procedurally generated. No, I didn't make the algorithm for it. I checked the license, don't worry.

