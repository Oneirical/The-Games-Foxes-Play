*"A billion cells, one bee. Ten thousand bees, one hive. A trillion hives, one god."*

## The Games Foxes Play
*([complete source code](https://github.com/Oneirical/The-Games-Foxes-Play) - [mirror](https://codeberg.org/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs))*

1000th Git commit reached today!

I am caught in a peculiar situation.

Relatively, I am quite young. I am not even out of university yet. I am trying to make my way through the world, building a career and network like all middle class souls wandering the industrialized world. There is so much to learn, so much to do, so much to read.

I am very glad that I have gotten to this point. This project has made me grow so much - from being a nigh-total newbie at programming back in early 2022 and all things tech to, this week, actively applying to technology internships and feeling pretty good about my chances. Tangentially, I discovered data privacy, the Linux operating system, and basic cybersecurity.

But in regards to this project, there are a few factors to consider:

- The codebase contains a non-negligible amount of spaghetti written by my inexperienced self from months ago.
- The entire project is literally just an index.html file with a folder of JavaScript files. I tried 3 times to use a package manager like bun, yarn or npm, and failed all 3 times due to a disgusting fest of conflicts and dependencies.
- Every time I want to add something new, I feel forced to reinvent the wheel and write tons of gore and spaghetti to get around JavaScript's oddities. My game is getting really sandbox-y and the sheer amount of "TypeError: undefined is not an X" encountered daily is getting unacceptable.
- Most importantly, *I feel like I am no longer learning much technical knowledge from working on this project.*

But, I also don't want to just give up. Too many things in this world are left unfinished. I care about the game itself, its story, and I don't want to let what is basically just a technological issue defeat me. This whole undertaking was never about shipping a product or making money, it was about expressing my own creativity.

For the sake of experimentation, I have started rebuilding the game from scratch in Rust, with the Bevy engine. I honestly expected it to be much harder - just a few hours later, I have a working 45x45 map of tiles that can contain creatures, and... the ability to zoom in and out on any point on the screen. Implementing something like that in my old codebase would have been utterly cancerous.

I'm really enjoying Rust so far. The rust-analyser plugin is like magic. The Cargo package manager delivers everything I need in minutes. I have not had a single runtime error yet. I just ~~write~~ copypaste codeblocks from the Internet, shift some things around, and things just work without fuss. And every time I start writing gore and spaghetti, the compiler goes "No! Bad Onei. Bad."

Good first impressions, but I remain cautious. I do not know if I am about to hit a wall of complexity in the near future, considering the bad things I heard about Bevy. I also wonder just how really valuable this entire project is - it's artistic, but the so-called "real world" will not care. Maybe I should be spending my time doing open source pull requests or mini-apps employers will actually find interesting instead. Or maybe I should just be wrapping up the JavaScript version in a minimum viable product, shipping it and not touching it again.

Quite the puzzle.