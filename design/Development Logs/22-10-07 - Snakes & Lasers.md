*"Current target incarnation neutralized. Awaiting reincarnation for further dispensing of gratuitous violence."*

-Epsilon, upon slaying the player

**The Games Foxes Play** ([github](https://github.com/Oneirical/The-Games-Foxes-Play) | [original post](https://www.reddit.com/r/roguelikedev/comments/uzb3iu/sharing_saturday_416/iaa1w3u/) | [play online in browser on itch.io!](https://oneirical.itch.io/tgfp))

I return! Long story short - the DCSS tournament juicing my feeble dopamine-vulnerable brain with promises of virtual trophies, and a big new (positive) event in Real Life™ drew my attention away from developing this project. After that, I lingered more or less in a vegetative state of I-still-want-to-do-this-but-it-will-take-too-much-effort-to-remember-how-everything-works. This would have probably ended up into scoring another victim for my ever-undisciplined personal project work ethic, but there was somebody involved in all this I had forgotten to ask: my esteemed composer friend. I promised I would rush back into the fray if he beat all 16 levels of the current version of the game - which I believed to be impossible to beat.

Well, a week later, he posted a screenshot of the buggy endgame screen, and, to put it bluntly, "hauled my ass back". Turns out he was obsessed with the game and made MORE music tracks while I was gone. Very well then.

Turns out, the "remember-how-everything-works" part was actually really easy, and game development is just as fun as I remembered it to be from a few months ago.

**Snakes and Lasers - Epsilon, a new boss fight!**

* Inspired by [this old thread](https://www.reddit.com/r/roguelikedev/comments/viicvz/share_some_enemyability_gimmicks/idg5aw4/) where u/mysda suggested to me a multi-segment enemy, I am proud to introduce Epsilon, the big-ass snake robot who also looks really badass. [Look at him go!](https://youtu.be/Bkn9izFKuiQ)

* The core principle: Epsilon starts out completely invincible, but is slow and can only dispense basic melee attacks. There are "Cores" scattered around the boss room, and each one will give Epsilon a new ability as well as a new vulnerability. For example, you can push the Red core (affectuously named "Turbo-Kinetic SurgeRockets-Branded Rack") into his maw, and then he will begin dashing all over the place. If you can bait that dash to land into one of the alcoves in the boss room, he will be rendered vulnerable for a couple of turns! If you install every core, then you will have a death machine on your hands, but also one that is permanently vulnerable.

* So far, I've coded in Epsilon's AI, pushable boxes, and a bunch of abilities for various Cores. That means Epsilon is currently unkillable and will swiftly execute all players who get to him. At least, Epsilon absolutely has [a great sense of spectacle](https://youtu.be/2CkZK2HwLKM) for you to enjoy before meeting your doom! Yes, I have godmode on.

* Thank you to everyone who replied in [this thread](https://www.reddit.com/r/roguelikedev/comments/xwc3t1/counterintuitive_mechanics_and_information/) about potentially counterintuitive gameplay for the Pink Core (affectuously named "Roseic Bio-Pacification Dual-Diffusers 3B"). In response to feedback, I've made one of the enemies you fight just a few rooms before, the **Roseic Bio-Embalmer**, have its nasty on-death effect negated if you purposefully intoxicate yourself (which is likely to happen, since Bio-Embalmers inject Glamour on hit)! This is mentioned in the enemy's description, of course, and actually fits quite well with their lore, even making the whole concept of Glamour even creepier than it already was. I hope this will tutorialize that accumulating Glamour is not necessarily negative as long as it stays under the threshold. Moderation is key.

**Balance & Tweaks**

* I was really unsatisfied with how the on-death "you can now sacrifice some souls to make you feel better" mechanic was more of a placebo than the actual core mechanic of the game that it is supposed to be. Therefore, I've radically upped the ante and made it so sacrificing souls in this way will *permanently* increase your Resolve counter for the rest of the run! (The closest classic roguelike equivalent to Resolve would be mana). In exchange, Resolve no longer scales based on the difficulty of the level you are on. After playtesting, this seems like a much healthier mechanic, and will actually help out players who die a lot in the early game. (Yes, I say "die", but my game is still a roguelike, you have extremely low HP and limited extra lives, it's the game's whole schtick).

* You no longer start with a Harmonic Modulator. It was simply too complex for new players trying to learn the ropes gradually. Instead, rerolling in Harmonic Relay rooms, which was once a noob trap, is now a great way of obtaining Modulators for all your rocket-thrusters and mind-control needs!

**UI**

* The Glamour counter has been repositioned, and now only appears when the player accumulates at least 1 point of Glamour.

* There is now mouseclick support for soul sacrifice and Harmonic Relay usage. I wish to eventually evolve into being able to play the whole game with mouse only! Some have told me my game looks like it would work great on mobile - I agree, but that's an objective for far down the road!

**Music**

* Too many to list. The composer made an OST video [here](https://youtu.be/4wnqnJ918bk), and it still only has like half of them. Wew.

More to come soon, with more Epsilon-related features on the conveyor belt waiting for assembly!