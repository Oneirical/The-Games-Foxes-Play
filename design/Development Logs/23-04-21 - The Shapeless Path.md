*"Not all who enlisted among the Ordered earn the glory of a general. Some stood in crystal caves, scanning every possible pebble for a trace of the cataclysm, while the chiming of their visors unsettled travellers. Their memories have long been crushed underneath exabytes of analysis data, leaving only the inflexibility of stone."*

- Flavour text of Paraceon, Forever Crystallized

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.2 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

*So* many changes. It is utterly insane how I either can't think about anything else but my game or can't bring myself to write a single line of code on any given day, no in between. I'm glad I can keep up the pace now, because The Plane Where Grass Is Touched has some exciting but time-consuming advancements in store for me in the coming weeks.

# Laws of Soul and Spirit, Represented

As the old burns to feed the new, many UI elements have been added and removed:

* There is a new [minimap]() viewable in the lower right corner, which dynamically updates every turn. The way it is rendered in the backend is... a bit gory (it is actually rendering outside of its frame, so I draw black rectangles to cover the overextending bits), but it *works* and I have noticed no performance issues.

* In the Legendary Soul menu, the minimap is replaced by a new [display]() which contains all relevant information about your crafted spells: its Potency (blue number), its Forms (green row) and its Functions (orange row). There are two extra rows for the Contigencies and Mutators I have designed but not implemented yet - we get there when we get there.

* There is now support for paragraphs and colored text in all text functions. This sounds so simple, but it was easily the most nightmarish thing on this list. Yet the result is [so glorious]()! Yes, Ulfsire, I have stolen the way you describe your powers in your game (Path of Achra) because I find the systematic layout to be very apt for a synergy-based game.

* The "Resolve", "Ipseity" and "Harmonic Relays" mechanics (and associated UI elements) have been all shown the door. A tragic thing, considering how I was really imagining the final product to include all of these as major mechanics, but as Souls shift and change, so does my game.

I'm still a bit ambivalent on if my game UI looks good or not. There is definitely some room for improvement, and I can't help but find the layout to be a bit overwhelming and amateurish. But then again, I've been looking at it for hours now, so I am in no place to have an unbiased opinion.

# Unlocking Memories of the Old World

There is now a "drawback" to crafting spells - each pattern used will now *permanently* [add a new feature]() used in the map generation of future Visions (dungeons). Most of the time, this is a creature. Can that charming spell deal with the swathes of Felidols it just added to the monster pool? I say "drawback" in quotation marks, because it is basically the whole point of the game - you are adding more diversified creatures in your ultimate quest to recreate the Old World as it once was, with all its weird denizens.

The Faith's End facility (where the player begins the game) has also received a major [touch-up]() for thematic purposes. Your existence is confined to only 5 vertical rooms, with the Saints' Voice hologram as your sole company. [Reinforced windows]() scattered across the corridor allowed the (now-long vanished) wardens to document your every motion. At the end of your containment chamber, an access gate with a few drawbridges allow access in and out of your cell - a privilege which is naturally not yours to choose.

Spoiler alert: those drawbridges won't stay locked for long. The cataclysm still rages outside the facility, and its perpetrators know you're trapped in there - your mind teeming with memories and an identity ripe for claiming. That will be something for a future week.

# Bonus: Tighten Your Seat-Belts

Oh, as I was tinkering around with some potentially fun spell combinations, here is a particularly hilarious one I stumbled upon:

* The EGO Form targets yourself.
* The GYVJI Function causes all targets to be brutally punched backwards, until they collide with an object, at which point they take massive damage and emit a damaging shockwave.
* The PARACEON Function causes all targets to gain temporary invincibility.

This means:

* EGO-PARACEON: You become temporarily invincible. Neat but boring.
* EGO-GYVJI: You launch yourself into a wall and perish pathetically.
* EGO-PARACEON-GYVJI: You BLAST OUT like a ROCKET LAUNCHER and EXTERMINATE every bystander with the shockwave, and leave COMPLETELY UNHARMED.

[Demonstration.]()