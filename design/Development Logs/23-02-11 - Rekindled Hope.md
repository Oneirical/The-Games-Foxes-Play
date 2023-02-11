*"After their fangs were done toying with your flesh, they had taken away much more than sinew and bone. Your soul turned Feral, and the last lights of duty and purpose were soon snuffed out like a candle flame, leaving nothing but a ravenous husk."*

- Permadeath message upon dying to a random basic enemy

## The Games Foxes Play
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I'm late, so I'll keep this short.

So, apparently, it turns out that throwing random stuff into a pile, giving it a good shake and then tasting it is not conducive to good design. Since the start of 2023, I have pretty much butchered an initially fun but simple concept by adding tons upon tons of features that served no further purpose beyond reducing the Fun™ factor:

* A knockback-based combat system that turned out to be a pain to work with in the game's cramped spaces
* Full-blown map generation that accomplished little beyond adding arbitrary down-time and backtracking that serves no purpose
* Putting those maps inside a giga-maze-map which has, again, done nothing except purposelessly make any kind of save & load function a living hell to implement
* A lore rewrite that caused a lot of previous content to stop making sense, and which made it so adding future content that made sense would be horrendously difficult

I have to return to my roots. I spent literal hours trying to get a JSON save & load system to work, but it's simply hopeless. There is simply no way I can fit literal hundreds of thousands of tiles inside a JSON document, where each one also has a cyclic reference to a creature which also has a tile object... Abhorrent. Maybe some code archmage could make this work, but it doesn't matter if the game isn't even fun.

I won't give up, though. I already gave up on projects like this way too many times. I don't want to go back to idle daydreaming.

I have a new plan. A new structure with a narrowed-down scope that should hopefully let a save & load feature happen. Something that just takes what worked in the beginning and allows the player to gain more control over it. I know myself and can expect that I can put this idea into much saner words once I've properly translated it from Onei-Delusions into implementable code, so I will talk about it more next week. I actually thought this through over multiple days, so this hopefully won't be another case of designer-delirium.

I won't throw that trio of unfortunate features in the trash, though. I'll recycle the knockback-combat in some gimmick enemy, I'll keep the map system as a core part of my new strategy, and as for the maze... Well, it can procedurally generate mazes. Surely that can fit somewhere in a roguelike game!