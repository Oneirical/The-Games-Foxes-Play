*"A glass canister filled with wispy, pink vapour. The label reads, 'Once the fluorescent tubes' buzzing becomes unbearable, break immediately and inhale contents. May induce ego death.'"*

- Saints' Breath description

**The Games Foxes Play** ([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [original post](https://www.reddit.com/r/roguelikedev/comments/uzb3iu/sharing_saturday_416/iaa1w3u/) | [play online in browser on itch.io!](https://oneirical.itch.io/tgfp))

My motivation had been wavering in November, causing a long month of very little updates. How strange, considering how rent free my game's lore and mechanics had lived in my head during that time. This week, I asked myself, "Why didn't I feel like actually putting in the work?"

I figured it out. My game was *too disconnected*. It had these cool robot snakes, these laser beams, these epic towers with creatures punching the daylights out of each other, but it didn't feel like a place that actually had a *physical presence*. You weren't exploring some techno-spiritual dungeon, you were solving puzzles clearly labeled as "level 1" or "level 6" like it's some bus commute mobile game.

This week, I devoted myself to fixing this. No, it's not what I had planned in my last post. My lifeblood is chaos and my style is spontaneity. Design documents? Never heard of them.

## HyperRogue's Got a Contender

The most important feature was a **complete overhaul** of the way the game generates rooms. Now, leaving a room does *not* cause its existence to vaporize out of the program's memory, and every single cube your @ explores is neatly stored inside a World object. This means it is now possible to retrace your steps back to any previously explored location! Consider it the equivalent to this mystical "up-staircase" that befuddles so many roguelike developers.

Additionally, my game is no longer a linear corridor of utter boredom, but rather a twisted, sprawling maze. Each time a door is passed, a new room is generated and added to the world, while the previous ones remain in memory. This means two things: first, the dungeon is *infinite*, and second, it laughs in the face of the feeble laws of three dimensional space. Going in a loop pattern (→↓←↑) will result in reaching a *completely different location* than the original room. This latter mechanic is the result of ~~me being too lazy to program an actual room matrix that makes sense~~ reinforcing the atmosphere that the corridors of Faith's End truly embody the meaning of "mind over matter", fitting for its nature as a divinity's dream. I want the player to feel lost, and to occasionally ask themselves "wait, that didn't make sense..." while trying to parse the structure of the dungeon in their minds. For the game's setting to succeed, its world must feel "convincingly fake".

Dying (my game is still a roguelike, you have very limited extra lives, it's a whole mechanic) will also whisk you off to a *completely* new location, and *delete* the World object's maze you met your demise in, replacing it with a fresh one. You will *never* return to that previous location. Right when you start to feel a sense of familiarity and knowing your way around a few rooms, all it takes is a careless battle to go back to prodding in the darkness. I imagine Faith's End as this planetary-sized brutalist complex of dull stone and metal, so incredibly massive each reincarnation draws you thousands of kilometers away from your death point.

## The Illusion of Choice

Now, of course, there is the issue that in an infinite space, there is no difference between going left, right or forwards. A player who has understood the true nature of Faith's End could simply go in random directions and constantly uncover uncharted lands. While that illusion of choice does fit well with the game's lore, I have a plan to make one's path through the dungeon more meaningful.

The dungeon branch that is currently known as the "Roseic Circus" will be *merged* with Faith's End, and will be made accessible only through the inhalation of the mysterious psychedelic toxin already used by some of the game's enemies - Saints' Breath. This should encourage the player to clear a few rooms, toke some of "that sweet pink stuff", and then *retrace their steps* as they now have a new series of hallucinatory creatures to fend off in these normally deserted rooms, with appropriate psychic-themed loot.

I'm really excited about this plan and the progress done this week, and I look forward to deepening this concept!