""

- 

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I have hauled myself back from confusion into fanatic creation. And with this state of mind comes insane reworks and reimaginings...

# Logic Paths

*Yet* again, the game's core "Axiom" mechanic has been rebuilt from the ground up. Each Soul now contains a Logic Map, which is basically a little electrical circuit. Current begins at certain nodes when something happens, and travels through the network, causing various effects, until there is nothing left to trigger.

In simple terms, it's basically showing a simplified version of the game's source code to the player and letting them edit it while playing.

The Player's Soul, for example, contains the circuit:

* Trigger Node: When the "W" key is pressed...
* Locate the tile north of the Player...
* Move to it...
* Then transmit to all entities the radio broadcast code "EON".

This is a fairly simple rendition of "when pressing W, go up", but it's fully malleable. You could easily replace:

* "locate north tile" with "locate tile of random creature on screen" 
* "move to it" with "do damage" 

and just make it so you blow up random creatures when pressing "W".

"EON" just means a turn has ended. Most creatures have "when receiving EON, do something" - if the EON block was removed, the player would effectively walk around in a world where time has stopped.

Epsilon the robotic giga-snake is back, now running with this new system. It's a multi-tile enemy with squiggly, slithering fashion. Let's take a look at the head's Logic Map:

* Trigger Node: When code "EON" is received...
* Flip all adjacent Boolean Gates from true to false or vice versa
* Boolean Gate: true - if this value is "false", interrupt circuit here

This first section just means that while "EON" is sent every time the player does something, Epsilon is only allowed to act every other turn, since their Boolean Gate keeps getting flipped every time. Next up:

* Locate the tile on which this entity (Epsilon) stands...
* Paint that tile red...
* Remove all located tiles from memory...

"Painting" a tile doesn't do anything except marking it for other circuits for various purposes. Keeping this in mind...

* Locate the player's tile...
* Move towards it...
* Then transmit to all entities the radio broadcast code "SLITHER1".

And that's it. The head moves towards the player... but what about Epsilon's tail? The first tail segment is the only entity programmed to receive "SLITHER1":

* Trigger Node: When code "SLITHER1" is received...
* Locate the tile on which this entity (Tail Segment) stands...
* Paint that tile red...
* Remove all located tiles from memory...

We already saw this part - the Tail is also painting its own tile in red. Why is that? Let's keep going:

* Locate all adjacent tiles...
* **Remove all located tiles not painted in red from memory...**

This is the relevant part! Only the tile that Epsilon's head once stood on before moving remains in memory after that.

* Move towards that only remaining tile...
* Clear the paint on that tile...
* Then transmit to all entities the radio broadcast code "SLITHER2".

The next tail segment receives the code SLITHER2, and does the exact same process, this time using the paint left behind by the first tail segment to know where to move.

**TL;DR: Epsilon's head marks its current position, then moves towards the player. Then, the snake instructs the next tail segment to mark its position, then move to the position marked by the head.** And so on, until the entire snake is dragging its bulky body in the direction of the player, once every other turn!

# Why Do All This And Not Just Hardcode It Like A Normal Person

My vision has endlessly reshaped itself since I started this project, but now, I am pretty adamant that what I really want is a game that requires you to exploit it to win.