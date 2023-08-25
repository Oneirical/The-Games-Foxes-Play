*"Do you see what I see? A universe which has traded every bit of turmoil or suffering for order and conformity. A place where all thinks, walks and is alike."*

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Finally, I know where I am going. There is approximately a 48.94% chance that 1 week from now, I will have a new GENIUS IDEA that is totally SO MUCH BETTER than what I just spent effort on and that's ABSOLUTELY WORTH nuking half my code for.

Hopefully that doesn't happen, because I think that what I just did here is quite cool.

# Ideology Delivery

[This]() is Epsilon's Industrial Apex. A lonely factory between the planes. Here's a quick run-down of the layout:

* A (Yellow) : This is Epsilon's big room. He is the yellow snake. He starts out disabled and completely paralyzed, because he doesn't have his Soul yet, but he continuously radiates an electromagnetic aura.
* B (Purple) : This is the portal from which the player, named Terminal, comes from. It leads to the player's spawnpoint/starting area.
* C (Pink) : This is the Scarab Waypoint. Two Soul Injectors perpetually maintain a beam inside the inner chamber, which has been secured by airlocks due to it being a mind-warping hazard.
* D (Green) : This is the Scarab Fabricator. Every so often, it spits out a Plated Thoughtferry, which is a simple creature which will immediately seek out the Scarab Waypoint.
* E (Red) : This is the portal from which a Felidol Programmer comes from. It links to a place that doesn't exist yet, but will eventually. The Felidol will also rush to go to the Scarab Waypoint.
* F (Blue) : This is a garnison of slug-robot guards, on stand-by for any emergencies.

Here's how this works. 

* The Felidol Programmer carries the Soul of Epsilon. It brings it into the Scarab Waypoint, where it is installed inside the Soul Injector. 

* The Plated Thoughtferry then comes, steps inside the chamber, and receives the Soul of Epsilon. It also has its destination reprogrammed to seek out Epsilon instead of the Waypoint.

* The Plated Thoughtferry arrives in the vicinity of Epsilon, and gets immediately detonated by Epsilon's aura. Its Soul falls to the floor, which is immediately sucked inside Epsilon.

* Now that Epsilon has his Soul, he is activated and begins the pursue the player.

Additionally, should a Plated Thoughtferry ever be destroyed prematurely, the identity of the one who destroyed it will be broadcasted to all within the facility as a cry for revenge. This will immediately cause the entire garnison of slug-robots to awaken, and seek out the criminal like a swarm of bees.

Currently, there is no filter to give Epsilon the special authorization to destroy these cute scarabs, so as soon as he breaks a single Thoughtferry to collect his Soul, literal civil war begins in the complex in an epic showdown between snake and slug.

It's worth mentioning that all this behaviour is coded using Souls, the game's core mechanic. For example, [here's what makes a Plated Thoughtferry tick](). A little ASCII computer chip of sort! When it is slain, ContinKilled triggers, LastDamageSource identifies the culprit, and AssimilateBroadcast overwrites the data of all the slug-robots to pursue "the culprit" instead of "nothing". As for the letter "P", it is linked to the Scarab Waypoint - but the mind-warping beam inside the latter will change that to Epsilon instead.

Making these is a puzzle of its own. For example, [this soul](), used to control Epsilon, genuinely felt like I was playing a logic game trying to connect everything. A snapshot of the challenges which await the player, as they too will be invited to assemble some of these...

And yes, should the player be foolish enough to step inside, they too will be reprogrammed in such a way that every time they try to move in the East direction, they will be irresistibly pulled towards Epsilon instead, just like a Thoughtferry would.

I am most excited by all these possibilities. If you need something dead, why not pop a lonely, innocent Thoughtferry, then Soul-Swap yourself with your foe, so that they get collapsed on by a dozen angry slugs while inside your old body? Why not subtly replace the Felidol Programmer's payload with something noxious, such as "when a turn passes, take 1 damage", so that Epsilon will self-destruct upon absorbing his Soul? Why not free the Soul Injectors from their chambers by giving them a Soul which allows movement, and have them cause havoc around the facility as they reprogram everything, and stunlock Epsilon with the paradoxical "when a turn passes, move towards Epsilon"?

There's a lot to do. But I like what I see.