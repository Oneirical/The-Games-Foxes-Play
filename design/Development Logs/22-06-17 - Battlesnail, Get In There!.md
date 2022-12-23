**The Games Foxes Play**

Greeting once again to the community! Lots of things have happened this week.

First, I showed my game extensively to an esteemed online friend of mine, and quickly got him obsessed with the lore and mechanics. He now wishes to join me on my quest to make this project happen, in the form of making the game's music. It may not be in the league of big bucks orchestral AAA epic themes, but it certainly works with the atmosphere I'm trying to convey.

The theme I'd like to showcase here plays in the very first room of the game. Named ["The Cage"](https://www.youtube.com/watch?v=wHub2nob2jI), it radiates with ominous drones, glitching computers and wailing sirens, immediately letting the player know that A) this is a high-technology setting, and that B) the game's universe is in a state of crisis. I simultaneously crafted the spawn room it goes with this week -- the World Seed, the prison the game's protagonist has been locked away with for their entire life. It's a tangled mess of neon green wires and machines, claustrophobically encased with impenetrable black steel, and watched over by a holographic messenger announcing the world's doom over and over.

Yeah, I know. It's a little bit hard to convey with my glyph-based art style, but I hope the writing in the examine descriptions and the OST will create that feeling of uncertainty and dread I seek to convey. Perhaps I will decorate the room some more with some extra decorative tiles!

***

Next up, I made a batch of new Souls (they are the spells of the game, basically) and enemies. I'd like to show off one of the latter in this post: the fabled, coveted and turbocharged BATTLESNAIL (actual name: Shelled Electromedic). This enemy cannot move on its own, and is fully dependent on the reactor placed on its shell, which randomly shoots BEAMS OF LIFE AND DEATH every turn. It is propelled in the direction of its lasers, and also heals all enemies/damages players and friendly units in the beam path. So far, it's extremely amusing to watch them dash around the battlefield and [absolutely obliterate me](https://www.youtube.com/watch?v=CA4ZZZ8Izyg). They're also invaluable when charmed, because they can then be used for self-healing.

***

Finally, I properly implemented the game's "gamble" system through which the player will obtain their items and powers that aren't just "tickle the enemy with your one-damage dash". It's a bit unusual, so I'll try my best to explain it as straightforwardly as possible.

* By killing enemies, you harvest their Souls. Souls come in 6 different basic types. Each type is worth a number from 1 to 6. For example, killing an animal will award you with a Feral soul, worth 2.

* In the Harmonic Relay room at which the "gamble" minigame is played, you are invited to sacrifice 6 "basic" Souls in exchange for 4 powerful, uniquely designed ones.

* Here's how you can sacrifice souls. First, start with the equation **ABC - DEF = Result**. 

* You must draw two basic Souls, and attribute them to two letter slots. For example, I draw a 5 and a 2. I place them in C and E. Now, we have **AB5 - D2F = Result**.

* I draw two more. 4 and 4. I send them to A and F. **4B5 - D24 = Result**. Finally, the last two. 1 and 4. I plug them in the last slots B and D. **415 - 424 = -9**

In the game, this is an *extremely* good result. Why? **Because you want to get as close to 0 as possible.** You may notice here that the dominating strategy here is pulling out Souls that have the same number, or at the very least are close to each other. The only way to get to 0 is, in fact, with a perfect set of 3 pairs of identical Souls.

This is very intentional. The creatures overseeing this mini-game, the Harmonizers, believe that *only in uniformity do we flourish*. They will reward best those who adhere to the Harmonic Truth. In my example, I managed to pull out three Artistic souls, worth 4, and also an Ordered soul, worth 5, which are quite similar, and pleased the Collective greatly. Here's another example of the mini-game in action, this time [in video](https://www.youtube.com/watch?v=uRchzwUR6i8). The Harmonizer at the centre has a lot of dialogue, and will comment on illegal actions, your final result, and inform you about the rules if you bump into her.

So, the entire game becomes this bounty hunt of sorts - of selective killing of the type you wish to devote yourself to. Now, some... parasites will naturally slither into your inventory because of the many AOE attacks available to players, which is what the game's "failure lets you remove mistakes" mechanic is for. I talked about it more in my [introductory post](https://www.reddit.com/r/roguelikedev/comments/uzb3iu/sharing_saturday_416/iaa1w3u/).

Of course, there will eventually be an option to defeat the Harmony with their own tools...  or to join them. Indeed, if you are unhappy with the outcome of the trade, you can ask for a reroll. However, it comes at a seemingly minor cost - the addition of a single Serene soul to your inventory.

Serene souls are quite powerful, letting you convert enemies to friendly Harmonizer summons that fight for you. The twist is that each use will transform a random soul in your inventory into another Serene soul. The more you rely on the Harmony's graces, the more the corruption within you grows (or purification, as the Collectivists would say)... *until you become one of them*.

The Harmony is central to the game's lore and themes, and I hope that even players who don't really care about the story will still be unnerved by these think-alike members of a hivemind forcing them to play in accordance with their assimilationist ideology to survive.