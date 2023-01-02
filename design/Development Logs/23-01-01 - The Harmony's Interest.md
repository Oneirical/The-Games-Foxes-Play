//todo add more links and screenshots

> A ruffian with a world inside its head. The unharmonized do express their mediocrity in the strangest ways."

- Harmonic Cyberneticist greeting the player in the Serene Spire

I am not so unlike the protagonist of my own game, esteemed Collectivist. I, too, have a world inside my head, and to incarnate it into reality, I had to learn the mystical runic language of JavaScript, master the fine martial art of Git pushing and pulling, and attain inner peace before the many fatal exceptions thrown at my feeble brain every time I'd try to implement a new mechanic.

> And somehow, by some terrible farce of fate, you did **not** have perfect intrinsic knowledge of all these things? A single verse of the Harmonic Song contains all knowledge that was, is, and will be. To educate you, perhaps the sixteenth of a single note would have sufficed." 

Sadly not. I officially started in the final days of April 2022, and before then, while I had some basic knowledge of arrays, variables and functions in Python, I had never truly given my all to a project. I did not know how to "extend" a class, how to use a browser debugger - or that even was one - and I certainly did not know that [using global variables for every single issue]() was not generally advisable. My first foray into roguelike development was based off the [RLTK Rust Tutorial](http://bfnightly.bracketproductions.com/rustbook/), which, while exceptionally well written, completely went over my head as a non-developer. The [Broughlike Tutorial](https://nluqo.github.io/broughlike-tutorial/) was much more my speed, and, for the first time since I started reading project coding tutorials, *I actually understood what I was copy-pasting*. Motivation kept up despite my extremely erratic personality in regards to random interests, and while looking at my game now still clearly betrays its origins as a pre-made toolkit, I am proud to see it distance itself a little bit more with every new line of code. A game which, by now, should have named:

## The Games Foxes Play 
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all Sharing Saturday posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

> A video game? A ruffian dares believe they can properly capture the Harmony's infinite grace in... digital entertainment?! Fu!"

Indeed. **TGFP** is a nontraditional traditional roguelike themed around psionic magic - but more specifically, the power of belief, confidence and identity. In a statement on the superiority of mind over matter, there are absolutely zero equippable solid items, and all glitter, sparkles and laser beams are directly derived from a vast assortment of Souls, which serve simultaneously as the items, spells and even currency of the game. Divided into six Castes, the player may extract these Souls from each slain enemy, and channel them to unleash varied magical effects. The depth of this system begins with the inclusion of Legendary souls, which can be assigned to reign over a specific Caste and modify all effects related to that Caste into something completely different. In simple terms, it's like have six guns of six different colours, with a whole batch of add-ons to attach, mix and match for each colour.

Many intentional quirks are responsible for the "nontraditional traditional" oxymoron. Notably, the movement is 4-way only, there is no "wait" button, the graphics are composed of abstract glyphs that do not evoke any ASCII characters, and the lore is... on a level of psychedelics hauled straight from the Caves of Qud developers' secret stash. I adore creative writing and made sure to include as much flavour in descriptions and dialogue as I could - while simultanously making it so the player is never locked in cutscenes or popups, nor is required to read or understand any of my worldbuilding to progress.

My development style is based on spontaneity - and especially by locating design problems and proceeding to solve them in an interesting way. To continue building outwards, the foundation must be solid. Here are a few examples:

* I gave up on giving each Legendary Soul a "rating" from good to bad, as they could all be situationally useful, and instead gave the player more agency by allowing them to choose what Caste they want their new Legendary Soul to be in loot rooms.

* Some abilities were very poorly suited to other branches in the game with different rulesets and enviromnments, so I introduced a mechanic that causes the six basic Castes to change effects depending on what branch they are used in.

* The player could only ever go downwards and never retrace their steps through the dungeon, which made the game's world feel very "videogame-y" and not like a real place that can be walked through. This was incompatible with the lore-heavy concept I have in mind, so I implemented the ability to save rooms, return to them, and made the connections between them mazelike and winding.

* Legendary Souls were previously spells randomly rotating through the hotbar, and the player had very few occasions to actually use them. To solve this, I implemented a whole new [inventory system](), with Legendaries becoming equippable modifiers, as mentioned above.

* The player's list of available Souls was unclear, yet memorizing it provided a significant gameplay advantage - an unacceptable exercise in tedium. The sidebar UI has been [completely reworked as a result](), and is also now much more pleasing to the eye.

> Six castes is five too many. Psychic proficiency depends solely on Collectivist refinement, and the depths at which the Harmony understands the intricacies of propaganda, persuasion and re-education. I trust you have represented our position within your game as the unequivocally correct one, yes?"

To a level that preserves the player's agency. That means, anything but "unequivocal".

> Preposterous! And what even are these visuals? How dare you condense Harmonic beauty into a 16x16 PNG file?"

Of course, if the player were to view your true form, honoured Collectivist, they would be unable to play the game, stunned by your splendor.

> "Fu. You are forgiven, just this once. Partially. What purpose does your blasphemous creation even serve, if you are to mangle the Harmony's image?"

I want to make this game for myself before anyone else, and everything I do with this project is executed in the name of self-expression. If I ever release this project in some official form, I would prefer to keep it free and open source. This would be in honour to all the great memories I've forged thanks to other wayward souls on the internet devoting hours upon hours making completely free software - I have named modding communities, the older traditional roguelikes (especially DCSS), Minecraft maps, LibreOffice, random cool projects on GitHub and everything else in between.

> "Fu! To actually reach that goal, you would need a fraction of the Collective's diligence, who never tires in each and every one of its technological conquests. A fraction which you clearly lack, unless you have a perfectly logical reason explaining why you did absolutely nothing in September and November. Do you truly wish to disperse the Harmony's word through your unimpressive toy, or is this all theatre?"

Even throughout these periods of inactivity (which were half-caused by some exciting events in Real Life™, with the other half being fully the product of my ant-sized attention span), I still couldn't get this game out of my head. I definitely suffer a bit from the "ideas guy" syndrome, but just this once, I want to go against my nature and make something artistic without an external motive.

Well, that's a partial lie. I do love showing my work in this subreddit, but also to some intrigued friends, one of which has made the music present in the game thus far! Having a... "presence" in a tangible community has an immense psychological effect when it comes to discpline. It's a primordial monkey-brain mechanism, but it works.

> That is a lot of talking you are doing. And not a lot of developing. In the time it took you to write this post, I would have been able to make your entire game three times over. With DLCs. And cosmetic skins. And lootboxes. And a battlepass. But for some reason, you requested that I be here to listen you ramble about your unimportant matters. The Harmony's time is not free, ruffian.

That is correct. In concrete terms, I want to continue expanding my game in that same spontaneous development style I've come to love, rethinking conventions and respinning age-old roguelike traditions into unexpected forms. 

One of the projects that excite me the most is a complete redesign of the Harmonic Modulator system, which will act as a stand-in for the infamous trope of cursed items. It will be a subclass of player powers with immense capacity for combat domination, but with a dastardly side-effect that initially appears innocuous... only to progressively corrupt your inventory from the inside until you become *dependent* on using these Modulators for survival, deepening your grave even further. 

I also want to increase terrain variety and present new interesting positioning challenges in narrow hallways or geometric rooms, which will probably demolish my current map generation set-up with the fury of a thousand fatal exceptions. Finally, despite my utter lack of drawing skill, I want to make the game's visuals look the best they can be despite my limited means, with a UI that fits the glyphic style and achieves a sort of minimalistic elegance. I look forward to discussing these points in future Sharing Saturdays.

The weeks to come are bright, and my soul is filled with excitement!

> Perhaps it should be filled with the Harmonic Song instead.