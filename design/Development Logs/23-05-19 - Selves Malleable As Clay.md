*""*

- 

## The Games Foxes Play
*([complete source code on github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

It's tough to still channel the discipline to hammer out lines of code after each 9-to-5 toiling in the data mines. Anyone who has released a game while simultaneously working full-time, I bow to you.

# Selves Malleable As Clay

I am getting *waaaay* too ahead of myself already working on this feature when the UI is still half-broken from my last week's 16:9 aspect ratio modifications. Plus, I haven't even finished equipping every entity with cutting-edge Axioms yet to make this mechanic truly universal.

But I was just too hyped to not at least start.

Enter: Soulswapping. Currently accessible as a Function spell component, it will shuffle around the souls of every affected creature, being quite unimpressive when used on two enemies together. However, when the *player* joins in on the fun... true chaos is abound. This allows one to play as any creature in the game and use their innate ability to your advantage, while the... previous owner of your new flesh vessel is now thrashing around in your body, spamming your own spells and potentially trying to swap themselves back. New meta: craft deliberately horrible suicide spells and soul swap with a boss and watch them self-detonate? We get there when we get there.

# Knowledge Forks Among Many Paths

Nope. No libraries. I am done. I spent 6 hours trying to redesign my code around PixiJS. It's not *impossible* and I made progress, but having to run a webserver to test any little thing is tedious beyond words, and I noticed no real performance improvements. I am not ready to make these sacrifices.

I'll do it *my* way. It has served me well so far. I've already cooked up a very basic tool to help me build my UI that lets me move my mouse around to place things instead of writing trial and error X and Y coordinates in my drawSprite() functions.

It's tedious work, but the UI has received a couple more repairs and overhaul following the aspect ratio transition. Unfortunately, there are some artifacts of my lack of front-end design experience that are now pretty baked into the code and which would take at least an entire week's worth of dev-time to fully root out. Notably, the game can only be devoid of visual artifacts when rendered in multiples of 16 pixels. 

1792x1008, fun stuff.

Hey, it's legally a native resolution. I have tried adding an option to resize the resolution, but it completely butchers up the UI as not every element is perfectly scaled according to the window width and height. I give up for now. The default setting looks great on every normal computer I have tried, from laptops to desktops. Supporting a few edge cases (Roguelikes in the movie theatre, anyone??) will be a later thing. When I, you know, actually have a good game.

The research tree screen has received a significant overhaul, as I just had to capitalize on all this sweet extra space. [Behold.]() It was starting to be an actual puzzle trying to place everything in the tiny space of the previous iteration - a fun puzzle I must say, but I am not here to play a game, I am here to make one. So, enter seven tabs of separated content, one for general knowledge and six others for all of the castes and their Axiom components. They are:

* **Saintly** - grace, healing and non-violence
* **Ordered** - authority, resilience and structure
* **Artistic** - craftiness, creativity and passion
* **Unhinged** - rage, destruction and zeal
* **Feral** - freedom, motion and randomness
* **Vile** - illusion, suffering and control

All these placements will be *very* relevant when I actually add the loss condition I have been designing and daydreaming about for way too long now. I have so, so much to do, but it is not like I am pressed for time. This game isn't a product to be sold, it is a vessel of self-expression.