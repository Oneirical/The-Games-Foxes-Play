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
// A Million Thoughts Forge A Soul
// Forests of Fur Tangled In Claws
// Pulsing Hearts Under Glossy Membranes
// Brushes of Motion Across the Air