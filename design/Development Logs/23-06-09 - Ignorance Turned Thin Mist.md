*"A ruin is the final state of an idea - the data has crystallized into matter, latched itself into the material like a tick - and once all the praise has been drained out, it leaves itself at the mercy of passing hours."*

- flavour text of Souvenirs Hauled from Bygone Eras, tutorial node

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I have cloned my source code to Codeberg, because as they say, when it comes to backups - one is zero and two is one. Learned that the hard way recently after I casually deleted the backup of my giga-huge DCSS Felid guide a week before the DCSS wiki went splat. It's [back]() now, but that was a bit too close for comfort.

# Dissipate the Mists of Ignorance

The research screen remake continues, and now looks snazzier than it ever was before. Animated tab selectors, removal of annoying scrolling, and sprawling skill trees!

In the original version, the code determining the unlock order and prerequisites was a simple database: "Vision" became available if both "Seed" and "Brush" were completed, for example. However, writing all of these connections was becoming extremely tedious with the sheer amount of nodes available. Instead, there is now a simple algorithm to make a theoretical liquid "flow" through the connectors and unlock everything it touches!

On the sidebar, the dynamic description and flavour text box has also been reworked. Just making the colored text work again took *over 10 hours*. It is bewildering to me how hard such a simple feature is - and the only library I found online is extremely unpopular and also only available for a deprecated version of my rendering library (PIXI.js). This is the kind of thing that makes me salivate at Rust programmers - when they have a crate, it rarely goes out of date, because it is simply finished. And also, they don't have to deal with the 200 IQ feature that is:

* measureText("rogue") = 24 pixels
* measureText("rogue ") = 24 pixels
* measureText(" rogue") = 28 pixels

I have a question. For the JS gods. *Why?*

In the end, my final implementation is very sad. It literally writes the text normally all in a single color, then locates all words from a "special words list" and places new Text elements on top with a different color. This basically means that I can't ever have bolded text without messing everything up. Oh well.

