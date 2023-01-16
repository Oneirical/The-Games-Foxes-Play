var key = {
    "W" : Wall,
    "." : Floor,
    "E" : MapExit,
    "#" : NoBreakWall,
    "A" : RealityWall,
    "T" : TermiWall,
    "t" : TermiExit,
    "," : TrueFloor,
    "M" : Mobilizer,
}

//spawns: N - W - E - S

var rooms = {
    "Seed" : { //currently unused because it explodes everything
        0 : "TTTTETTTT",
        1 : "T.......T",
        2 : "T.......T",
        3 : "T.......T",
        4 : "E.......E",
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
    "Rogue" : {
        0:  "...#E#....###E####",
        1:  "...#.#....#......#",
        2:  "...#.#....#......#",
        3:  "####.#....#......#",
        4:  "E....#....#......E",
        5:  "####.#....####.###",
        6:  "...#.#.......#.#..",
        7:  ".###.####....#.#..",
        8:  ".#......######.#..",
        9:  ".#.............#..",
        10: ".#......######.#..",
        11: ".###.####AAAA#.#..",
        12: "####.#AAAAAAA#.###",
        13: "E....#..######...E",
        14: "####.#..#......###",
        15: "...#.#..#......#..",
        16: "...#.#..#####.##..",
        17: "...#E#......#E#...",
        "tags" : ["randomgen"],
    },
}