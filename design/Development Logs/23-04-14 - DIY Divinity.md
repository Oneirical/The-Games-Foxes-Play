*""*

- TODO

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.2 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

First, I had a problem with the map generation system generally making unfun structures. Therefore, I made it so the player can build their own dungeon networks, since they probably know better than I do what is fun for them. When in doubt, outsource the labour.

Now, I am doing the same for spells.

# DIY Divinity

I am retiring the concept of multiple pre-defined spells from my game - the à la DCSS kind with a massive list to choose from. I have all this lore about souls being malleable and adaptative, and then I forcefeed the player with hardcoded, immutable effects. No can do.

Instead, I have enabled the player to craft their own tools of destruction (and occasionally, creation)! Right now, there are two possible classes of components:

* **Form** components target specific tiles. The Ego Form targets the tile you are standing on, the Beam Form targets all tiles in a straight line in front of you, and so on. They also assign their Caste to the Spell - Ego is Saintly, so all Ego- spells are Saintly as well.

* **Function** components trigger an effect at each of the targeted tiles. The Senet Function induces Charm Touch status effects on all targets, the Gyvji Function punches all targets back, and so on.

Each component has a pattern. For example, [this]() is Senet and [this]() is Ego. If you imprison souls in the Soul Cage to draw those patterns [like so](), the Vision they create becomes special - upon clearing it, you will be awarded with an Ego-Senet spell. It is Saintly, because of the Ego- part. That means that from now on (after equipping the new spell), every single time you'll use a Saintly soul, instead of being healed, you'll enchant yourself with a Charm Touch.

Lore-wise, you are stitching together bits and pieces of the identities of your hapless prisoners. It's like the psychic equivalent of that "flesh golem" trope assembled from the body parts of many different species, but with minds instead of muscles. 

With every update, this magic is getting darker and darker... Oh well, there are too many heroes in roguelikes anyhow.

Here is what [Beam-Gyvji]() looks like - reliant on the Unhinged caste (because of Beam-), it fires out a hyper-knockback laser upon the first encountered unsuspecting fool.

Fun? So far, very much so. Broken? I expect it to be. With free reign over what can be combined together, the player will probably be able to assemble some pretty deranged contraptions. Frankly, that's part of the fun, but I'll have to keep this system in check to ensure things remain interesting.

# The Bottomless Dream-Pit

I made a [thread]() a little while back wondering how I'd actually present those possible patterns to the player. I think I've made my decision - they are all somewhere in the [research tree](), but their placements are semi-randomized (semi-, because I want simple stuff like Ego- to come up early), and must be unlocked progressively. Each time the player crafts a new spell, all patterns used in the process are "researched" and the next nodes linked to it are unlocked, granting access to more complicated patterns.

It seems to me like a rather interesting gameplay loop - draw patterns in the Cage, go challenge the Vision, return to claim your new spell, look at unlocked nodes... And craft a new spell, more powerful but requiring the defeat of a more difficult Vision, which your new spell should help you with. Great replayability - you might get the same Form two runs in a row, but that's just an invitation to try combining it with different Functions.

The only small problem is that unlike the old versions of my game, there is kind of... uh, no way to lose. If you fail a Vision, sure, the souls get scrapped into Shattered Souls, but the only way you'd actually be done for would be somehow breaking every single one of your Souls. It can pathetically happen at the very beginning of the game when you only have one, but after that, it gets quite improbable.

I have ideas for a system that will add a proper loss condition, but that will be the topic of a future post...