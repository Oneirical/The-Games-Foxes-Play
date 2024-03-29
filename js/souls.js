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
    "HypnoWell" : {
        0 : "..R..",
        1 : "..E..",
        2 : "..W..",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "R" : new RadioReceiver("CRUSH"),
            "E" : new EgoForm(),
            "W" : new WarpEntity(),
        }
    },
    "PlanarMove" : {
        0 : ".R...",
        1 : ".B...",
        2 : ".G...",
        3 : ".A...",
        4 : ".D...",
        "keys" : {
            "R" : new InterdimensionalReceiver("EON"),
            "A" : new FormDir("N"),
            "D" : new MoveFunction(),
            "B" : new BooleanFlip(),
            "G" : new BooleanGate(true),
        }
    },
    "AttractPole" : {
        0 : ".RE..",
        1 : "..B..",
        2 : "..G..",
        3 : "..S..",
        4 : "..H..",
        "keys" : {
            "R" : new RadioReceiver("EON"),
            "G" : new BooleanGate(false),
            "B" : new BooleanFlip(),
            "S" : new TargetAllAffected(),
            "H" : new ForcePullToSelf(),
            "E" : new ShowEffects(),

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
        0 : "TMXDB",
        1 : "....S",
        2 : "EPN.N",
        3 : "A.R..",
        4 : "WKI..",
        "keys" : {
            "T" : new TriggerWatch("MoveFunction"),
            "M" : new MomentumTarget(),
            "D" : new DirectionExtractor(),
            "B" : new BashDir(),
            "W" : new WarpCloseAway(),
            "F" : new FurthestFilter(),
            "E" : new ExpandTargets(),
            "S" : new ScreenShake(10),
            "X" : new BreakIfNobody(),

            "I" : new DefineIcon(28),
            "R" : new RadioReceiver("1"),
            "P" : new PlusForm(),
            "A" : new EgoFilter(),
            "K" : new RadioBroadcaster("EON"),
            "N" : new ShowEffects(),
        }
    },
    "SaintlyStarter" : {
        0 : "SCETW",
        1 : "1....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        /*
        2 : ".SR..",
        3 : ".X...",
        4 : ".ZLET",
        */
        "keys" : {
            "1" : new RadioReceiver("1"),
            "C" : new PlusForm(),
            "E" : new EgoType(),
            "T" : new TwinningAssimilation(),
            "W" : new RadioBroadcaster("EON"),
            "S" : new ShowEffects(),
/*
            "R" : new RadioReceiver("EON"),
            "X" : new SpeciesGrabber(),
            "Z" : new TargetAllOfSpecies(),
            "L" : new LinkAllTargets(),
            */
        }
    },
    "ArtisticStarter" : {
        0 : "DBCET",
        1 : "S...X",
        2 : "Z....",
        3 : "1....",
        4 : ".....",

        "keys" : {
            "1" : new RadioReceiver("1"),
            "D" : new DirectionFromMotion(),
            "B" : new BeamFromCaster(),
            "S" : new EgoForm(),
            "Z" : new ShowEffects(),
            "A" : new SoulWipe("ORDERED"),
            "C" : new SoulInjector("ORDERED"),
            "E" : new SoulSwapper("SAINTLY"),
            "T" : new TagInjector("RealityAnchor"),
            "X" : new RadioBroadcaster("EON"),


        }
    },
    "FeralStarter" : {
        0 : ".....",
        1 : "....X",
        2 : ".RBTD",
        3 : "..A.C",
        4 : ".EF..",
        "keys" : {
            "T" : new TargetAllAffected(),
            "R" : new TriggerWatch("MoveFunction"),
            "X" : new RadioBroadcaster("EON"),
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
    "BouncyBall" : {
        0 : "RCEDB",
        1 : ".....",
        2 : ".....",
        3 : ".....",
        4 : ".....",
        "keys" : {
           "R" : new RadioReceiver("EON"),
           "C" : new CrossBeamTarget(),
           "D" : new DirectionExtractor(),
           "E" : new EgoForm(),
           "B" : new BashDir(),
        }
    },
    "ElectroCoil" : {
        0 : "RCD..",
        1 : "..A..",
        2 : "..B..",
        3 : "..E..",
        4 : "RFG..",
        "keys" : {
           "R" : new RadioReceiver("EON"),
           "C" : new CrossBeamTarget(),
           "D" : new DirectionExtractor(),
           "E" : new EgoForm(),
           "B" : new BashDir(),
           "A" : new AssimilationExtender(),
           "F" : new BooleanFlip(),
           "G" : new BooleanGate(true),
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
    "SwarmPlayer" : {
        0 : ".....",
        1 : ".....",
        2 : "EFBPM",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("EON"),
            "M" : new MoveFunction(),
            "P" : new FormEntity("93"),
            "F" : new BooleanFlip(),
            "B" : new BooleanGate(true),
        }
    },
    "SwarmPlayerDisabled" : {
        0 : ".....",
        1 : ".....",
        2 : "EFBSM",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("EON"),
            "M" : new MoveFunction(),
            "F" : new BooleanFlip(),
            "B" : new BooleanGate(true),

            "S" : new FormEntity(242),
        }
    },
    "ScanForPlayer" : {
        0 : ".CXE.",
        1 : ".N...",
        2 : ".GAF.",
        3 : ".PHO.",
        4 : ".....",
        "keys" : {
            "E" : new RadioReceiver("EON"),
            "C" : new CrossBeamTarget(),
            "N" : new NoTagFilter("Robotic"),
            "F" : new FormEntity(),
            "G" : new GrabRandomCreature(),
            "O" : new AssimilateCaste("SAINTLY"),
            "A" : new AssimilationExtender(),
            "P" : new TargetAllAffected(),
            "H" : new HasTagFilter("Robotic"),
            "X" : new ShowEffects(),
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
    "EpsilonLink" : {
        0 : "T.EWN",
        1 : "DAF..", 
        2 : "IAC..",
        3 : "CCC..",
        4 : ".....",
        "keys" : {
            "T" : new TriggerWatch("MoveFunction"),
            "D" : new DirectionFromMotion(),
            "F" : new FormDir(),
            "I" : new DirInverter(),
            "A" : new AssimilationExtender(),
            "E" : new FormEntity(new SoulLink("EpsilonTail1")),
            "W" : new WarpAwayClose(),
            "C" : new Connector(),
            "N" : new RadioBroadcaster("SLITHER1"),
        }

    },
    "Tail1" : {
        0 : "T.EWN",
        1 : "DAF..", 
        2 : "IAC..",
        3 : "CCC..",
        4 : ".....",
        "keys" : {
            "T" : new RadioReceiver("SLITHER1"),
            "D" : new DirectionFromMotion(),
            "F" : new FormDir(),
            "I" : new DirInverter(),
            "A" : new AssimilationExtender(),
            "E" : new FormEntity(new SoulLink("EpsilonTail2")),
            "W" : new WarpAwayClose(),
            "C" : new Connector(),
            "N" : new RadioBroadcaster("SLITHER2"),
        }
    },
    "Tail2" : {
        0 : "T.EWN",
        1 : "DAF..", 
        2 : "IAC..",
        3 : "CCC..",
        4 : ".....",
        "keys" : {
            "T" : new RadioReceiver("SLITHER2"),
            "D" : new DirectionFromMotion(),
            "F" : new FormDir(),
            "I" : new DirInverter(),
            "A" : new AssimilationExtender(),
            "E" : new FormEntity(new SoulLink("EpsilonTail3")),
            "W" : new WarpAwayClose(),
            "C" : new Connector(),
            "N" : new RadioBroadcaster("SLITHER3"),
        }
    },
    "Tail3" : {
        0 : "T.EW.",
        1 : "DAF..", 
        2 : "IAC..",
        3 : "CCC..",
        4 : ".....",
        "keys" : {
            "T" : new RadioReceiver("SLITHER3"),
            "D" : new DirectionFromMotion(),
            "F" : new FormDir(),
            "I" : new DirInverter(),
            "A" : new AssimilationExtender(),
            "E" : new FormEntity(new SoulLink("EpsilonTail4")),
            "W" : new WarpAwayClose(),
            "C" : new Connector(),
        }
    },
    "Terminal" : {
        0 : "MT.NW",
        1 : "O.TM1",
        2 : "A2.3D",
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
            "M" : new MoveFunction(),
            "T" : new RadioBroadcaster("EON"),
        }
    },
}