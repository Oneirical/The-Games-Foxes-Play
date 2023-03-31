*"There was a time where the legislators of the Old World would have smitten any users of this sinister device with the most harrowing punishments they could conceive. It turns out these primitive rules are hard to enforce when one lacks a physical form."*

- flavour text of Ivory Bars

## The Games Foxes Play
*([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [view all previous posts](https://github.com/Oneirical/The-Games-Foxes-Play/tree/main/design/Development%20Logs) | [play 0.2 online in browser on itch.io!](https://oneirical.itch.io/tgfp))*

*Unfortunately, I have chosen to downgrade my browser build to the old 0.2 from January. 0.3 is bloated with unfun features and is way too confusing, giving people a bad first impression of my game - as cool as the map generation algorithm may be.*

At last, officially back on track. It's genuinely deranged how forcing myself to sit down and get developing is the most arduous thing ever, but if I survive the first 30 minutes of urges to go do something else, then I become so engrossed it would take a nuclear cataclysm to get me off the computer.

Anyhow, to get past the "none of these features are fun and my game is stuck" bottleneck, I have had to rethink the core gameplay loop entirely. The progress shown in this post is the result of weeks of obsessed brainstorming and daydreaming cumulated across many, many public transit rides.

I hope I won't have to scrap all this stuff again. But this time, I feel like I actually thought this through. Plus, despite the apparent complexity, it was surprisingly easy to make just by repurposing some bits of code from unused features.

## Totally Not Evil And 100% Ethical

The player now starts every single run directly in the [pre-fabricated facility](https://cdn.discordapp.com/attachments/504088568084561930/1091370030073127002/Capture_decran_le_2023-03-31_a_10.18.21.png) I have showcased last week. It is not randomized, and contains a couple of interesting rooms - but the one I would like to talk about is our little [sinister friend](https://cdn.discordapp.com/attachments/504088568084561930/1091370030291222628/Capture_decran_le_2023-03-31_a_10.18.40.png) right here.

Meet the Soul Cage. A prison capable of holding captive the very identity of whichever hapless individuals are placed within. Mechanically, this means that Souls (the spells of my game) can be both placed and retrieved into the slots of this container.

Now, Souls used to be rather obedient and overjoyed at the thought of you enslaving them for eternity. That is no longer the case. When acquired for the first time, Souls will now be in their Turbulent state, which makes them thrash fruitlessly in terror both in [your inventory and in the cage](https://cdn.discordapp.com/attachments/504088568084561930/1091366635832610907/turntogif.gif). They are not usable in this state.

While placed in the Soul Cage, Turbulent Souls daydream a lot - of the worlds they once knew, of the creatures they encountered on their travels. When a whole assortment of Souls unite their thoughts from the Cage, they create together a Vision of the universe outside the facility.

You may explore this Vision. By meditating in [this familiar room](https://cdn.discordapp.com/attachments/504088568084561930/1091370030542897194/Capture_decran_le_2023-03-31_a_10.22.11.png), you enter a dream-dungeon where *each room represents one Turbulent Soul*. Compare the structure between [the cage](https://cdn.discordapp.com/attachments/504088568084561930/1091370030723244103/Capture_decran_le_2023-03-31_a_10.24.41.png) and [the map](https://cdn.discordapp.com/attachments/504088568084561930/1091370030945534012/Capture_decran_le_2023-03-31_a_10.25.30.png).

In each of these rooms, your task is to exterminate the creatures within - through the combat system I've shown many times now. Upon doing so, the Soul they belonged to will be coerced into submission, cease its struggles, and have its ability unlocked for usage.

Now all is left to do is exit the Vision, return to the Cage, and harvest the [freshly disciplined Souls](https://cdn.discordapp.com/attachments/504088568084561930/1091368863796568185/collection.gif) like a cultivator visiting their fields on a warm summer day. As for who will refill it to repeat the process?

Well. The creatures inside the Vision... They may be just imaginary creatures, but they have Souls too. Perhaps you are an imaginary creature yourself?

# Staring Into Infinity

I love this mechanic, because it lets me use the map generation/display system I made without removing the fun part of my game (clearing puzzle-like encounters in small rooms). The future plan is to make the player able to accumulate a large quantity of Disciplined Souls, then put those in the Cage, and create a Vision that is peaceful, stable, comfortable... A new facility to call home, with its own dream-Cage to continue the process one layer downwards. And so on, in an infinity of dreams within dreams.

Why would one want to embrace such insanity? Well, I doubt the Harmony - the main antagonistic force of the game - are very happy about your psycho-agricultural business. As they pour into the facility from the outside world, perhaps the only escape will be down a bottomless pit forged out of the imagination of hundreds.