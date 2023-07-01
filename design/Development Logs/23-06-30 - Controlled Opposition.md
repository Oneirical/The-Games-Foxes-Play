*"What divides Unhinged from Artistic is not so different from what separates carbon from diamond. In each strike, the artisans of motion inject a part of their selves, expressing passion through pain as their canvas."*

- flavour text of "Polish Rage To Sheen", an Artistic Function that delays the execution of a spell until the next basic attack

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Well, I'll be honest. I had this whole giga-rework planned of my enemy placement system, with some wild ideas thrown into the mix - such as every single denizen of certain rooms spontaneously transforming into other types at certain intervals. I tried to get started on implementation last Saturday and Sunday, but all I did was stare blankly into my monitor as if the protagonist of my game had stolen my soul. Something was wrong.

My previous design idea was probably doomed from the start. Multiple annhiliated features already rot in the virtual graveyard that is my Git history, and I did not want another to join them:

* It would have been tedious to learn all these enemy types, a major flaw of DCSS & co. with the "oh, you died to eels? just use a wand of flame! oh, you died to Nessos? just use a wand of polymorph!"

* It would have taken dozens of hours to make, when it isn't even linked to the two core mechanics of my game.

I have to retain some humility and remember what my game is really about: the Axioms crafting system and the Harmony system. Everything else should derive from one of these!

It is after a deep introspection session while I was turned into a floor puddle and listening to new age music that a revelation came to me: *Why do work when you can have the player do it for you?* Tongue in cheek, I attest, but this design philosophy has served me well so far - I wasn't sure how to make interesting dungeons, so I allowed the player to design their own layouts, and I wasn't sure how to mass produce interesting spells, so I devised this entire magic-crafting system ("Axioms") that has now wormed its way into "Core Mechanic" status.

# Controlled Opposition

First, I've cut down the amount of different enemies down to a measly 6. It was a tough choice choosing which would be the chosen ones, but I ultimately settled on a mix of some of my favourites, alongside some simple ones which I judged would make a good introduction to the game's mechanics. Each of these 6 representatives have been polished to fully utilize the game's Axiom system.

For example, Greedswept Felidols now contain the Axiom "ONDEATH","EGO","DEATHCLICK","CLICK","EGO","SUMMFELIDOL". This means:

* ONDEATH: When this creature dies...
* EGO: On the tile it stands on...
* DEATHCLICK: And considering that all future CLICK blocks will be triggered by entities dying on top...
* CLICK: Set down a trap on that tile, triggered only by death due to DEATHCLICK. The trap contains EGO, SUMMFELIDOL.

The Axiom ends there as CLICK is an endpoint. So, the Felidol has been reduced to glistening purple shards on the floor, grasping at the false life they once had... Until the player slays a different enemy while it is standing on the trap!

* EGO: On the tile it stands on...
* SUMMFELIDOL: Summon a new Felidol!

Thematically, the Felidol is grasping the soul of the defeated to reassemble itself. Technically, this Axiom is completely mutable, and nothing really stops the system from replacing "EGO" with, say, "BEAM" and removing DEATHCLICK AND CLICK, thus shooting forth laser beams of Felidol summoning. As the protagonist of my game would say, desire separates what is from what is not!

I concocted a *lot* of plans on where to bring this next, but as there is approximately a 10% chance that I will drop this entire idea and go back to the drawing board, it will be the topic of a future post. They say game ideas are a dime a dozen, but honestly, *good* ideas are surely worth more than that.

Until then...

# Daydream Vertigo

Not only are Dreamscapes now directly accessible from the Soul Cage (the room they used to be in, the World Seed, will probably be removed), there is now a [dizzying](https://vid.puffyan.us/embed/vzHl4Thi7lQ) zoom animation for entering and exiting them! Initially, [only the hologram would enlarge](https://vid.puffyan.us/embed/R7sikUKbx6k), which looked quite poor. Thank you #roguelikedev on the Discord for the much superior suggestion!

Screenshake effects have also returned, to my great amusement. Time to make some explosions!

I was really expecting this to be difficult - and was pleasantly surprised at how simple it turned out to be. It is giving me hope for some other eye candy here and there, such as less jarring transitions when passing through airlocks, or perhaps the ability to zoom in and out of the game view!