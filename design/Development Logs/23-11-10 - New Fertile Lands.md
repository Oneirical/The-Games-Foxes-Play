*"Vessel. I have a riddle for you.*

*Which takes more effort? Painting a masterful work, or ripping apart the canvas on which it was made?*

*It is not a very difficult question to answer. Conceiving a harmonious dance of colours takes seconds, while forgetting such beauty would take days of forceful hypnosis.*

*The problem should be obvious to you. Our world has too many creators, and not enough destroyers. Entropy approaches the zero constant with every passing moment - and soon, there will be nothing left but perfection."*

# The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [rust source code](https://github.com/Oneirical/rust_tgfp) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs))*

So, against all restraint, I am tearing it all apart and rebuilding everything from scratch. And not just the code, no - the design, too. Unless I change my mind, the JavaScript version - which I have spent the last 18 months on - is to be abandoned for good. I debated "finishing" it into a Minimum Viable Product, but this simply would not cut it:

- The core mechanic of the game is that every entity can be reprogrammed using "code blocks".
- Actually shipping a game featuring this mechanic would require extensive testing to avoid the heaps of problems caused by specific combinations among the millions of possibilities.
- Not only do I not want to bang my head against such an ordeal, it would not be a good use of my time, as it would be a repetitive activity teaching me little to nothing.
- Removing this mechanic would leave a diluted version of the game that simply does not fit my vision.

I feel no regrets. I have learned a lot. It is time to look forwards.

## New Fertile Lands Await

This weekend, I participated in a 48-hour game jam. You may see the result of my work [here](https://oneirical.itch.io/plerokeno) - a simple solitaire puzzle game with a cool minimalist monochrome aesthetic. This will not win the contest, but it has however reinforced my knowledge on the Bevy engine & the Rust programming language to a personally unprecedented extent.

The code behind it is so horrible that it has probably caused Alan Turing to spin in his (metaphorical, he was cremated) grave at the speed of light. I still made it open source so all can gaze upon the horrors within.

Following this expedition, I was then able to forge a new The Games Foxes Play - Rust Edition on the few spare hours I had this week.

The code is clean. Immaculate. Pristine. Each time I dare repeat one of the mistakes that led to the downfall of the JavaScript version by sneaking in a cursed line of code, RUST-ANALYSER descends from the heavens surrounded by the purple halo of my IDE and smites me with the righteous fury of a thousand red squiggly lines.

Today and yesterday, I spent 90 minutes typing out two giga-codeblocks without ever testing them. When the Rust compiler is finally satisfied, I tell myself "great, now onto the runtime debugging part". BAM. Zero issues, first try, both times. It's like magic. I feel confident and relieved, and never have the thought of "Fffffuuuuuu-, when I have to touch this code again in 1 month I will want to kill the past me that is currently present me..."

I don't have much to show this week, because:

1. The result of my work is not very visually impressive for now. It's just a bunch of little purple @ glyphs running in random directions on a 45x45 map with sleek pan and zoom.
2. The actual new design idea, which I hope to be unveiling soon with a prototype, is so unhinged that it might just hit a brick wall before it even truly begins. Let's just say the so-called "fearless concurrency" of Rust is going to be severely abused.

Despite these brewing developments:

* The theme of the game and the lore is staying. In fact, I think it might be even better adapted to this new model.
* The mechanic of "programming creatures to your liking" with Axioms and Souls is staying, but in a reworked form that won't make me want to direct brick-like objects towards my monitor.
* I hope to still be able to avoid having Health/Damage as a mechanic, as that was cool.
* It's going to lose a lot of Berlin Interpretation points, but it's still turn-based, grid-based, procedurally generated and with permadeath.

Is this the irrational behaviour of a perfectionist who will never finish a project? Is this a stroke of genius that will propel my game into the next echelon of greatness? I look forward to finding out.