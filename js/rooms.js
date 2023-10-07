var keytile = {
    "W" : "Wall",
    "." : Floor,
    "E" : Airlock,
    "#" : "Wall",
    "A" : RealityWall,
    "T" : TermiWall,
    "t" : TermiExit,
    "," : TrueFloor,
    "M" : Mobilizer,
    "~" : Goop,
    "R" : RoseWall,
    "P" : Plate,
    "n" : CageWall,
    "s" : CageWall,
    "e" : CageWall,
    "w" : CageWall,
    "o" : "HoloStabilizer",
    "ç" : CenterTeleport,
    "H" : HypnoticProjector,
    "|" : Window,
    "a" : Airlock,
    "V" : Airlock,
    "^" : Airlock,
    ">" : Airlock,
    "<" : Airlock,
}

var keyroom = {
    "G" : EmptyFaith,
    "E" : EmptyFaith,
    "P" : PlateGenerator,
    "B" : SoulCage,
    "W" : WorldSeed,
    "." : VoidRoom,
    "H" : NarrowFaith,
    "V" : NarrowFaith,
    "S" : EmptyFaith,
    "s" : BigRoomVoid,
    "e" : BigRoomVoid,
    "w" : BigRoomVoid,
    "O" : TriangleFaith,
    "1" : Tele1,
    "2" : Tele2,
    "3" : Tele3,
    "4" : Tele4,
    "5" : Tele5,
    "6" : Tele6,
    "T" : TCross,
    "A" : SpawnRoom,
    "N" : AnnounceCorridor,
    "L" : StareL,
    "R" : StareR,
}

