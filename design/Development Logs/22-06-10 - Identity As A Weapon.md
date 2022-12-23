First, I'd like to point out just how much Javascript lets you get away with. Forgot a semicolon? Wrong indentation? Calling a function that doesn't exist? No problem, chum, I'll still run! Just... perhaps not in the way you'd expect it. This has created many very amusing bugs, such as the one time where using *any* ability caused time to stop, every enemy to freeze, and the player being able to go stab them one by one. Maybe I'll turn that into an actual ability sometime.

There's also the... uhh... ["Wall of Global Variables"](https://cdn.discordapp.com/attachments/504088568084561930/984945501742977044/Capture_decran_le_2022-06-10_a_18.21.28.png). Every day, it just keeps getting bigger and bigger, and soon, it may very well swallow the universe and end reality as we know it.

***

**The Games Foxes Play** ([original post](https://www.reddit.com/r/roguelikedev/comments/uzb3iu/sharing_saturday_416/iaa1w3u/))

These last 2 weeks have been laser-focused on creating a grand variety of player abilities/spells. In the game, they're called "souls". Here's a showcase of some of them!

First, I'd like to showcase [Aube](https://cdn.discordapp.com/attachments/843035924468203540/984912607637037066/Capture_decran_le_2022-06-10_a_16.09.29.png). It's complete and utter trash, making the entire room harder for the very minor consolation prize of healing you slightly. However, after 5 uses, it becomes the completely overpowered [Zenith](https://cdn.discordapp.com/attachments/504088568084561930/984946662931828736/Capture_decran_le_2022-06-10_a_18.26.05.png). Just look at that [power](https://webmshare.com/play/Qb78R).

Now, nothing good can last. After Zenith has been used 5 times, it becomes the worn-out and sorrowful [Crepusculum](https://cdn.discordapp.com/attachments/504088568084561930/984947608713822218/Capture_decran_le_2022-06-10_a_18.29.53.png), with a minor utility effect. Once Crepusculum has been used 5 times, it vanishes forever from your deck, and restores 3 Ipseity as a reward for quieting this restless soul. For those who are just tuning in, "Ipseity" is the player's "true HP", and the game ends if they run out of it.

I really like how you can learn the sad story of Aube's life through these game mechanics. My plan is to make the game's "magic" feel emotional, in a way. The protagonist isn't using mere magic runes, but the actual spirits of beings which *depend* on your success in your quest to be saved.

Yeah, the "in your paw" part is pretty iffy. I just didn't want to say "in your hand" for a feline protagonist. I'll figure this out later.

Next up, we have the narcissistic [Rose](https://cdn.discordapp.com/attachments/504088568084561930/984488410444075078/Capture_decran_le_2022-06-09_a_12.05.11.png) who lets you mark one enemy with bright pink ribbons, which will thus become targeted by all. Of course, the marked enemy will not be very happy with you and will remain hostile, but it's only a matter of time before they are torn apart by their former allies.

[Here's a video of it in action.](https://webmshare.com/play/x8vdn)

It's not an especially offensive ability, as the marked enemy tends to die quite quickly, however, it does have the advantage of grouping enemies in a big dogpile over their former friend. This makes the room very vulnerable to an AOE-type ability, such as the one that will be demonstrated next.

[Joltzazon](https://cdn.discordapp.com/attachments/504088568084561930/984490577901027358/Capture_decran_le_2022-06-09_a_12.13.47.png) is a potentially devastating blast that may require some set-up. It will wreck havoc on any enemy that's adjacent to other enemies, but will remain ineffectual on a dispersed crowd.

[Here's a video of it in action.](https://webmshare.com/play/JbzPW)

Of course, not all abilities are meant to inflict damage. Kilami, for example, has a powerful loot-duplicating effect that lasts this turn and the next. Now, in this game, having multiple copies of the same soul type is very desirable, as the merchants of the world give much better trades if you can demonstrate your commitment to "harmonizing" your deck towards a single type, or at the very least similar types.

There's a really sweet synergy with landmine/charm/summon type powers, since the duplicating effect is also active for the turn where you are busy using Kilami. If you can get a kill despite not taking any offensive action, through the help of something you placed on the board beforehand, you can really harvest an impressive amount of souls! Once again, [demonstration](https://webmshare.com/play/eweMa). Here, I set down a landmine with my Artistic soul. Then, just before that yellow Shrike steps on it, I activate Kilami. I immediately collect 2 extra Feral souls from the Shrikes, and then, while Kilami is still active for one last turn, I explode that group of 3 with Joltzazon for even more bonus loot!

***

Beyond the abilities I've not shown, I've also made sure that each ability is also usable by enemies. For some, it's not really relevant, like this Kilami one, but the more flashy, explosions-and-lasers powers are really fun to slap on enemies and watch them utterly decimate me, the player. I dream of a single boss in the entire game, that will only be found at the very end of the journey, that just pulls out a chaotic assortment of attacks while the player uses their own in an ultimate two-way DEATH RAVE.

HP sponges and tanks are boring. A lot of this game was inspired from Felid gameplay in DCSS, so I imagine the more elite enemies will be very squishy, but have a bunch of extra lives and/or be more of a coordinated swarm than a single "big bad".

Next up will be diversifying enemy variety, as the 5 types present right now are getting a little bit old. Or, I might just spend the week making more spells. They are really fun to design!