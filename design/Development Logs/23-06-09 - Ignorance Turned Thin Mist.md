*""*

- Terminal commenting on his first sighting of the Harmony

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I have cloned my source code to Codeberg, because as they say, when it comes to backups - one is zero and two is one. Learned that the hard way recently after I casually deleted the backup of my giga-huge DCSS Felid guide a week before the DCSS wiki went splat.

# Dissipate the Mists of Ignorance

The research screen remake continues, and now looks snazzier than it ever was before. Animated tab selectors, removal of annoying scrolling, and sprawling skill trees!

In the original version, the code determining the unlock order and prerequisites was a simple database: "Vision" became available if both "Seed" and "Brush" were completed, for example. However, writing all of these connections was becoming extremely tedious with the sheer amount of nodes available. Instead, there is now a simple algorithm to make a theoretical liquid "flow" through the connectors and unlock everything it touches!