basic = ["SERENE","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
const soulSlotNames = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
basicspire = ["VILES","FERALS","UNHINGEDS","ARTISTICS","ORDEREDS","SAINTLYS"];
smod = ["Alacrity","Selective","Thrusters","Hover","Focus"];
modulators = ["Alacrity","Selective","Thrusters","Hover","Focus"];

const floors = ["AttunementChamber", "EpsilonApex", "EntertainAlpha", "BooleanChoice"]; // vox?
const floorLinks = {};
const floorStyles = {
    "AttunementChamber" : "Vault",
    "EpsilonApex" : "Blocks",
    "EntertainAlpha" : "Vault",
    "BooleanChoice" : "Vault",
};

// DO NOT USE THIS AS A LIST IT GETS WIPED EACH TIME
const casteNodes = ["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"];

let excludeloot = {
    "FORM" : ["EPSILON"],
    "FUNCTION" : [],
    "CONTINGENCY" : [],
    "MUTATOR" : [],
};

const tagSprites = {
    "RealityAnchor" : 20,
    "HarmonicGrace" : 26,
}

const speciesData = {
    "Terminal" : {
        "sprite" : 0,
        "souls" : {
            "SAINTLY" : "Terminal",
            //"ORDERED" : "OrderedStarter",
            //"ARTISTIC" : "Singularity"
            //"FERAL" : "OrderedStarter",
        },
        "tags" : ["RealityAnchor"],
    },
    "Programmer" : {
        "sprite" : 49,
        "souls" : {
            "VILE" : "Programmer",
        }
    },
    "SaintlyStarterHologram" : {
        "sprite" : 39,
        "souls" : {
            "SAINTLY" : "SaintlyStarterHologram",
        }
    },
    "OrderedStarterHologram" : {
        "sprite" : 40,
        "souls" : {
            "ORDERED" : "OrderedStarterHologram",
        }
    },
    "ArtisticStarterHologram" : {
        "sprite" : 41,
        "souls" : {
            "ORDERED" : "ArtisticStarterHologram",
        }
    },
    "FeralStarterHologram" : {
        "sprite" : 42,
        "souls" : {
            "ORDERED" : "FeralStarterHologram",
        }
    },
    "HoloStabilizer" : {
        "sprite" : 1,
        "souls" : {
        },
        "tags" : ["Intangible","Invisible","Unaffected"],
    },
    "DimensionWarp" : {
        "sprite" : 1,
        "souls" : {
            "ORDERED" : "HypnoWell",
        },
        "tags" : ["Intangible","Invisible","Unaffected"],
    },
    "WellWall" : {
        "sprite" : 108,
        "souls" : {
        },
        "tags" : ["Intangible","Unaffected"],
    },
    "Airlock" : {
        "sprite" : 17,
        "souls" : {
            "ORDERED" : "Airlock",
        },
        "tags" : ["Unaffected"],
    },
    "Wall" : {
        "sprite" : 3,
        "souls" : {
        },
        "tags" : ["Unaffected"],
    },
    "TermiWall" : {
        "sprite" : 37,
        "souls" : {
        },
        "tags" : ["Unaffected"],
    },
    "SixfoldIdol" : {
        "sprite" : 36,
        "souls" : {
        },
        "tags" : ["Intangible"],
    },
    "RoseWall" : {
        "sprite" : 55,
        "souls" : {
        },
        "tags" : ["Unaffected"],
    },
    "Apiarist" : {
        "sprite" : 6,
        "souls" : {
            "SAINTLY" : "SwarmPlayerDisabled"
        },
        "tags" : ["Robotic"],
    },
    "FourScanner" : {
        "sprite" : 7,
        "souls" : {
            "ORDERED" : "ScanForPlayer",
        },
        "tags" : ["Robotic"],
    },
    "EpsilonHead" : {
        "sprite" : 67,
        "souls" : {
            "ORDERED" : "EpsilonStand",
        }
    },
    "EpsilonTail1" : {
        "sprite" : 68,
        "souls" : {
            "ORDERED" : "Tail1",
        }
    },
    "EpsilonTail2" : {
        "sprite" : 68,
        "souls" : {
            "ORDERED" : "Tail2",
        }
    },
    "EpsilonTail3" : {
        "sprite" : 68,
        "souls" : {
            "ORDERED" : "Tail3",
        }
    },
    "EpsilonTail4" : {
        "sprite" : 68,
        "souls" : {
            "ORDERED" : "Tail4",
        }
    },
    "Slug" : {
        "sprite" : 29,
        "souls" : {
            "ORDERED" : "SwarmPlayer",
        }
    },
    "Harmonizer" : {
        "sprite" : 26,
        "souls" : {
            "SAINTLY" : "CyanFlood",
        },
        "tags" : ["Intangible","RealityBreak","HarmonicGrace"],
    },
    "Scarab" : {
        "sprite" : 76,
        "souls" : {
            //"ORDERED" : "Scarab",
        }
    },
    "Weaver" : {
        "sprite" : 27,
        "souls" : {
            "ORDERED" : "ScarabSpawner",
        }
    },
}
// A Million Thoughts Forge A Soul
// Forests of Fur Tangled In Claws
// Pulsing Hearts Under Glossy Membranes
// Brushes of Motion Across the Air