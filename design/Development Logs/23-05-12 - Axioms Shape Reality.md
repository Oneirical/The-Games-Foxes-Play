*"In a realm where sheer belief draws the line between what is and what is not, pride is omnipotence. The Saints were the first to learn this primordial truth."*

- Flavour text of Haughty As The Saints Were, form component

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Rough days all around. Without going into too much detail, I work in the research sector, and the culture of trickling down the most grueling tasks to the bottom of the ladder is ever-present. Thankfully, when I wasn't watching video feeds of test chambers for hours and annotating hundreds of samples, I found some time to cook up a little more cyber-arcana:

# Axioms Dictate What Is

I am in the process of reworking *every single creature* to operate according to my new spell-crafting system. This is, in a way, showing the player a simplified view of the code blocks that make them tick! For example, our dedicated Apiarist robots now hold the spell **"When a step is taken, on self, apply 1 Paralysis"**. Before this new feature, each enemy had a special block of code dictating what they did in particular (in the case of Apiarists, it was "skip every other turn"), but now, every little bit of their behaviour is modular and - most importantly - can also be used by the player.

Why do this? Well, I am just salivating at all the doors this opens up. Polymorphing the player into *any* creature and having it work Nethack-style is now a feasible feature, since every entity is really just a critter with legs to move with, claws to attack with, and a list of cool spells. You might be able to permanently change a creature type's innate spells so they heal you instead. You could soul-swap with an enemy and have them attack you with *your own spells that you carefully crafted* while you thrash around in their body that gets stunned and confused every other turn. Now THIS is the traditional roguelike spirit I seek!

For clarity, these spells are now named Axioms. Lore-wise, they are an unshakable belief that reality works in a certain way - robots are programmed to think that their body is too bulky to move quickly, so they advance at a snail's pace. The main character's abilities are centered around ideology and identity, so it is only right that they might be able to entrance creatures into believing something entirely different - or be entranced themselves...

This ironically also makes it much easier for me to add new enemies, since all I must do is look at my ever-growing list of spell components, jam a couple that seem funny together, and go for a test run. If I'm happy, I sketch a quick sprite, give it some crispy lore and I'm done.

# Vision Stretches Out From Squares

While I was reading about Path of Achra's awesome launch on Steam, I fell upon an interesting exchange questioning why the game had been made with a 4:3 aspect ratio. This sent me into a reading frenzy about the way games should be displayed, until I eventually came to the harrowing conclusion that my game is impossible to display in glorious fullscreen in its current state.

Following my horror, I then grabbed my big metaphorical axe and butchered up my UI to bits, expanded the screen to majestuous 16:9, and began the rather daunting task of putting everything back together. On the plus side, this gave me much more space to work with, and allowed me to add a [miniature]() Axiom equip screen accessible directly at any time. There are reasons why one would want to swap between two Axioms for a certain task, and speeding up the process instead of mashing the keyboard each time is such a huge improvement. It also makes me feel like I added the equivalent of an "Right arm: Steel Gauntlet" equipment display sidebar to my game, which earns bonus True Roguelike™ points.

If any readers feel like this new UI has something out of place or should be improved at some location, now is the time.

At the risk of horrifying some readers of the subreddit, I will say that I build my UI by literally saying "draw this symbol at pixels x: 1473 and y: 843" and going at it trial and error style until everything looks centered and pleasant.

So far, I've been going at it pure JavaScript Canvas Vanilla style, but I am starting to get quite fed up about the graphics constantly getting in the way and sucking up my limited development time moving pixels around instead of coding actually fun stuff. Not to mention my CPU fans going *brrrrrr* every time I open the world map screen due to the hundreds of sprites getting drawn every 15 milliseconds on it. I've been looking into libraries - PixiJS especially, but any one would imply a complete rewrite of my rendering code. Sigh.

# Long Days Ahead

I'm really excited about making all this awesome content, but work is getting really demanding with full-time hours. It comes and goes... I've had to relocate because of it and now only have an old laptop to develop on. After weeping at how slow this glorified calculator was, I surrendered to the penguin elitists and changed the OS to Linux Mint - best decision ever. This thing now works like a charm. I won't ever be able to run any of my old games on it, but honestly, that's a good thing. Those who have lost days to bashing pixelated creatures across a grid will understand what I mean.