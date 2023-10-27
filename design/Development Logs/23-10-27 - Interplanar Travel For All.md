

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs))*

It has been a little harder cranking out code this week, but the forges of creation still blaze with maintained interest.

# Dastardly Traps

Some new devious creatures have been added to the world generation pool:

- the Arctic Phobist sits alone at the centre of empty rooms. Their constant dread of hypothermia permeates through surrounding minds, inspiring all to huddle and cuddle around it in search of warmth... Which tends to create dangerous piles of stacked foes, unleashed as soon as the Phobist is deactivated by a misfired ability. Its ability also extends to the player, making escape difficult when one is constantly being reeled in...

- groups of Ecstatic Ribbondancers gather in small and cramped areas, and chaotically bounce all over the place like they are super rubber balls. Getting through these gauntlets without getting trapped requires careful steps... which one may not always afford to take when one is being chased by a horde.

# Interplanar Travel for All

* A non-negligible quantity of techno-wizardry has now allowed me to keep loading and simulating creatures even when they are not located on the same Plane (floor) as the player. The technique used, which I like to call the "yellow pages", keeps an index of all specific creatures which are allowed to take input even if the player is not on the same Plane as them, and simulates their actions in a way that is accurate, but does not nuke the game's performance.

    * This is huge. I can't wait for the applications this new development will have, from banishing foes into pocket dimensions to programming bots to clear far-away Planes for you.

* A new special teleportation Axiom allows one to "astral project" into a pocket dimension from your current position, which may be extremely dire. It reminds me a little bit of DCSS's Okawaru Arena, but with a little more interdimensional flair. I've been thoroughly enjoying the related animation...