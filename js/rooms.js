var keytile = {
    "W" : "Wall",
    "." : Floor,
    "E" : "Airlock",
    "#" : "Wall",
    "A" : Floor,
    "T" : "TermiWall",
    "," : Floor,
    "R" : "RoseWall",
    "n" : "WellWall",
    "s" : "WellWall",
    "e" : "WellWall",
    "w" : "WellWall",
    "o" : "HoloStabilizer",
    "ç" : "DimensionWarp",
    "V" : "AirlockS",
    "^" : "AirlockN",
    ">" : "AirlockE",
    "<" : "AirlockW",
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
    "O" : TriangleFaith,
    "T" : TCross,
    "A" : SpawnRoom,
    "N" : AnnounceCorridor,
    "L" : StareL,
    "R" : StareR,
}

const worldMaps = {
    "Epsilon" : {
        0 : "....V",
        1 : "..W..",
        2 : "..B..",
        3 : "..A..",
        4 : "..E..",
        "keys" : {
            "W" : "AttunementChamber",
            "E" : "EntertainAlpha",
            "A" : "EpsilonApex",
            "B" : "BooleanChoice",
            "V" : "VileMarket"
        }
    }
}

var genstruct = {
    "WorldSeed" : {
        0 : "E.E..",
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
    "AttunementChamber" : {
        0 : ".....",
        1 : "..C..",
        2 : "..V..",
        3 : "..W..",
        4 : ".....",
        keys: {
            "C" : SoulCage,
            "W" : WorldSeed,
            "V" : EmptyCorridor,
            "." : VoidRoom,
        },
    },
    "BooleanChoice" : {
        0 : "..C..",
        1 : ".B...",
        2 : ".....",
        3 : ".....",
        4 : "..C..",
        keys: {
            "C" : SoulCage,
            "B" : BooleanChoice,
            "." : VoidRoom,
        },
    },
    "VileCage" : {
        0 : "S.VS.",
        1 : "..V..",
        2 : "HHCCH",
        3 : "S.VS.",
        4 : "..V..",
        keys: {
            "C" : SoulCage,
            "S" : VileCage,
            "." : VoidRoom,
            "H" : EmptyCorridor,
            "V" : EmptyCorridor
        },
    },
    "VileMarket" : {
        0 : "..V..",
        1 : "..V..",
        2 : "HHC..",
        3 : ".....",
        4 : ".....",
        keys: {
            "C" : SoulCage,
            "." : VoidRoom,
            "H" : EmptyCorridor,
            "V" : EmptyCorridor
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
        0 : "TTTTETTTT",
        1 : "T.......T",
        2 : "T.......T",
        3 : "T.......T",
        4 : "T.......T",
        5 : "T...t...T",
        6 : "T.......T",
        7 : "T...q...T",
        8 : "TTTTTTTTT",
        "tags": [],
        "creatures" : {
            "t" : "Terminal",
            "q" : "Weaver"
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
    "ApiaristCross" : {
        0 : "####E####",
        1 : "#Wf...fW#",
        2 : "#ff...ff#",
        3 : "#..f.f..#",
        4 : "E...4...E",
        5 : "#..f.f..#",
        6 : "#ff...ff#",
        7 : "#Wf...fW#",
        8 : "####E####",
        "tags": ["randomgen"],
        "creatures" : {
            "f" : "Apiarist",
            "4" : "FourScanner",
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
        4 : "E..WrW..E",
        5 : "#..WWW..#",
        6 : "#.......#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen","randomflip"],
        "creatures" : {
            "r" : "Scarab",
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
    "BooleanChoice" : {
        0:  ".############E############.",
        1:  "##.......................##",
        2:  "#.........................#",
        3:  "#......RVR.......RVR......#",
        4:  "#.....WW.WW.....WW.WW.....#",
        5:  "#.....r...l.....r...l.....#",
        6:  "#.....WW.WW.....WW.WW.....#",
        7:  "#......R^R.......R^R......#",
        8:  "#........S.......O........#",
        9:  "#.........................#",
        10: "#.........................#",
        11: "#..WrW...............WlW..#",
        12: "#.RW.WRA............RW.WR.#",
        13: "#.>...<......6......>...<.#",
        14: "#.RW.WR............ARW.WR.#",
        15: "#..WlW...............WrW..#",
        16: "#.........................#",
        17: "#.........................#",
        18: "#........F.......A........#",
        19: "#......RVR.......RVR......#",
        20: "#.....WW.WW.....WW.WW.....#",
        21: "#.....r...l.....r...l.....#",
        22: "#.....WW.WW.....WW.WW.....#",
        23: "#......R^R.......R^R......#",
        24: "#.........................#",
        25: "##.......................##",
        26: ".############E############.",
        "tags" : ["randomgen"],
        "creatures" : {
            "r" : "Wall",
            "l" : "Wall",
            "6" : "SixfoldIdol",
            "S" : "SaintlyStarterHologram",
            "O" : "OrderedStarterHologram",
            "F" : "FeralStarterHologram",
            "A" : "ArtisticStarterHologram",
        },
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
        2 : "#...1....",
        3 : "#...2....",
        4 : "E...3....",
        5 : "#...4....",
        6 : "#...5....",
        7 : "#........",
        8 : "#........",
        "tags": ["randomgen"],
        "creatures" : {
            "1" : "EpsilonHead",
            "2" : "EpsilonTail1",
            "3" : "EpsilonTail2",
            "4" : "EpsilonTail3",
            "5" : "EpsilonTail4",
        },
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
        6 : "A#y...j#A",
        7 : "A##.,.##A",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
        "creatures" : {
            "ANY" : "ElectroCoil",
        },
    },
    "BouncyHall" : {
        0 : "AA##E##AA",
        1 : "A##.,.##A",
        2 : "A#a.#.f#A",
        3 : "A#b...g#A",
        4 : "A#c.#.h#A",
        5 : "A#d...i#A",
        6 : "A#y.#.j#A",
        7 : "A##.,.##A",
        8 : "AA##E##AA",
        "tags": ["randomgen","randomflip"],
        "vertical" : true,
        "creatures" : {
            "ANY" : "BouncyBall",
        },
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
    "AttractPole" : {
        0 : "AAA#E#AAA",
        1 : "AA#W.W#AA",
        2 : "A#W...W#A",
        3 : "#W.....W#",
        4 : "E...p...E",
        5 : "#W.....W#",
        6 : "A#W...W#A",
        7 : "AA#W.W#AA",
        8 : "AAA#E#AAA",
        "tags": ["randomgen"],
        "creatures" : {
            "p" : "AttractPole"
        }
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
    "VileCage" : {
        0:  "##################",
        1:  "#................#",
        2:  "#................#",
        3:  "#................#",
        4:  "#................#",
        5:  "#................#",
        6:  "#................#",
        7:  "#................#",
        8:  "#................#",
        9:  "#########........#",
        10: "........#........#",
        11: "........#........#",
        12: "........#........#",
        13: "........#........#",
        14: "........#........#",
        15: "........#........#",
        16: "........#........#",
        17: "........##########",
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