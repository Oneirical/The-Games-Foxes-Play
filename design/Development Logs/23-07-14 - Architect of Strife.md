*"In truth, my artificial axioms are an anomaly. Most natural ideologies are more reactive than active, responding with hatred and love at the sight of harmless symbols."*

- flavour text of the tutorial node explaining Contingencies

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

The overscope is real. I keep having these utterly insane, giga-mass-redesign everything visions of epic proportions, and then come up to the computer only to hit a wall of design problems or programming difficulties. Last Thursday, I quite literally stared into the void for 4 continuous hours, phased out of reality, thinking about all kinds of things I could do.

I hope I have learned my lesson now. I need humility, and the comfort that I'll always be able to build onto what I already have.

# Architect of Strife

I welcome yet another JavaScript library to my pile of "things that would have taken weeks to do myself" - Pixi Viewpoint. Following an excruciating implementation process, it has allowed me to transform my zoom animation code (which used to be roughly the coding equivalent to rotting roadkill on an unpaved road after a nuclear apocalypse) into something *much*, [much more presentable](https://vid.puffyan.us/embed/3ZHK8QAOUa8), and with a seamlessness I find quite charming. In the future, it will also open up opportunities for drag-and-drop camera panning, mouse zooming, and much more...

Aside from that, it was not a great week. I have undid multiple commits that were going pretty much nowhere, such as letting the player place enemies as they want before initiating combat, a background visual effect for the zoom animation that turned out horribly glitchy, and overall struggled with inconsistent, overly ambitious design. 

One of my most "cool on paper, now actually make it" concepts was letting the player design their own enemies using the spell "programming" system already in the game (for example, create an entity with "when taking a step, shoot lasers"). Then, I'd have the player be challenged to defeat their own creations. To prevent players from crafting "when this exists, die instantly"-type pushovers, a squad of NPCs would come afterwards and try to also defeat the artificial enemies. You'd have to make the entities strong enough to beat the NPCs, but weak enough so that you could triumph where they failed.

This has so many problems.

- What stops the player from crafting "trap" enemies like "this enemy cannot attack, but when it moves, it leaves behind traps that oneshot you"? The player will be intelligent enough to avoid the traps when *they* play through the challenge, but my NPC squad will get nuked the moment their AI steps where it shouldn't.

- This implies that a portion of gameplay will be spent watching the NPCs battle it out, how can this part be made interesting and not completely passive?

- The NPC squad will also get programmable spells of their own, do I just come up with contraptions in a weird arms race against the player to make increasingly broken combos?

I don't think the idea to be irredeemable. This concept of a "sandbox" roguelike - not in the Qud/CDDA sense where "you can do anything" but in the sense of "you can have a part in the world's creation" is not only very thematic with my game's lore, but also lets me secretly distribute some of the design work to the player so they "make my game for me while playing it", so to speak. Tongue in cheek, but I think there is potential here. It's *fun* to outwit a design and coming up with the "trap" mentioned earlier might be interesting... assuming it isn't some "meta" that should be made every single time.

I am at a turning point. There are so many directions I could go in. I have so many ideas, but many are bad and in the end, only a few can remain. Development might slow a little while I work this out.