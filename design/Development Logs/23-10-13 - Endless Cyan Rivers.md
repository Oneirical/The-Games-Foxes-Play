*"Gaze into my cyan eyes. See an ocean: your identity, a droplet drowned in endless lives."*

- Saintly Hologram, advertising its choice of starting Soul to new players

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io! (very old)](https://oneirical.itch.io/tgfp))*

I've done too much this week. I'm nearly at 1000 Git commits. Let's jump straight into it.

* Tiles have been removed. There are only creatures now.
  * There are now intangible creatures. They can move anywhere, completely unimpeded.
    * Yes, things such as the Well (stairs) or floor features are creatures. They have a Soul and everything. And you can become them. You can turn yourself into a walking stairwell and banish creatures into the tutorial level as you walk around.
  * Properties can be applied to pretty much anything. Those airlocks that slide open when you touch them? You can put that on an enemy. You can open your enemies. Literally.

* The new Axiom "Droplets Drowned In Endless Lives" turns other creatures into perfect copies of the caster in both body and Soul. You can have 10 clones of yourself walking around in perfect synchrony and copying all your Souls ("spells"). This is balanced, because each action also makes 10 turns pass due to the way Souls work (1 turn per clone).
* The new Axiom "Reality Torn Asunder" removes all safeguards and restrictions from all Souls. For example, combining that with the previous Axiom lets you turn the walls and stairwells into clones of yourself.
* The new Axiom "Timelines Snapped Like Twigs" makes associated Souls trigger every second. Not every turn. Every second.
* Merging all those 3 alongside some other fun Axioms has return an old enemy type I had retired months ago. The new Serene Harmonizer gradually consumes **the entire level with everything in it** by turning every piece of matter into a clone of itself.
  * This is actually the nerfed version. The initial prototype would literally conquer the entire game in seconds due to a hilarious chain reaction and drop my frames per second to 1.

* A new starter area presents the player with a choice of 1 out of 6 starter Souls. Which Caste will you pledge yourself to? Since this is practically one of the first things a new player will see, I am making sure to bring out the cool stuff right away. This is no choosing if you want to be a wizard or a warrior, this is choosing if you want identity takeover, soul swapping or gravity manipulation in your starting kit.
  * Actually making those 6 Souls is a work in progress. I have the Ordered one (knockback and teleports) finished, and the Saintly one (assimilation and clones) will be extremely easy to make. Artistic (soul swap) and Feral (gravity swap) shouldn't take too long. Unhinged and Vile are the ones I'm not too sure about. Their themes are respectively "greed and desire" (probably something about stealing abilities) and "distancing oneself from direct conflict" (probably something about summons or making a little pokémon team).

* Save and load system completely reworked.
  * Every time a creature changes either its Position, Species (and some other minor things), this gets tracked.
  * When the game is saved, the RNG seed is noted, as well as all the modified Positions and such of every creature in the game.
  * To reload the game, simply build the world using the same RNG seed, then move everything back into place.
  * Making it so Soul changes are tracked too is a work-in-progress, but should not be too hard.
* Complete rework of the rendering logic, which significantly improved performance and made movement animations much more satisfying.
* Tons of new lore and text for many different things.

I had the week off from any responsibility which allowed me to go full no-life and implement all this stuff. I expect the coming week to be *very* different. Nonetheless, I am still aiming for my objective of a new playable - and winnable - demo before the end of the year!