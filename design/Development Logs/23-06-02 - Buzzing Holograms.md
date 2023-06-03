*"Some chains are unbreakable. In this case, it is the prisoner that must be broken."*

- Tutorial entry on Shattered Souls

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

The toiling in the UI mines continues, scorched by the heat of the miniaturized sun that is my laptop CPU every time I cause an infinite loop, and pestered by the buzzing of the feature ideas sparking up while I am stuck in graphical work. Not to mention the fatigue of coming home from the modern aberration known as the 40 Hour Work Week...

It's particularly annoying that so many of these features *used* to be completed, but have to be remade from scratch due to the rendering code working in a completely different way after my rewrite.

I am now pretty much exclusively debugging and testing my game with [Tauri](https://tauri.app/). I really love how smooth the performance is, and also how the game automatically refreshes in seconds every time I make changes to my code for me to test it right away. It's so elegant that it has gotten me to start reading the first few chapters of the Rust book. Ironically, I had bounced off Rust when first trying to choose what language to make my game in (thebracket's [tutorial](https://bfnightly.bracketproductions.com/chapter_1.html) is amazing but very complex for an absolute beginner). I think I would actually stand a chance now that I have honed my skills - but I don't want to risk getting sucked into a new project, so my interest will remain superficial for now.

# Glamour Sparks Respect

In the spirit of adding some pizzazz to my otherwise unimpressive minimalist graphics, I added a few extra sparkles. Sorry about the low framerate, still figuring out how to record GIFs on Linux.

* This [awesome glitch effect](https://cdn.discordapp.com/attachments/504088568084561930/1114349525260320788/Rc7mDVw.gif), which I ~~shamelessly stole~~ borrowed from the Internet, looks absolutely amazing on all things holographic. It depends on a library that has a "no commercial use" license - not that selling this game was my intention, but honestly, this effect is so cool it might just harden my choice even further.

* The map, minimap and [Hypnotic Projectors](https://cdn.discordapp.com/attachments/504088568084561930/1114349889971822602/KAbEoPW.gif) now use actual tiny tiles instead of boring plain pixels. Next step, making it zoom in when you step into a Hypnotic Projector for that fancy aesthetic?

* Collecting Souls now makes them faintly bounce around the UI, resulting in a [dazzling show](https://cdn.discordapp.com/attachments/504088568084561930/1114347662054014997/F1DCCVE.gif) when many have been acquired.

* The "paint cans" used in the Soul Cage now use [a bouncing effect](https://cdn.discordapp.com/attachments/504088568084561930/1114349526019477586/MmPAAEy.gif) instead of a rotation effect. Turbulent Souls stuck in the cage also [vibrate](https://cdn.discordapp.com/attachments/504088568084561930/1114349525621014608/pRDhX2Z.gif) in a neater way, though I am not sure if I'll keep the latter.

This week, I have also encountered (and patched) one of the most devious bugs I have ever seen. *Every time I passed a door, the frame rate was reduced by approximately 1.* This was utterly unnoticeable in short playtests, but after a while, I started to get suspicious, mashed my keyboard on top of a door tile, and reduced my game to a slideshow presentation. I frantically looked around for the cause for 2 and a half hours, commenting out and trying tons of deranged fixes, until I finally realized it was all because some backwater function drawing a tiny button in the sidebar was getting called over and over again and drawing thousands of mini-buttons on top of each other. 

Fun.

# Trees Of Knowledge Covered In Webs

The research screen is slowly being re-introduced, with a new sprawling design! I didn't like the cramped and claustrophobic previous iteration, so now, I am going for something truly [expansive](https://cdn.discordapp.com/attachments/504088568084561930/1114350048311005184/X841LsW.png). I have mapped out a very unique (to my knowledge) game mechanic idea related to this screen, and I am *so* hyped to begin working on it. If only all that pesky UI work could stop getting in the way...