const worldMaps = {
    "Epsilon" : {
        0 : "..W..",
        1 : "..A..",
        2 : "..E..",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "W" : "WorldSeed",
            "E" : "EntertainAlpha",
            "A" : "EpsilonApex",
        }
    }
}

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
    "Unaffected" : {
        0 : ".....",
        1 : ".....",
        2 : "..U..",
        3 : ".....",
        4 : ".....",
        "keys" : {
            "U" : new UnaffectedTag(),
        }
    },
    "OrderedStarter" : {
        0 : "TMDBW",
        1 : "....F",
        2 : "EPN.E",
        3 : "A.R.X",
        4 : "WKINS",
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
    "Singularity" : {
        0 : "EEEEA",
        1 : "E...W",
        2 : "EPN.K",
        3 : "..R..",
        4 : "..I..",
        "keys" : {
            "W" : new WarpCloseAway(),
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
        3 : ".D...",
        4 : ".....",
        "keys" : {
            "R" : new TriggerWatch("MoveFunction"),
            "A" : new EgoForm(),
            "D" : new DamageDealer(1),
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
        0 : "MTMNW",
        1 : "O...1",
        2 : "A2R3D",
        3 : "4...E",
        4 : "SsMTM",
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

var genstruct = {
    "WorldSeed" : {
        0 : "..E..",
        1 : ".....",
        2 : "E.W.E",
        3 : "V...V",
        4 : "E...E",
        keys: {
            "E" : EmptyFaith,
            "C" : SoulCage,
            "W" : WorldSeed,
            "H" : NarrowFaith,
            "V" : NarrowFaith,
            "M" : EmptyFaith,
            "." : VoidRoom,
        },
    },
    "EntertainAlpha" : {
        0 : "..E..",
        1 : "..V..",
        2 : "EHCHE",
        3 : "..V..",
        4 : "..E..",
        keys: {
            "E" : EmptyFaith,
            "C" : SoulCage,
            "W" : WorldSeed,
            "H" : NarrowFaith,
            "V" : NarrowFaith,
            "M" : EmptyFaith,
            "." : VoidRoom,
        },
    },
    "Facility" : {
        0 : "GHEHTHEHG",
        1 : "V.V.E.V.V",
        2 : "V.V...V.V",
        3 : "V.E.G.E.V",
        4 : "V...V...V",
        5 : "EHL.B.RHE",
        6 : "V...P...V",
        7 : "GHL.N.RHG",
        8 : "....A....",
        keys: {
            "G" : EmptyFaith,
            "E" : EmptyFaith,
            "P" : PlateGenerator,
            "B" : SoulCage,
            "W" : WorldSeed,
            "." : VoidRoom,
            "H" : NarrowFaith,
            "V" : NarrowFaith,
            "S" : EmptyFaith,
            "s" : BigRoomVoid,
            "e" : BigRoomVoid,
            "w" : BigRoomVoid,
            "O" : TriangleFaith,
            "1" : Tele1,
            "2" : Tele2,
            "3" : Tele3,
            "4" : Tele4,
            "5" : Tele5,
            "6" : Tele6,
            "T" : TCross,
            "A" : SpawnRoom,
            "N" : AnnounceCorridor,
            "L" : StareL,
            "R" : StareR,
        }
    },
    "Epsilon" : {
        0 : ".G.....TT",
        1 : "GCSHZH12T", // epsilon in top right, consumes the treadmill scarabs
        2 : "....V.34.",
        3 : "....V..V.",
        4 : "FHRHPHHZ.", //"hacker" at the centre
        5 : "V.V.V..V.", // factories produce axioms, research tests to see if they are safe
        6 : "XHWHR..S.", // malfunction room accumulates dangerous specimen
        7 : "V.V.V..CG", // security checkpoints lead into the production sector
        8 : "WHXHA..G.", // X checkpoints detect harmonic intrusions
        keys: {
            W: SoulCage,
            A: SpawnRoom, //delete
            V: NarrowFaith,
            H: NarrowFaith,
            X: EmptyFaith,
            F: EmptyFaith,
            R: EmptyFaith,
            P: EmptyFaith,
            G: EmptyFaith,
            C: EmptyFaith,
            S: EmptyFaith,
            Z: EmptyFaith, //zap the scarabs
            T: EmptyFaith,
            M: EmptyFaith, //malfunction
            1: Epsilon1,
            2: Epsilon2,
            3: Epsilon3,
            4: Epsilon4,
            ".": VoidRoom,
        }
    }
}

// anisychia should be natural selection

var rooms = {
    "Tutorial" : {
        0 : "TTTTTTTTT",
        1 : "T.......T",
        2 : "T.......T",
        3 : "T.......T",
        4 : "T.......T",
        5 : "T.......T",
        6 : "T.......T",
        7 : "T.......T",
        8 : "TTTTTTTTT",
        "tags": [],
    },
    "Seed" : {
        0 : "TTTTTTTTT",
        1 : "T.......T",
        2 : "T..nnn..T",
        3 : "T.woooe.T",
        4 : "T.woçoe.T",
        5 : "T.woooe.T",
        6 : "T..sss..T",
        7 : "T...t...T",
        8 : "TTTTTTTTT",
        "tags": [],
        "creatures" : {
            "t" : "Terminal",
        }
    },
    "Void" : {
        0 : "AAAAAAAAA",
        1 : "AAAAAAAAA",
        2 : "AAAAAAAAA",
        3 : "AAAAAAAAA",
        4 : "AAAAAAAAA",
        5 : "AAAAAAAAA",
        6 : "AAAAAAAAA",
        7 : "AAAAAAAAA",
        8 : "AAAAAAAAA",
        "tags": [],
    },
    "Tele5" : {
        0 : "ooooooooo",
        1 : "ooooooooo",
        2 : "ooooooooo",
        3 : "ooooooooo",
        4 : "ooooooooo",
        5 : "ooooooooo",
        6 : "ooooooooo",
        7 : "sssssssss",
        8 : "####E####",
        "tags": [],
    },
    "Tele4" : {
        0 : "AAAAAAA#w",
        1 : "AAAAAAA#w",
        2 : "AAAAAAA#w",
        3 : "AAAAAAA#w",
        4 : "AAAAAAA#w",
        5 : "AAAAAAA#w",
        6 : "AAAAAAA#w",
        7 : "AAAAAAA#.",
        8 : "AAAAAAA##",
        "tags": [],
    },
    "Tele6" : {
        0 : "e#AAAAAAA",
        1 : "e#AAAAAAA",
        2 : "e#AAAAAAA",
        3 : "e#AAAAAAA",
        4 : "e#AAAAAAA",
        5 : "e#AAAAAAA",
        6 : "e#AAAAAAA",
        7 : ".#AAAAAAA",
        8 : "##AAAAAAA",
        "tags": [],
    },
    "Tele3" : {
        0 : "AAAAAAAAA",
        1 : "AAAAAAAAA",
        2 : "AAAAAAAAA",
        3 : "AAAAAAAAA",
        4 : "AAAAAAAAA",
        5 : "##AAAAAAA",
        6 : ".#AAAAAAA",
        7 : "e#AAAAAAA",
        8 : "e#AAAAAAA",
        "tags": [],
    },
    "Tele1" : {
        0 : "AAAAAAAAA",
        1 : "AAAAAAAAA",
        2 : "AAAAAAAAA",
        3 : "AAAAAAAAA",
        4 : "AAAAAAAAA",
        5 : "AAAAAAA##",
        6 : "AAAAAAA#.",
        7 : "AAAAAAA#w",
        8 : "AAAAAAA#w",
        "tags": [],
    },
    "Tele2" : {
        0 : "AAAAAAAAA",
        1 : "AAAAAAAAA",
        2 : "AAAAAAAAA",
        3 : "AAAAAAAAA",
        4 : "AAAAAAAAA",
        5 : "#########",
        6 : "nnnnnnnnn",
        7 : "ooooooooo",
        8 : "ooooooooo",
        "tags": [],
    },
    "Standard" : {
        0 : "####E####",
        1 : "#...,...#",
        2 : "#.......#",
        3 : "#.......#",
        4 : "E,.....,E",
        5 : "#.......#",
        6 : "#.......#",
        7 : "#...,...#",
        8 : "####E####",
        "tags": ["randomgen","randomwall"],
    },
    "Empty" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.......#",
        3 : "#.......#",
        4 : "E.......E",
        5 : "#.......#",
        6 : "#.......#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "CatsCross" : {
        0 : "####E####",
        1 : "#Wf...fW#",
        2 : "#ff...ff#",
        3 : "#...f...#",
        4 : "E..fWf..E",
        5 : "#...f...#",
        6 : "#ff...ff#",
        7 : "#Wf...fW#",
        8 : "####E####",
        "tags": ["randomgen"],
        "creatures" : {
            "f" : "Felidol",
        }
    },
    "ScarabFactory" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.......#",
        3 : "#.......#",
        4 : "E.......E",
        5 : "#..WfW..#",
        6 : "#..WWW..#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "creatures" : {
            "f" : "Weaver",
        }
    },
    "ScarabSample" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.......#",
        3 : "#..WWW..#",
        4 : "E..WsW..E",
        5 : "#..WWW..#",
        6 : "#.......#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "creatures" : {
            "s" : "Scarab",
        }
    },
    "ScarabWaypoint" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#..RVR..#", //replace with danger signs
        3 : "#.WW.WW.#",
        4 : "E.r...l.E",
        5 : "#.WW.WW.#",
        6 : "#..R^R..#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "creatures" : {
            "ANY" : "Apiarist",
        },
        "marks" : {
            "l" : "ProgramThis",
            "r" : "LinkHere",
        }
    },
    "Garnison" : {
        0 : "####E####",
        1 : "#ggg.ggg#",
        2 : "#g.....g#",
        3 : "#g.ggg.g#",
        4 : "E..gWg..E",
        5 : "#g.ggg.g#",
        6 : "#g.....g#",
        7 : "#ggg.ggg#",
        8 : "####E####",
        "tags": ["randomgen"],
        "creatures" : {
            "g" : "Slug",
        }
    },
    "Epsilon1" : {
        0 : "####E####",
        1 : "#........",
        2 : "#...e....",
        3 : "#...a....",
        4 : "E...b....",
        5 : "#...c....",
        6 : "#...d....",
        7 : "#........",
        8 : "#........",
        "tags": ["randomgen"],
        "creatures" : {
            "e" : "EpsilonHead",
            "a" : "EpsilonTail1",
            "b" : "EpsilonTail2",
            "c" : "EpsilonTail3",
            "d" : "EpsilonTail4",
        }
    },
    "Epsilon2" : {
        0 : "####E####",
        1 : "........#",
        2 : "........#",
        3 : "........#",
        4 : "........E",
        5 : "........#",
        6 : "........#",
        7 : "........#",
        8 : "........#",
        "tags": ["randomgen"],
    },
    "Epsilon4" : {
        0 : "........#",
        1 : "........#",
        2 : "........#",
        3 : "........#",
        4 : "........E",
        5 : "........#",
        6 : "........#",
        7 : "........#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "Epsilon3" : {
        0 : "#........",
        1 : "#........",
        2 : "#........",
        3 : "#........",
        4 : "E........",
        5 : "#........",
        6 : "#........",
        7 : "#........",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "StareL" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.......|",
        3 : "#.......|",
        4 : "E.......|",
        5 : "#.......|",
        6 : "#.......|",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "StareR" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "|.......#",
        3 : "|.......#",
        4 : "|.......E",
        5 : "|.......#",
        6 : "|.......#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "HarmonicTransport" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#..nnn..#",
        3 : "#.woooe.#",
        4 : "E.woçoe.E",
        5 : "#.woooe.#",
        6 : "#..sss..#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "VileTransport" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#..nnn..#",
        3 : "#.woooe.#",
        4 : "E.woçoe.E",
        5 : "#.woooe.#",
        6 : "#..sss..#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen"],
        "creatures" : {
            "f" : "Programmer",
        },
        "marks" : {
            "f" : "LinkToWaypoint",
        }
    },
    "Cage1" : {
        0 : "####E####",
        1 : "#.nnnnn.#",
        2 : "#woooooe#",
        3 : "#woooooe#",
        4 : "EwoooooeE",
        5 : "#woooooe#",
        6 : "#woooooe#",
        7 : "#.sssss.#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "EmptyNoExits" : {
        0 : "#########",
        1 : "#.......#",
        2 : "#.......#",
        3 : "#.......#",
        4 : "#.......#",
        5 : "#.......#",
        6 : "#.......#",
        7 : "#.......#",
        8 : "#########",
        "tags": ["randomgen"],
    },
    "Triangle" : {
        0 : "####E##AA",
        1 : "#..W.WW#A",
        2 : "#....W.W#",
        3 : "#......W#",
        4 : "E.......E",
        5 : "#......W#",
        6 : "#....W.W#",
        7 : "#..W,WW#A",
        8 : "####E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Announce" : {
        0 : "AA##E##AA",
        1 : "AA#.,.#AA",
        2 : "AA|...|AA",
        3 : "AA|...|AA",
        4 : "AA|.h.|AA",
        5 : "AA|...|AA",
        6 : "AA|...|AA",
        7 : "AA#.,.#AA",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
        "creatures" : {
            "h" : "Hologram",
        }
    },
    "Narrow" : {
        0 : "AA##E##AA",
        1 : "AA#.,.#AA",
        2 : "AA#...#AA",
        3 : "AA#...#AA",
        4 : "AA#...#AA",
        5 : "AA#...#AA",
        6 : "AA#...#AA",
        7 : "AA#.,.#AA",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "LaserHall" : {
        0 : "AA##E##AA",
        1 : "A##.,.##A",
        2 : "A#a...f#A",
        3 : "A#b...g#A",
        4 : "A#c...h#A",
        5 : "A#d...i#A",
        6 : "A#e...j#A",
        7 : "A##.,.##A",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
        "creatures" : {
            "ANY" : "Snail",
        },
        "marks" : {
            "a" : [0,"f"],
            "b" : [1,"g"],
            "c" : [2,"h"],
            "d" : [3,"i"],
            "e" : [4,"j"],
            "f" : "f",
            "g" : "g",
            "h" : "h",
            "i" : "i",
            "j" : "j",
        }
    },
    "TCross" : {
        0 : "AAAAAAAAA",
        1 : "AAAAAAAAA",
        2 : "#########",
        3 : "#.......#",
        4 : "E.......E",
        5 : "#.......#",
        6 : "###...###",
        7 : "AA#.,.#AA",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Bridge" : {
        0 : "AA##E##AA",
        1 : "A#W...#AA",
        2 : "A#W...#AA",
        3 : "A#...W#AA",
        4 : "A#...W#AA",
        5 : "A#...W#AA",
        6 : "A#W...#AA",
        7 : "A#W...#AA",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Contract" : {
        0 : "AA##E##AA",
        1 : "A#W...#AA",
        2 : "A#W...#AA",
        3 : "AA#W.W#AA",
        4 : "AA#W.W#AA",
        5 : "AA#W.W#AA",
        6 : "A#W...#AA",
        7 : "A#W...#AA",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Dilate" : {
        0 : "AA##E##AA",
        1 : "A#W...W#A",
        2 : "A#W...W#A",
        3 : "A#.....#A",
        4 : "A#.....#A",
        5 : "A#.....#A",
        6 : "A#W...W#A",
        7 : "A#W...W#A",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Blox" : {
        0 : "####E####",
        1 : "#...,...#",
        2 : "#.WW.WW.#",
        3 : "#.WW.WW.#",
        4 : "E,.....,E",
        5 : "#.WW.WW.#",
        6 : "#.WW.WW.#",
        7 : "#...,...#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "Storage" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "|.......|",
        3 : "|.......|",
        4 : "|.......|",
        5 : "|.......|",
        6 : "|.......|",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "Star" : {
        0 : "AAA#E#AAA",
        1 : "AA#W.W#AA",
        2 : "A#W...W#A",
        3 : "#W.....W#",
        4 : "E.......E",
        5 : "#W.....W#",
        6 : "A#W...W#A",
        7 : "AA#W.W#AA",
        8 : "AAA#E#AAA",
        "tags": ["randomgen"],
    },
    "Pipes" : {
        0 : "####E####",
        1 : "#...,...#",
        2 : "#WWW.WWW#",
        3 : "#.......#",
        4 : "E.WWWWW.E",
        5 : "#.......#",
        6 : "#WWW.WWW#",
        7 : "#...,...#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Hide" : {
        0 : "####E####",
        1 : "#...,.W.#",
        2 : "#.W...W.#",
        3 : "#.W...W.#",
        4 : "E,W...W,E",
        5 : "#.W...W.#",
        6 : "#.W...W.#",
        7 : "#.W.,...#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "SmallSix" : {
        0 : "####E####",
        1 : "#...,...#",
        2 : "#..W.W..#",
        3 : "#.......#",
        4 : "E,W...W,E",
        5 : "#.......#",
        6 : "#..W.W..#",
        7 : "#...,...#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Capture" : {
        0 : "####E####",
        1 : "#...,.W.#",
        2 : "#.WW..W.#",
        3 : "#.W...W.#",
        4 : "E,W...W,E",
        5 : "#.W...W.#",
        6 : "#.W..WW.#",
        7 : "#.W.,...#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "SoulBank" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.WLLLW.#",
        3 : "#.L...L.#",
        4 : "E.L...L.E",
        5 : "#.L...L.#",
        6 : "#.WLLLW.#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
    },
    "Epsilon" : {
        0:  "####E########E####",
        1:  "##.#.....#.#....##",
        2:  "#................#",
        3:  "#...............##",
        4:  "E...##......##...E",
        5:  "##..#M......M#...#",
        6:  "#................#",
        7:  "##...............#",
        8:  "#................#",
        9:  "#................#",
        10: "#...............##",
        11: "#................#",
        12: "#...#M......M#..##",
        13: "E...##......##...E",
        14: "##...............#",
        15: "#................#",
        16: "##...#.#......#.##",
        17: "####E########E####",
        "tags" : ["randomgen"],
    },
    "GrandHall" : {
        0:  "AA##E##AAAA##E##AA",
        1:  "AA#...#AAAA#...#AA",
        2:  "###...#AAAA#...###",
        3:  "#.....#AAAA#.....#",
        4:  "E.....#AAAA#.....E",
        5:  "#.....#AAAA#.....#",
        6:  "###...######...###",
        7:  "AA#............#AA",
        8:  "AA#.....WW.....#AA",
        9:  "AA#.....WW.....#AA",
        10: "AA#............#AA",
        11: "###...######...###",
        12: "#.....#AAAA#.....#",
        13: "E.....#AAAA#.....E",
        14: "#.....#AAAA#.....#",
        15: "###...#AAAA#...###",
        16: "AA#...#AAAA#...#AA",
        17: "AA##E##AAAA##E##AA",
        "tags" : ["randomgen"],
    },
    "Template" : {
        0:  "....E........E....",
        1:  "..................",
        2:  "..................",
        3:  "..................",
        4:  "E................E",
        5:  "..................",
        6:  "..................",
        7:  "..................",
        8:  "..................",
        9:  "..................",
        10: "..................",
        11: "..................",
        12: "..................",
        13: "E................E",
        14: "..................",
        15: "..................",
        16: "..................",
        17: "....E........E....",
        "tags" : ["randomgen"],
    },
    "Beeg" : {
        // this gets autocompleted in world.js
        "tags" : ["randomgen"],
    },
    "Sixfold" : {
        0:  "####E########E####",
        1:  "#................#",
        2:  "#................#",
        3:  "#....##....##....#",
        4:  "E....##....##....E",
        5:  "#................#",
        6:  "#................#",
        7:  "#................#",
        8:  "#..##........##..#",
        9:  "#..##........##..#",
        10: "#................#",
        11: "#................#",
        12: "#................#",
        13: "E....##....##....E",
        14: "#....##....##....#",
        15: "#................#",
        16: "#................#",
        17: "####E########E####",
        "tags" : ["randomgen"],
    },
    "Circus" : {
        0: "RRRRRRRRAARRRRRRRR",
        1: "RAAAAARAAAARAAAAAR",
        2: "RARRRRRRRRRRRRRRAR",
        3: "RAR~~~~~~~~~~~~RAR",
        4: "RAR~~~~~..~~~~~RAR",
        5: "RAR~~..~..~..~~RAR",
        6: "RAR~~........~~RAR",
        7: "RAR~~~......~~~RAR",
        8: "AAR~..........~RAA",
        9: "AAR~..........~RAA",
        10:"RAR~~~......~~~RAR",
        11:"RAR~~........~~RAR",
        12:"RAR~~..~..~..~~RAR",
        13:"RAR~~~~~..~~~~~RAR",
        14:"RAR~~~~~~~~~~~~RAR",
        15:"RARRRRR~~~~RRRRRAR",
        16:"RAAAAAR~~~~RAAAAAR",
        17:"RRRRRRRRRRRRRRRRRR",
        "tags" : ["randomgen"],
    },
    "Rogue" : {
        0:  "AAA#E#AAAA###E####",
        1:  "AAA#.#AAAA#......#",
        2:  "AAA#.#AAAA#......#",
        3:  "####.#AAAA#......#",
        4:  "E....#AAAA#......E",
        5:  "####.#AAAA####.###",
        6:  "AAA#.#AAAAAAA#.#AA",
        7:  "A###.####AAAA#.#AA",
        8:  "A#......######.#AA",
        9:  "A#.............#AA",
        10: "A#......######.#AA",
        11: "A###.####A####.###",
        12: "####.#AAAA#......#",
        13: "E....#AAAA#......E",
        14: "####.#AA####.#####",
        15: "AAA#.#AA#.....#AAA",
        16: "AAA#.#AA#.....#AAA",
        17: "AAA#E#AA#####E#AAA",
        "tags" : ["randomgen","randomflip"],
    },
}