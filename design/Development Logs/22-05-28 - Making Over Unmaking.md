First time posting in one of these threads! While my project is still very nascent, it's starting to actually deviate from the sidebar tutorial it started from: the Broughlike tutorial in Javascript. A huge thank you to its writer! My dream roguelike had been floating in my mind for years now, but every time I tried to get started, I would bounce off due to not understanding how the libraries in the other tutorials magically did all the work for me. For any beginner/programming novice looking to get started, I highly recommend it.

***

**The Games Foxes Play**

*The cycle nears its end, and the Old World is crumbling once more, soon to be replaced by the Next World.*

*You are Terminal, the Vessel purposed to save the souls from this crumbling reality, so they may have another shot at life in the Next World.*

*As a Reality Anchor, your task is to complete a pilgrimage to the all-engulfing Vortex that heralds the end of reality, and the beginning of another.*

*It won't be easy. By carelessness, your existence has been made known to all.*

*Your tale spread around like wildfire, giving the people hope. Hope of immortality, hope of making a difference, hope of becoming a Reality Anchor like you.*

*And it is with this hope that these copycats will tear you apart.*

Gameplay consists of a maze of individual rooms. Whenever a room is entered, it must be cleared for the doors to open. This means that the layout is not an expansive cave system like most roguelikes, but rather self-contained, cramped interior spaces.

Slaying enemies awards the player with their Soul, available in **6** different types. Souls are the items of the game: there are no swords, sets of armour, or potions. Souls are stacked in a "deck of cards". You can draw from the deck of cards to equip Souls, and they can then be cast for a special effect. When a Soul is cast, it goes to the discard pile, and will cycle back for usage eventually.

Rooms can be cleared by slaying all enemies within, as one might expect. However, there is another way: **dying to the enemies**.

This will cause your foes to steal some of your Souls. For each foe left alive, one Soul is consumed. However, *you can choose which Souls they take away*. Generally, this will be used to remove useless and ineffectual Souls so they do not clutter your deck. A strong build is therefore the product of both victory and defeat, so you may accumulate the strong and expunge the weak respectively.

Of course, dying has a price. Whenever you are slain, you lose some **Ipseity**, which is your *real* HP bar. It represents your identity slowly slipping away after each reincarnation. When it reaches zero, you become not much more than a purposeless animal, and then the game truly ends. Conversely, slaying all enemies in a room reminds the protagonist of their purpose as a ferryman of Souls, and restores some Ipseity.

Special rooms can be found around the labyrinth. They each contain a mysterious NPC, a Serene Harmonizer, who will demand you sacrifice 6 souls in a gambling minigame of sorts. The Harmonizers, as their name might suggest, value uniformity and sameness above all, and favour players who are willing to focus their deck into only a single or a select few types of Souls. If you wish to impress the Harmonizers, you will need to throw away valuable Souls just because they are too different from the others, and also lose Ipseity in the process of that deletion. However, the loot granted by the Harmonizers is truly worth the gamble.

In a nutshell, this is the core principle. My main design goals are:

* Ensuring the player doesn't get oneshotted, but rather loses after many little mistakes

* Requiring zero grind or long walks across empty space, and constantly putting the player in danger

* Revealing extensive lore and worldbuilding without gameplay interruptions, through snappy dialogue (from the Souls and the Harmonizers) that's relevant to what the player is doing and flavourful descriptions

* Not making a game first and a story second -- they must complement each other through the mechanics

Here are some screenshots and gifs.

[Setting down a landmine with an Artistic Soul, then leading an enemy on it to blow it up](https://cdn.discordapp.com/attachments/504088568084561930/979962251219980298/artminereal.gif)

[Examining creatures with a cursor mode](https://cdn.discordapp.com/attachments/504088568084561930/979962252029485106/cursor.gif)

[Failing to slay all enemies in a room, and removing pesky Tainted Souls with that failure](https://cdn.discordapp.com/attachments/504088568084561930/979962252251787284/removal.gif)

[Sacrificing souls to a Serene Harmonizer named Fluffy](https://cdn.discordapp.com/attachments/504088568084561930/979962252532785232/sacrifice.gif)

Some examples of context-dependent dialogue:

[What happens if you try to sacrifice a Soul without standing on one of the altars](https://cdn.discordapp.com/attachments/504088568084561930/979962323672371250/Capture_decran_le_2022-05-28_a_00.18.56.png)

[What happens if you try to sacrifice a Soul on an already occupied altar](https://cdn.discordapp.com/attachments/504088568084561930/979962323894665226/Capture_decran_le_2022-05-28_a_00.19.10.png)

[What happens if you try to sacrifice a Soul that you do not have](https://cdn.discordapp.com/attachments/504088568084561930/979962324129562634/Capture_decran_le_2022-05-28_a_00.19.42.png)

Future developments are to add cooler, more diverse rewards to the gambling minigames, to create new areas with new palettes and tiles, and to add a reroll mechanic to the gambling minigame... at a price.