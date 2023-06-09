*"A ruin is the final state of an idea - the data has crystallized into matter, latched itself into the material like a tick - and once all the praise has been drained out, it leaves itself at the mercy of passing hours."*

- flavour text of Souvenirs Hauled from Bygone Eras, tutorial node

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror]() | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.4.3 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

I have cloned my source code to Codeberg, because as they say, when it comes to backups - one is zero and two is one. Learned that the hard way recently after I casually deleted the backup of my giga-huge DCSS Felid guide a week before the DCSS wiki went splat. It's [back]() now, but that was a bit too close for comfort.

# Dissipate the Mists of Ignorance

The research screen remake continues, and now looks [snazzier than it ever was before](). Animated tab selectors, removal of annoying scrolling, and sprawling skill trees!

In the original version, the code determining the unlock order and prerequisites was a simple database: 

```prerequisites = {
    "Vision" : ["Seed","Cage"],
    "Seed" : ["Herald"], ..etc..
}
```

 However, writing all of these connections was becoming extremely tedious with the sheer amount of nodes available. Instead, there is now a simple algorithm to make an imaginary liquid "flow" through the connectors and unlock everything it touches!

On the sidebar, the dynamic description and flavour text box has also been reworked. Just making the colored text work again took *over 10 hours*. It is bewildering to me how hard such a simple feature is - and the only library I found online is rather unpopular, has a trillion dependencies and is also only available for a deprecated version of my rendering library (PIXI.js). This is the kind of thing that makes me salivate at Rust programmers - when they have a crate, it rarely goes out of date, because it is simply finished. And also, they don't have to deal with the 200 IQ feature that is:

* measureText("rogue") = 24 pixels
* measureText("rogue ") = 24 pixels
* measureText(" rogue") = 28 pixels

I have a question. For the JS gods. *Why?*

In the end, my final implementation is very sad. It literally writes the text normally all in a single color, then locates all words from a "special words list" and places new Text elements on top with a different color. This basically means that I can't ever have bold text without messing everything up. Oh well.

There is also a mysterious cyan variant of the "liquid flow" unlocking algorithm, which [spreads very rapidly]() across the entire network and unveils truths as if they had been obvious since the very beginning of our protagonist's journey. I hope to build an entire core mechanic around this peculiar infection - and I believe the moment where it finally gets translated from my design document into code will be the big turning point between an amateurish experiment and an actually promising potential game. Over a year later, about time.

# Arcane Researchers Toil Alone

I've come to find out that solo game development is very much based on intrinsic motivation. People can give you a thumbs up after you show off a neat screenshot, but there's never really an ear that's willing to hear you unload your entire thought-stream for obvious reasons (this is not a complaint, I certaintly do not want to hear any unregulated thought-streams myself). The process of making the thing in itself requires one to be *obsessed* with the subject matter to avoid giving up. If I wasn't so attached to the concept and to the characters of this little glyphic imaginary universe, these posts would have dried out long ago. I understand why duo-development projects are quite often more successful... Though the more minds go into the creation of a product, the more diluted it risks becoming. "Dans les petits pots, les meilleurs onguents" (In the smallest jars come the best ointments), as they say in my homeland.

I generally try to read the other posts in this thread every Saturday, though I tend to have trouble parsing the tech-tongued incantations some users here particularly enjoy. I'm just glad to have an anchor to tie myself to every week, even though it might just be a kind of placebo.