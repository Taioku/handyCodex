/**
 * tasks.js
 * Every reset timer in Warframe, as of July 2026.
 * Source: https://wiki.warframe.com/w/Reset (and linked pages)
 *
 * Schema:
 * {
 *   id: string,
 *   name: string,
 *   category: "daily" | "weekly" | "unique",
 *   resetRule: {
 *     type: "daily" | "weekly" | "interval" | "custom",
 *     hourUTC: number,
 *     minuteUTC: number,
 *     weekday?: number,        // 0=Sunday..6=Saturday
 *     intervalHours?: number,  // for interval resets
 *   },
 *   notes?: string
 * }
 *
 * Notes on standard (0:00 UTC) daily reset and standard (Monday 0:00 UTC)
 * weekly reset: most entries share the exact same resetRule object shape;
 * they are still listed individually so each can be tracked/checked off
 * separately in a UI.
 */

export default [

  // ============================================================
  // DAILY RESET — 0:00 UTC
  // ============================================================
  {
    id: "daily-tribute",
    name: "Daily Tribute (login reward)",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "daily-first-win-bonus",
    name: "Daily First Win Bonus",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-faction-syndicates",
    name: "Standing limit — Faction Syndicates (Steel Meridian, Arbiters of Hexis, Cephalon Suda, Perrin Sequence, Red Veil, New Loka)",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-ostron",
    name: "Standing limit — Ostron",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-quills",
    name: "Standing limit — The Quills",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-solaris-united",
    name: "Standing limit — Solaris United",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-ventkids",
    name: "Standing limit — Ventkids",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-vox-solaris",
    name: "Standing limit — Vox Solaris",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-entrati",
    name: "Standing limit — Entrati",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-necraloid",
    name: "Standing limit — Necraloid",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-holdfasts",
    name: "Standing limit — The Holdfasts",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-cavia",
    name: "Standing limit — Cavia",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-hex",
    name: "Standing limit — The Hex",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-simaris",
    name: "Standing limit — Cephalon Simaris",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "standing-conclave",
    name: "Standing limit — Conclave",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "nightwave-daily-act",
    name: "Nightwave Daily Act",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "focus-daily-limit",
    name: "Focus daily limit",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "trading-daily-limit",
    name: "Trading daily limit",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "circuit-stage4-bonus",
    name: "The Circuit — Stage 4 Bonus Circuit Progress",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "simaris-daily-synthesis",
    name: "Cephalon Simaris Daily Synthesis Target",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
    notes: "Only refreshes if the old task was completed or none was selected before reset.",
  },
  {
    id: "ventkids-kdrive-races",
    name: "Ventkids K-Drive Races + daily leaderboard",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "hex-chemistry",
    name: "Kinemantik Instant Messaging Chemistry (chat/gift/bounty per Hex member)",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "argon-crystal-decay",
    name: "Argon Crystal half-life decay tick",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "steel-path-incursions",
    name: "Steel Path Incursion Alerts",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "vendor-acrithis-daily",
    name: "Acrithis daily offerings (Duviri Capturas & Arcanes)",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
    notes: "Requires Rank 9 Opportunity Intrinsic.",
  },
  {
    id: "vendor-grandmother-daily",
    name: "Grandmother — \"Mend the Family\" shop",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "vendor-ticker-crew",
    name: "Ticker — Railjack Crew for hire",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "vendor-lyon-furniture",
    name: "Lyon — daily furniture offerings (La Cathédrale)",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },
  {
    id: "vendor-marie-daily",
    name: "Marie — daily Antique Mods, Tektolyst Artifact Arcanes, etc. (La Cathédrale)",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 0, minuteUTC: 0 },
  },

  // ---- Offset daily timers ----
  {
    id: "sortie",
    name: "Sortie missions",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 16, minuteUTC: 0 },
    notes: "17:00 UTC standard time / 16:00 UTC during North American Daylight Saving Time.",
  },
  {
    id: "syndicate-alerts",
    name: "Syndicate Alerts",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 16, minuteUTC: 0 },
    notes: "17:00 UTC standard time / 16:00 UTC during North American Daylight Saving Time.",
  },
  {
    id: "conclave-daily-challenges",
    name: "Conclave Daily Challenges",
    category: "daily",
    resetRule: { type: "daily", hourUTC: 18, minuteUTC: 0 },
  },

  // ============================================================
  // WEEKLY RESET — Monday 0:00 UTC
  // ============================================================
  {
    id: "nightwave-weekly-acts",
    name: "Nightwave Weekly & Elite Weekly Acts",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "maroo-weekly-ayatan",
    name: "Maroo's Weekly Ayatan Treasure Hunt",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "help-clem",
    name: "\"Help Clem\" Alert",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "clan-weekly-initiatives",
    name: "Clan Weekly Initiatives",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "helminth-invigoration",
    name: "Helminth Invigoration selection",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "kahls-garrison",
    name: "Kahl's Garrison — Break Narmer missions",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "archon-hunt",
    name: "Archon Hunt (Narmer)",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "1999-calendar-season",
    name: "1999 Calendar — new season",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "descendia-weekly",
    name: "The Descendia weekly progress, challenges, reward pools",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "steel-path-descendia-weekly",
    name: "Steel Path The Descendia — weekly progress, challenges, reward pools",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "circuit-weekly-pools",
    name: "The Circuit — weekly reward pools",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "cavia-deep-archimedea",
    name: "Cavia Deep Archimedea — 5 weekly Search Pulses",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "hex-temporal-archimedea",
    name: "The Hex Temporal Archimedea — 5 weekly Search Pulses",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "cavia-netracell",
    name: "Cavia Netracell — 5 weekly Search Pulses",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },

  // ---- Weekly vendors ----
  {
    id: "vendor-nightwave-cred",
    name: "Nightwave Cred Offerings (Aura Mods, Weapon Augment Mods, helmets, glyphs, sigils)",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "vendor-palladino",
    name: "Palladino — weekly offerings (Credits, Endo, Kuva, etc.)",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "vendor-archimedean-yonta",
    name: "Archimedean Yonta — weekly 35,000 Kuva offering",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "vendor-teshin",
    name: "Teshin — Steel Path Honors featured item + Veiled Riven Cipher",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "vendor-bird3",
    name: "Bird 3 — weekly Archon Shard offering",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "vendor-kaya",
    name: "Kaya — weekly Arcane Enhancement offering",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "vendor-acrithis-weekly",
    name: "Acrithis — weekly Orokin Catalyst / Reactor / Rivens / Adaptors",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },
  {
    id: "vendor-cavalero",
    name: "Cavalero — weekly Incarnon Market",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 1 },
  },

  // ---- Offset weekly timers ----
  {
    id: "conclave-weekly-challenges",
    name: "Conclave Weekly Challenges",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 0, minuteUTC: 0, weekday: 5 },
  },
  {
    id: "leaderboards-weekly",
    name: "Leaderboards",
    category: "weekly",
    resetRule: { type: "weekly", hourUTC: 9, minuteUTC: 0, weekday: 1 },
  },

  // ============================================================
  // UNIQUE / OTHER RESET TIMERS
  // ============================================================
  {
    id: "baro-kiteer",
    name: "Baro Ki'Teer (Void Trader) arrival/departure",
    category: "unique",
    resetRule: { type: "custom" },
    notes: "Arrives every 2 weeks on Friday at 9:00am Eastern Time, departs the following Sunday at 9:00am ET (48h visit). Unlike most resets, Baro observes North American Daylight Saving Time, so his UTC time shifts between 13:00 and 14:00 UTC.",
  },
  {
    id: "ergo-glast-tenet-valence",
    name: "Ergo Glast — Tenet weapon progenitor bonus cycle (Agendus, Exec, Ferrox, Grigori, Livia)",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 96, hourUTC: 0, minuteUTC: 0 },
    notes: "Cycles every 4 days at 0:00 UTC.",
  },
  {
    id: "eleanor-coda-batch",
    name: "Eleanor Nightingale — Coda weapon batch rotation (Batch A / Batch B)",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 96, hourUTC: 0, minuteUTC: 0 },
    notes: "Cycles every 4 days, generating new valence bonuses.",
  },
  {
    id: "bounty-rotation",
    name: "Bounty rotation (all open-world/landscape bounty boards)",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 2.5 },
    notes: "2.5 hour (2h30m) cycle regardless of location.",
  },
  {
    id: "prime-resurgence",
    name: "Prime Resurgence rotation",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 672, hourUTC: 18, minuteUTC: 0 },
    notes: "Monthly timer, exactly 28 days, changes at 18:00 UTC.",
  },
  {
    id: "plains-day-night",
    name: "Plains of Eidolon (Earth) day/night cycle",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 2.5 },
    notes: "Day lasts 100 minutes, Night lasts 50 minutes; full cycle 150 minutes (2h30m).",
  },
  {
    id: "orb-vallis-warm-cold",
    name: "Orb Vallis (Venus) warm/cold cycle",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 0.4444 },
    notes: "Warm lasts 6m40s, Cold lasts 20m; full cycle 26m40s (~0.444h).",
  },
  {
    id: "cambion-drift-fass-vome",
    name: "Cambion Drift (Deimos) Fass/Vome cycle",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 2.5 },
    notes: "Fass dominant for 100 minutes, Vome dominant for 50 minutes; full cycle 150 minutes (2h30m).",
  },
  {
    id: "duviri-mood-spirals",
    name: "Duviri Mood Spirals (Joy → Anger → Envy → Sorrow → Fear)",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 2 },
    notes: "Changes every 2 hours, cycling through all 5 moods in fixed order.",
  },
  {
    id: "zariman-faction-invasion",
    name: "Zariman invading faction (Kuva Grineer vs Juno Corpus)",
    category: "unique",
    resetRule: { type: "interval", intervalHours: 2.5 },
    notes: "Rerolls between the two factions every 150 minutes (2h30m).",
  },
  
];