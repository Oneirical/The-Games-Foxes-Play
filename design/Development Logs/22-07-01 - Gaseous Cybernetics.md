I have a GitHub now! My code is accessible by all, and I hope programmers will recount its terrifying syntax around campfires to scare each other. I never had actual dev experience and learned everything from the internet, so, uh, what even are those "good practices" everyone talks about? Surely they don't have anything to do with the funny noises my computer fans make when I boot up my game...

**The Games Foxes Play** ([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [original post](https://www.reddit.com/r/roguelikedev/comments/uzb3iu/sharing_saturday_416/iaa1w3u/))

This week, I started work on diversifying the 4 branches of the game. Traditionally, roguelike players move between branches by finding entrances, but I think that's kind of boring. It makes every game start in a "Dungeon", locking away all the cool environments behind progression, and makes early splats extremely repetitive. In my game, you will always start in the same branch, yes, but every single time you *die*, you will randomly continue your adventure in one of the other branches. If you die in F:3, you may respawn in C:4, and when you later die in C:7, you might respawn in F:8. Dying in my game is part of the mechanics, and the amount of times you can respawn is your "real" HP bar. I was inspired by Felid gameplay in DCSS, after all.

Here are the 4 branches. Doing a certain action in each one will advance the "global progression", which will gradually spawn harder enemies, and bring the ultimate end of the dungeon closer and closer.

* **Faith's End** was the one seen in my previous gameplay demonstrations. It's a long series of small, claustrophobic rooms, which must be cleared to proceed. The focus here is on small-scale puzzles, positioning and strategy, and slow-paced gameplay. In the future, I plan to add a "maze" generator, and some hallways/L-shaped rooms for diversity. Clearing a room advances the global progression.

* [**Roseic Circus**](https://youtu.be/KXGA0U64PvM) takes place in a single large 18x18 room. The room's design is selected from a batch of prefab vaults - I will make more varied shapes in the future. Waves of enemies spawn one by one, and defeating a wave advances global progression. Gameplay here will be chaotic and wacky, with a focus on spamming infinite-use spells and destroying massive groups of enemies with impressive AOE power. Ziggurats from DCSS were my main inspiration here! There's also a hallucinogenic toxin that floats around the battlefield, causing some [strange effects](https://youtu.be/Mw5hvPocnuo).

* [**Serene Spire**](https://youtu.be/bmI63Udh0EE) -- the headquarters of the Harmony, the game's main antagonists -- is another "tight" area similarly to Faith's End. This time, there's a gravity effect, inspired from Hyperrogue's Ivory Tower. The threat of falling off the platforms in this vertical dungeon is ever-present, and doing so will result in instant death. Clearing a screen's worth of platforms advances the global progression. I plan that all enemies here will deal zero damage, and will instead use tricks, such as pushing you off into the abyss, or hijacking your inventory to use it against you. Gameplay here will be of the rushing, movement-based type, as exits are always unlocked, and actually trying to slay enemies here can get quite dangerous.

* **Edge of Reality** is the most "traditional roguelike" area I have. The generation is very reminiscent of a big cave, with limited Field-of-View to boot (though it does go through walls). Prefab vaults will be scattered around the expanse with a collection of difficult monsters, and activating the switch at the centre of the vault will advance global progression. The expanse is "infinite", in that places far away from you get constantly re-generated and shifted into different things, like DCSS's Abyss branch. No screenshots yet, I can get the cave generation to work somewhat, but it's a horrendous buggy mess that makes my computer fans go brrrrrr.

There is also new music, once again composed by my friend -- one for the Roseic Circus area, and one for a later section of Faith's End.

***

Another thing I worked on this week was solving a design problem. Think of my game's magic system as a deck of cards: you slay an enemy, you get a card with their spell on it (it's called a "soul"). You can also purchase really great spells at special Harmonic stations. The problem is that as the game progresses, you start to slay massive hordes of enemies, and your deck becomes bloated with 100+ basic and weak spells while the actual good spells are buried somewhere in there. This is boring -- what's the point of getting cool powers if you can only use them every 5 minutes?

Most designers may have done something like making it so there's only a 25% chance of soul drops on kill. I am not "most designers".

Enter the **Harmonic Modulators**. These creepy cybernetics can only be achieved through two means: found in the Serene Spire, or obtained from a perfect result at a Harmonic station. They are permanent items that you can activate/deactivate at any time. While they are active, you gain an extremely good status effect, like being able to dash every time you take a step, or making it [so drawing souls does not take an action](https://youtu.be/HxA64SkGFms). Additionally, all Serene souls (which are Harmony members in the game's lore) gain a special passive effect as long as your cybernetic is active.

The eerie part is that they constantly consume your "basic" souls while they are active. The ones that you loot from random common monsters. And while this is a good thing, as it cuts down the bloat from your inventory, it also makes your inventory much, much less diverse. Every time you use a Serene soul, another random soul in your inventory gets assimilated into a Serene soul. Less souls mean quicker conversion of your entire inventory, at which point you become Harmonized yourself.

These cybernetics *look* like they're free to use and even provide a benefit (purifying your items), but they are actually quite dangerous. Be careful, and do not fall for the Harmony's tricks!

Next up, I'll populate the Roseic Circus and the Serene Spire with some inhabitants. I have a few ideas already...