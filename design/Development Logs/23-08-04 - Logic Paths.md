"A monolithic mass of pink glass, its monotony broken by a complex maze-like pattern spreading within. Its alluring colours and patterns invite you to find an exit to this impossible, titanic puzzle - an offer to be denied, should you wish to remain fully in control of your destiny."

- Roseic Blowglass flavour text

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I have hauled myself back from confusion into fanatic creation. And with this state of mind comes insane reworks and reimaginings...

For a quick showcase, **[here is a video showing off pretty much everything in this post.](https://vid.puffyan.us/embed/990epP62SbU)**

# Sparks of Logic Surge Through Synapses

*Yet* again, the game's core "Axiom" mechanic has been rebuilt from the ground up. Each Soul now contains a Logic Map, which is basically a little electrical circuit. Current begins at certain nodes when something happens, and travels through the network, causing various effects, until there is nothing left to trigger.

In simple terms, it's basically showing a simplified version of the game's source code to the player and letting them edit it while playing.

The Player's Soul, for example, contains the circuit:

* Trigger Node: When the "W" key is pressed...
* Locate the tile north of the Player...
* Move towards it, or break circuit if impossible...
* Then transmit to all entities the radio broadcast code "EON". (This basically means, "a turn has ended").

This is a fairly simple rendition of "when pressing W, go up", but it's fully malleable. Potential ways to "hack" this include:

* Add a "Harm" component right after locating a tile, to get the classic roguelike ability to bump-attack.
* Remove the "EON" transmitter, to stop time and walk around with infinite turns.
* Locate the furthest accessible tile north instead of an adjacent one, replace "move towards" with "teleport to", and get a rocket-boosted dash.

Epsilon the robotic giga-snake is back, now running with this new system. It's a multi-tile enemy with squiggly, slithering fashion. The "Logic Map" is fairly complex - but roughly, every other turn, the head moves in the direction of the player. However, Epsilon also "paints" the floor in red underneath him, which lets the tail segments know where to move to retain the snake formation.

* Trigger Node: When code "EON" is received...
* Flip all adjacent Boolean Gates from true to false or vice versa
* Boolean Gate: true - if this value is "false", interrupt circuit here
* Locate the tile on which this entity (Epsilon) stands...
* Paint that tile red...
* Remove all located tiles from memory...
* Locate the player's tile...
* Move towards it...
* Then transmit to all entities the radio broadcast code "SLITHER1".

Potential ways to "hack" this include:

* Remove the Boolean Flip, making Epsilon permanently deactivated
* Paint a ton of tiles in red with a Soul of your own, to throw off the pathfinding
* Replace the target (you, the player) with the "nearest creature" to have Epsilon eat his own tail (the segments are considered to be independent creatures)
* ...or do that, but also filter out Epsilon himself to make him go rage mode and attack everything that comes near.

[Here is what happens if I replace the "EON" trigger with triggers that respond to directional keys...](https://vid.puffyan.us/embed/J-1iqbYr7zw) I become Epsilon!

# Perfectly Timed Steps

* Boring empty doorways have now been replaced by sliding airlocks, as can be seen in the above videos. Pshhhh!

* There is now a hallway of lasers which occasionally generates in Epsilon's domain. Each of these coils has a Logic Map of its own, like any other entity in the game. Roughly, they tick down a certain counter and zap the other coil across the hallway when it reaches zero. A funny way to hack it would be changing the "laser link" to yourself instead of the other coil, [causing absolute havoc](https://vid.puffyan.us/embed/NF93UE7s-yg). That's right, every coil on the map is drawing a laser-line between me and itself every time it would fire.

# Why Do All This And Not Just Hardcode It Like A Normal Person

My vision has endlessly reshaped itself since I started this project, but now, I am pretty adamant that what I really want is a game that requires you to exploit it to win. I think I'll be giving Epsilon some completely broken logic chain (example: on each turn, heal all surrounding entities - since it's a snake it just means the segments will be healing each other ceaselessly). Then, the player will be tasked to engineer something to counteract the problem making Epsilon invincible - to follow up on this example, just separating the segments would be enough!

To this end, in addition to all the ideas I already presented, they could craft a Soul that knocks segments of the tail out of the way, they could forcefully inject a Soul inside Epsilon that transforms healing into damage...

To tell you the truth, I have no idea how this will ever be balanced or if this will even make for an interesting game. I will have to make sure enough "hacks" are available to craft fun tools, but that "I win" combos like:

* When damaged, heal that amount
* On each creature except yourself, damage 9999

will be inaccessible until the end game, or be counteracted in a certain way.

No matter what, I'm having fun doing these things and it beats splatting FeCKs in Dungeon Crawl Stone Soup, so there's that.