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
    "|" : Window,
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
    "6" : SixfoldStand,
    "T" : TCross,
    "A" : SpawnRoom,
    "N" : AnnounceCorridor,
    "L" : StareL,
    "R" : StareR,
}

var keyspells = {
    "S" : Saintly,
    "O" : Ordered,
    "A" : Artistic,
    "U" : Unhinged,
    "F" : Feral,
    "V" : Vile,
    "." : Empty,
}

var keycreature = {
    "C" : Cage,
    "H" : Hologram,
}

var keyresearch = {
    "<" : "ur",
    ">" : "ul",
    ")" : "dr",
    "L" : "dl",
    "I" : "u",
    "T" : "t",
    "-" : "s",
    "." : ".",
    "+" : "+",
    "K" : "K",
    "Y" : "Y",
    "J" : "J",
}

var spellpatterns = {
    //Saintly
    "EGO" : {
        0: "S",
        "type" : "Form",
    },
    "STEP" : {
        0: "S.S",
        1: ".S.",
        2: ".S.",
        "type" : "Contingency",
    },
    "STOP" : {
        0: ".S",
        1: ".S",
        "type" : "Function",
    },
    "SACRIFICE" : {
        0: "S.",
        1: ".S",
        "type" : "Mutator",
    },

    //Ordered

    "PARACEON" : {
        0: "O",
        "type" : "Function",
    },
    "ASPHA" : {
        0: "..",
        1: "OO",
        "type" : "Function",
    },
    "ABAZON" : {
        0: ".O",
        1: "OO",
        "type" : "Function",
    },
    "CLICK" : {
        0: ".O",
        1: "O.",
        "type" : "Mutator",
    },
    "EPSILON" : {
        0: "OOO",
        1: "OOO",
        2: "OOO",
        "type" : "Form",
    },

    //Artistic

    "GYVJI" : {
        0: "AA",
        1: "..",
        "type" : "Function",
    },
    "ATKDELAY" : {
        0: ".A",
        1: ".A",
        "type" : "Function",
    },

    "ZENORIUM" : {
        0: "...",
        1: "A.A",
        2: ".A.",
        "type" : "Function",
    },
    
    //Unhinged

    "KASHIA" : {
        0: "U.",
        1: ".U",
        "type" : "Function",
    },
    "BEAM" : {
        0: "UU",
        1: "..",
        "type" : "Form",
    },
    "XCROSS" : {
        0: ".U.",
        1: "..U",
        2: ".U.",
        "type" : "Form",
    },
    "JOLTZAZON" : {
        0: "...",
        1: ".U.",
        2: "U.U",
        "type" : "Mutator",
    },

    //Feral

    //Vile

    "SMOOCH" : {
        0: "..",
        1: "VV",
        "type" : "Form",
    },
    "SENET" : {
        0: "VV",
        1: "V.",
        "type" : "Function",
    },
    "RASEL" : {
        0: ".V.",
        1: "..V",
        2: "..V",
        "type" : "Function",
    },
}

let lootPool = {
    "CONTINGENCY" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    },
    "FORM" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    },
    "FUNCTION" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    },
    "MUTATOR" : {
        "S" : [],
        "O" : [],
        "A" : [],
        "U" : [],
        "F" : [],
        "V" : [],
    }
}

var contingencies = [];
var forms = [];
var mutators = [];
var functions = [];
for (let i of Object.keys(spellpatterns)){
    let caste = false;
    for (let x = 0; x<spellpatterns[i][0].length; x++){
        for (let y = 0; y<spellpatterns[i][0].length; y++){
            if (spellpatterns[i][x][y] != "."){
                caste = spellpatterns[i][x][y];
                break;
            }
            if (caste) break;
        }
    }
    lootPool[spellpatterns[i]["type"].toUpperCase()][caste].push(i);
    const equi = {
        "S" : "Saintly",
        "O" : "Ordered",
        "A" : "Artistic",
        "U" : "Unhinged",
        "F" : "Feral",
        "V" : "Vile",
    }
    spellpatterns[i]["caste"] = equi[caste];
    //if (spellpatterns[i]["type"] == "Contingency") contingencies.push(i);
    //else if (spellpatterns[i]["type"] == "Form") forms.push(i);
    //else if (spellpatterns[i]["type"] == "Mutator") mutators.push(i);
    //else if (spellpatterns[i]["type"] == "Function") functions.push(i);
}

