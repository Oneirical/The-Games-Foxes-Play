**NOTE: If a wanderer of the Internet stumbles upon this log, the features mentioned in it are not finished yet (I am working on them this week) and the text below may change. The reason I write these in advance is because pretending that I made great progress inspires me to actually make great progress. Fake it til' you make it. Everything I post in Sharing Saturday - that means, all previous devlog entries in this folder - are completed, of course.**

*"-"*

- quote

**The Games Foxes Play** ([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play online in browser on itch.io!](https://oneirical.itch.io/tgfp)) 

I've noticed that when it comes to adaptability versus planning, roguelikes stretch out among a spectrum with two extremes. Take Brogue, for example, where you are at the mercy of what random items the dungeon throws at you and must make do with what you find. Compare that with, say, Rift Wizard, where you can go for the exact same build every single game and theorycraft for literal hours until all your IRL responsabilities are forgotten.

My game was absolutely at the Brogue end of that spectrum until this week. You were given a bunch of random powers, you'd... occasionally get to use them, and that was that. It was kind of lame - you got to perform a HYPERPUNCH for a single turn and then had to wait until your HYPERPUNCH would cycle back around for usage, which could take ages. In fact, you were much more likely to win or lose the game before you could ever use any given non-Common spell more than 3 times.

With this new update, the correct daily quantity of punching recommended by leading doctors worldwide can finally be attained.

## On-Demand Laser Beams

Let me start off with an example. Vile souls, one of the six Common castes, have as a basic effect a simple damage bonus that adds itself to your next melee attack and dissipates afterwards. Senet, a Legendary Vile soul, used to be another spell cycling through your hotbar that would empower your next melee attack with a Charming touch that recruits the struck enemy to fight for you. That is no longer the case.

Behold [my new inventory screen](). Let its beauty leave its mark upon your feeble eyes. There are 6 slots, one for each Common soul "caste", represented by their respective symbols. The bottom right one is for Vile souls. In each of those slots, the player may insert a Legendary Soul they have discovered in the dungeon to "lead" the caste with their ideology, belief and power. This means that you can place Senet in that bottom right slot, and anoint her as the leader of all Vile souls in your possession.

And then, *every single time* you use a Vile soul, instead of gaining the damage bonus, you gain a Charming touch, as Vile souls now answer to Senet's command.

The central rectangle can store up to 4 unused Legendary Souls. Meanwhile, the player's actual Soul-casting hotbar and drawing-"deck" is now composed exclusively of Common souls. Indeed, Legendaries are now basically equippable items instead of spells. One is invited to mix and match effects for each of the six castes, and find Legendaries that have synergy with each other.

To adjust my game's UI to these changes, I've also [completely reworked the sidebar]() to fit the game's aesthetic style, using the new cool symbols I came up with, and also added some extra buttons to increase mouse/clicking support even more. ([Old sidebar for comparison]()) No worries, symmetry cultists, there will be something in the bottom left as well. Not sure about keeping all these numbers, though - I'm thinking of an immersive numbering system in the same glyph-like style that would be both easy to read and fitting with my game's visuals.

This is practically a complete rework of my magic system and utterly topples the game's balance. However, I'm really excited about the possibilities - not having the player deck bloated with all kinds of Legendary and Common souls is such a relief. I remember Spellsweaver on this subreddit suggested I'd add a way to view the contents of your own deck, and while that would have been an essential addition to my old design, I could only imagine the Theoretically Optimal Player scanning that screen on every single turn and taking a minute before every keypress to optimize for upcoming Legendary soul usage. Now, you can just choose your loadout before entering combat, and go blasting with your selection of 6 unique flavours of psychic magic! It's also a much more replayable system, as I am now dropping only one Legendary soul instead of four in loot rooms, which doesn't exhaust every unique Legendary soul as quickly and makes every run different.