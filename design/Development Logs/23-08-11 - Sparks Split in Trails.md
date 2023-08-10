*"Of all emotions, anger must be the most terrible. How could one be so foolish to wield a sword with a bladed hilt?"*

- Rage Dilutes Focus flavour text

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I finally [won]() that deranged DCSS meme build I dreamt of succeeding with. Hopefully that quenches the time-wasting thirst for a while.

A few things were done this week, though mostly in more discrete areas.

* Performance overhauls once more have been sprinkled across the teleportation pads. I spent a full hour trying to remove all traces of lag, and felt true despair when I went for a playtest and realized nothing had changed. I later remembered I had left a debug "console.log" somewhere, which had instituted itself as the new cause of lag. Rightfully slaying it immediately made everything [flawless]()!

* The synapse and logic map mechanic has been partially reworked - data is now only preserved in each "current" respectively. This means that if a branch targets a tile, other branches won't magically start targeting that tile as well.

I'm aware this probably means nothing to anyone reading this post, but it does make the system a lot more intuitive in game - trust me. Also, this change makes everything look a [lot more elegant than before]().