var researchpage = {
    
    "Basic" : {
        0 : ".........",
        1 : ".........",
        2 : ".........",
        3 : ".........",
        4 : ".........",
        5 : ".........",
        6 : ".........",
        7 : ".........",
        8 : ".........",
    },
    "Web0" : {
        0 :  "c.............f",
        1 :  ".>-----------<.",
        2 :  ".I...........I.",
        3 :  ".I...........I.",
        4 :  ".I..>-----<..I.",
        5 :  ".I..I.....I..I.",
        6 :  ".I..I.....I..I.",
        7 :  ".I..I.....I..I.",
        8 :  ".I..I.....I..I.",
        9 :  ".a..I.....I..I.",
        10 : ".I..L--T--)..I.",
        11:  ".a.....I.....I.",
        12:  ".I.....I.....I.",
        13:  ".a.....I-----).",
        14:  "...............",
    },
    "Template" : {
        0 :  "...............",
        1 :  "...............",
        2 :  "...............",
        3 :  "...............",
        4 :  "...............",
        5 :  "...............",
        6 :  "...............",
        7 :  "...............",
        8 :  "...............",
        9 :  "...............",
        10:  "...............",
        11:  "...............",
        12:  "...............",
        13:  "...............",
        14:  "...............",
    },
    "Web3" : {//Fundamentals
        0 :  "..a.........c..", //f for fuffypocalypse
        1 :  "..I..cTc....I..",//s for spellcraft
        2 :  "..a...I...m.Kc.",// inhale exhale
        3 :  "..I...I.s-K.I..", // o and m contin and mut
        4 :  "..h...n-K.a-K..",//shattereds and subdueds
        5 :  "..I...I.s-K.I..", // t for structures
        6 :  "k-+-l-o...o.I..",// dreamscape
        7 :  "..I.........d..", // d for deeper still, i for influences
        8 :  "i-f-<.......I..",// paint & seed
        9 :  "I...d...>-i-+-c", 
        10:  "c-b-)...I...I..",//herald
        11:  "..I.....t...c..",
        12:  "..a.....I......",//move
        13:  "..I...r-)......",
        14:  "..z............",//research tree
    },
    "Web2" : {
        0 :  "c.............f",
        1 :  "L-s-m.....m-c-)",
        2 :  "....K-sTs-J....",
        3 :  "f-c-s..I..m-s-s",
        4 :  "..I....f....I..",
        5 :  "..m-f..I..c-f..",
        6 :  "....I..I..I....",
        7 :  "....Ks-a-sJ....",
        8 :  "....I..I..I....",
        9 :  "....m..I..m....",
        10 : ".......f.......",
        11 : ".......I.......",
        12 : "......sYm......",
        13 : "......I.I......",
        14 : "......Lc)......",
    },
    "Web0" : {
        0 :  "C-D----T----T-C",
        1 :  "..I....I....I..",
        2 :  "C-J...>A<...C..",
        3 :  "..I...I.I......",
        4 :  "N-).O-FTU-M.C..",
        5 :  "I......I....I..",
        6 :  "I..k-l-o--T-+-C",
        7 :  "I....I....I.I..",
        8 :  "S..>-f-<..g.n..",
        9 :  "I..I...I..I....",
        10 : "I..i-T-d..H....",
        11 : "I....I.........",
        12 : "L-r..c-b-<.....",
        13 : ".........a.....",
        14 : ".......z-).....",
    },
    "Page0" : {
        0 : "....I....",
        1 : ".>--f--<.",
        2 : ".d.....i.",
        3 : ".L--c--).",
        4 : "....I....",
        5 : "....b--e.",
        6 : "....I....",
        7 : "....a....",
        8 : ".........",
        "links" : {
            "a" : [[]],
            "b" : [["a"]],
            "c" : [["b"]],
            "d" : [["c"]],
            "f" : [["d"],["i"]],
            "e" : [["b"]],
            "i" : [["c"]],
        }
    },
    // a - A Tingling In The Soul (intro)
    // b - The Herald of the Old World (cold storage)
    // c - Containing the Intangible (soul cage)
    // d - Synchronized Daydreaming (world seed)
    // e - Unruly Prey (turbulents)
    // f - Visions of the Old World (visions)
    // g - With Prudence Comes Serenity (security)
    // h - The Song That Stirs Souls (tier 1 harmony)
    "Page1" : {
        0 : ".I.I.I...",
        1 : ".I.iTj...",
        2 : ".K-<I....", // extend from e at some point
        3 : ".f.hI....", // and add e, anyhow... right above d
        4 : ".LT)I....",
        5 : "..L-cTd..",
        6 : ".g--)I...",
        7 : "...aTb...",
        8 : "....I....",
        "links" : {
            "b" : [["<f"]],
            "a" : [["<f"]],
            "c" : [["b"]],
            "d" : [["b"]],
            //"e" : [["d"]],
            "j" : [["c"]],
            "g" : [["c"]],
            "i" : [["c"]],
            "f" : [["c"]],
            "h" : [["c"]],
        }
    },
    // a - Spiritual Sewage (shattered souls)
    // b - The Servitude of Still Minds (subdued souls)
    // c - Wear Beings Like Costumes (spellcasting)
    // d - Estate of Servants' Dreams (subdued souls in cage)
    // e - The Bottomless Dream-Pit (soul cage pattern)
    // f - 
    // g - Reforging Legends Past (spell crafting)
    // h - 
    "Page2" : {
        0 : ".........",
        1 : "....i....",
        2 : "..>-+-<..",
        3 : "..h.f.I..",
        4 : ".>Y<I.g..",
        5 : ".e.dLT)..",
        6 : ".I.I.I...",
        7 : ".a.b.c...",
        8 : ".I.I.I...",
        "links" : {
            "a" : [["<f","<h"]],
            "b" : [["<i"]],
            "c" : [["<j"]],
            "e" : [["a"]],
            "h" : [["e","d"]],
            "d" : [["b"]],
            "g" : [["c"]],
            "f" : [["c"]],
            "i" : [["h","f","g"]],
        }
    },
}

