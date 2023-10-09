basic = ["SERENE","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
const soulSlotNames = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
basicspire = ["VILES","FERALS","UNHINGEDS","ARTISTICS","ORDEREDS","SAINTLYS"];
smod = ["Alacrity","Selective","Thrusters","Hover","Focus"];
modulators = ["Alacrity","Selective","Thrusters","Hover","Focus"];

const floors = ["WorldSeed", "EpsilonApex", "EntertainAlpha"]; // vox?
const floorLinks = {};
const floorStyles = {
    "WorldSeed" : "Vault",
    "EpsilonApex" : "Blocks",
    "EntertainAlpha" : "Vault",
};

// DO NOT USE THIS AS A LIST IT GETS WIPED EACH TIME
const casteNodes = ["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"];

let excludeloot = {
    "FORM" : ["EPSILON"],
    "FUNCTION" : [],
    "CONTINGENCY" : [],
    "MUTATOR" : [],
};

const speciesData = {
    "Terminal" : {
        "sprite" : 0,
        "hp" : 3,
        "souls" : {
            "SAINTLY" : "Terminal",
            "ORDERED" : "OrderedStarter",
            //"ARTISTIC" : "Singularity"
        }
    },
    "Programmer" : {
        "sprite" : 49,
        "hp" : 2,
        "souls" : {
            "VILE" : "Programmer",
        }
    },
    "EntropicHusk" : {
        "sprite" : 1,
        "hp" : 0,
        "souls" : {
        },
        "intangible" : true,
    },
    "HoloStabilizer" : {
        "sprite" : 1,
        "hp" : 0,
        "souls" : {
            "ORDERED" : "Unaffected",
        },
        "intangible" : true,
    },
    "DimensionWarp" : {
        "sprite" : 1,
        "hp" : 0,
        "souls" : {
            "ORDERED" : "Unaffected",
        },
        "intangible" : true,
    },
    "WellWall" : {
        "sprite" : 108,
        "hp" : 0,
        "souls" : {
            "ORDERED" : "Unaffected",
        },
        "intangible" : true,
    },
    "Airlock" : {
        "sprite" : 17,
        "hp" : 0,
        "souls" : {
            "ORDERED" : "Airlock",
        },
    },
    "Wall" : {
        "sprite" : 3,
        "hp" : 0,
        "souls" : {
            "ORDERED" : "Unaffected",
        }
    },
    "TermiWall" : {
        "sprite" : 37,
        "hp" : 0,
        "souls" : {
            "ORDERED" : "Unaffected",
        }
    },
    "RoseWall" : {
        "sprite" : 55,
        "hp" : 0,
        "souls" : {
            "ORDERED" : "Unaffected",
        }
    },
    "Apiarist" : {
        "sprite" : 6,
        "hp" : 4,
        "souls" : {
            "ORDERED" : "ScarabHack",
        }
    },
    "EpsilonHead" : {
        "sprite" : 67,
        "hp" : 4,
        "souls" : {
            "ORDERED" : "EpsilonStand",
        }
    },
    "EpsilonTail1" : {
        "sprite" : 68,
        "hp" : 4,
        "souls" : {
            "ORDERED" : "Tail1",
        }
    },
    "EpsilonTail2" : {
        "sprite" : 68,
        "hp" : 4,
        "souls" : {
            "ORDERED" : "Tail2",
        }
    },
    "EpsilonTail3" : {
        "sprite" : 68,
        "hp" : 4,
        "souls" : {
            "ORDERED" : "Tail3",
        }
    },
    "EpsilonTail4" : {
        "sprite" : 68,
        "hp" : 4,
        "souls" : {
            "ORDERED" : "Tail4",
        }
    },
    "Slug" : {
        "sprite" : 29,
        "hp" : 2,
        "souls" : {
            "ORDERED" : "Guard",
        }
    },
    "Scarab" : {
        "sprite" : 76,
        "hp" : 1,
        "souls" : {
            "ORDERED" : "Scarab",
        }
    },
    "Weaver" : {
        "sprite" : 27,
        "hp" : 2,
        "souls" : {
            "ORDERED" : "ScarabSpawner",
        }
    },
}
// A Million Thoughts Forge A Soul
// Forests of Fur Tangled In Claws
// Pulsing Hearts Under Glossy Membranes
// Brushes of Motion Across the Air