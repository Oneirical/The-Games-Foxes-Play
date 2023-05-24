*""*

- 

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

Well well well well well. Look at me coming back to the JavaScript libraries with my tail between my legs, moments after I said I was done. I tried to resume feature development normally, but after entering the crafting room and seeing my FPS become a slideshow presentation, I realized that my game code has reached its limit. It is bloated by gore and unholy practices from back when I was literally using my own game as motivation to learn how to code. I see now why Kyzrati said "don't make your dream roguelike right away unless you like starting over".

Well I do kind of like starting over. It's refreshing to grab a big metaphorical axe and butcher up the unworthy who think parasiting my 256MB of VRAM with their 1500+ drawSprite() calls every 15 milliseconds is funny.

* Possibly about half of the game's entire code has just been vaporized out of existence. 
* The entire graphics and UI module has been rewritten from scratch, this time using PIXI.js.
* Tons upon tons of mechanics that had been concocted back when I didn't really know where I was bringing this project have been expunged.
* Many fundamental concepts, like monsters existing and moving around, have been significantly changed to ensure the player character is no longer some special snowflake with unique functions, but rather just another creature with some "is Controllable" flag set to true.
* The "Great Wall of Global Variables" has terrorized the populace for too long, and has been rightfully destroyed.

This hurt. It really did. So many hours of work, just gone. But proved to be a worthy sacrifice. At last, I have:

* Pure 60 FPS crispy goodness
* A 1920x1080 resolution that actually makes sense
* A gloriously juicy UI redesign
* A code architecture that does *not* instill desires in me to abandon society and live in the woods when I look at it

I have also unlocked a lot more visual tricks to add some pizazz to my otherwise minimalist graphics, like this cool looking [blur effect](). It is giving me delusions of grandeur to make this game actually look good despite my non-existent art skills. Please dispense a slap to my facial regions to knock some sense into me.