//spawns: N - W - E - S

var genstruct = {
    "Facility1" : {
        0 : "GHHHGHHHG",
        1 : "V...V...V",
        2 : "V...V...V",
        3 : "V..PBS..V",
        4 : "V...W...V",
        5 : "V.......V",
        6 : "V...G...V",
        7 : "6e..V...V",
        8 : "wsHHGHHHG",
    },
    "Facility" : {
        0 : "GHEHTHEHG",
        1 : "V.V.E.V.V",
        2 : "V.V...V.V",
        3 : "V.E.S.E.V",
        4 : "V...W...V",
        5 : "EHL.B.RHE",
        6 : "V...P...V",
        7 : "GHL.N.RHG",
        8 : "....A....",
    }
}

var creaturespawn = {
    "Basic" : {
        0 : ".........",
        1 : ".........",
        2 : ".........",
        3 : ".........",
        4 : ".........",
        5 : ".........",
        6 : ".........",
        7 : ".........",
        8 : ".........",
    },
    "Storage" : {
        0 : ".........",
        1 : ".........",
        2 : ".........",
        3 : ".........",
        4 : "....C....",
        5 : ".........",
        6 : ".........",
        7 : ".........",
        8 : ".........",
    },
    "Announce" : {
        0 : ".........",
        1 : ".........",
        2 : ".........",
        3 : ".........",
        4 : "....H....",
        5 : ".........",
        6 : ".........",
        7 : ".........",
        8 : ".........",
    },
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
        3 : "T..HHH..T",
        4 : "E..HHH..E",
        5 : "T..HHH..T",
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
    "Cage2" : {
        0 : "####E####",
        1 : "#.......#",
        2 : "#..nnn..#",
        3 : "#.woooe.#",
        4 : "E.woooe.E",
        5 : "#.woooe.#",
        6 : "#..sss..#",
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
    "Announce" : {
        0 : "AA##E##AA",
        1 : "AA#.,.#AA",
        2 : "AA|...|AA",
        3 : "AA|...|AA",
        4 : "AA|...|AA",
        5 : "AA|...|AA",
        6 : "AA|...|AA",
        7 : "AA#.,.#AA",
        8 : "AA##E##AA",
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
        2 : "|.WW.WW.|",
        3 : "|.W...W.|",
        4 : "|.......|",
        5 : "|.W...W.|",
        6 : "|.WW.WW.|",
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