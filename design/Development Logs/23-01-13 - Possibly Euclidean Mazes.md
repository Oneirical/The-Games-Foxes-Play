*"A pocket of unreality, void of the concept of void itself. Your gaze fills it with your flawed preconceptions of what nonexistence must be like - to you, it is a sparkling expanse of starry lights, dancing among the nothingness. To try to step within this space would be just like trying to rewind time before the birth of time: impossible."*

- Nonexistent Nullspace description

## The Games Foxes Play
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play online in browser on itch.io! - does not feature this week's additions](https://oneirical.itch.io/tgfp))*

**TGFP**'s narrative takes place in a gargantuan, but very monotonous complex of concrete and fluorescent tubes known as Faith's End. Built by no living soul, it is only the product of a primordial force that constantly strives to turn anything basic into complex systems. Left alone, grains of sand turn to pebble, which turn to factories producing deranged, overly complex pieces of engineering that serve zero purpose.

Given this setting, it made quite little sense to build it from a chaotic dungeon generator! I wanted the game's environment to be built out of designed, symetrical and orderly parts, but that coalesce together to form deranged, nonsensical twists and turns where opening a door that leads into a gaping void is just an average day.

To this end, I had to implement a mechanic which many other aspiring roguelike developers have no doubt wrestled with - prefabricated rooms and vaults.

## Designed for Maximum Violence

Is it not [sumptuous](https://cdn.discordapp.com/attachments/504088568084561930/1063554864157839520/Capture_decran_le_2023-01-13_a_15.26.58.png)? With this new mechanic (which took surprisingly little time to develop), making new rooms has never been easier. There are now 10 different configurations which the player can find themselves challenged by on their way to face Epsilon, from the very cramped FaithBridge (and its associated Nullspace abyss) to the expansive GrandHall (and its zoomed out view). Some of these, with the "randomflip" tag, will even receive random rotations to vary things up! I could - and will - make many more, but I had something else taking up all my development time.

Making an *actual* room matrix, and an associated minimap. I know I had this whole cool thing going on about non-euclidean spaces, but at some point, one has to accept that no, it's not a feature - it's a *bug*.

After paying the considerably high price of reducing all my neurons into a formless grey sludge, I finally achieved [this buggy mess](https://cdn.discordapp.com/attachments/504088568084561930/1063556294285471825/Capture_decran_le_2023-01-13_a_15.08.54.png) that can be brought up by pressing "M". The little purple dot is me. While it certainly works, there are some significant flaws:

* At the very right of the map, one of the rooms spawned *on top* of a 2x2 room.

* 2x2 rooms never fail to overlap on top of adjacent rooms for one extra pixel column/row, as is seen with the top left room. EDIT: Just fixed this! Turns out the drawing size was incorrect the whole time. Only had to change a single number.

Honestly, I'm very confused. I thought 18x18 was just the double of a 9x9 square, but maybe I am completely clueless.

I am rather proud of making 1x1 rooms work perfectly - these mesh seamlessly, never allowing reality-breaking phasing through walls or overlapping exits. Making 2x2s work alongside them is, however, an unspeakable nightmare.

I'm not one hundred percent sure what I'll do yet. I could find a workaround and review my vision, or I could sit down and try to untangle this mess. I know what the right choice is, but I dread it.

Besides this main project, I also delivered some bugfixes here and there (including a hilarious softlock where the "reanimate enemies on death" Soul mixed with the "reincarnates on death until it is the last foe in the room" enemy caused a... spectacular chain reaction). My "minor nitpicks to polish" document is growing so large it will one day devour the galaxy, so I try to sneak in some quick tweaks when I'm not feeling very motivated to tackle a major implementation. I am also testing out the ["Play" font](https://cdn.discordapp.com/attachments/504088568084561930/1063562879837671434/Capture_decran_le_2023-01-13_a_15.58.04.png) kindly suggested by AleatoricConsonance in the last Sharing Saturday. Not completely sold on it yet, but I quite like it and will be giving it a spin as I continue development.

I am a bit tired, but hopeful for the future. I know my objectives are within my ability. I just need to unsheathe my fork and declare war against the spaghetti code monster which unexperienced-past-me has unwittingly constructed.