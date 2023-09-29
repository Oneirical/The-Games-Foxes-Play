*"There were a few who craved peace, who undid art in search of a moment without meaning. When they realized their zeal for annihilation was Artistic in itself, their cries could be heard even through the walls of Faith's End."*

- Stillness of Granite, Returned flavour text

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io! (very old)](https://oneirical.itch.io/tgfp))*

The Great Purge continues, with easily 25% of my old code having now been subjugated to utter annihilation. In doing so, I have finally achieved what I wanted: a world map that actually works!

# Many-Worlds Interpretation

I can now put all kinds of floor themes in [these](https://cdn.discordapp.com/attachments/504088568084561930/1157380710827573298/Capture_decran_le_2023-09-29_a_14.17.28.png?ex=65186648&is=651714c8&hm=ccd427521bd2fac7fd5410efcb48c981c135be4f4115c666c21aef91019e5c76&) little mosaics to connect them. Automatically, Hypnotic Wells are generated on each floor to allow passage between each layer. The transition is *seamless*, and I've put in so much work in making sure the illusion looked perfect. Some may have seen [my post](https://www.reddit.com/r/roguelikes/comments/16t8tih/an_alternative_to_stairs_in_my_workinprogress/) on r/roguelikes, which was, as much as I hate to admit it, quite motivating. Wretched crow-brained fool that I am, who judges worth according to internet clout!

Additionally, I've been working on a rework of the [UI sidebar](https://cdn.discordapp.com/attachments/504088568084561930/1157432738878603284/Capture_decran_le_2023-09-29_a_17.44.02.png?ex=651896bd&is=6517453d&hm=bb8783f3644675ccc16a5eda1712fe2a5bf6f6e798e6d910635431489286c24e&) to inspect creatures on click. I'm not too sure about those lore descriptions spoken in the protagonist's voice, it's a little cringe, uninformative and I'll probably be remaking those. However, it is much more minimalist than the last iteration! To match my recent Great Purge of many game mechanics, it only has a name, lore description, Soul menu and health bar. The latter capping at 4!

Indeed, every entity in the game can only have between 1 to 4 health points. Naturally, there is a catch - the system already allows for creating Souls like "up to 3 times, on death, respawn at full health". Every creature might be as squishy as a wet tissue, but with the power of soul-forging, nothing is impossible.

I am currently working on a saving-and-loading system (completely different from my failed first attempt) For this purpose, I am simplifying the data structures all over the game, making sure everything can be stored in a compact JSON file that isn't as long as the distance between the Sun and Proxima Centauri. It's actually quite the interesting puzzle! I've already made it so all RNG in the game is derived from a one word seed, which should save me the horrendous burden that would be storing the position of every single tile in the save file.

# Annoying Technowizardry

My crusty 8 years old laptop is now only capable of running my game at 30 FPS, which I judge to be a disgrace for a traditional roguelike. Yes, the GPU in it is ranked as "terrible" on [UserBenchmark](https://gpu.userbenchmark.com/SpeedTest/38173/IntelR-HD-Graphics-515), but that seems like a poor excuse for what is basically a 2D game with almost no animation. The game used to run a lot better on it, but I did something in the last month that wrecked it (while I was developing on another computer) and I have no idea what it was.

Meanwhile, the M1 Mac Mini I also tested my game on has perfect performance. I'm actually not sure what the community's expectations are - I know roguelikes are supposed to be able to run on glorified calculators, but how far do people stretch this? Are you exiled and unpersoned from the community should you dare release something that can't run on a Commodore 64?

I have a few ideas for optimization. But I don't expect it to be easy.