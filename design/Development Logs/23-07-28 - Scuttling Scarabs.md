"The Ordered know nothing of creation, destruction or transformation - they preserve, simply put, and their digital minds cannot conceive anything but."

- flavour text on Ordered Souls

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I've been having a few DCSS addiction issues in recent evenings, where the bulk of my limited development time is located. Hopefully the last horrendous FeCK run will knock some sense into me. It's almost as if a D:2 Mana Viper is Xom speak for "go back to programming NOW!".

Despite this lapse in discipline, progress has been made:

* The ["zoom-teleport"]() has been reworked for what is probably the 8th time by now. I lost count. What DOES matter is my success in optimizing away that annoying lag spike RUINING my immersion. (I did this by pre-loading some assets on game start) I personally think it looks very awesome now.

* Epsilon's "Industrial Apex" level has had some random generation returned to it despite my statements from last week, because it took almost no effort to bring it back and I still want to have the right to post in a place named "**roguelike**dev".

* I have implemented A* pathfinding! I was really expecting a nightmare here, but things went very smoothly. All I had to do was steal some (MIT-licensed) code (and read this [excellent article]() to understand it better)! So far, zero lag has been noticed even though every entity running it is updating their path every single turn. I remember reading that Cogmind ran into performance issues with the trillion service bots running around, though, so I may be forced to optimize this later on (say, by only recalculating the path if something obstructs it).

