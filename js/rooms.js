var keytile = {
    "W" : Wall,
    "." : Floor,
    "E" : BExit,
    "#" : NoBreakWall,
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
    "o" : CageContainer,
    "H" : HypnoticProjector,
}

var keyroom = {
    "G" : EmptyFaith,
    "P" : PlateGenerator,
    "B" : SoulCage,
    "W" : WorldSeed,
    "." : VoidRoom,
    "H" : NarrowFaith,
    "V" : NarrowFaith,
    "S" : EmptyFaith,
}

//spawns: N - W - E - S

var genstruct = {
    "Facility" : {
        0 : "GHHHGHHHG",
        1 : "V...V...V",
        2 : "V...V...V",
        3 : "V...V...V",
        4 : "V.BHWHS.V",
        5 : "V...V...V",
        6 : "V...P...V",
        7 : "V.......V",
        8 : "GHHHHHHHG",
    }
}

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
        4 : "E...H...E",
        5 : "T.......T",
        6 : "T.......T",
        7 : "T.......T",
        8 : "TTTTETTTT",
        "tags": [],
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
    "Cage2" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.WnnnW.#",
        3 : "#.woooe.#",
        4 : "E.woooe.E",
        5 : "#.woooe.#",
        6 : "#.WsssW.#",
        7 : "#.......#",
        8 : "####E####",
        "tags": ["randomgen"],
    },
    "Cage1" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.......#",
        3 : "#..WnW..#",
        4 : "E..woe..E",
        5 : "#..WsW..#",
        6 : "#.......#",
        7 : "#.......#",
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
    "Corners" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#.WW.WW.#",
        3 : "#.WP.PW.#",
        4 : "E.......E",
        5 : "#.WP.PW.#",
        6 : "#.WW.WW.#",
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