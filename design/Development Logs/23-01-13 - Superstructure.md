*"TODO"*

- TODO

## The Games Foxes Play
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play online in browser on itch.io! - does not feature this week's additions](https://oneirical.itch.io/tgfp))*

I am awed by Caves of Qud's overworld map. Every single tile is itself composed of 9 full screens, and each of those screens contains hundreds of tiles. Qud is *massive*, and it is that sense of scale that makes the player feel like Qud is a living, breathing world.

So, naturally, when I was sitting in front of my "random ideas" document at the start of this week, the first thought that sprung to mind was:

*"What if we went even BIGGER"?*

## Giga-Mega-Ultra-Superstructures

**TGFP**'s narrative takes place in a gargantuan, but very monotonous complex of concrete and fluorescent tubes known as Faith's End. Built by no living soul, it is only the product of a primordial force that constantly strives to turn anything basic into complex systems. Left alone, grains of sand turn to pebble, which turn to factories producing deranged, overly complex pieces of engineering that serve zero purpose. It's... fairly big as a result.

*Very* big.

I naturally had to reflect this through the gameplay. Enter [my new map UI](). Each of these square icons reflect in real time the contents of each room, and are updated should their terrain change for any reason. This UI can fit 9x9 rooms, for a total of 81.

Zooming back, this suite of 81 rooms fits in a single [pixel]() of this world map, which itself fits as a single pixel in [this]() map of the entire universe. My game's total capacity thus reaches precisely 531441 rooms.

Naturally, there is some illusion and artifice going on here. The glorified calculator that serves as my computer would not be very happy at the thought of generating each and every single dust speck of Faith's End. In fact, at the start of the game, a single room is generated - the World Seed - and as the player explores and uncovers new rooms, these are saved and added to the map. Still, I amuse myself to imagine a new player zooming out the map and realizing in horror that it simply *doesn't stop*.

There is a purpose to this madness beyond simple atmosphere. Some [interesting waypoints]() are marked on Faith's End, but are technically unreachable through walking as they are located literal thousands of rooms away. This is where the protagonist's signature ability comes in - limited, but controlled reincarnation. The location where the game will continue following a non-final death can be *directed* according to which Souls the player chooses to sacrifice upon meeting their demise, and thus skip across megakilometres of concrete in the goal of exploring these mysterious landmarks. This furthens my game's design goal of "turning mistakes into tools for success".