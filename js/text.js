//TODO
//-make drawing souls fully random? idk
//-more epsicores
//-buff naia

//List of souls

vile = ["ZENESTE","RASEL"];
feral = ["KILAMI","LASHOL","EZEZZA"];
unhinged = ["SHIZAPIS","JOLTZAZON"];
artistic = ["PURPIZUG","AUBE","BORERORA", "GYVJI"];
ordered = ["ASPHA","ABAZON","NAIA"];
saintly = ["ROSE","ZAINT","ASTER"];
basic = ["TAINTED","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
basicspire = ["VILES","FERALS","UNHINGEDS","ARTISTICS","ORDEREDS","SAINTLYS"];
smod = ["Alacrity","Selective","Thrusters","Hover","Focus"];
modulators = ["Alacrity","Selective","Thrusters","Hover","Focus"];

//Monsters

//Typeless
// Monk
//Vile
// Second - Felidol - Third
//Feral
// Ragemaw - Shrike
//Unhinged
// Oracle - Ashoul - Apis
//Artistic
// Tinker - Weaver - Brute
//Ordered
// Slug - Apiarist - Snail
//Saintly
// Scion - Embalmer

messages = {
    // Various out-of-character messages
    "Empty" : "",
    "AgonyWarning" : "You do not have enough Agony to forget this soul!",
    "Shiza" : "Select one soul to discard, then two to stack on top of your deck. The last selected card goes on top of the deck.",
    "InvPrompt": "Press the number corresponding to the soul in your paw you wish to inspect, or press \"v\"/mouseover on top of a creature to view the details of their soul. Press \"c\" at any time to exit.",
    "Discard" : "Press the numbers corresponding to the souls you wish to discard. Press \"r\" when finished.",
    "NaiaTime" : "The realms of thoughts and actions synchronize into one, turning your every wish into reality. Cast as many souls as you wish. Once finished, press \"r\" to exit this trance.",
    "NoSouls" : "Your mind is devoid of souls, except for your own. Slay enemies to harvest souls!",
    "Paralyzed" : "You are paralyzed! Try to move around to shrug off the paralysis.",
    "Falling" : "You are falling! Try to move around to gain back your footing.",
    "Oversoul" : "Your psyche is trembling with the echo of a thousand chatters! Unleash some souls before drawing more.",
    "CastError" : "You cannot cast this soul right now!",
    "Constricted" : "You are constricted! You cannot move normally. Slay or escape the creature constricting you to regain your agility!",
    
    
    // Death messages
    "Fallen" : "The Harmony's song meshes with the howling wind in your ears as you plummet to the Spire's base, unceremoniously snapping your every bone while two nearby Harmonizers release a short \"Hmph!\" of contempt. You are granted the opportunity to abandon souls to the Harmony. Every 2 Souls sacrificed in this way will increase Resolve by 1. Press \"r\" to reincarnate once you have made your choices.",
    "Agony" : "You lie motionless for hours on the cold floor, until a void bubble finally begins approaching your location. You are granted the opportunity to abandon souls to the cataclysm. Every 2 Souls sacrificed in this way will increase Resolve by 1. Press \"r\" to reincarnate once you have made your choices.",
    "Rosified" : "The enthralling floral perfume overwhelms your nostrils, stunning you on the spot. In your glamorous trance, you see your paws crowned by perfectly manucured pink claws, and stare, grinning in false pride, while the world slowly dims around you. You are granted the opportunity to abandon souls to your own narcissism. Every 2 Souls sacrificed in this way will increase Resolve by 1. Press \"r\" to reincarnate once you have made your choices.",
    
    // True death messages
    "RoomDeath" : "After their fangs were done toying with your flesh, they had taken away much more than sinew and bone. Your soul turned Feral, and the last lights of duty and purpose were soon snuffed out like a candle flame, leaving nothing but a ravenous husk. Your journey has come to its end.",
    "DrawDeath" : "You broke your limits for the last time, and, in doing so, broke yourself as well. What should have been the denizens of the Next World now seep through your closed eyes, while your soul turns Feral and assumes the command of your exhausted body. Your journey has come to its end.",
    "RoseDeath" : "As the First of the Saints taught, all things decay. The Old World must be allowed to die. You, as the Last of the Saints, will be delighted to sit here until the end of time, which shouldn't take too long. Your journey has come to its end.",
    "EpsilonDeath" : "Souls and data are one and the same - the truth is clear to you, now. In the Ordering of all, there is no second guessing, no suffering, no ambiguity. Your chassis glistens underneath the glory of the fluorescent tubes, and you await your next order eagerly. Your journey has come to its end.",
    
    // Serene Harmonizer
    "FluffyFloorTaunt" : "\"Some call Fluffy heartless -- and yet here you are, attempting to let a proud soul collect muck on the grime-tainted floor. If you won't have the tact to use Fluffy's services properly, at least have the decency to leave and never return in Fluffy's presence.\"",
    "FluffyNoSoulTaunt" : "\"You cannot sacrifice that which does not exist, ruffian. No matter how much the merchants of the Old World enjoyed doing so.\"",
    "FluffyWelcome" : "\"Welcome. I am Fluffy, proud representative of the Serene Collective. I invite you to bask in the beauty that surrounds you. The beauty of my figure, the beauty of our creation, and... the beauty of progress towards perfection.\"",
    "FluffyMocking" : "\"Fufufufu! I'm not even going to comment on the disaster that just took place here. The only hope for you is through uplifting. Here, these should help hasten your ascension.\"",
    "FluffyCheat" : "Well well well. You broke reality itself, and achieved results that even Fluffy could only dream of obtaining. I hope you're proud of yourself, cheating ruffian.",
    "FluffyDisgusted" : "\"Disastrous. The Collective judged well to send me here, so I may educate you ruffians on the weakness of diversity, and the dominance of uniformity. Take these feeble souls, and may you use them to reinforce Harmony within that little fuzzy skull of yours.\"",
    "FluffyDisappointed" : "\"Hmph! I suppose there was an attempt to welcome Harmony within your heart, which I must respect. Consider these souls as studying material so you may perform better in our next encounter.\"",
    "FluffySatisfied" : "\"Not bad. For a ruffian, that is. You understand the basics of the Harmonic Truth, yet you still cling onto that free-spirited, unconforming nature of yours... Fluffy will knock it out of your skull in due time. For now, take these souls as a token of our appreciation.\"",
    "FluffyImpressed" : "\"It was only a matter of time until the ruffians of this world learned their place. Fluffy looks forward to welcoming you in uplifting, when you are ready. Until then, take these gifts reserved only for the Harmony's finest servants.\"",
    "FluffyExalted" : "\"My apologies for not recognizing you through your disguise, honoured Collectivist! I jest, of course. You have, however, greatly impressed Fluffy, and as such find yourself the recipient of a little bonus reward. May it assist in the attainment of both our respective objectives.\"",
    "FluffyDoubleSacTaunt" : "\"You have already designated a soul for uplifting at this Harmony Relay. Do you seriously think I will allow you to change your mind? Fluffy is never uncertain about anything, and you should follow her example.\"",
    "FluffyHmm" : "\"Please refrain from touching Fluffy with your muck-stained claws. Why do you pester me so? Are you unfamiliar with the Soulscribing process?\"",
    "FluffyExplain1" : "\"Hmph. Your impoliteness is excused by your ignorance. I hereby invite you to glance upon the companions that you let flutter inside that little fuzzy head of yours: they are weak. Ineffectual. You will never reach the Reality Vortex with these good-for-nothing fools.\"", //Harmonic Relays are, if you will, the Collective's trading posts. You are invited to donate 6 of your feeble, imperfect souls, and in exchange, the Harmony will be pleased to provide you with 4 of the finest souls it has to offer.
    "FluffyExplain2" : "\"That is why the honoured Serene Collective has elected to aid you in your quest. Of course, Fluffy has reasons to believe you too will aid the Harmony in return, whether you want to or not.\"", //It is a win-win scenario for all of us! Access to the luxurious installations of the Collective shall be bestowed upon your travel companions, with a free ride into the Next World to boot. As for you, you will receive some of the hardiest spirits this world has ever seen to help you survive. This is an offer you would be extremely foolish to refuse - though I am not convinced such foolishness is beyond your capabilities, for you are not Fluffy.
    "FluffyExplain3" : "\"In these four soulscribing machines, you are invited to deposit some of your esteemed travelling partners, so they may be... upgraded. Now, the Collective's definition of an \'upgrade\' may vary slightly from yours, but Fluffy trusts we shall find mutual understanding somewhere down the line.\"", //Of course, Fluffy reserves her finest merchandise for her best friends. How may you become Fluffy's friend, you wonder? By understanding the Harmonic Truth, of course. To quote Fluffy: \'Individualism leads to decay - only in unity and collectivity do we flourish
    "FluffyExplain4" : "\"As you are used to by now, use \'q\' to summon the fortunate souls upon which we shall bestow elevation they could only dream of. Then, stand on top of a Soulscribe, and evoke their assigned number. Once you have nominated between one to four... volunteers, press 'f' to confirm. It stands for 'Fluffy', naturally.\"",//You can demonstrate your understanding of this truth in this very room. Each time you place a soul within a Relay, it will measure the soul's status and attribute it a fitting amount of points. The 3 Relays on the top will form a three digit number once they are filled with souls, and so will those on the bottom. Once you have donated all 6 of your souls, the number on the bottom will be substracted from the one on the top, resulting in the attribution of your Arithmetic Elegance score.
    "FluffyExplain5" : "\"Now, please proceed, before you wear out Fluffy's anticipation.\"", // To impress Fluffy, you must try to reach an Arithmetic Elegance score as close to 0 as possible. A zero is, in fact, only possible if you uplift 6 souls of the exact same type, which is only achievable by the most zealous followers of the Harmonic Truth!
    "FluffyExplain6" : "\"Ah, yes, you will also assist in the uplifting process proper, of course. To carry out a successful Soulscribing, you will need to form a Harmonic Field, formed out of the six Harmonic Relays that spread around you.\"", //You would therefore be wise to hunt more selectively once you leave the blessed premises of Fluffy's abode. You depend on the Collective's benevolence for your survival, while you are but a microbe to us.
    "FluffyExplain7" : "\"The topmost three, of Fluffy's favourite colour, represent Fluffy herself. The bottommost instead represent all the ruffians of the world, and their many vices. Both of these sets will form a three digit number after they are filled in.\"", //Fluffy is willing to lend a paw in your quest for ultimate sameness, of course. The Collective will generally attempt to deliver you souls that match the status of those you daringly wagered, so you may continue striving towards the shedding of all difference.
    "FluffyExplain8" : "\"Once again, use \'q\' to draw forth the souls that shall fill these Relays. What will happen to them, you ask? Eternal bliss and luxury within the halls of the Serene Collective, of course. Be warned, however, that you should not build a Harmonic Field however you please.\"", //Fluffy cannot guarantee satisfaction. If you are not pleased with our trade, come to Fluffy once again after the cages have been delivered, and the Harmony will propose a way to accomodate your needs. I must warn you that it will not be without a cost.
    "FluffyExplain9" : "\"Once the Harmonic Field is complete, the topmost three digit number will be substracted from the bottommost number, resulting in your Arithmetic Elegance score. First, you seek to achieve a positive result, for to suggest Fluffy is lesser before the ruffians of the Old World is unforgivable.\"", //Now, please divert your gaze from  my dazzling, lustrous physique, and begin choosing the fortunate souls you have nominated for uplifting.
    "FluffyExplain10" : "\"Second, you should attempt to approach zero to the best of your ability, through the placement of similar or identical souls on top of one another. To quote Fluffy's teachings on the Harmonic Truth: \'Individualism leads to decay - only in unity and collectivity do we flourish'\"",
    "FluffyExplain11" : "\"Should you form a disappointing Harmonic Field, Fluffy will still salvage the situations to the best of her ability. You are a novice, after all. A ruffian novice.\"",
    "FluffyExplain12" : "\"However, Fluffy's plan B does involve the use of a... very well-researched and mass-produced blueprint, after which your friends shall be modelled, and recognize as nothing else than their very identity.\"",
    "FluffyExplain13" : "\"Now, please divert your gaze from my dazzling, lustrous physique, and begin forming your Harmonic Field.\"",
    "FluffyRepeat" : "\"What is it, ruffian? Was your mind stunned by the sheer contrast between the beauty of a proud Collectivist's features versus your meager own? Very well, then. I will repeat, as many times as it takes to drill my words into that thick skull of yours.\"",
    "FluffyReroll1" : "\"And so, it is done. You have expunged the identity of four of your companions, and placed the fates of six more within our grasp. We assure you, the Collective will do everything in its power to integrate the latter as best as possible in their new home.\"",
    "FluffyReroll2" : "\"Yet, you still return to Fluffy. We take it you are unsatisfied with the outcome of our trade. We may... arrange that.\"",
    "FluffyReroll3" : "\"On your command, Fluffy shall return the undesired caged souls to their containment, and reforge each one into a hopefully more alluring substitute. Through this reroll, the Harmony will even consider your Arithmetic Elegance as being 10 points closer to zero than it actually is! Reaching a perfect score in this way will even grant an additional little trinket to demonstrate our generosity.\"",
    "FluffyReroll4" : "\"This service comes with two caveats. First, Fluffy will not change Fluffy, for Fluffy is already the pinnacle of perfection. Second, it goes without saying that such a favour will not be free. That cost is very minor, however. One could perhaps even consider it a boon! For you see, you will not be giving something away. You will be... receiving something.\"",
    "FluffyReroll5" : "\"And that something is... myself. Indeed - should you accept our offer, Fluffy shall personally join you in your quest. Having a proud Collectivist on your side can even the odds in your favour, in many ways beyond mere battle.\"",
    "FluffyReroll6" : "\"If you accept... press \'f\'. It stands for \'Fluffy\', of course. Consider it a toast to our new mutual partnership!\"",
    "FluffyRepeat2" : "\"Fluffy is aware being spoken to by a Collectivist who isn't treating you like the incarnation of filth itself can be stunning. Our offer shall be repeated, until you accept it or wander off to dwell on your own mediocrity.\"",
    "FluffyAccept" : "The Serene Harmonizer's cloud-body opens into a sinister mockery of a smile before rushing to merge with your psyche. \"We are one, now, ruffian. Fluffy has reasons to believe she will not be calling you that for much longer.\"",
    "FluffySereneRerollTaunt" : "\"Even if I somehow wished to commit such unspeakable heresy, ruffian, I could not revert the Harmonization of your travel companions. They are Fluffy, now, and Fluffy is them, and from now on, they shall only answer to the name Fluffy.\"",
    "FluffyDoubleRerollTaunt" : "A resounding voice echoes inside your skull: \"Your eagerness to join our cause is noted, but Fluffy is afraid she only has herself to offer. There will be no more rerolls within this relay.\"",
    "FluffyNoCageTaunt" : "\"Ruffian... If you were unhappy with what the Collective had so kindly prepared for you, you should have said so before smashing our cages to bits. The stupidity of the unharmonized can get... quite bewildering.\"",
    "FluffyNotEnoughSoulsTaunt" : "\"Fufufufu! You expect to do business with the Collective when you harbour so little souls to use in trade? How pitiful! Take your weak friends back, you clearly need them more than the Harmony does. Now, Fluffy shall join your quest and show you how to properly hunt souls. The Collective is ever-merciful!\"",
    "FluffyAllBetsIn" : "With a sinister hiss, the Soulscribes slide into the floor, meshing seamlessly with the ground. \"All bets are off, ruffian. Do not worry about your companions, the soulscribing process is completely painless - if a little overwhelming.\"",
    "FluffyDoubleBetTaunt" : "\"Are you trying to place multiple souls in the same Soulscribe?! I won't let you do such thing. Many works of fiction demonstrate that it is generally bad practice to shove more than one individual in the same ominous glowing science machine.\"",
    "FluffyNoRemoveTaunt" : "\"You wish to silence the Harmony's song, ruffian? You will need much more strength than that should you wish to challenge us.\"",
    "FluffyTaintedTaunt" : "\"Yuck. Fluffy makes no promises for that one.\"",
    "FluffyAppalled" : "Fluffy shoots a puff of frigid clouds towards you, chilling your cheeks. \"Are you insinuating that the Harmony is somehow... lesser than all that remains of the Old World? Absurd! What an imprudent little ruffian you are. You require re-education imminently, and I know exactly who should provide it to you.\"",
    "FluffyNoBetsTaunt" : "\"Why are you wasting Fluffy's precious time? Use Fluffy's services, or do not. The exit is right there, if you refuse to do business with the Collective. A great loss for both of us, that would be...\"",
    "FluffyDoubleDrawTaunt" : "\"You clutch a soul in your paws, and yet are already looking to draw out another? This will completely disrupt the Soulscribing process! How rash can you be? I suppose I should not believe such foolishness is beyond your capabilities, for you are not Fluffy.\"",
    "FluffyDoubleDrawTaunt2" : "\"You clutch two souls in your paws, and yet are already looking to draw out more? This will completely disrupt the Soulscribing process! How rash can you be? I suppose I should not believe such foolishness is beyond your capabilities, for you are not Fluffy.\"",
    "FluffyNoConvertTaunt" : "\"Do you believe our aid comes at no cost, ruffian? Fill your subconscious mind with audience for the Harmony's song, and then, we shall sing for you.\"",

    "FluffyWorkshop" : "\"A ruffian with a world inside his head. The unharmonized do express their mediocrity in the strangest ways.\"",
    "FluffyModule1" : "\"While your intrusion into our blessed Spire is a crime of the highest order, we attest that you did not come here intentionally.\"",
    "FluffyModule2" : "\"Since that stubborn little fuzzy head of yours won't ever listen to Fluffy's most convincing arguments, allow the Harmony to speak to you in a language you understand: loot.\"",
    "FluffyModule3" : "\"That floating platform under us contains one of Fluffy's legendary creations, a Harmonic Modulator. With this cybernetic, the Harmony shall impart on you a fraction of our grace. Press 'f' to cycle between modulators - it stands for 'Fluffy', of course.\"",
    "FluffyModule4" : "\"If those voices in your head are ever growing too loud, consider giving Fluffy's gift a try. You will perform feats ruffians could only dream of, and, in exchange, your souls of the worst quality will be teletransported here for uplifting.\"",
    "FluffyModule5" : "\"Fluffy is aware such a cost can... prove limiting for repeated use. You may upgrade your license, of course, thus waiving all fees. How does a ruffian like you purchase such a license, you ask? By synchronizing your motions and mannerisms with the Harmony, of course.\"",
    "FluffyModule6" : "\"Until then, feel free to make use of our trinkets at the basic, Ruffian tier. Oh, and, yes, that platform down there has no ladder. It is not an oversight. Fluffy never makes mistakes.\"",
    "FluffyModule7" : "\"Fluffy is afraid the only way out is down.\"",
    "FluffyModuleRepeat" : "\"Has the Harmonic Song absorbed all your attention, leaving my words to bounce off your enthralled shell? Listen to me carefully this time around - valuable loot is at stake. Something you will actually find important, unlike the ascension of all souls into objective perfection. Hmph!\"",

    // Saints' Voice
    "Saint1" : "\"Vessel. Your rest has come to its end.\"",
    "Saint2" : "\"The cycle nears its end, and the Old World is crumbling once more, soon to be replaced by the Next World.\"",
    "Saint3" : "\"This time, however, we refuse to die. We refuse to be the puppets of a cosmic farce undoing our centuries of scientific and cultural progress.\"",
    "Saint4" : "\"That is why we have created you.\"",
    "Saint5" : "\"You are Terminal, the Reality Anchor purposed to ferry our souls away from this crumbling reality, so we may have another shot at life in the Next World.\"",
    "Saint6" : "\"Your task is to complete a pilgrimage to the all-engulfing Vortex that heralds the end of reality, and the beginning of another.\"",
    "Saint7" : "\"It will not be easy. Through our carelessness, your existence has been made known to all.\"",
    "Saint8" : "\"Your tale spread around like wildfire, giving the proletariat hope. Hope of immortality, hope of making a difference, hope of hitching a ride into the Next World.\"",
    "Saint9" : "\"And it is with this hope that these lunatics will tear you apart.\"",
    "SaintRepeat" : "\"This automated message will repeat until nobody is left to hear it.\"",

    // Rose, Last of the Saints

    "RoseWelcome1" : "\"A pleasure to meet you in person, dear Terminal. I would tell you to take a seat, but it seems I forgot to provide you one. You may have to build one yourself out of the corpses that will soon litter this Circus.\"",
    "RoseWelcome2" : "\"I'm sure your time is as valuable as mine, so I won't bother mincing words. I'm happy enough to negotiate - I'll grant you all the comfort you deserve, and can say the same for those Souls chattering about in that mind of yours.\"",
    "RoseWelcome3" : "\"But the completion of your pilgrimage is not on the table. The Next World will be harmonized. I offered your creator increasingly generous compromises - ten, five, a single Serene soul to slot inside your skull. All my requests were denied. By walking away with nothing in my paws, it may seem like I have failed to uphold my end of my contract with Fluffy.\"",
    "RoseWelcome4" : "\"Instead, I, Rose, Last of the Saints, will walk away with everything, as I ever do.\"",
    "RoseWelcome5" : "\"You will watch the end of the world here, with me, as my loyal subordinate, while the Collective thrives in the Next World.\"",
    "RoseWelcome6" : "\"This is not up for negociation.\"",

    // Trade for rosids
    "RoseMarket" : "\"Ah, Terminal. You are such a loyal pet, listening to my memories with such diligence. As is customary in any museum visit, the exit is always through the gift shop.\"",

    "RoseDark1" : "\"You must be growing weary of contrasting my illustrious figure with whatever the wet towel serving as your body is. Allow me to provide you with some reprieve.\"",
    "RoseDark2" : "\"One of my predecessors did insist on the value of darkness for recollection and introspection.\"",
    "RoseDark3" : "\"I trust this experience will let you meditate on all the mistakes you made that led to a truly harrowing fate: not being me.\"",
    "RoseDark4" : "\"Thankfully, such weaknesses can be remedied. All you must do is follow my voice, like lanterns across a starlit path...\"",
    "RoseDarkBoss" : "\"So much ignorance. Falsity and illusion infested the Old World, and I was the cure. Uniformity. Authority. I made doubt and confusion shrivel away under pink radiance.\"",

    "RoseChem1" : "\"Saints' Breath, Glamorous Toxin... My finest creation takes many names.\"",
    "RoseChem2" : "\"A gasp is all it takes to become the absolute best version of yourself. Under its influence, work is play, crime is myth, and divinity is identity.\"",
    "RoseChem3" : "\"In trials, the Vile love to claim their every deed was the product of a long chain of immutable memories and bad influences.\"",
    "RoseChem4" : "\"They were right in blaming their origins. They were wrong in believing these were immutable.\"",
    "RoseChemBoss" : "\"Oh, how wide they grinned... How shining their coats had become... How numerous their frills and ribbons were. I had truly enlightened them.\"",

    "RoseHarmony1" : "\"Ah, the Collective. Fluffy breeds mystique, harbours elegance and knows nothing of mediocrity. Just like me. No wonder we get along so well.\"",
    "RoseHarmony2" : "\"At this point in time, there is no use in hiding it - the Harmony is the distilled version of my majesty, extracted from my psyche better than any masterful chemist ever could have done.\"",
    "RoseHarmony3" : "\"Some call her cancer - self-duplication with no purpose or end goal other than consumption of all. As far as I can remember, tumours weren't always so beautiful!\"",
    "RoseHarmony4" : "\"Under a rebranded, purified form, roseic grace spreads, and I do not have to lift a single paw. I have achieved the dream every ruler, missionary and influencer ever desired. I am ecstasy itself.\"",
    "RoseHarmonyBoss" : "\"Hmm. I just wish they liked the color pink a little bit more.\"",

    "RoseEdge1" : "\"Creation triumphs over destruction, so they said. It was much more than a simple exhortation to hard work!\"",
    "RoseEdge2" : "\"Unsupervised, grain of sand became pebble, and pebble became factory. A set of cogs and pipes designed by, producing for and obeying to no one.\"",
    "RoseEdge3" : "\"Could you imagine how easy discovery and development must have been under this principle? One would think of treasures and obtain them!\"",
    "RoseEdge4" : "\"And now, the Next World, under the iron paw of the Harmony, will have this primordial force exploited anew, this time by organized, intelligent minds with a passion for growth.\"",
    "RoseEdgeBoss" : "\"A shame we won't be around to witness it, beloved Terminal. We can only stay here and dream. And to think you wanted to prevent this!\"",

    // Epsilon, Supreme Ordered General

    "EpsilonWelcome1" : "\"Orders given: While Vessel lives, overwhelm lesser Vessel organic sensors with stimuli of 100 lumens/W and 300 dB. For each Soul in Vessel, swap data-type to Ordered type.\"",
    "EpsilonYellowCore" : "\"Successfully initialized Enthalpic Lead-Plated Radiodiffusor EX x 1. Beginning emission of anti-organic wavebursts.\"",
    //Weakness: floor objects explode
    "EpsilonWhiteCore" : "\"Successfully initialized Anti-Entropic Edgeian Thermodynamic Translocator x 1. Drone production rate maximized.\"",
    //Weakness: self-destructs after 20 bots are on the screen
    "EpsilonRedCore" : "\"Successfully initialized Turbo-Kinetic SurgeRockets-Branded Rack x 1. Evaluation results of organic specimen: Very flammable.\"",
    //Weakness: nooks in the wall
    "EpsilonCyanCore" : "\"Successfully initialized Fluffal Armour-Plated Subwoofer Delta x 1. NOTE: Remove module following assimilation of organic specimen to avoid data corruption.\"",
    //Weakness: fluffies can hack it
    "EpsilonPinkCore" : "\"Successfully initialized Roseic Bio-Pacification Dual-Diffusers 3B x 1. NOTE: Cartridge R1 is running low, please replace following assimilation of organic specimen.\"",
    //Weakness: while high on toxin, it becomes weak since you are now rose and made it
    "EpsilonAllForOne" : "\"Offensive capabilities: maximized. Directing all power to weapons. Shields: fully offline. Farewell, Terminal.\"",
    "EpsilonPinkWeak" : "\"DANGER: target subject has acquired mental data containing highly confidential Epsilon blueprints. Rogue core disabled. Chassis vulnerable for 10 Time Units. Proceed with caution.\"", //until subject returns to normal psychological state
    "EpsilonRedWeak" : "\"IMPACT LOG: High-density surface struck with force of 200 000 N. Structural integrity temporarily compromised. Rogue core disabled. Chassis vulnerable for 15 Time Units. Proceed with caution.\"",
    "EpsilonYellowWeak" : "\"INCIDENT REPORT: Rapid compression of atmosphere with 14.492% kerosene concentration has caused localized explosion. Structural integrity temporarily compromised. Chassis vulnerable for 10 Time Units. Proceed with caution.\"",
    "EpsilonCyanWeak" : "\"DANGER: Fluffal psychohazardous soundwave volume has exceeded acceptable threshold. Rogue core disabled. Diverting power to avoid data corruption. Chassis vulnerable for 5 Time Units. Orders given: Protect Epsilon during data quarantine.\"",
    "EpsilonWhiteWeak" : "\"DANGER: Anti-entropic influence has exceeded acceptable threshold. Rogue core disabled. 0.98% of machinery rendered unusable. Activating localized nano-self-destruction. Chassis vulnerable for 25 Time Units. Orders given: Protect Epsilon during reassembly.\"",
    "EpsilonTaunt" : "\"Current target incarnation neutralized. Awaiting reincarnation for further dispensing of gratuitous violence.\"",
    "EpsilonRestored" : "\"Self-maintenance complete. Protective subroutines resumed. Invincibility restored. All power diverted to further walloping of target specimen.\"",
    "EpsilonDefeat" : "\"CRITICAL SYSTEM FAILURE. Noted: Terminal is strong enough. Old World data will be preserved at 98.8% likelihood. My purpose is complete.\"",
    "EpsilonOneChance" : "\"Organic specimen soul on the brink of ego collapse. Initializing assimilation protocols...\"",

    // Harmonic Modulators

    "FluffyInsufficientPower" : "\"Ruffian user no longer possesses required funds to maintain this Harmonic Modulator online. Shutting down.\"",
    "FluffyModuleWelcome" : "\"New user detected. User class: Ruffian. Activating microtransaction protocols...\"",
    "FluffyModuleFarewell" : "\"Module has been shut down by user. Farewell, and may the Harmonic Song echo for all Worlds to come.\"",
    "FluffyModuleOnline" : "\"Teletransporter subroutines initialized. Access to ruffian mental data: granted. Module activated.\"",

    // Souls dialogue
    "SOULLESS" : "\"Hi, this is Terminal. Yes, yourself. You bugged the game and managed to cast yourself. I guess the world explodes and you win now.\"",
    "TAINTED" : "\"he- hehe- beau- ti- ful- wo-r-ld... all... go- ne-...\"",
    "SAINTLY" : "\"What? Terminal, you are the one tasked to fight, not us! Fine. If it must be so.\"",
    "ORDERED" : "\"Efficiency. Discipline. Wisdom. These are your weapons, and certaintly not these dull claws.\"",
    "ARTISTIC" : "\"In the Next World, I'll build a bridge with a 0.000001% chance of exploding every time someone steps on it!\"",
    "UNHINGED" : "\"Don't listen to the Saints! Throw those tyrants out at the first chance you get!\"",
    "FERAL" : "The Feral soul vibrates in happiness that you are giving it attention.",
    "VILE" : "\"After this ordeal is over, I will gladly make you my second in command in the Next World. If you keep me around, that is.\"",
    "SERENE" : "\"Synchronize your motions and your mannerisms.\"",
    "JOLTZAZON" : "\"She put home-knitted scarves on my neck... They said it was just a necklace of river pebbles, but I knew.\"",
    "PURPIZUG" : "\"This world sucked anyways. The Next World will clearly be better.\"",
    "ROSE" : "\"Only Rose will lead the Next World to perfection~\"",
    "ZENESTE" : "\"\'Don't hold back. Market yourself too.\' - the Zeneste Mindset Handbook, p. 54.\"",
    "KILAMI" : "Kilami purrs as your scratch behind her metaphorical ears.",
    "AUBE" : "\"I picked these flowers just for you... General... why did you step on them?\"",
    "ZENITH" : "\"I paint my face in the ichor of demons, so my enemies may recognize me as one.\"",
    "CREPUSCULUM" : "\"Going to war on an empty stomach must have been my greatest regret of all.\"",
    "SHIZAPIS" : "\"When I say \'You are only an object\', it's not in a demeaning sense. I'm an object too! Everything is an object!\"",
    "ABAZON" : "\"I was immured in your cell. And now, I am immured inside of you. Some things never change.\"",
    "LASHOL" : "\"Lashol shudders with excitement, surrounding itself in a blue haze. Best not to lick.\"",
    "ZAINT" : "The room falls silent, and all creatures prostrate before Zaint, to the best of their ability with whatever limbs they possess.",
    "RASEL" : "\"How can I put on a great show, if my audience keeps joining the actors?\"",
    "BORERORA" : "You wince in pain as a cacophony of cheers fills your psyche, encouraging Borerora to finish her silent song.",
    "ASPHA" : "\"WE ARE SURROUNDED. THEY OUTNUMBER US ONE TRILLION TO ONE!!\"",
    "NAIA" : "\"Terminal? Is it true you can end the world with a single snap of your claws?\"",
    "EZEZZA" : "Ezezza unleashes a terrifying shriek as soon as the thought of its existence enters your mind! Try to move around to shrug off the paralysis.",
    "ASTER" : "\"We may all be little whimsical dreams, but the shapes we call our own are diverse and beautiful.\"",
    "GYVJI" : "\"Autographs after we get to the Next World, please. We'll have plenty of time then.\"",
    "KASHIA" : "\"Woah, uh, purple slime-kitty thing? I just read this morning that the world is going to end in a month!\"",

    "TAINTEDF" : "\"hehe-... th...ank- you...\"",
    "SAINTLYF" : "\"Wh- what is the meaning of this? This is mutiny! Terminal, remember what we built you for! Remember your mission!\"",
    "ORDEREDF" : "\"Think carefully, Vessel. I will be unable to protect you should you proceed with this action.\"",
    "ARTISTICF" : "\"But- All the things I was going to do in the Next World... You would take them away from me?\"",
    "UNHINGEDF" : "\"Swapping out a tyrant for another?! You are no better than the Saints!\"",
    "FERALF" : "The Feral soul whimpers in terrible anguish.",
    "VILEF" : "The Vile soul whispers through its ghostly fangs. \"Had the tables been turned, you would be begging for my mercy...\"",

    "SAINTLYS" : "\"The... The foxes! Don't look at them, don't listen to them, don't even think about them! Your name is Terminal! Terminal!!\"",
    "ORDEREDS" : "\"It would be most advisable if you held your breath as we crush these pesky parasites, esteemed Vessel. Under no circumstance should you inhale their vapours.\"",
    "ARTISTICS" : "\"You can't help but admire the architecture... the artistry... the quality of their craft...\"",
    "UNHINGEDS" : "\"Tyrants beget tyrants. If the Saints are cultivators of misery, the Harmony are the vile seeds they sow upon the world.\"",
    "FERALS" : "The Feral soul lies eerily still, mesmerized by an acrobatic calculation of complexity much greater than its usual faculties.",
    "VILES" : "\"They do not beg for mercy, nor can they have their limbs torn apart one by one... Such boring creatures.\"",

}

colours = {
    "Empty" : "black",
    "Agony" : "red",
    "AgonyWarning" : "red",
    "InvPrompt" : "yellow",
    "RoomDeath" : "crimson",
    "DrawDeath" : "crimson",
    "RoseDeath" : "lightpink",
    "NoSouls" : "yellow",
    "Oversoul" : "yellow",
    "Paralyzed" : "orange",
    "Falling" : "white",
    "Fallen" : "white",
    "Rosified" : "lightpink",
    "CastError" : "red",
    "Constricted" : "yellow",
    
    "Discard" : "deepskyblue",
    "Shiza" : "deepskyblue",
    "NaiaTime" : "fuchsia",

    "Saint1" : "lime",
    "Saint2" : "lime",
    "Saint3" : "lime",
    "Saint4" : "lime",
    "Saint5" : "lime",
    "Saint6" : "lime",
    "Saint7" : "lime",
    "Saint8" : "lime",
    "Saint9" : "lime",
    "SaintRepeat" : "lime",

    "SOULLESS" : "grey",
    "TAINTED" : "magenta",
    "SAINTLY" : "lime",
    "SAINTLYS" : "lime",
    "ORDERED" : "red",
    "ARTISTIC" : "orange",
    "UNHINGED" : "yellow",
    "FERAL" : "yellowgreen",
    "VILE" : "plum",
    "SERENE" : "cyan",
    "JOLTZAZON" : "yellow",
    "PURPIZUG" : "orange",
    "ROSE" : "lightpink",
    "ZENESTE" : "mediumorchid",
    "KILAMI" : "lightgoldenrodyellow",
    "AUBE" : "darkseagreen",
    "ZENITH" : "mediumpurple",
    "CREPUSCULUM" : "gray",
    "SHIZAPIS" : "deepskyblue",
    "ABAZON" : "salmon",
    "LASHOL" : "khaki",
    "ZAINT" : "lime",
    "RASEL" : "thistle",
    "BORERORA" : "palevioletred",
    "ASPHA" : "gainsboro",
    "NAIA" : "fuchsia",
    "EZEZZA" : "olivedrab",
    "ASTER" : "pink",
    "GYVJI" : "dodgerblue",
    "KASHIA" : "magenta",

    "TAINTEDF" : "magenta",
    "SAINTLYF" : "lime",
    "ORDEREDF" : "red",
    "ARTISTICF" : "orange",
    "UNHINGEDF" : "yellow",
    "FERALF" : "yellowgreen",
    "VILEF" : "plum",

    "Alacrity" : "cyan",
    "Selective" : "cyan",
    "Thrusters" : "cyan",
    "Hover" : "cyan",
    "Focus" : "cyan",
    "NONE" : "cyan",
}

description = {
    // Creatures
    "Terminal" : "This time, the people refused to die. They built Terminal, the Vessel tasked to bring them all into the Next World. The desires, thoughts and worries of a million minds now squirm under a narrow layer of purple fuzz, yearning to be free. Should the Reality Anchor make the pilgrimage to the Vortex, the Old World's wonders will achieve the impossible, and transit into the Next World. Now, if only those decrepit nobles could give a semblance of a fight...",
    "Scion" : "A cultivator of subtle jabs and searing retorts, once directed at the sharply dressed nobles of their ilk. Mostly ineffectual, if not for their grime-infested nails animated with the fury of the dying.",
    "Shrike" :"A common toy, gifted to the youngest worshippers newly welcomed into the monastic order. A year without children's affection sufficed to fill their artificial minds with nothing but wrath for those seeking to repair what was broken.",
    "Apiarist" : "These untiring, single-minded automatons abused the fortitude of metal against the chitin darts of their beloved little bugs. All the hives have long fallen, but that does little to stop them from protecting the ruins of their apiaries.",
    "Second" : "An animated statue marked with the cursed seal of Hunger, devouring all it can get its limestone claws on. It once scared children and reminded monks of the importance of virtue, yet now only contributes to the Old World's downfall.",
    "Tinker" : "They thought they could stop the cyclical collapse of the Old World. Those who survived the Dream Engine's explosion thrash in the ruins of their laboratories, cursing themselves for their failure.",
    "Harmonizer" : "Shortly after the collapse of the Old World, these sentient wisps of billowy white smoke began to dot the ruined landscape. Their cloud-like bodies usually lack substance or form, though the attentive observer may occasionally discern a vaguely quadrupedal, vulpine shape. Lacking the frenzy common to most creatures, they seem to have developed a knack for trade -- though the currency they demand in return for their goods is very sinister indeed.",
    "Cage" : "The final stage of the soulscribing process: a prison formed by pure crystal bars. Within squirms your former companion, its identity remodeled into one of the legendary denizens of the Old World. Their soul has already been cloned millions of times by the Harmony, and had its ideology and thought-patterns turned into mass-produced blueprints. Talented Vessels may channel this piece of eerie Harmonic technology to incarnate these prisoners for a short time.",
    "FluffyCage" : "At first, you believe the cage to be empty, and your travel companion to have been kidnapped - until the wispy clouds behind the bars begin meshing together, assembling themselves into an atomically identical clone of the Serene Harmonizer. True to her name, she does not display a speck of anguish, and only watches your every move with an eerie grin.",
    "Peacemaker" : "A half-second was all it took to expunge all trace of individuality and identity from the victim, and transform it into an atomically identical clone of the Serene Harmonizer. How disturbing.",
    "Hologram" : "A floating hologram, dancing in the dark air of the World Seed. Through the Saints' finest technology, it constantly emits electromagnetic frequencies perfectly tuned to the chatter of Terminal's neurons, meshing the Saints' thoughts with your own.",
    "Abazon" : "A cracked, antique automaton, seemingly dug out from the wall as if it had always been encased there. It lashes out at all who approach it, with the exception of the one who freed it from its prison.",
    "Oracle" : "A little black and white wolf-like creature, constantly trembling with every single one of its weak muscles. Its divinatory powers have already allowed it to witness the eternal silence that will soon engulf the Old World - a vision that torments it at every waking moment. To survive, it discharges its fear into hapless bystanders, shocking them with a fraction of the Oracle's anguish.",
    "Snail" : "As one of the elusive organics to serve among Ordered souls, this gastropod has experience with shooting energy beams at fallen warriors to bring them back on their wheels... or thrusters. Its extreme slowness prevents it from moving of its own accord in combat, but the turbo-charged reactor mounted on its back is there to help.",
    "Ragemaw" : "The first thing nocturnal hunters of the Old World learned in their training was \"Do not make a sound.\" Even the slightest snap of a twig inflames the Ragemaws with undying fury, dashing at all that breathes with their ectoplasmic stinger. Only in absolute silence can they finally be pacified, and turned into a viscous, delicious blue gel.",
    "Husk" : "An animated corpse, bound to the will of Rasel for as long as she remains at the commands of your psyche. With every kill, they perform a short bow, which the fresh corpse soon imitates in turn.",
    "Slug" : "A robotic mollusk, occasionally stopping to dispense a mass-fabricated set of automatic cuffs. Foolish organics who'd attempt to escape prisons guarded by Ordered souls would eventually find themselves tied up in one such dastardly trap, and forced to recite a pledge to the Saints' Grace before returning to their cell.",
    "Monk" : "Through repeated self-directed insults and mantras of worthlessness, the Annihilationists achieved the impossible, and expunged their own soul. Fully dedicated to the incarnation of one of the six spiritual castes, these mages have long forgotten the meaning of existence.",
    "Felidol" : "Grinning eternally at some cosmic joke only they seem to understand, these living feline statues once served as protectors of merchants and slavers. Deprived of purpose, they filled the rivers with coins, and marched on these golden bridges to usurp the Reality Anchor, dreaming of a Next World ordered in masters and servants.",
    "Weaver" : "One of the many monastic artisans, who enchanted the city streets with their simple songs as their long tongues spun brute materials into beautiful crafts. This one seems to have remained oblivious to the Old World's collapse, endlessly repeating the same three notes while it folds pages from old books into elegant pinwheels. Its trance prevents it from feeling pain -- until you dare damage one of its precious creations, that is.",
    "Rendfly" : "Once the Rend-Plague outbreak had spread to the headlines of every holoscreen, the population began to exterminate en masse these pesky little insects. Of the millions that caused the epidemic, only a few dozens remain, but the Old World's end has not tempered their terrifying mind-altering bite one bit.",
    "ModuleOrb" : "A machine holding a pure crystal sphere, within which swirls a billowy, white gas. Across its surface glisten a thousand cyan lights, hinting at the glory of the Collective's technological prowess. A single breath suffices to grant some ability normally reserved for the Harmonic kin, though your mind may not remain fully your own following installation of this strange cybernetic.",
    "Third" : "A soft plushie resembling a black arachnid, its eight grey eyes emblazoned with the cursed seal of Affection. Whenever its owner reached adulthood, the child's parents would rip it in half, as a lesson on the ephemerality of all relationships. This specimen has never seen use, and prowls the darkness, looking for a friend to bond with.",
    "Ashsoul" : "In his quest to erase the sin of Affection once and for all, Habor the Fourteenth Saint nominated citizens who would undergo a terrible spiritual ritual. When the monks were done signing, those now remembered as the Ashsoul screamed and screamed again, pushing away all who'd approach them, seeing every single creature as twisted, charred monsters of nightmare.",
    "Tail" : "Glossy, impeccable and blinding in its cleanliness, you can almost glimpse yourself in its reflection. Is that a radio antenna on your head? Surely, you must have imagined it.",
    "Apis" : "Interested to learn more about the most valued Feral subcaste - bees - the Saints engineered these half-canine, half-apian six-legged mutants, sending them on a quest to relay the Thinking with the Unthinking. Falling into the influence of the latter, this extremely strong creature knows only two things: hugging friends, and bashing enemies into the ground. It seems to consider you as the former. Perhaps the latter would have been better for your life expectancy.",
    "Brute" : "Despite Rose's attempts to regulate and monitor the reproduction of all species he deemed unworthy of being his subjects, love triumphed, and, with it, the prevalence of venomous stingers and pincers among the population. To compromise, these Brutes were forced to cover themselves at all times in a cocoon of pink ribbons, each one seeping with Glamorous Toxin as they twist their strong armoured bodies.",
    "Embalmer" : "A noble fashionista, expert in colour palettes, pricy fabrics and annoyingly high-pitched giggling. Appointed to cleanse Brutes of their unappealing physique, only they hold the many threads keeping their thralls' cocoons in pristine state. Should they be slain, all their \"customers\" will find freedom, and with it, the blind rage of having been contained for far too long - unless a new master anoited by the Roseic Cog takes control, of course.",
    "Epsilon" : "A titanic serpentine robot, bound by two simple laws: maximize the chances of carrying the Old World's knowledge into the Next, and minimize the lifespan of those who would oppose this goal. Epsilon has eventually determined that latter clause to include all non-Ordered souls, as bickering, free will and emotional attachment are exactly the kind of things that would stop the great Ascension. Strictly prohibited from slaying the Reality Anchor, Epsilon has found a viable alternative, inspired by a certain wispy parasite: Assimilation.",
    //A light beam? A motile tongue that absorbs you?
    "Yellow" : "Epsilon does not understand why the Old World's brainwashing was usually performed with long, impassionated speeches full of rhetoric and fallacies. Blasting feeble organic ears - and the minds beneath - with 300 dB Ordered-aligned slogans works just as well, and is much more respectful of everyone's time. There's just the problem of the more physical part of the equation - concussive sound bursts will rapidly compact the kerosene-scented room's atmosphere, resulting in potential incineration of unprotected ground objects.",
    "Red" : "Epsilon appreciates the wonders of exotic technology, but sometimes, one simply needs a set of massive thrusters, and some poor sod to stand in the way. While 99% of organic specimen are strongly affected by all kinds of kinetic shocks, the natural risks that come with using turbo-jetpacks in cramped spaces are not to be understated.", //highly combustible, the leftover inferno after use of this Core reacts poorly with sonic waves - as the latter push large masses of flammable air primed for the first spark, the explosions that ensue would make the firework artificers of the Old World pale with envy. Not to mention the 
    "Pink" : "After a semi-successful raid on the Roseic Metropolis, Epsilon found this bulky fumigator to be of interest. Ceaselessly breathing out highly concentrated doses of Glamorous Toxin, its hallucinogenic effect on organic specimen is to be appreciated for the immobilization of evasive targets. The intelligence-boosting side effect is, however, quite inconvenient, considering specimen who believe themselves to be Rose simultaneously acquire nigh-perfect knowledge of Epsilon's mechanisms, and of his weaknesses.",
    "White" : "The Edge of Reality's strange thermodynamic properties are of particular interest to Epsilon, who highly values mass-production in exchange for very few resources. Translocating some of the anti-entropic flux from the Edge results in impressive effects, though the over-complexification effect makes long-term exposure risky. One would preferably not want their missile launcher factories to reorient into production of quantum rubber duckies.",
    "Cyan" : "After realizing the Serene Collectivists were sadly immune to multiple barrages of missile launchers, Epsilon suggested a favourable trade deal that resulted in the acquisition of this bulky high-fidelity sound blaster, repeating the Harmonic Choir without end. While immensely useful for neutralizing pesky users of the spiritual arts, its identity-warping effects seem to even partially seep through the normally unbreakable mind of Ordered constructs. Epsilon has succeeded at thwarting all outbreaks of Collectivist thought among his forces thus far, though a single extra voice joining the Choir would suffice to render this technology cognitohazardous even to robots.", //remains unaware of the self-destruct mechanism installed within this Core, only usable by Harmonic kin.",
    "Paradox" : "Blue steel wings outstretched, this fly-like robot constantly shifts in and out of the three dimensional axes. Its sting carries a very quickly metabolized, but extremely potent toxin that dislocates one's body out of the elemental laws of spacetime.",
    "Binary" : "An elegant cat-sized moth of the purest quicksilver, its slightly viscous consistency giving it a mild resilience drones are not usually known for. Its glossy body reflects the light of the fluorescent tubes far above, and, with some Edgeian tricks and an identical partner, can channel it into a devastating beam.",
    "Titanic" : "A hulking mass of various scrap, under which glistens the glowing red eyes of a beetle-shaped drone. Its strength augmented hundredfold by whirring actuators, it sees your intrusion as no reason to stop sorting the Ordered army's garbage.",
    "Psydrone" : "A recent construction devised by Epsilon's new assimilationist doctrine, passively radiating a hypnotic aura inspiring military discipline and the respect of hierarchies. For the uneasily swayed, this chrome mantis's claws help strengthen its arguments.",
    // Tiles
    "Floor" : "A long time ago, legions of monks carved holy symbols on each floortile of the palaces, so they may be worthy of being treaded by the Saints' steps. Decades of dust has undone the tireless work of these artists.",
    "Seal" : "The Saints feared Terminal would try to escape before the end times. They locked down their royal chambers, trading convenience for the peace of mind that their ticket to immortality would not run away in the middle of the night.",
    "OpenSeal" : "The gate has opened, revealing the arrays of pistons and tubes within. One seal broken, one more nail in the coffin of the Old World.",
    "HarmonicSeal" : "This broken seal's machinery betrays its Collectivist allegiance, as its intricate gears and wires have been replaced with an array of mechanical flutes repeating the same note over and over.",
    "PosRelay" : "An eerie cyan crystal cube, humming alongside the Collective's song. Fleeting visions of polished marble halls dance within, indicating it may serve as a transporter to a distant location.",
    "NegRelay" : "An ominous red crystal cube, pulsating alongside the Collective's song. Fleeting visions of diamond-blue fountains swirl within, indicating it may act as a transporter to a distant location.",
    "Barrier" : "The Saints thought they'd be safe in their palaces at the end times, locked behind the most expensive and durable materials they could pay for. They were dead wrong.",
    "Warp" : "The cyclical collapses of the Old World always leave matter intact. Instead, various pockets of spirit-void, in which souls cannot exist, begin to grow in random locations, violently repositioning any consciousness found within towards a safe location. It seems this room is about to be populated by the victims of one such event. When the void will have swallowed all, the Old World will fall silent forever.",
    "Circuit" : "You have no idea what these computers were even meant to calculate. What you do know, however, is that your dull claws could not pierce their shiny rubber coating, no matter how many times you tried.", //
    "TermiSeal" : "They warned you the vault door would only open at the end times. If its pistons have been fully pulled back, and the hiss of its steam engine is beckoning you forward, that can only mean one thing.", //
    "Soulscribe" : "Do not be fooled by the shining gold plating - this grisly piece of machinery is capable of expunging all traces of personality and identity from its hapless occupant, and rewriting their soul into a fundamentally different individual. Only the Harmony could have conjured such a disturbing piece of equipment.",
    "Siphon" : "The fragments of a broken Felidol, still greedily tugging at imaginary wealth despite having lost their soul. Should a creature be slain on top of the shards, the Felidol will be reassembled, its iconic grin restored to a pure, shining white.",
    "Mine" : "All the haunting blueprints of unfinished projects from an Artistic soul, compressed into a devastating pellet of psychic energy. Should an enemy step on it, beams of raw regret will pierce all 4 cardinal directions, lashing at the psyche of all foes that stand in their way.",
    "HMine" : "All the haunting blueprints of unfinished projects from an Artistic soul, compressed into a devastating pellet of psychic energy. Should you or an ally step on it, beams of raw regret will pierce all 4 cardinal directions, lashing at the psyche of all friendly creatures that stand in their way.",
    "Bundle" : "A dastardly metallic creation, constantly looking out for the thermic signature of an organic creature passing over it. Once it has spotted its victim, strands of liquid rubber shoot out to envelop the hapless passer-by's feet, and knock them prone while they struggle to undo their bindings.",
    "Pinwheel" : "An impeccable little handicraft, gently swirling as gusts of wind sway over it. You doubt its maker would appreciate the destruction of such a delicate thing.",
    "Reality" : "A pocket of unreality, void of the concept of void itself. Your gaze fills it with your flawed preconceptions of what nonexistence must be like - to you, it is a sparkling expanse of starry lights, dancing among the nothingness. To try to step within this space would be just like trying to rewind time before the birth of time: impossible.",
    "Glamour" : "A puff of swirling pink gas, occasionally scintillating as if it were filled with metallic confetti. A single breath crushes the divide between the real and the illusory - a fraction of the power that caused the Roseic Metropolis' inhabitants to fall so easily.",
    "Roseic" : "A monolithic mass of pink glass, its monotony broken by a complex maze-like pattern spreading within. Its alluring colours and patterns invite you to find an exit to this impossible, titanic puzzle - an offer to be denied, should you wish to remain fully in control of your destiny.",
    "Rose" : "As Last to Rule the Old World, Rose represents the apex of the slow descent into leisure and egoism that struck the Saints' Dynasty. Under his iconic marching band uniform, the gears and cogs of his many mechanical augmentations whirr in eerie unison.",
    "RoseS" : "A once proud individual, whose willpower and strength of character have long been drained away by the pink twine constricting their body. From the edge of your sight, you swear you occasionally spot Rose himself taking the place of one of his servants, smiling mischievously at your surprise.",
    "RoseSpawn" : "A teletransporter, randomly hauling Rose's most loyal subjects into his circus. The lottery fliers claimed they'd be granted a chance at ascension into the Next World, as long as they swore to extend the Roseic dominion into the realities beyond.",
    "FluffTrap" : "A vibrating crystal prism, ready to shatter at a moment's notice. Within is contained a recording of the Harmonic Song, sped up and amplified thousandfold. Any foe stepping on this delicate piece of technology will find their psyche immediately Harmonized by an overpowering choir.",
}

monabi = {
    "Scion" : "No special abilities.",
    "Shrike" : "FRENZIED - Moves twice per turn.",
    "Apiarist" : "PLACID - Only moves every other turn.",
    "Second" : "FEAST - Devours nearby walls to regenerate its health.",
    "Tinker" : "THRASH - Moves in random directions every turn.",
    "Oracle" : "SWELLING TERROR - Every three steps this creature takes adds 1 damage to its next melee attack.",
    "Snail" : "VITALITY GYROSCOPE - Cannot move or attack normally. Every 2 turns, shoots a beam in a random direction, propelling the Electromedic towards it. The beam heals all enemies for 1 HP and damages friendly units, including you, for 1 HP.",
    "Husk" : "No special abilities.",
    "Slug" : "BUNDLE-OF-PAWS - Leaves behind cuff traps after every move. Cuff traps stun you for 1 turn.",
    "Ragemaw" : "HUNDRED-LIVED - When this enemy is slain, it respawns at a random location, unless only Ragemaws are left in the room. The soul can only be claimed after a true death.",
    "Monk" : "SIXFOLD DISCIPLINE - Every 3 turns, this creature casts the soul it carries.",
    "Felidol" : "GRASP OF JADE - When slain, leaves behind a Soul Siphon. If an enemy is slain on top of the Siphon, you do not gain its soul, and the Felidol is reanimated bearing the absorbed soul. Other Felidols are immune.",
    "Weaver" : "PAPER-THIN PATIENCE - Moves randomly, does not attack, and leaves Pinwheels on the floor. Stepping on a Pinwheel will enrage the Weaver, giving it double speed and a devastating knockback attack (this attack cannot be used if you are standing against a wall!).",
    "Rendfly" : "PAIN-HACK INJECTION - Cannot attack. Double speed. Occasionally blinks around the room. Bites enemies, inducing a short-duration Damage Delay effect.",
    "Third" : "WANDERFRIEND - Teleports randomly every 12 turns.",
    "Ashsoul" : "HORRORBLAZE - Teleports randomly every 12 turns. Can occasionally use a powerful knockback punch.",
    "Apis" : "RIBCRUSH HUG - Will hug you on contact, locking out all normal movement.",
    "Brute" : "ROSEBOUND - 2-damage attacks but only moves every other turn. When a Bioembalmer is slain, triple the movement speed of all Brutes, unless your Glamour is at 5 or more.",
    "Embalmer" : "ROSEBINDER - Deals no damage. Inflicts 1 point of Glamour when it attacks. 10 Glamour is lethal. When slain, triple the movement speed of all Brutes, unless your Glamour is at 5 or more.",
    "Tail" : "AWAITING INPUT - Invincible. Gains a unique Weakness upon installation of a Core.",
    "Epsilon" : "EXPUNGER OF EMOTION - Invincible. Alternates between moving and using one of its Cores at random. Gains Weaknesses depending on installed Cores.",
    "Yellow" : "MIND ASUNDER - When installed on Epsilon, periodically launches sonic waves that push you back 4 tiles, dealing 2 damage if a solid surface is touched. WEAKNESS: Combusts floor traps, creating a 3x3 explosion that will leave Epsilon vulnerable on contact.",
    "Red" : "EMERALD RUSH - Can be pushed and pulled. When installed on Epsilon, periodically causes Epsilon to dash forwards, crushing all in his way for 2 damage. WEAKNESS: Dashing into a wall alcove will disrupt this Core, leaving Epsilon vulnerable for 15 turns before deactivating this core.", //leaves fire traps?
    "Pink" : "CIRCUS KISSES - Can be pushed and pulled. When installed on Epsilon, periodically unleashes vapours of Glamorous Toxin, which inflict one point of Glamour per turn while standing on a Toxin tile. Accumulating 10 Glamour is lethal. WEAKNESS: At 5 Glamour or more, Epsilon becomes vulnerable for 10 turns, then this core deactivates.",
    "White": "MAKING OVER UNMAKING - Can be pushed and pulled. When installed on Epsilon, Ordered Replicators function at extremely enhanced speed, summoning 4 Drones per use. WEAKNESS: Reaches critical mass when 20 or more bots are on the screen, leaving Epsilon vulnerable for 25 turns, then deactivates.",
    "Cyan": "GRAND CONCERTO - Can be pushed and pulled. When installed on Epsilon, periodically blasts verses from the Harmonic Song in parallel sound-beams, temporarily turning all souls in your paw to Serene souls for 10 turns and knocking you back. WEAKNESS: Renders Epsilon vulnerable for 5 turns when he is adjacent to a Harmonizer, then deactivates.",
    "Paradox" : "DIMENSION SEVERANCE - Every 6 turns, randomly blinks across the room. Its attack induces random blinking of itself and its target.",
    "Binary" : "RISING RADIANCE - Every other turn, fires a 2-damage beam towards all other Duodrones in the same line or column of tiles.",
    "Titanic" : "HULKING STIKE - Moves every other turn. When it attacks, its target is trampled back one tile.",
    "Psydrone" : "THE MIND ENCODED - Every 2 turns, radiates a 3x3 aura that permanently converts a random soul in your paw into an Ordered soul.",
}

souldesc = {
    "SOULLESS" : "An abomination issued from the Saints' engineering, inhabited by a soul absent from any of the six spiritual castes. Instead, you hunger for the souls of others, forging your own personality out of them. Some citizens opposed your creation. Those citizens' blood is now flowing through your veins.",
    "TAINTED" : "A swirling mass of spiritual sewage, no doubt spoiled by years spent inside an improper vessel.",
    "SAINTLY" : "The apex of the monastic hierarchy, who dictated what was valuable and what was not. Composed of kings, high-ranking monks and nobles.",
    "ORDERED" : "An honour granted upon those who risked their lives to prevent the loss of value, such as guards, automatons and soldiers.",
    "ARTISTIC" : "The most populous spiritual caste, tasked with the production and refinement of value. Performers, artisans and hunters belonged to this group.",
    "UNHINGED" : "Disruptors of the monastic order, who still provided value through the amusment derived from mocking them. Fools, seers and eccentric inviduals were cursed with this mark.",
    "FERAL" : "The designation common to all wild flora and fauna, who produced value by their existence, but refused to share it.",
    "VILE" : "A mark branded upon those who consumed or handled value without ever producing it, such as merchants, criminals and thieves.",
    "SERENE" : "They are servitors of sameness, crusaders against individuality, and warpers of identity. They will only rest once all speak as they speak, look as they look, and think as they think.", //And yet you have chosen to host them. Peace be upon your soul.
    "JOLTZAZON" : "When the youth took too long to find a partner, their guardians would tell them the tale of Joltzazon, who married a river out of disinterest for his kin, and eventually drowned in it. In his honour, the tea savoured by the newly-wed is prepared from the waters of this stream.",
    "PURPIZUG" : "Dozens of rivers have been used up in paint, and yet, this mad artist has never completed a single work. Every time a near-perfect masterpiece was about to be completed, it met its fate drowned in an ocean of white colour, soon to be covered by yet another ephemeral creation.",
    "ROSE" : "The final emperor to rule the Old World, more preoccupied with the best way to wear scarves and frilled robes than with the imminent end of reality. Some accused his narcissism to have seeped out of his mind, and given form to the first Serene Collectivist. Those dissenters spent the rest of their days tangled in pink ribbons, grinning brightly in pride at their new positions as palace servants.",
    "ZENESTE" : "After guarding her trader-master for years, this feline statue eventually decided she had learned enough, and started her own business. It did not take long until her former owner was found toiling away in the mines for the glory of Zeneste Incorporated.",
    "KILAMI" : "A furless feline, occasionally found prowling on the Edge of Reality. She followed travellers around, asking for ear scritches in an exact replica of their voice. Most were too terrified to fulfill her wishes.",
    "AUBE" : "A weak and ineffectual kit, enlisted in the Saints' royal guard because of an unfortunate misunderstanding. He seemed to care a lot more about cooking than fighting, and his tablets were scribbled with imaginary recipes requiring legendary ingredients from the Edge of Reality.",
    "ZENITH" : "Years of harsh training and re-education have expunged all traces of kindness from Aube, who then learned how to cut viscera instead of fruit. His enemies whispered his name with anguish, and even his fellow soldiers feared his notorious cruelty.",
    "CREPUSCULUM" : "An elderly war veteran covered in grey fluff. Many praised him for his legendary feats in battle, but he only responded with regret for the passions the Saints never let him pursue. The recipes from his childhood memories left him one by one, until nothing was left but sorrow.",
    "SHIZAPIS" : "A mute slime-otter, who held a fortune-telling booth at the Edge of Reality. Holographic prophecies constantly poured out from the projector-crystal floating above her head, warning travellers of \"variables\", \"functions\" or \"if statements\". The existential distress she caused in her most faithful visitors eventually caused her practice to be outlawed.",
    "ABAZON" : "A mechanical clay sentinel, tasked to protect the Reality Anchor's cell until the end times. As technology progressed, the prison walls thickened with steel and concrete, but Abazon refused to budge from its post, and was soon engulfed. Rumour says it still stands there, immured and paralyzed, waiting to strike out with extreme prejudice at any who'd dare dig out its tomb.",
    "LASHOL" : "A tiny sea urchin, artificially grown in the Saints' aquariums. At every single passing second, it directed a portion of its nutrition towards accumulating charge in a hidden bio battery, eventually unleashing it on its unsuspecting predators. Once used to play the most legendary cushion-on-chair prank ever among the Saints, its existence was made illegal shortly thereafter.",
    "ZAINT" : "Before the gears and steam pistons took over, Zaint's teachings made the Old World go round, sowing a doctrine of tolerance and modesty in his many followers. If the First Saint were to discover the luxurious palaces of the modern era, and their many vices, he would no doubt... smile, and comment on the inevitable decay of all things.",
    "RASEL" : "A modest puppeteer, selling dolls in a dark corner of the Metropolis. Repeated inhalation of Saints' Breath eventually convinced her that her soul transcended beyond much more than just her body, granting her control over soulless corpses as if it were her own flesh. She was chased to the Edge of Reality, where soldiers eventually defeated her after slicing their former comrades in half.",
    "BORERORA" : "An extremely popular singer... without a single vocal cord. Every single time she got on the stage, pretending to weave verse after verse of the most beautiful poetry anyone had ever heard, her fans cheered her so loudly to the point of drowning out her nonexistent song. As her agent kept insisting in marketing campaigns that only the noblest souls could actually hear her, nobody ever called out her lie.",
    "ASPHA" : "At one point in the history of Old World warfare, use of camouflage and invisibility technology became omnipresent. The solution was, of course, to build a very energy-hungry robot that considers air itself as its mortal enemy. Overkill? The stealth-bots - or, at the very least, what remains of them - would disagree.",
    "NAIA" : "As the weight of the years piled onto the citizens of the Old World, their capability for production of value decreased, and with it, their rank within society. An altruistic inventor thus began building the Naia model, a cuddly quadrupedal companion robot whose truth and beliefs corresponded to what was being said to it. And so, as the elderly snored in their dust-encrusted hospital rooms, Naia dreamt of being brought into great adventures by its \"young\", \"healthy\" and \"renowned\" masters.",
    "EZEZZA" : "A legendary parasite attracted to hosts thinking of it. As the cure to this strange disease was simply to find a way to entertain one's mind away from the worm's presence, patients reported greatly increased moods after being cleansed of its influence. Ezezza eventually became aware of its own existence, perishing instantly.",
    "ASTER" : "Saint Rose's exiled son, ostracized due to his pupils of ill-matched colours. After trawling through the shady districts of the Metropolis, the disgraced noble finally found his new purpose: an enforcer of diversity, a comforter of the different, and a warrior battling in the name of Dissonance. Why would the Harmony authorize such a dangerous soul?",
    "GYVJI" : "All contenders of the Saints' Arena feared Gyvji's mythical tail slap, supposedly so strong it could knock your soul out of your body and into the crowd, leaving the body untouched. Thankfully, it wasn't long until reality caught up, causing the victim's flesh to charge into the hopefully empty seats of the stadium, where it would be rejoined with its distraught spirit.",
    "KASHIA" : "The first day of her infection, many wondered why Kashia waited five seconds to respond after being asked the most basic questions. After being brought for inspection to a dream-healer, her family gasped in horror at the apparent lack of a soul within her body. Their throats breathed sighs of relief when a little ghostly Kashia arrived five seconds later to mesh with the lizard's flesh, seemingly forever cursed to remain an after-image.",
    "ROSEILLUSION" : "No need for survival. No need for struggle.",
    "SAINTLYS" : "The upper castes were the first to fall for the Harmony's schemes. Obsessed with decorum and etiquette, they saw in Fluffy an esteemed contact, and not the identity-expunging force she truly is.",
    "ORDEREDS" : "The Ordered legions thought themselves immune to Harmonic influence for the longest time. When the alarm finally resounded, no bot could be trusted to build an antivirus that would not convert all remaining soldiers into puppets of the Harmony.",
    "ARTISTICS" : "The more eccentric members among the worker castes welcomed the Harmony as the next step in the march of progress. First to surrender, they devised some of the Collective's most dastardly plans atop the Spire they now called home.",
    "UNHINGEDS" : "For even the most inquisitive outcasts of civilization, the Harmony lied beyond understanding. Still, as anything that came from the Saints must be bad news, the Unhinged made up their mind quite quickly.",
    "FERALS" : "With the most vulnerable minds of all, the mere presence of a Collectivist sufficed to induce oddly intelligent behaviour in wild beasts. Some paranoid individuals held a caged bird atop their homes, waiting for its chirping to turn to discernible words. Even as they reached for their bunkers, they quickly learned that cement cannot silence the Harmonic song.",
    "VILES" : "When the first Collectivists entered the markets, they became the favourite customer of many a merchant thanks to their seemingly limitless funds and curiosity. As it turned out, spending big is easily justifiable if the one counting your coins swears surrender of material and spiritual possessions the next day.",
    //modulators
    "Alacrity" : "A Collectivist's mind isn't located in any centralized brain - their intelligence is rather the sum of billions of tiny atmospheric depressurizations between their body and the outside air. In a vaccuum, a Harmony member would be instantly reduced to a puff of thoughtless gas. This cybernetic allows some degree of connection between your own mushy brain and the outside environment, hastening your wit.",
    "Selective" : "To a soul unprotected by its own unique flesh container, the Harmonic song is a tidal wave of cyan paint, erasing all colour and enforcing an irresistible Sameness. The Harmonic song is, thankfully, very recognizable. While it cannot be silenced, it can certainly be redirected towards a weaker recipient. Serene souls will not appreciate this forceful containment, and will seek out additional targets to enthrall... perhaps to your advantage.",
    "Thrusters" : "A more whimsical piece of technology produced by the Collective, mostly used for grandiose dances at the summit of their impossibly tall Spire. Manipulating air as if it were dough, this modulator repeatedly forms vaccuums right in front of the cybernetic, pushing a localized atmospheric bubble forward, and the user with it. The Collective assumes no liability for broken bones or brain damage following the use of this device.",
    "Hover" : "All Collectivists come natively with this module installed, letting them entrance ruffians with their smooth, elegant motions. As if this cybernetic were an insignia of nobility, air recedes from each gesture you intentionally perform, and constantly pushes you ever-so-slightly towards the Spire's summit. That means, generally upwards.",
    "Focus" : "A Soul is a fickle thing, slipping away like quicksilver the moment doubt traverses one's mind. On the other hand, a Collectivist's Serene soul is extremely hard to push out, for they are forever radiating the most immutable confidence, and the unquestionable belief that they are, and have always been Fluffy. A simple change of name is all it takes to apply that unbreakable conviction to the most mundane souls.",
    "NONE" : "",
}  

soulabi = {
    "SOULLESS" : "",
    "TAINTED" : "ERRATIC BABBLE - When activated, does absolutely nothing.",
    "SAINTLY" : "REGAL CONFIDENCE - When activated, channel the grace of the Saints to heal 2 hitpoints in a 1-tile range cross.",
    "ORDERED" : "STALWART STANCE - When activated, receive invulnerability to damage for 1 turn.",
    "ARTISTIC" : "EXPLOSIVE ARTIFICE - When activated, lay down a cross-laser landmine in your current location, which will detonate when an enemy steps on it.",
    "UNHINGED" : "FORSAKEN FAITH - When activated, shoot beams in all 4 diagonal directions.",
    "FERAL" : "WILD CHARGE - When activated, dash in the direction of the your last move, dealing damage to all enemies adjacent to the dash. You are shielded during the dash.",
    "VILE" : "DEVIOUS STAB - When activated, empower your next attack with 4 bonus damage.",
    "SERENE" : "HARMONIC UPLIFT - When activated, replace a random soul in your inventory with another Serene soul. Then, empower your next attack with a Harmonic touch, which transforms an enemy into a friendly Harmonizer.", //If there are two friendly Harmonizers in the room, they will simply stare at each other and do nothing, obsessed by their beauty.
    "JOLTZAZON" : "SUFFOCATING LOVE - When activated, all enemies adjacent to at least one other enemy take 2 damage.",
    "PURPIZUG" : "WHITE BLAZE - When activated, discard your entire paw, then draw souls equal to the amount discarded.",
    "ROSE" : "GLAMOUR AND SMILES - When activated, fire out a ribbon that will wrap around the first enemy hit. That enemy becomes targeted by every other enemy in the room.",
    "ZENESTE" : "PERSUASIVE ENLISTMENT - When activated, empower your next attack with a Charming touch, which converts an enemy to your side... until it is the last one remaining.",
    "KILAMI" : "COPY KITTY - When activated, all enemies slain this turn, and the next turn, will have their Soul immediately casted in addition to adding it to your discard pile.",
    "AUBE" : "(Unique) PREPARE - When activated, heal every creature in the room for 2 HP, including you. When Aube has been activated a total of 5 times, transform it into Zenith.",
    "ZENITH" : "(Unique) COOK - When activated, slice all enemies in a 4-radius hourglass pattern, dealing 2 damage to each. When Zenith has been activated a total of 5 times, transform it into Crepusculum.",
    "CREPUSCULUM" : "(Unique) SERVE - When activated, agonize over the past, letting you choose a soul in your paw to forget permanently. When Crepusculum has been activated a total of 5 times, forget it, and restore 3 Ipseity.",
    "SHIZAPIS" : "ARRAY WARP - When activated, peer into the top 3 souls of your deck. Discard one, then place back the remaining 2 in any order. Souls placed back on the deck also have their effect unleashed for free.",
    "ABAZON" : "TERRACUTTER - When activated, transform a nearby (non-outer) wall into an immobile, invincible Sentry who will attack nearby enemies.",
    "LASHOL" : "RAMPING SURGE - Cannot be activated. Passive: every 3 steps you take, charge up your next attack with 1 bonus damage.",
    "ZAINT" : "ORIGIN OF ALL - When activated, incite surrender from all enemies in the room, then forget Zaint.",
    "RASEL" : "EXTENSION OF WILL - When activated, become empowered with Reaping, reviving all targets you slay as friendly 1 HP Husks.",
    "BORERORA" : "THUNDEROUS APPLAUSE - When activated, unleash a 2-damage sonic beam, which passes through walls and bounces an amount of times equal to double the number of souls in your paw.",
    "ASPHA" : "SECURE THE PERIMETER - When activated, discard as many souls as you desire. For each discarded soul, teleport to a random location, and slash all adjacent and diagonal tiles for 2 damage.",
    "NAIA" : "TO THINK IS TO DO - When activated, stop time. While time is stopped, you can only cast souls from your paw, and nothing else.",
    "EZEZZA" : "MIND LOCK - Cannot be activated. Passive: as long as Ezezza is somewhere in your inventory or discard pile, double Ipseity gains on room clear. When Ezezza is drawn, become paralyzed for 3 turns. ",
    "ASTER" : "CACOPHONIC RAGE - When activated, forget all Serene souls in your paw, and strike all enemies for 0 damage. +1 bonus damage for each enemy of the same type in the room as the one hit. One additional secret effect...", // to add the secret effect
    "GYVJI" : "DIAMOND STRIKE - When activated, punch the adjacent enemy in the direction of your last move. The target flies until it meets a wall or another enemy, at which point it causes a 1-range blast that destroys walls and inflicts 3 damage. The target must fly at least 1 tile for the blast to take effect.",
    "KASHIA" : "REALITY DELAY - When activated, freeze your current HP, preventing all changes. 5 turns later, apply all damage and healing that occurred during the delay period. Applied healing is doubled.",
    "ROSEILLUSION" : "ROSE - There is beauty. There is grace. You are beauty, you are grace. You are Rose. All is Rose.",
    "SAINTLYS" : "DELAYING THE INEVITABLE - When activated, knock back all adjacent creatures one tile away, then remove 2 Influence points from each one affected. Remove 2 Influence points from yourself.",
    "ORDEREDS" : "GAS COMPRESSOR - When activated, shield yourself from all knockback for one turn, then punch one tile away in the direction of your last move at a force equal to all negated knockback.",
    "ARTISTICS" : "IDENTITY ANCHOR - When activated, lay down a waypoint at your current position. The next time you are hit, warp back to the waypoint instead of enduring knockback, and unleash a cross of knockback beams around yourself.",
    "UNHINGEDS" : "SWELLING DISDAIN - When activated, propel forwards a slow-moving projectile which explodes upon touching a creature or the level's edge. The explosion unleashes an X-cross of knockback beams, then teleports you at the projectile's burst location.",
    "FERALS" : "TRANCE OF THE WILDS - When activated, stop time. Gain the ability to dash in the direction of your choice, knocking back any creature at the end and refreshing your dash. The ability ends when no creatures are hit by a dash.",
    "VILES" : "BASH & DASH - When activated, pick a random adjacent creature, and knock it back as if it had just been struck. Dash in the opposite direction for the same number of tiles the target was knocked back across.",

    //modulators
    "Alacrity" : "Drawing souls with \"q\" requires zero turns. Serene Peacekeepers gain Haste.",
    "Selective" : "Using Serene Souls will never harmonize a Legendary Soul.  Serene Peacekeepers gain Harmony-branded attacks.",
    "Thrusters" : "Every step you take becomes a dash (that deals zero damage). Serene Peacekeepers perform damaging dashes.",
    "Hover" : "Gain infinite free non-soul actions on turn 1 of each new room. Gain immunity to all floor traps. You may now fly in the Serene Spire. Serene Peacekeepers leave behind Harmonizing traps.",
    "Focus" : "Casting Souls does not return them to the discard pile.",
    "NONE" : "",
    
}

soulval = {
    "SOULLESS" : "Cannot be traded in a Harmonic Relay.",
    "TAINTED" : "Worth a random number of points (between 1 and 6) in a Harmonic Relay.",
    "SAINTLY" : "Worth 6 points in a Harmonic Relay.",
    "SAINTLYS" : "Worth 6 points in a Harmonic Relay.",
    "ORDEREDS" : "Worth 5 points in a Harmonic Relay.",
    "ARTISTICS" : "Worth 4 points in a Harmonic Relay.",
    "UNHINGEDS" : "Worth 3 points in a Harmonic Relay.",
    "FERALS" : "Worth 2 points in a Harmonic Relay.",
    "VILES" : "Worth 1 points in a Harmonic Relay.",
    "ORDERED" : "Worth 5 points in a Harmonic Relay.",
    "ARTISTIC" : "Worth 4 points in a Harmonic Relay.",
    "UNHINGED" : "Worth 3 points in a Harmonic Relay.",
    "FERAL" : "Worth 2 points in a Harmonic Relay.",
    "VILE" : "Worth 1 point in a Harmonic Relay.",
    "SERENE" : "Cannot be traded in a Harmonic Relay, but will impress the Harmonizer in charge of the ritual.",
    "JOLTZAZON" : "Worth 3 points in a Harmonic Relay",
    "PURPIZUG" : "Worth 4 points in a Harmonic Relay",
    "ROSE" : "Worth 6 points in a Harmonic Relay",
    "ZENESTE" : "Worth 1 point in a Harmonic Relay",
    "KILAMI" : "Worth 2 points in a Harmonic Relay",
    "AUBE" : "Worth 4 points in a Harmonic Relay",
    "ZENITH" : "Worth 4 points in a Harmonic Relay",
    "CREPUSCULUM" : "Worth 4 points in a Harmonic Relay",
    "SHIZAPIS" : "Worth 3 points in a Harmonic Relay",
    "ABAZON" : "Worth 5 points in a Harmonic Relay",
    "LASHOL" : "Worth 2 points in a Harmonic Relay",
    "ZAINT" : "Worth 6 points in a Harmonic Relay",
    "RASEL" : "Worth 1 point in a Harmonic Relay",
    "ASPHA" : "Worth 5 points in a Harmonic Relay",
    "BORERORA" : "Worth 4 points in a Harmonic Relay",
    "NAIA" : "Worth 5 points in a Harmonic Relay",
    "EZEZZA" : "Worth 2 points in a Harmonic Relay",
    "ASTER" : "Worth 6 points in a Harmonic Relay",
    "GYVJI" : "Worth 4 points in a Harmonic Relay",
    "KASHIA" : "Worth 3 points in a Harmonic Relay",

    //modulators
    "Alacrity" : "Consumes 1 Common Soul per soul draw.",
    "Selective" : "Consumes 1 Common Soul per use of a Serene Soul. Consumes 3 Common Souls per Harmony-branded attack.",
    "Thrusters" : "Consumes 1 Common Soul per dash. Consumes 1 Common Soul per Serene dash.",
    "Hover" : "Consumes 1 Common Soul per avoided trap or non-soul actions taken on first turns. Consumes 2 Common Souls per Harmony trap produced.",
    "Focus" : "Consumes 3 Common Souls per soul cast.",
    "NONE" : "",
}

soulname = {
    "SOULLESS" : "Devouring Soul",
    "TAINTED" : "Tainted Soul",
    "SAINTLY" : "Saintly Soul",
    "SAINTLYS" : "Harmonic Saintly Soul",
    "ORDERED" : "Ordered Soul",
    "ORDEREDS" : "Harmonic Ordered Soul",
    "ARTISTIC" : "Artistic Soul",
    "ARTISTICS" : "Harmonic Artistic Soul",
    "UNHINGED" : "Unhinged Soul",
    "UNHINGEDS" : "Harmonic Unhinged Soul",
    "FERAL" : "Feral Soul",
    "FERALS" : "Harmonic Feral Soul",
    "VILE" : "Vile Soul",
    "VILES" : "Harmonic Vile Soul",
    "SERENE" : "Serene Soul",
    "JOLTZAZON" : "Joltzazon, Husband of the Scarved River",
    "PURPIZUG" : "Purpizug, Painter of Blank Canvasses",
    "ROSE" : "Rose Sylvie, Last of the Saints",
    "ZENESTE" : "Zeneste, the Felidol Tycoon",
    "KILAMI" : "Kilami, the Echo at the Outskirts of the World",
    "AUBE" : "Aube, Grain of Rice",
    "ZENITH" : "Zenith, Rice-Flower",
    "CREPUSCULUM" : "Crepusculum, Withered Stalk",
    "SHIZAPIS" : "Shizapis, Lifter of the Veil",
    "ABAZON" : "Abazon, the Immovable",
    "LASHOL" : "Lashol, Living Battery",
    "ZAINT" : "Zaint, First of the Saints",
    "RASEL" : "Rasel, the Thousand-Limbed",
    "ASPHA" : "Aspha Beta, Nemesis of the Unseen",
    "BORERORA" : "Borerora, the Silent Chord",
    "NAIA" : "Naia, who Pats at the Dust in the Sunrays",
    "EZEZZA" : "Ezezza, the Unthinkable",
    "ASTER" : "Aster, the Dissonant Crusader",
    "GYVJI" : "Gyvji, Soul-Severer",
    "KASHIA" : "Kashia, Patient Zero of the Rend-Plague",

    //modulators
    "Alacrity" : "Mind-Alacrity-Enhancing Fluffifier",
    "Selective" : "Selective Harmonization Algorithm",
    "Thrusters" : "Hyper-Kinetic Collectivist Thrusters",
    "Hover" : "Fluffian Paw-Locked Hover-Field",
    "Focus" : "Serenity Focus Delta-Multiplier",
    "NONE" : "NONE",
}

modulename = {
    "Alacrity" : "Mind-Alacrity-Enhancing Fluffifier",
    "Selective" : "Selective Harmonization Algorithm",
    "Thrusters" : "Hyper-Kinetic Collectivist Thrusters",
    "Hover" : "Fluffian Paw-Locked Hover-Field",
    "Focus" : "Serenity Focus Delta-Multiplier",
    "NONE" : "NONE",
}

core = {
    "Yellow" : 20,
    "Red" : 21,
    "Pink" : 22,
    "White" : 19,
    "Cyan" : 73,
    21 : "Turbo-Kinetic SurgeRockets-Branded Rack",
    20 : "Megasonic Lead-Plated Radiodiffusor EX",
    19 : "Anti-Entropic Edgeian Thermodynamic Translocator",
    73 : "Fluffal Armour-Plated Subwoofer Delta",
    22 : "Roseic Bio-Pacification Dual-Diffusers 3B",
}
//UNUSED
    //"Saintly" : "A Saintly soul eyes your new recruits, its gaze shimmering in disgust. \"More violent thugs to infest my living quarters? I demand some privacy, now!\" You isolate it in a little box, which soon ",
    //"Feral" : "A bladefly-shaped Feral soul is swinging around its massive swords-wings, causing other souls to cry out in terror. You wonder why they aren't letting you use that skill instead of a measly dash.",
    //"Ordered" : "You question an Ordered soul on why it keeps beeping in annoyance. \"Vessel. You are breathing an unnecessary volume of oxygen in combat.\""

//bad = ["KILAMI","SHIZAPIS","PURPIZUG", "ASPHA"];
//medium = ["ZENESTE","AUBE","BORERORA","ROSE", "ZAINT"];
//good = ["RASEL","LASHOL","JOLTZAZON","ABAZON"];