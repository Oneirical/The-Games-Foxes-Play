const logicMaps = {
    "Empty" : {
        0 : ".....",
        1 : ".....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
        }
    },
    "SaintlyStarterHologram" : {
        0 : "IPND.",
        1 : ".....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "I" : new RadioReceiver("TAKE"),
            "P" : new NumberIncrementer(1),
            "N" : new NumberStorage(-1),
            "D" : new DialoguePrinter("SaintlyStarterHologram"),
        }
    },
    "OrderedStarterHologram" : {
        0 : "IPND.",
        1 : ".....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "I" : new RadioReceiver("TAKE"),
            "P" : new NumberIncrementer(1),
            "N" : new NumberStorage(-1),
            "D" : new DialoguePrinter("OrderedStarterHologram"),
        }
    },
    "ArtisticStarterHologram" : {
        0 : "IPND.",
        1 : ".....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "I" : new RadioReceiver("TAKE"),
            "P" : new NumberIncrementer(1),
            "N" : new NumberStorage(-1),
            "D" : new DialoguePrinter("ArtisticStarterHologram"),
        }
    },
    "FeralStarterHologram" : {
        0 : "IPND.",
        1 : ".....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "I" : new RadioReceiver("TAKE"),
            "P" : new NumberIncrementer(1),
            "N" : new NumberStorage(-1),
            "D" : new DialoguePrinter("FeralStarterHologram"),
        }
    },
    "CyanFlood" : {
        0 : ".RANM",
        1 : ".P...",
        2 : ".N...",
        3 : ".E...",
        4 : ".T...",
        "keys" : {
            "R" : new ContinSecond(),
            "E" : new EgoType(),
            "P" : new PlusForm(),
            "X" : new PercentChanceSever(90),
            "T" : new TwinningAssimilation(),
            "A" : new TargetAllCreatures(),
            "N" : new NoTagFilter("HarmonicGrace"),
            "M" : new MoveFunction(),
        }
    },
    "Airlock" : {
        0 : "..I..",
        1 : "..O..",
        2 : ".....",
        3 : "....C",
        4 : "REPBF",
        "keys" : {
            "I" : new RadioReceiver("TAKE"),
            "R" : new RadioReceiver("EON"),
            "E" : new EgoForm(),
            "O" : new OpenSelf(),
            "P" : new PlusForm(),
            "B" : new BreakIfNobody(),
            "F" : new FailCatcher(),
            "C" : new CloseSelf(),

        }
    },
    "OrderedStarter" : {
        0 : "TMDBW",
        1 : "....F",
        2 : "EPN.E",
        3 : "A.R.S",
        4 : "WKI.N",
        "keys" : {
            "T" : new TriggerWatch("MoveFunction"),
            "M" : new MomentumTarget(),
            "D" : new DirectionExtractor(),
            "B" : new TargetsDirectionalBeam(),
            "W" : new WarpCloseAway(),
            "F" : new FurthestFilter(),
            "E" : new ExpandTargets(),
            "X" : new DamageDealer(1),
            "S" : new ScreenShake(20),

            "I" : new DefineIcon(28),
            "R" : new RadioReceiver("1"),
            "P" : new PlusForm(),
            "A" : new EgoFilter(),
            "K" : new RadioBroadcaster("EON"),
            "N" : new ShowEffects(),
        }
    },
    "FeralStarter" : {
        0 : ".....",
        1 : ".....",
        2 : ".RBTD",
        3 : "..A.C",
        4 : ".EF..",
        "keys" : {
            "T" : new TargetAllAffected(),
            "R" : new RadioReceiver("EON"),
            "C" : new BashDir("N"),
            "D" : new DirectionFromMotion(),
            "E" : new RadioReceiver("3"),
            "F" : new BooleanFlip(),
            "B" : new BooleanGate(true),
            "A" : new AssimilationExtender(),
        }
    },
    "Singularity" : {
        0 : "EEEEA",
        1 : "E...W",
        2 : "EPN.K",
        3 : "..R..",
        4 : "..I..",
        "keys" : {
            //"W" : new WarpCloseAway(),
            "W" : new TwinningAssimilation(181),
            "E" : new ExpandTargets(),
            "I" : new DefineIcon(29),
            "R" : new RadioReceiver("2"),
            "P" : new PlusForm(),
            "A" : new EgoFilter(),
            "K" : new RadioBroadcaster("EON"),
            "N" : new ShowEffects(),
        }
    },
    "ElectroCoil" : {
        0 : "RINMB",
        1 : "....Z",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
           "R" : new RadioReceiver("EON"),
           "I" : new NumberIncrementer(1),
           "N" : new NumberStorage(0),
           "M" : new ModuloGate(5),
           "B" : new LinkForm(),
           "Z" : new DamageDealer(1),
        }
    },
    "Scarab" : {
        0 : "KLB.R",
        1 : "....I",
        2 : "...MP",
        3 : "....A",
        4 : ".....",
        "keys" : {
            "R" : new RadioReceiver("EON"),
            "A" : new RadioReceiver("GONOW"),
            "M" : new MoveFunction(),
            "P" : new FormTile("ScarabWaypoint"),
            "K" : new ContinKilled(),
            "L" : new LastDamageSource(),
            "B" : new AssimilateBroadcast("DANGER"),
            "I" : new SpeciesCheck("Scarab"),
        }
    },
    "MoveDownBot" : {
        0 : ".....",
        1 : ".....",
        2 : ".R...",
        3 : ".A...",
        4 : ".D...",
        "keys" : {
            "R" : new RadioReceiver("EON"),
            "A" : new FormDir("S"),
            "D" : new MoveFunction(),
        }
    },
    "Guard" : {
        0 : ".....",
        1 : ".....",
        2 : "MPR..",
        3 : ".E...",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("EON"),
            "R" : new RadioReceiver("DANGER"),
            "M" : new MoveFunction(),
            "P" : new FormEntity(),

        }
    },
    "SwarmPlayer" : {
        0 : ".....",
        1 : ".....",
        2 : "EFBPM",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("EON"),
            "M" : new MoveFunction(),
            "P" : new FormEntity(181),
            "F" : new BooleanFlip(),
            "B" : new BooleanGate(true),
        }
    },
    "SoulSiphon" : {
        0 : ".....",
        1 : ".....",
        2 : ".....",
        3 : ".R...",
        4 : ".....",
        "keys" : {
            "D" : new TriggerWatch("DamageDealer"),
            "A" : new SoulAbsorber(),
            "R" : new RealityAnchor(),
        }
    },
    "Programmer" : {
        0 : "CFA..",
        1 : "E.VBS",
        2 : "P....",
        3 : "M....",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("EON"),
            "M" : new MoveFunction(),
            "P" : new FormEntity(), //handled to link to the hacker
            "C" : new PlusForm(),
            "F" : new SpeciesFilter("Apiarist"),
            "A" : new NoTargetStop(),
            "V" : new VoidTargets(),

            "S" : new SoulInjector("Epsilon"),
            "B" : new AssimilateBroadcast("PAYLOAD"),

        }
    },
    "PermaHeal" : {
        0 : "EIPH.",
        1 : ".....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("TERMINATE"),
            "P" : new PlusForm(),
            "H" : new HealProvider(1),
            "I" : new SpeciesCheck("EpsilonTail"),
        }
    },
    "ScarabHack" : {
        0 : ".....",
        1 : "....A", //A
        2 : "....P",
        3 : ".EBTI",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("EON"),
            "B" : new LinkForm(),
            "I" : new SoulInjector(),
            "A" : new OverwriteSlot("ORDERED"),
            "P" : new FormEntity(),
            "T" : new RadioReceiver("PAYLOAD"),
        }
    },
    "ScarabSpawner" : {
        0 : "RINMP",
        1 : "....S",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "R" : new RadioReceiver("EON"),
            "I" : new NumberIncrementer(1),
            "N" : new NumberStorage(998),
            "M" : new ModuloGate(999),
            "P" : new PlusForm(),
            "S" : new SummonCreature("Scarab"),
        }
    },
    "EpsilonControl1":{
        0 : "wnMIN",
        1 : "I.E..",
        2 : "CS.SC",
        3 : "..E.I",
        4 : "NIMoa",
        "keys" : {
            "M" : new MoveFunction(),

            "C" : new EgoForm(),
            "S" : new PaintTile("Red"),
            "N" : new RadioBroadcaster("SLITHER1"),
            "I" : new SpeciesCheck("EpsilonHead"),
            "E" : new RadioBroadcaster("EON"),

            "w" : new RadioReceiver("W"),
            "a" : new RadioReceiver("A"),
            "s" : new RadioReceiver("S"),
            "d" : new RadioReceiver("D"),

            "n" : new FormDir("N"),
            "o" : new FormDir("W"),
            "e" : new FormDir("E"),
            "u" : new FormDir("S"), 
        }
    },
    "EpsilonControl2":{
        0 : "deMIN",
        1 : "I.E..",
        2 : "CS.SC",
        3 : "..E.I",
        4 : "NIMus",
        "keys" : {
            "M" : new MoveFunction(),
            "E" : new RadioBroadcaster("EON"),

            "C" : new EgoForm(),
            "S" : new PaintTile("Red"),
            "N" : new RadioBroadcaster("SLITHER1"),
            "I" : new SpeciesCheck("EpsilonHead"),

            "w" : new RadioReceiver("W"),
            "a" : new RadioReceiver("A"),
            "s" : new RadioReceiver("S"),
            "d" : new RadioReceiver("D"),

            "n" : new FormDir("N"),
            "o" : new FormDir("W"),
            "e" : new FormDir("E"),
            "u" : new FormDir("S"), 
        }
    },
    "EpsilonStand" : {
        0 : "RPFDA",
        1 : ".....", 
        2 : "TPA..",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "R" : new RadioReceiver("EON"),
            "P" : new PlusForm(),
            "D" : new DamageDealer(1),
            "F" : new SpeciesFilter("Scarab"),
            "T" : new TriggerWatch("DamageDealer"),
            "A" : new SoulAbsorber(),

        }
    },
    "Epsilon" : {
        0 : "IRT..", // ego, store targets, 
        1 : "F....", // flip boolean stop
        2 : "BPM0V",
        3 : "C.N.C",
        4 : "S...X",
        "keys" : {
            "R" : new RadioReceiver("EON"),
            "M" : new MoveFunction(),
            "P" : new FormEntity("Player"), // just testing for now, no player targeters later
            "F" : new BooleanFlip(),
            "B" : new BooleanGate(true),
            "I" : new SpeciesCheck("EpsilonHead"),

            "C" : new EgoForm(),
            "S" : new PaintTile("Red"),
            "V" : new VoidTargets(),
            "N" : new RadioBroadcaster("SLITHER1"),
            "T" : new RadioBroadcaster("TERMINATE"),

            "0" : new FailCatcher(),
            "X" : new ClearPaint(),

        }
    },
    "Tail1" : {
        0 : "RCSVP",
        1 : "....F", 
        2 : "....M",
        3 : "....X",
        4 : "....N",
        "keys" : {
            "R" : new RadioReceiver("SLITHER1"),
            "P" : new PlusForm(),
            "F" : new PaintFilter("Red"),
            "M" : new MoveFunction(),
            "X" : new ClearPaint(),
            "C" : new EgoForm(),
            "S" : new PaintTile("Red"),
            "V" : new VoidTargets(),
            "N" : new RadioBroadcaster("SLITHER2"),
        }
    },
    "Tail2" : {
        0 : "RCSVP",
        1 : "....F", 
        2 : "....M",
        3 : "....X",
        4 : "....N",
        "keys" : {
            "R" : new RadioReceiver("SLITHER2"),
            "P" : new PlusForm(),
            "F" : new PaintFilter("Red"),
            "M" : new MoveFunction(),
            "X" : new ClearPaint(),
            "C" : new EgoForm(),
            "S" : new PaintTile("Red"),
            "V" : new VoidTargets(),
            "N" : new RadioBroadcaster("SLITHER3"),
        }
    },
    "Tail3" : {
        0 : "RCSVP",
        1 : "....F", 
        2 : "....M",
        3 : "....X",
        4 : "....N",
        "keys" : {
            "R" : new RadioReceiver("SLITHER3"),
            "P" : new PlusForm(),
            "F" : new PaintFilter("Red"),
            "M" : new MoveFunction(),
            "X" : new ClearPaint(),
            "C" : new EgoForm(),
            "S" : new PaintTile("Red"),
            "V" : new VoidTargets(),
            "N" : new RadioBroadcaster("SLITHER4"),
        }
    },
    "Tail4" : {
        0 : "RPFXM",
        1 : ".....", 
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "R" : new RadioReceiver("SLITHER4"),
            "P" : new PlusForm(),
            "F" : new PaintFilter("Red"),
            "M" : new MoveFunction(),
            "X" : new ClearPaint(),
            "C" : new EgoForm(),
            "S" : new PaintTile("Red"),
            "V" : new VoidTargets(),
        }
    },
    "Terminal" : {
        0 : "MT.NW",
        1 : "O.TM1",
        2 : "A2R3D",
        3 : "4MT.E",
        4 : "Ss.TM",
        "keys" : {
            "W" : new RadioReceiver("W"),
            "A" : new RadioReceiver("A"),
            "D" : new RadioReceiver("D"),
            "1" : new DefineIcon(58),
            "2" : new DefineIcon(60),
            "3" : new DefineIcon(59),
            "4" : new DefineIcon(61),

            "N" : new FormDir("N"),
            "O" : new FormDir("W"),
            "E" : new FormDir("E"),
            "S" : new RadioReceiver("S"),

            "s" : new FormDir("S"),
            "R" : new RealityAnchor(),
            "M" : new MoveFunction(),
            "T" : new RadioBroadcaster("EON"),
        }
    },
}