//List of souls

//vile = ["SENET","RASEL"];
//feral = ["KILAMI","LASHOL","EZEZZA"];
//unhinged = ["SHIZAPIS","JOLTZAZON","KASHIA"];
//artistic = ["PURPIZUG","AUBE","BORERORA", "GYVJI"];
//ordered = ["ASPHA","ABAZON","NAIA"];
//saintly = ["ROSE","ZAINT","ASTER"];

basic = ["SERENE","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
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

var nodeloot = {
    "FORM" : forms.slice(),
    "FUNCTION" : functions.slice(),
    "CONTINGENCY" : contingencies.slice(),
    "MUTATOR" : mutators.slice(),
    "Caste" : ["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"],
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