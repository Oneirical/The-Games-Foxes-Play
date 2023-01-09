var key = {
    "W" : Wall,
    "F" : Floor,
    "E" : BExit,
    "A" : AbazonWall
}

//spawns: N - W - E - S

var rooms = {
    "Triangle" : {
        0 : "WEWWWWWWW",
        1 : "WFFWWWWWW",
        2 : "WFFFFWWWW",
        3 : "WFFFFFFWW",
        4 : "EFFFFFFFE",
        5 : "WFFFFFFWW",
        6 : "WFFFFWWWW",
        7 : "WFFWWWWWW",
        8 : "WEWWWWWWW",
        "tags": ["randomgen"],
        "exits" : [[1,0],[0,4],[8,4],[1,8]],
    },
    "Narrow" : {
        0 : "AAWWEWWAA",
        1 : "AAWFFFWAA",
        2 : "AAWFFFWAA",
        3 : "AAWFFFWAA",
        4 : "AAEFFFEAA",
        5 : "AAWFFFWAA",
        6 : "AAWFFFWAA",
        7 : "AAWFFFWAA",
        8 : "AAWWEWWAA",
        "tags": ["randomgen"],
        "exits" : [[4,1],[3,4],[5,4],[4,7]],
    }
}