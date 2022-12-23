[AAAAAANNNND SLAM!](https://www.youtube.com/watch?v=e1PARn8Lpt0)

I knew this was going to be a funny idea for a spell, but it has exceeded all my expectations. [I simply cannot get enough of it.](https://www.youtube.com/watch?v=d-uK8_nEAFk) (Not normal conditions - I am cheating to get infinite uses and extra HP).

***

**The Games Foxes Play**

This week, I've just been mass producing new enemies and spells (they are called "souls" in the game, because lore-wise, you are channelling the memory of a deceased legend to perform one of the feats they were known for). A huge thank you to everyone who commented in [my recent thread](https://www.reddit.com/r/roguelikedev/comments/viicvz/share_some_enemyability_gimmicks/) on this subreddit for cool creature designs, it has certainly helped with my inspiration. Some of the new additions include:

* **Greedswept Felidol** - A cursed cat statue that leaves behind gemstone rubble on a tile on death, which will steal the soul of any creature killed on it to reanimate the idol.

* **Midnight Ragemaw** - A pesky bat-like creature that has 1 HP, but constantly respawns on death until the only enemies left are other Ragemaws.

* **Self-Erased Monk** - A nasty spellcaster that can use a randomly selected spell among six different ones, from leaving landmines to dashing around.

* **Rendfly Vermin** - An extremely annoying fly that buzzes everywhere with insane speed, deals zero damage, but inflicts a "damage delay" effect on enemies. Basically, if I hit a "delayed" creature for 3 damage, they will only take that damage in a few turns. The sound effect makes me go crazy and I might remove it.

* **Humming Paperweaver** - My favourite. A completely passive enemy that leaves behind cute little paper pinwheels on the floor. If you step on one, the Weaver enters RAGE MODE, gains Haste, and INFINITE USES of that punching spell I initiated my post with.

I love that spell so, so much, in case that wasn't obvious. [Here, I gave myself 99 HP (that's why there's red bars everywhere) and infinite punches, and had an epic 1v1 with a single 99 HP Paperweaver.](https://www.youtube.com/watch?v=yR6tFjBwcHg) I swear, this is still a turn-based game, I'm just mashing the keys very fast. In [this scenario](https://www.youtube.com/watch?v=RinAuvCd4lE) (warning: loud), I gave myself 999 HP, and accidentally discovered a bug that caused the Felidol enemy to get duplicated if slain by the punch spell. Fixed now, but hilarious to see. If anyone accuses me of slacking off, know that cheating at my game made me find a glitch I might not have found otherwise!

***

I made other new spells in addition to that punching one, but I don't want to turn this post into a novel anymore than it already is, and would rather like to talk about one of the design problems I encountered with the Serene Harmonizer gambling mini-game, which I described in my last Sharing Saturday post. To put it bluntly, there was absolutely no reason to actually shoot for a good result.

If the player completely failed the challenge, they would earn themselves a snarky comment from the Harmonizer, and... 4 souls from the "bad" tier, which was just an array in which I lumped all the spells I judged to be mediocre. Except they weren't actually mediocre, due to my design philosophy of not ever making anything that's objectively "weaker" than a counterpart. For example, is "charm the next enemy you touch" good or bad? It's bad if you charm some good-for-nothing run-and-stab-you melee dude, but it's outrageously good if you manage to charm a healer and earn yourself your own little private life support. Or an enraged Paperweaver. For the record, that charm power was considered to be part of the "bad" tier, because I made it when enemies were still uncreative and had their threat level based on numbers rather than power. Everything is just so, so situational, and "tiers" had no place in my game, so they were all thrown out.

Now, you are invited to "bet" an amount of souls from 1 to 4. In the actual game lore and descriptions, it's this extremely creepy process revolving around machines that expunge all trace of individuality and identity from the unfortunate prisoners. The souls will also [express their disapproval](https://cdn.discordapp.com/attachments/504088568084561930/989976074014302288/Capture_decran_le_2022-06-24_a_15.30.22.png) in the message box (message varies depending on which soul it is) when you lock them up in the... "Soulscribes", as they are called. Metal.

Then, once again, you do a little arithmetic puzzle trying to reach a perfect zero. For every 3 points separating you from that goal, each soul you wagered receives a 1% Harmonization chance. Having a negative result is now extremely offensive and will instantly bring your Harmonization chance to 100%. For each soul, the Harmonization chance is rolled, and if it hits... instead of one of those legendary figures, you get a Serene soul. It's literally a clone of the Serene Harmonizer, and it will try to corrupt you from the inside by progressively assimilating your entire inventory into more Serene souls, until you root them out by force. Nasty. At least, they are pretty good in combat, [letting you polymorph enemies into Harmonizer summons that fight for you](https://www.youtube.com/watch?v=k9YmH7SyNcU) Once again, cheating so I can use it every room, just for demonstration purposes.

I really like this change, because it rockets the creepiness and the horror factor of the Harmony into the stratosphere. Having these innocent souls watch you fill in the Relay while they tremble in anguish every time a Harmonization % trickles in is anxiety inducing.

***

Finally, my highly esteemed friend has been hard at work on the game's music. There's a new atmospheric title screen theme, and a snazzy "level 1" theme. However, the one I'd like to talk about here is the new theme song for the Harmony - the game's lead antagonistic faction. It starts as this very quiet, light and carefree music box tune, backed by an unnerving crackle of static. The latter represents the protagonist - and hopefully the player's - disgust towards the Harmony and its assimilationist ideology. However, every time their theme song is supposed to play, the game calculates how corrupted you are by measuring the number of Serene souls in your inventory versus your non-Serene souls. The more control the Harmony holds over your psyche, the more layers are added to the music box, which will now be doubled by xylophones, triangles and synthetic vocals. Eventually, the creepy drone in the background is drowned out by the sheer Harmonic holy power, demonstrating how enthralled the protagonist is becoming. [In this video](https://www.youtube.com/watch?v=l79rTFNT4Rg), I compiled together 3 excerpts out of the 6 different infection stages (see description for timestamps).

It's so, so creepy, and brings home that half-horror, half-tranquil atmosphere I was shooting for.

***

For this next week, I will be working on increasing room shape variety, from narrow corridors to massive battle arenas. For that, though, I will need to implement a system where not every tile in the room is visible at once, but things still happen out of Line-of-Sight. It's FOV without walls blocking vision - think DCSS's Ashenzari powers. My code will have to be really tampered with to make this work, and I hope it won't be too difficult.