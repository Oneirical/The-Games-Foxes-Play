*"Of all emotions, anger must be the most terrible. How could one be so foolish to wield a sword with a bladed hilt?"*

- Rage Dilutes Focus flavour text

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I finally won that deranged DCSS meme build (FeCK^Xom for the initiates) I dreamt of succeeding with. Hopefully that quenches the time-wasting thirst for a while.

A few things were done this week, though mostly in more discrete areas.

* Performance overhauls once more have been sprinkled across the teleportation pads. I spent a full hour trying to remove all traces of lag, and felt true despair when I went for a playtest and realized nothing had changed. I later remembered I had left a debug "console.log" somewhere, which had instituted itself as the new cause of lag. Rightfully slaying it immediately made everything [flawless](https://vid.puffyan.us/embed/CVGQWpUZH5s)! Naturally, these fixes also broke the entire suite of move-animations of every entity, which I spent 2 hours to fix. Amusing.

* The teleportation pad "preview" is much more accurate to your destination - I'm just trying to figure out now how to present a preview inside the preview without an infinite recursive effect.

* Map generation has received some tweaks, namely the ability to customize the rarity of certain prefabricated rooms. Certain areas can therefore be forced to generate only once, very often, in only 10% of cases, or any other such parameter!

* The synapse and logic map mechanic has been partially reworked in a way that would be useless to even try explaining to anyone who is not deeply involved in my game's workings. That means, currently, everyone in the cosmos except me.



