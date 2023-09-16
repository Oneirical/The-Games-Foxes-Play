//List of souls

//vile = ["SENET","RASEL"];
//feral = ["KILAMI","LASHOL","EZEZZA"];
//unhinged = ["SHIZAPIS","JOLTZAZON","KASHIA"];
//artistic = ["PURPIZUG","AUBE","BORERORA", "GYVJI"];
//ordered = ["ASPHA","ABAZON","NAIA"];
//saintly = ["ROSE","ZAINT","ASTER"];

basic = ["SERENE","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
const soulSlotNames = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
basicspire = ["VILES","FERALS","UNHINGEDS","ARTISTICS","ORDEREDS","SAINTLYS"];
smod = ["Alacrity","Selective","Thrusters","Hover","Focus"];
modulators = ["Alacrity","Selective","Thrusters","Hover","Focus"];

commons = [Empty,Vile,Feral,Unhinged,Artistic,Ordered,Saintly];

commoneq = {
    "VILE" : Vile,
    "FERAL" : Feral,
    "UNHINGED" : Unhinged,
    "ARTISTIC" : Artistic,
    "ORDERED" : Ordered,
    "SAINTLY" : Saintly,
}

// DO NOT USE THIS AS A LIST IT GETS WIPED EACH TIME
const casteNodes = ["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"];

var nodeloot = {
    "FORM" : forms.slice(),
    "FUNCTION" : functions.slice(),
    "CONTINGENCY" : contingencies.slice(),
    "MUTATOR" : mutators.slice(),
}

let excludeloot = {
    "FORM" : ["EPSILON"],
    "FUNCTION" : [],
    "CONTINGENCY" : [],
    "MUTATOR" : [],
}

for (let i of Object.keys(excludeloot)){
    for (let j of excludeloot[i]) removeItemOnce(nodeloot[i],j);
}

const influenceShop = {
    "Furred" : { // Forests of Fur Tangled In Claws
        FurSpirit : "0A",
        Tinker : "1A",
        Apis : "1F",
        Oracle : "2U",
        Felidol : "3V",
    },
    "Glossy" : { // Pulsing Hearts Under Glossy Membranes
        GlossySpirit : "0A",
        Third : "1V",
        Slug : "1O",
        Weaver : "2A",
        Brute : "3U",
        Snail : "3O",
        Embalmer : "3S",
    },
    "Aerial" : { // Brushes of Motion Across the Air
        FlySpirit : "0A",
        Shrike: "1F",
        Scion : "2S",
        Ashsoul : "2U",
        Ragemaw : "3F",
    },
    "Swarm" : { // A Million Thoughts Forge A Soul
        SwarmSpirit : "0A",
        Second : "1V",
        Apiarist : "1O",
        Monk : "3A",
    }

};

// it should be, FELIDOL, APIS, SHRIKE, SNAIL, SLUG, TINKER

//Monsters

//Typeless
// Monk
//Vile
// Second - Felidol - Third
//Feral
// Ragemaw - Shrike
//Unhinged
// Oracle - Ashsoul - Apis
//Artistic
// Tinker - Weaver - Brute
//Ordered
// Slug - Apiarist - Snail
//Saintly
// Scion - Embalmer