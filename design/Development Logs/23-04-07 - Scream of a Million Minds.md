*"A holographic dreamscape, woven from the intertwined daydreams of the Soul Cage's unfortunate denizens. A careless step into this theatre of dancing lights is all it takes to replace your world with their own."*

- Hypnotic Projector flavour text

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.2 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

This week, I have been continuing the complete redesign of my entire game. I feel a little heartsick butchering some huge blocks of code and knowing I am effectively invalidating hours of work, but I try to keep a holistic perspective. I couldn't be where I am now without all these missteps. Every good idea is the sum of many bad ones.

# Complete UI rework

The [abundance of numbers](https://cdn.discordapp.com/attachments/504088568084561930/1093949431348473866/image.png) in the lower part of the sidebar was starting to irk me by its inelegance. I am not sure yet if the replacement I have cooked up is final, but it is certainly an improvement. [Two receptacles](https://cdn.discordapp.com/attachments/504088568084561930/1093949921817788446/image.png) of Souls illustrate the cacophony of minds screeching inside Terminal's psyche, and a [little spinning wheel](https://cdn.discordapp.com/attachments/504088568084561930/1093951846130917436/tgfp.gif) contains all Souls used in each room. Zero numbers, pure visual goodness. You can even see the turbulent Souls thrashing around! I hope it isn't too distracting. If it is, such an annoyance is clearly representative of the player character being driven mad by the endless chit-chat of psychic voices.

# The Intangible Path

Every time I add something new to my game, a question keeps coming up - *how in the world will I ever tutorialize this mechanic?* I love interactive, text-less tutorials, but at this point I have to make some concessions.

The new [Research Tree](https://cdn.discordapp.com/attachments/504088568084561930/1093967794325962822/image.png) tries to address this problem, slightly inspired from the [Thaumonomicon](https://ftbwiki.org/images/8/85/2012-12-11_09.20.18.png) which appreciators of eldritch tentacles and power drills may recognize. Each "Node" contains an entry of [thoughts and reflections](https://cdn.discordapp.com/attachments/504088568084561930/1093967192569155656/image.png) from Terminal for those interested in the lore, and a column of condensed information to assist the aspiring soul manipulator. Doing certain things in the game that prove mastery of the previous topic will unlock the next node combined with a discrete notification, pushing the player further on the intangible path.

I imagine some of these concepts are still a bit nebulous for new players, so I hope to replace the placeholder grid in the lower right corner soon with some helpful GIFs - or perhaps a mini-interactable dungeon showing off the feature.

I wish to do more things than just tutorializing with this new feature, but that will be the topic of a later Sharing Saturday - with a possible connection to that one [thread](https://www.reddit.com/r/roguelikedev/comments/129a6k8/between_mystery_and_strategy_how_many_secrets_is/) I made earlier this week. My gratitude to all kind commenters who pitched in. I already made the pattern finder code - possibly a little inefficient with all those [nested loops](https://cdn.discordapp.com/attachments/504088568084561930/1093953688688660591/image.png)? My tests seem to run fine for now. If everything goes according to plan, this should be positively awesome.

# Sundered Minds

"Failure is as valuable as success and both are required for victory" was always a core part of my design philosophy for TGFP, but with the recent cullings, this precept had started to sink away from relevance. No longer! Upon dying inside a pocket dimension, you now respawn in the dimensional layer above, and *all* Souls contained in the Soul Cage become [Shattered Souls](https://cdn.discordapp.com/attachments/504088568084561930/1093954824254529657/image.png). Lore-wise, I imagine this as a kind of failed surgery - the Souls not recovering from your incursion into the deepest reaches of their identity and breaking apart as a result.

This is not necessarily a bad thing. Yes, you have scrapped some potential building blocks for creating more pocket dimensions, but as Terminal is himself made out of what is basically spiritual sewage, this resource can be assimilated within your psyche to enhance its abilities. Every 3 Shattered Souls grant an additional free use of a spell in each combat room, which is a welcome boon in especially dangerous areas.

# Random additional changes

* I have excised the so-called "accidentally implemented feature" that is [the grid effect](https://cdn.discordapp.com/attachments/504088568084561930/1089395888360796201/Capture_decran_le_2023-03-25_a_23.49.55.png) appearing on the minimap. No, Onei, it's not a feature, it's a bug. I have deluded myself for long enough. [Into the trash it goes](https://cdn.discordapp.com/attachments/504088568084561930/1093955240392409250/image.png).

* Brand-new [Hypnotic Projectors](https://cdn.discordapp.com/attachments/504088568084561930/1093955646673666108/image.png), placed inside a special room, constantly display the pocket dimension [crafted by the Soul Cage](https://cdn.discordapp.com/attachments/504088568084561930/1093955808150175925/image.png) in all its glory. They also double as a means of access, as you stare into the dancing holograms, substituting your reality with their own...

* I have written and rewritten some flavour text and descriptions here and there to be less heavy on purple prose, and to hopefully leave a better lasting effect. Soul manipulation is dark work, we're not in the realm of bunnies and rainbows here! It's a tough balance finding the right point that screams "delusional zealot" without going full Caves of Qud 2: Attack on Thesaurus. 

My obsession with development has been rekindled, and my free time is being mercilessly slaughtered on the altar to JavaScript. I pray that the flame will keep on burning for the weeks to come!