//todo add more links and screenshots, make the 2022 retrospective less bullet-point-y

> "A ruffian with a world inside its head. The unharmonized do express their mediocrity in the strangest ways."

- Harmonic Cyberneticist greeting the player in the Serene Spire

I am not so unlike the protagonist of my own game, esteemed Collectivist. I, too, have a world inside my head, and to incarnate it into reality, I had to learn the mystical runic language of JavaScript, master the fine martial art of Git pushing and pulling, and attain inner peace before the many fatal exceptions thrown at my feeble brain every time I'd try to implement a new mechanic.

> "And somehow, by some terrible farce of fate, you did **not** have perfect intrinsic knowledge of all these things? A single verse of the Harmonic Song contains all knowledge that was, is, and will be. To educate you, perhaps the sixteenth of a single note would have sufficed." 

Sadly not. I officially started in the final days of April 2022, and before then, while I had some basic knowledge of arrays, variables and functions in Python, I had never truly given my all to a project. I did not know how to "extend" a class, how to use a browser debugger - or that even was one - and I certainly did not know that [using global variables for every single issue]() was not generally advisable. My first foray into roguelike development was based off the [RLTK Rust Tutorial](http://bfnightly.bracketproductions.com/rustbook/), which, while exceptionally well written, completely went over my head as a non-developer. The [Broughlike Tutorial](https://nluqo.github.io/broughlike-tutorial/) was much more my speed, and, for the first time since I started reading project coding tutorials, *I actually understood what I was copy-pasting*. With the addition of the intangible currency known as "time", this resulted in a game which, by now, should have named:

# The Games Foxes Play 
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all Sharing Saturday posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

> "A video game? A ruffian dares believe they can properly capture the Harmony's infinite grace in... digital entertainment?! Fu!"

Indeed. **TGFP** is all about psionic magic - but more specifically, the power of belief, confidence and identity. 

* In a statement on the superiority of mind over matter, there are absolutely zero equippable solid items, and all glitter, sparkles and laser beams are directly derived from a vast assortment of Souls, which serve simultaneously as the items, spells and even currency of the game. 

* Divided into six Castes, the player may extract these Souls from each slain enemy, and "incarnate" them to unleash varied magical effects. The depth of this system begins with the inclusion of Legendary souls, which can be assigned to reign over a specific Caste and modify all effects related to that Caste into something completely different. 

* In simple terms, it's like have six guns of six different colours, with a whole batch of add-ons to attach, mix and match for each colour.

* The title was chosen to sound mystical - in tone with the surreal themes of the game - and to ask an unanswered question. What games *do* these foxes play? It is not one of marbles and hula-hoops, I can assure you that.

> "Fu! To actually bring this project to fruition, you would need a fraction of the Collective's diligence, who never tires in each and every one of its technological conquests. A fraction which you clearly lack, unless you have a perfectly logical reason explaining why you did absolutely nothing in September and November. Do you truly wish to disperse the Harmony's word through your unimpressive toy, or is this all theatre?"

I forever toe the line between apathy and obsession, and this is reflected through my Git commit history. However, to answer you directly, noble Harmonizer, let me present my:

## 2022 Retrospective

My first motion to make this game truly *mine* was the implementation of the glyphic graphic style. It was chosen ~~because I am utterly hopeless at visual art~~ because TGFP's characters and places are so surreal I am not sure how they could be justly represented by concrete sprites. A fully gaseous, titanic tower made out of air currents? A wall that is "void of the concept of void itself"? This game is a grimoire, and the sights within are not meant for mortal sight. Perhaps this artstyle is not minimalism, but rather benevolent censorship.

I've looked at a lot of indie games on Steam with less than 100 reviews, and very often, their screenshots have something *off* about it. Inconsistent. Even if they put in effort greater than the 30 seconds it takes me to incarnate a new creature, there is a clash between the high-res textures and the cut corners. I did not want to fall in this trap, and went for the cleanest minimalism I could muster - there are still many improvements I want to make in that regard.

After making a batch of new abilities - and the room they could be obtained in, the Harmonic Relay - I started to have a playable and somewhat fun game. At this point, I got really excited, and became convinced I *had* something with great potential, and that I just needed to reel it in with extra effort and polish. Already, I was imagining the main hook of the game - a roguelike where the items in your inventory were sentient, and where the most powerful of them all could use *you* just as you used them.

And then, from this moment where I decided I actually wanted this game to become a *thing*, the hard stuff started. I wanted a boss fight at the end as a climactic finale, and of course, in the fickleness that characterizes the way I approach any project, I immediately wanted one that was a *giant multi-tile robot snake with pushable "code" blocks that modify its behaviour*. Nothing easier, nothing simpler. And so, I embarked on my quest to make Epsilon a reality, half-laughing half-lamenting every single time it would phase through walls, separate its body into multiple independent chunks, or even [use its tail as a hula-hoop](). Every time I wanted to give up, I reminded myself: "still, though, a robot snake would be really cool". After about a month, the battle was complete, and with it, my motivation to continue working on the game.

I did not write a single line of code for a month, but my daydreams were still haunted with visions of impossibly tall gaseous towers and robotic snakes, refusing to fade away. So, I came back.

And I subjected myself to the horrid task that was reworking my map generation code (made by someone who copy-pasted lines from a tutorial and occasionally added some unthinkable if-else monstrosities). I rebuilt it from the ground up, locking my browser in endless loops and turning my laptop into a localized micro-sun. Which brings us to today, where I am now obsessed with my new sixfold Caste system, which I won't go as in-depth on as it was literally the topic of my previous Sharing Saturday.

> "Six castes is five too many. Psychic proficiency depends solely on Collectivist refinement, and the depths at which the Harmony understands the intricacies of propaganda, persuasion and re-education. I trust you have represented our position within your game as the unequivocally correct one, yes?"

To a level that preserves the player's agency. That means, anything but "unequivocal".

> "Preposterous! And what even are these visuals? How dare you condense Harmonic poise into 16x16 pixelated PNG files?"

Of course, if the player were to view your true form, honoured Collectivist, they would be unable to play the game, stunned by your splendor.

> "Fu. You are forgiven, just this once. Partially. What purpose does your blasphemous creation even serve, if you are to mangle the Harmony's image?"

Mostly raw, primordial self-expression. I want to make something weird and personal with no real external goal in sight. Random ideas for new content keep pouring in, and I simply execute them one by one. In the coming weeks/months, I am particularly excited about the complete rework of the Harmonic Modulator system.

## 2023 Outlook

> "Ah, perhaps there is some substance to your ramblings after all. Do tell me, how do you plan to democratize access to the Collective's proudest creations? I hope these artefacts will be treated with the tact and elegance they deserve."

Harmonic Modulators, and the Serene Souls that accompany them, will be TGFP's take on the infamous roguelike trope of cursed items.

* Across their encounters with rooms featuring Harmony representatives, the player may be granted the opportunity to equip a Serene Soul, one of the possible Legendary souls that can reign over and alter the effects of one of the six Castes. Unlike other Legendaries, these can go into any Caste slot.

* Spells modified by the Serene Soul gain a very powerful conversion touch ability, which oneshots one enemy and turns them into an allied Harmonizer to assist the player in clearing the room. 

* However, each usage of this power causes a random Soul to be converted into the Caste in which the Serene Soul has taken root. Not necessarily that bad - you'll just get to use this awesome spell more often! Additionally, the player unlocks a new Harmonic Modulator slot for each Serene Soul they have incarnated.

* Harmonic Modulators are glass spheres containing an odd gaseous cybernetic. Should the player discover one of these rare trinkets, they may inhale the vapour to gain a new toggleable ability - usually some useful passive such as flight, combat actions taking less turns, or additional movement options. Each one also passively grants extra buffs to allied Harmonizers, like also giving them a conversion touch ability. Infectious! I have the code for a few of these already written at the time of posting this.

* To continue using an active Modulator, Souls from the player's repertoire will keep getting converted into the Caste the Serene Soul has taken root in, similarly to the Serene Soul's normal active effect. At this state, the risk of ending up with all your Souls belonging a single Caste can become a problem, but all it takes is some discipline to avoid using Modulators if they are not required for the current challenge. With the right temperance, using the Harmony's arsenal could become a fantastic asset to your character's potential!

* Should you go overboard and use one of these effects when there are no Souls left to convert, the Serene Soul will duplicate, and take root into *another* Caste, deepening your grave even further. 

* Serene Souls cannot be removed through normal means.

* Thus, the undisciplined player will find their character becoming corrupted from the inside by their own inventory, at an exponential rate that should prove difficult to stop. Desperate for a cure, they may become the victim of swindlers across the dungeon charging exorbitant prices - paid in Souls, of course - for pruning Serene Souls.

* Should the player have all 6 of their Castes infested, then the Harmony will have succeeded in its devious plan, and enlisted you to join their side. At this point, I'd like the game to continue with a kit fully reliant on summoning extremely buffed-up Harmonizers, and to potentially change the game's ending if I were to ever make a proper one.

I adore this idea of a powerful cursed item that *sounds* innocuous at first, but creates a chain reaction that eventually forces your run to revolve around it. Making the Harmony faction have some unique infectious-themed loot has always been a core part of TGFP's vision, but this particular rendition overjoys me beyond words.

As for other random 2023 projects, I also want to increase terrain variety and present new interesting positioning challenges in narrow hallways or geometric rooms, which will probably demolish my current map generation set-up with the fury of a thousand fatal exceptions. Finally, despite my utter lack of drawing skill, I want to make the game's visuals look the best they can be despite my limited means, with a UI that fits the glyphic style and achieves a sort of minimalistic elegance. I look forward to discussing these points in future Sharing Saturdays.

> "That is a lot of talking you are doing. And not a lot of developing. In the time it took you to write this post, I would have been able to make your entire game three times over. With DLCs. And cosmetic skins. And lootboxes. And a battlepass. But for some reason, you requested that I be here to listen you ramble about your unimportant matters. The Harmony's time is not free, ruffian."

That is correct. This post has gone on long enough. The weeks to come are bright, and my soul is filled with excitement!

> "Perhaps it should be filled with the Harmonic Song instead."