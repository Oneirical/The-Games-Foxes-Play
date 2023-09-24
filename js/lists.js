basic = ["SERENE","VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
const soulSlotNames = ["VILE","FERAL","UNHINGED","ARTISTIC","ORDERED","SAINTLY"];
basicspire = ["VILES","FERALS","UNHINGEDS","ARTISTICS","ORDEREDS","SAINTLYS"];
smod = ["Alacrity","Selective","Thrusters","Hover","Focus"];
modulators = ["Alacrity","Selective","Thrusters","Hover","Focus"];

const floors = ["WorldSeed", "EpsilonApex", "EntertainAlpha"]; // vox?
const floorLinks = {
    "WorldSeed" : ["EpsilonApex"],
    "EpsilonApex" : ["WorldSeed","EntertainAlpha"],
    "EntertainAlpha" : ["EpsilonApex"],
}
const floorStyles = {
    "WorldSeed" : "Vault",
    "EpsilonApex" : "Blocks",
    "EntertainAlpha" : "Vault",
}

// DO NOT USE THIS AS A LIST IT GETS WIPED EACH TIME
const casteNodes = ["Saintly","Ordered","Artistic","Unhinged","Feral","Vile"];

let excludeloot = {
    "FORM" : ["EPSILON"],
    "FUNCTION" : [],
    "CONTINGENCY" : [],
    "MUTATOR" : [],
}
// A Million Thoughts Forge A Soul
// Forests of Fur Tangled In Claws
// Pulsing Hearts Under Glossy Membranes
// Brushes of Motion Across the Air