export const JEWELRY_TYPE = {
    ring: "RING",
    stud: "STUD",
    tennis_bracelet: "TENNIS_BRACELET",
    pendant: "PENDANT", 
    jvMenu: "JEWLERY-TYPE-MENU"
}

// ============================================
// ---------------- RINGS DATA ---------------- 
export const SHANKS = {
    S01: {
        key: "S01",
        name: "Solitaire",
        decorations: false,
    },
    S02: {
        key: "S02",
        name: "French Pave",
        decorations: true,
    },
    S03: {
        key: "S03",
        name: "U Shaped Pave",
        decorations: true,
    },
    S04: {
        key: "S04",
        name: "Knife Edge Pave",
        decorations: true,
    },
    S05: {
        key: "S05",
        name: "Knife Edge Solitaire",
        decorations: false,
    },
    S06: {
        key: "S06",
        name: "Marquise Diamond",
        decorations: true,
    },
    S07: {
        key: "S07",
        name: "Marquise Sapphire",
        decorations: true,
    },
    S08: {
        key: "S08",
        name: "Cathedral Pave",
        decorations: true,
    },
    S09: {
        key: "S09",
        name: "Rope Solitaire",
        decorations: false,
    },
    S10: {
        key: "S10",
        name: "Rope Pave",
        decorations: true,
    },
    S11: {
        key: "S11",
        name: "Sleek Accent",
        decorations: true,
    },
    S12: {
        key: "S12",
        name: "Channel Set",
        decorations: true,
    },
}

export const HEADS = {
    H01: {
        key: "H01",
        name: "Four Prong",
        decorations: false,
    },
    H02: {
        key: "H02",
        name: "Six Prong",
        decorations: false,
    },
    H03: {
        key: "H03",
        name: "Classic Basket",
        decorations: false,
    },
    H04: {
        key: "H04",
        name: "Pave Basket",
        decorations: true,
    },
    H05: {
        key: "H05",
        name: "Suprise Diamond",
        decorations: true,
    },
    H06: {
        key: "H06",
        name: "Suprise Sapphire",
        decorations: true,
    },
    H07: {
        key: "H07",
        name: "Lotus Basket",
        decorations: false,
    },
    H08: {
        key: "H08",
        name: "Tulip Basket",
        decorations: false,
    },
    H09: {
        key: "H09",
        name: "Scalloped Six Prong",
        decorations: false,
    },
    H10: {
        key: "H10",
        name: "Vintage Basket",
        decorations: false,
    },
    H11: {
        key: "H11",
        name: "Pave Halo",
        decorations: true,
    },
    H12: {
        key: "H12",
        name: "Sapphire Halo",
        decorations: true,
    },
    H13: {
        key: "H13",
        name: "French Pave Halo",
        decorations: true,
    },
    H14: {
        key: "H14",
        name: "Falling Edge Halo",
        decorations: true,
    },
}

export const STONES = {
    RND: {
        key: "RND",
        name: "Round",
    },
    PRNC: {
        key: "PRNC",
        name: "Princess",
    },
    RAD: {
        key: "RAD",
        name: "Radiant",
    },
    EMR: {
        key: "EMR",
        name: "Emerald",
    },
    MRQ: {
        key: "MRQ",
        name: "Marquise",
    },
    OVL: {
        key: "OVL",
        name: "Oval",
    },
    PER: {
        key: "PER",
        name: "Pear",
    },
    HEART: {
        key: "HEART", // not defined / available
        name: "Heart",
    },
    ASH: {
        key: "ASH",
        name: "Asscher",
    },
    CSH: {
        key: "CSH",
        name: "Cushion",
    },
}

export const METAL_COLOR = {
    white: "#F0F6EA",
    yellow: "#FFE5B2",
    rose: "#FFDBD1",
}

export const STONE_COLOR = {
    white: "#FFFFFF",
    blue: "#0055a2",
}

export const HEAD_SIZES = [0.5, 1.0, 1.5, 2.0]

export const STONE_SIZES = [0.5, 1.0, 1.5, 2.0]

export const DECORATIONS = {
    rnd_side: "RNDSIDE",
    rnd_side_sap: "RNDSIDESAP",
    mrq_side: "MRQSIDE",
    mrq_side_sap: "MRQSIDESAP",
    prnc_side: "PRNCSIDE",
}

// TODO: Use one white matcap and change it's color (from Metal-Color list)
export const METAL_TEXTURE = {
    yellow: "/assets/matcap/metal_matcap_yellow_bright.jpg",
    white: "/assets/matcap/metal_matcap_white_bright.jpg",
    rose: "/assets/matcap/metal_matcap_rose_bright.jpg",
}

//# By default initial ring data to shank + head with 0 side_stones and white color 
export const RING_PARTS = {
    shank_type: SHANKS.S01,
    shank_color: METAL_TEXTURE[0],
    head_type: HEADS.H01,
    head_color: METAL_TEXTURE[0],
    head_size: HEAD_SIZES[0],
    stone_type: STONES.RAD,
    stone_size: STONE_SIZES[0],
    stone_color: STONE_COLOR[0],
}

// ============================================
// ---------------- STUDS DATA ----------------
export const STUDS = {
    Stud01: {
        key: "Stud01",
        name: "Stud test",
        decorations: false,
    },
}
export const STUDS_STONES = {
    RND: {
        key: "RND",
        name: "Round",
    },
}

// ============================================
// -------------- PENDANTS DATA ---------------
export const PENDANTS = {
    Pendant01: {
        key: "Pendant01",
        name: "Pendant test",
        decorations: false,
    },
}
export const PENDANTS_STONES = {
    RND: {
        key: "RND",
        name: "Round",
    },
}

// ============================================
// ----------- TENNIS-BRACELTS DATA -----------

