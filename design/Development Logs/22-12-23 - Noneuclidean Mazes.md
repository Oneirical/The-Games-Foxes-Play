*"The gate has opened, revealing the arrays of pistons and tubes within. One seal broken, one more nail in the coffin of the Old World."*

- Unraveled Seal description

**The Games Foxes Play** ([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [original post](https://www.reddit.com/r/roguelikedev/comments/uzb3iu/sharing_saturday_416/iaa1w3u/) | [play online in browser on itch.io!](https://oneirical.itch.io/tgfp))

My motivation had been wavering in November, causing a long month of very little updates. How strange, considering how rent free my game's lore and mechanics had lived in my head during that time. This week, I asked myself, "Why didn't I feel like actually putting in the work?"

I figured it out. My game was *too disconnected*. It had these cool robot snakes, these laser beams, these epic towers with creatures punching the daylights out of each other, but it didn't feel like a place that actually had a *physical presence*. You weren't exploring some techno-spiritual dungeon, you were solving puzzles clearly labeled as "level 1" or "level 6" like it's some bus commute mobile game.

This week, I devoted myself to fixing this. No, it's not what I had planned in my last post. My lifeblood is chaos and my style is spontaneity. Design documents? Never heard of them.

## HyperRogue's Got a Contender

The most important feature was a **complete overhaul** of the way the game generates rooms. Now, leaving a room does *not* cause its existence to vaporize out of the program's memory, and every single cube your @ explores is neatly stored inside a World object. This means it is now possible to retrace your steps back to any previously explored location! Consider it the equivalent to this mystical "up-staircase" that befuddles so many roguelike developers.

Additionally, my game is no longer a linear corridor of utter boredom, but rather a twisted, sprawling maze. Each time a door is passed, a new room is generated and added to the world, while the previous ones remain in memory. This means two things: first, the dungeon is *infinite*, and second, it laughs in the face of the feeble laws of three dimensional space. Going in a loop pattern (→↓←↑) will result in reaching a *completely different location* than the original room. This latter mechanic is the result of ~~me being too lazy to program an actual room matrix that makes sense~~ reinforcing the atmosphere that the corridors of Faith's End truly embody the meaning of "mind over matter", fitting for its nature as a divinity's dream. I want the player to feel lost, and to occasionally ask themselves "wait, that didn't make sense..." while trying to parse the structure of the dungeon in their minds. For the game's setting to succeed, its world must feel "convincingly fake".

Okay. Maybe I'm just hyping myself up over some "it's not a bug, it's a feature" kind of deal. As I continue development, I will decide whether I want sensible room geometry or not. It would certainly make a minimap much easier to implement.

Dying (my game is still a roguelike, you have very limited extra lives, it's a whole mechanic) will also whisk you off to a *completely* new location, and *delete* the World object's maze you met your demise in, replacing it with a fresh one. You will *not* be returning to that previous location without external help. Right when you start to feel a sense of familiarity and knowing your way around a few rooms, all it takes is a careless battle to go back to prodding in the darkness. I imagine Faith's End as this planetary-sized brutalist complex of dull stone and metal, so incredibly massive each reincarnation draws you thousands of kilometers away from your death point.

This implementation challenged my neurons quite significantly, and it caused a few weird quirks. I am grateful for the commenters from [yesterday's thread](https://www.reddit.com/r/roguelikedev/comments/zsn3fw/what_are_some_of_your_most_cursed_examples_of/) - thanks to the advice I received, I figured out that the invisible player clones were in fact the player entity getting "saved" alongside everything else in the room just before the room transition actually happens. Now, I made it so the Player entity isn't saved upon leaving a room, which seems to have fixed the issue in a much cleaner way! As for the "player phased out until they move" bug, I realized that this was because the player entity was actually getting placed in the *previous* room they just came from, and that the real position was only updated after calling the move function. I changed the player spawning function to be based off the level itself instead of arbitrary coordinates, and now it works like a charm!

## The Illusion of Choice

Now, of course, there is the issue that in an infinite space, there is no difference between going left, right or forwards. A player who has understood the true nature of Faith's End could simply go in random directions and constantly uncover uncharted lands, never bothering to retrace their steps. While that illusion of choice does fit well with the game's lore, I have a plan to make one's path through the dungeon more meaningful... stay tuned.