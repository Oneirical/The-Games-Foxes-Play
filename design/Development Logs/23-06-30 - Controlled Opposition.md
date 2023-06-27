*""*

- 

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Well, I'll be honest. I had this whole giga-rework planned of my enemy placement system, with some wild ideas thrown into the mix - such as every single denizen of certain rooms spontaneously transforming into other types at certain intervals. I tried to get started on implementation last Saturday and Sunday, but all I did was stare blankly into my monitor as if the protagonist of my game had stolen my soul. Something was wrong.

My previous design idea was probably doomed from the start. Multiple annhiliated features already rot in the virtual graveyard that is my Git history, and I did not want another to join them:

* It would have been tedious to learn all these enemy types, a major flaw of DCSS & co. with the "oh, you died to eels? just use a wand of flame! oh, you died to Nessos? just use a wand of polymorph!"

* It would have taken dozens of hours to make, when it isn't even linked to the two core mechanics of my game.

I have to retain some humility and remember what my game is really about: the Axioms crafting system and the Harmony system. Everything else should derive from one of these!

It is after a deep introspection session while I was turned into a floor puddle and listening to new age music that a revelation came to me: *Why do work when you can have the player do it for you?* Tongue in cheek, I attest, but this design philosophy has served me well so far - I wasn't sure how to make interesting dungeons, so I allowed the player to design their own layouts, and I wasn't sure how to mass produce interesting spells, so I devised this entire magic-crafting system ("Axioms") that has now wormed its way into "Core Mechanic" status.

First, I've cut down the amount of different enemies down to a measly 6. It was a tough choice choosing which would be the chosen ones, but I ultimately settled on a mix of some of my favourites, alongside some simple ones which I judged would make a good introduction to the game's mechanics.

Then...

# Controlled Opposition

It was only a matter of time with the way my development was headed, but the player can now craft their own enemies. The UI for this is far from complete, but the code is there.

Saying it out loud sounds insane (and it very well might be), but it's more straightforward than it appears. Every TGFP enemy is a blank slate with some HP points and an AI that tells it to move and bump attack. That's it. All their special abilities come from the Axioms implanted in them, which create all kinds of programming-inspired logic blocks: "When taking a step, on self, stop for one turn, then place down a trap which, when stepped on, paralyses the creature that stepped on it".

The player was already crafting their own Axioms to cast spells. You might see where I am going with this: just let the player whip up some creative Axioms, implant those in a basic enemy, then spread clones of this new creature across the dungeon.

In this case, why not just create some hilariously suicidal creatures with thought-provoking Axioms such as "do nothing, then perish" or "heal your enemies every millisecond", then proceed to win the game without a trace of challenge? 

This ties in with the Harmony core mechanic - making creatures attack other things than the player is already a feature, through the charm/summoning magic effects. My idea would be that some Harmonic agents pursue you across the dungeon, and are slowed down by the enemies you have triumphed over, now respawned and working for you. If you only make utter weaklings, the Harmony will easily power through the opposition and reach your position in little time. If you make death machines, well, you will be the one to enter a die-and-retry loop while the Harmony spawn-camps you.

