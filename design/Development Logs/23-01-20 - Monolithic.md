*"A legendary parasite attracted to hosts thinking of it. As the cure to this strange disease was simply to find a way to entertain one's mind away from the worm's presence, patients reported greatly increased moods after being cleansed of its influence. Ezezza eventually became aware of its own existence, perishing instantly."*

- Flavour text of **Ezezza, the Unthinkable**, a Legendary Feral Soul

## The Games Foxes Play
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.2 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

*0.3 (including everything related to map generation from last week and this week) will release on itch.io soon after I've fixed some weird interactions with the reincarnation mechanic.*

My neurons are fuming and my grey matter has been crushed into a viscous slimy paste. But at last, it is done.

[BEHOLD.](https://cdn.discordapp.com/attachments/504088568084561930/1066029723160956969/Capture_decran_le_2023-01-20_a_11.21.00.png) My brand new, 100% organic, GMO-free random dungeon generator. [WITNESS.](https://cdn.discordapp.com/attachments/504088568084561930/1066029723395829851/Capture_decran_le_2023-01-20_a_11.20.45.png) Fully featured with 2x2 rooms, corridors, dynamic paths that never create isolated areas and prefab vaults. [ADMIRE.](https://cdn.discordapp.com/attachments/504088568084561930/1066029723681038416/Capture_decran_le_2023-01-20_a_11.20.29.png)

If I took a time machine and showed this to myself from May 2022, he would ask, bewildered, "Wow, Onei, how did you become so good at programming?" My esteemed clone, it is all artifice and illusion. For starters, the function that decides where rooms are allowed to spawn in the first place is the *exact same* as the one that used to choose where to build walls in a given square room. In fact, when I generate a new dungeon, I am *generating a room that does not exist* with assorted walls and floors. Then, I replace all the floor tiles with rooms, each one containing walls and floors. A dungeon is basically a room built out of rooms. Meta.

Then, with the assistance of a couple of [capital crimes against the very concept of programming](https://cdn.discordapp.com/attachments/504088568084561930/1066030166456926218/Capture_decran_le_2023-01-20_a_11.22.27.png), I look for sets of 4 1x1 small rooms and replace them with a single 2x2 big room, I turn rooms with exactly 2 neighbours into corridors, and I sprinkle in some pre-defined structures here and there that I talked about more in my last Sharing Saturday. Finally, I place exits on every single possible connection and call it a day.

It is unholy. It is abject. It is vile.

But it *works*.

## Rooms Within Rooms Within Rooms

Naturally, after completing this atrocity, I had the thought any sane man should have in my place: ["Why stop there?"](https://cdn.discordapp.com/attachments/504088568084561930/1066030433747341343/Capture_decran_le_2023-01-20_a_11.24.07.png) Each and every single white pixel of this twisted maze contains *one entire* dungeon. Considering that the previously demonstrated dungeon map is composed of 9x9 rooms and that the maze is composed of 72x72 pixels, that makes for a grand total of 648x648 rooms' worth of space, or approximately 420 000 rooms. The universe is therefore a room, made out of rooms, which are also made out of rooms. The glorified calculator that serves as my computer would not be very happy at the thought of generating each and every single dust speck of this complex, so dungeons are only generated if the player visits them by exiting from the extremity of a previous white pixel. Notice the red exits leading out of the current dungeon at the eastern and southern extremes of the [third screenshot](https://cdn.discordapp.com/attachments/504088568084561930/1066029723681038416/Capture_decran_le_2023-01-20_a_11.20.29.png). Northern and southern exits would lead into a black pixel of the maze, so they remain blocked.

Yes, the maze is procedurally generated. No, I didn't make the algorithm for it. I checked the license, don't worry.

## The Rivers Will Run Cyan

As an experimental feature, I added a quick [pandemic simulator](https://cdn.discordapp.com/attachments/504088568084561930/1066031424102219806/itspreads.gif) to my maze-world map. Starting from a single room, the Harmonic song flows across the Faith's End complex like a plague, assimilating everything it touches. I've been tossing ideas around for an equivalent to the dreaded hunger clock, with the aim to incite the player to hurry up a little during their exploration. Instead of having the *player* character growing weaker as their belly empties (which is lame), why not instead have the *dungeon* itself gradually lose turf to an indiscriminate, all-conquering force and its very strong Collectivist enemies? This concept is still in the design phase, but it would fit extremely well with the game's themes.

Otherwise, I am having some doubts on how I will actually manage enemy encounters. This week, I overhauled the terribly outdated "spawn X enemies where X is the number of cleared rooms+1" function and replaced it with a neat squad system that picks themed assortments of enemies to team up against the player. However, I'm still hesitant on the specifics. Once the rooms hit the 12+ enemies mark, things start to get quite crowded, but I want to continue scaling the difficulty (and the player power level)! Due to TGFP's design, it's really hard to just make things hit harder or tank more hits and call it a day (which is lazy design, anyhow!)

I'm also honestly not so sure about the title of my game. I picked it *very* early because I was listening to [this excellent dark ambient track](https://www.youtube.com/watch?v=cw56kZ5I8-4) on that day and thought the name was beautiful and mystical-sounding (especially given the context of the song). In my game's flavour, the Harmony's air elementals enjoy taking the vague shape of fox spirits as they go about their plots of conquest (which are non-violent and full of tricks and traps), so it felt fitting. I am however not a fan of the fact that an (admittedly unpopular) finance self-help book is the first result when looking this title up on a search engine. In truth, none of the candidates I've thrown around have proven as poetic...