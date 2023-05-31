*"Some chains are unbreakable. In this case, it is the prisoner that must be broken."*

- Tutorial entry on Shattered Souls

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

The toiling in the UI mines continues, scorched by the heat of the miniaturized sun that is my laptop CPU every time I cause an infinite loop, and pestered by the buzzing of the feature ideas sparking up while I am stuck in graphical work.

# Glamour Sparks Respect**

In the spirit of adding some pizzazz to my otherwise unimpressive minimalist graphics, I added some neat animations here and there:

* This awesome glitch effect, which I ~~shamelessly stole~~ borrowed from the Internet, looks absolutely amazing on all things holographic. It depends on a library that has a "no commercial use" license - not that selling this game was my intention, but honestly, this effect is so cool it might just harden my choice even further.

* The map, minimap and Hypnotic Projectors now use actual tiny tiles instead of boring plain pixels. Next step, making it zoom in when you step into a Hypnotic Projector for that fancy aesthetic?

* Collecting Souls now make them faintly bounce around the UI, resulting in a [dazzling show]() when many have been acquired.

* The "paint cans" used in the Soul Cage now use [a bouncing effect]() instead of a rotation effect. Turbulent Souls stuck in the cage also [vibrate] in a neater way, though I am not sure if I'll keep the latter.

This week, I have also encountered (and patched) one of the most devious bugs I have ever seen. *Every time I passed a door, the frame rate was reduced by approximately 1.* This was utterly unnoticeable in short playtests, but after a while, I started to get suspicious, mashed my keyboard on top of a door tile, and reduced my game to a slideshow presentation. I frantically looked around for the cause for 2 and a half hours, commenting out and trying tons of deranged fixes, until I finally realized it was all because some backwater function drawing a tiny button in the sidebar was getting called over and over again and drawing thousands of mini-buttons on top of each other. 

Fun.



