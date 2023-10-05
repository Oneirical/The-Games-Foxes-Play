*""*

- 

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io! (very old)](https://oneirical.itch.io/tgfp))*

The fascination is getting to me. My ideas are getting weirder by the day. This might be the week in which I put the most hours into my game since its very inception. I don't even want to play video games anymore, I just want to make *make* **make**.

# Return of the Diamond Fist

My beloved hyper-punch knockback spell is back after an all-too-long retirement, fully reprogrammed to use the new Soul system in a way that makes me feel like an absolute genius. In simple terms, taking a step will passively punch the creature on the next tile in front of the player, knockback that creature (if possible), and create a shockwave at its impact location.

In order to increase reliability, the companion active ability (which I somehow managed to fit in the same Soul) warps every creature in a short circle AOE as far from the caster as possible, in order to forcefully reposition creatures backing into corners or cuddling in packs to avoid getting punched.

The [wheel UI]() in the top right has been reworked to automatically scan the player's Souls, detect all hotkey bindings and add them as clickable buttons. Currently, you see it scanning the Saintly Soul, containing the WASD movement commands, and then the Ordered Soul, with that active I just mentioned assigned to 1. Yes, if you mess up your starting Saintly Soul, you may literally lose the ability to move. I am going to need a surrender button.

I am not too sure what to limit these actives with, or when they recharge... Mana, creatures defeated, turns passed? I can't quite find a satistfying mechanic that would tie in with my game. Maybe I should just let these abilities get spammed as much as the player wants and balance them around that.

# ALL IS SOUL

I am currently in the process of **removing tiles from my game**. That's right, every wall, feature and doorway is being turned into a creature that *believes* it is an inanimate object. Their Souls, devoid of any reaction to the passage of time, only have simple Axioms such as "You are untargetable.".

(Floor tiles will remain as the only tile type).

I expect lots of horrible bugs to surface from this rework, but for now, it has allowed me to create this hilarious ["reverse black hole" giga-spell](), which instantly makes any pain endured in development worth it. The matching Soul goes roughly like this: *"When the spell hotkey is pressed, target all adjacent tiles to the caster, expand, expand, expand, [...], exclude the caster's tile, warp every targeted creature as far away from the caster as possible."*

There has been previous times where I journeyed into fundamental reworks like this only to get disappointed and undo everything. This time, I think this is genuinely a great idea:

* If I am not wrong, not having to draw tiles and just plopping creatures on a black background will improve performance considerably on my potato laptop.
* If I am not wrong, only having to save the position, health and Souls of creatures and not tiles will do wonders for my soon-to-be save & load system.
* Lore-wise and flavour-wise, it's just perfect.

I'll be building a starter dungeon of sorts soon where every single interaction revolves around my Soul system. If everything goes according to plan, it will have cool powers like enemy ability copying and body swapping (both of which are trivial due to the Soul system - the creature which currently is the "player" is only determined by which entity is holding the legendary Reality Anchor...) 

Perhaps... a new demo before the end of the year is possible? That will depend on what Real Life™ has in store for me...