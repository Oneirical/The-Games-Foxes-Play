//List of souls

//vile = ["SENET","RASEL"];
//feral = ["KILAMI","LASHOL","EZEZZA"];
//unhinged = ["SHIZAPIS","JOLTZAZON","KASHIA"];
//artistic = ["PURPIZUG","AUBE","BORERORA", "GYVJI"];
//ordered = ["ASPHA","ABAZON","NAIA"];
//saintly = ["ROSE","ZAINT","ASTER"];

basic = ["TAINTED","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
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

//Monsters

//Typeless
// Monk
//Vile
// Second - Felidol - Third
//Feral
// Ragemaw - Shrike
//Unhinged
// Oracle - Ashoul - Apis
//Artistic
// Tinker - Weaver - Brute
//Ordered
// Slug - Apiarist - Snail
//Saintly
// Scion - Embalmer

//excludes aube && zaint
relayPool = {
    "VILE" : [new Senet(),new Rasel()],
    "FERAL" : [new Kilami(), new Lashol(), new Ezezza()],
    "UNHINGED" : [new Shizapis(), new Joltzazon(), new Kashia()],
    "ARTISTIC" : [new Purpizug(), new Borerora(), new Gyvji()],
    "ORDERED" : [new Aspha(), new Abazon, new Naia()],
    "SAINTLY" : [new Rose(), new Aster()],
}