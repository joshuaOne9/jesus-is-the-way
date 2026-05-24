// Edges between beings, with type. Each type renders with its own visual style.
// Source-material reasoning is in the comments — fact-check anything that doesn't match your intent.

export const RELATIONSHIPS = [
  // === Watcher hierarchy: Shemyaza led his chiefs (1 Enoch 6) ===
  { from: 'Shemyaza', to: 'Azazel', type: 'led' },
  { from: 'Shemyaza', to: 'Penemue', type: 'led' },
  { from: 'Shemyaza', to: 'Gadreel', type: 'led' },
  { from: 'Shemyaza', to: 'Kasdeya', type: 'led' },
  { from: 'Shemyaza', to: 'Tamiel', type: 'led' },

  // === Apocalyptic empowerment: the Dragon empowers Beast & False Prophet (Rev 13) ===
  { from: 'The Dragon', to: 'The Beast', type: 'led' },
  { from: 'The Dragon', to: 'The False Prophet', type: 'led' },

  // === Adversaries: cosmic opposition ===
  { from: 'Michael', to: 'The Dragon', type: 'adversary' },                 // Rev 12:7
  { from: 'Michael', to: 'The Adversary (ha-satan)', type: 'adversary' },   // Jude 9
  { from: 'Michael', to: 'Prince of Persia', type: 'adversary' },           // Dan 10:13
  { from: 'Gabriel', to: 'Prince of Persia', type: 'adversary' },           // Dan 10:12-13
  { from: 'Raphael', to: 'Asmodeus', type: 'adversary' },                   // Tobit 8:3

  // === Syncretic identifications: multiple names for the same being across traditions ===
  { from: 'The Dragon', to: 'The Adversary (ha-satan)', type: 'identified_with' },              // Rev 12:9 explicit
  { from: 'The Day-Star, Son of Dawn', to: 'The Adversary (ha-satan)', type: 'identified_with' }, // Christian Lucifer tradition
  { from: 'The Day-Star, Son of Dawn', to: 'The Dragon', type: 'identified_with' },             // same chain
  { from: 'Beelzebub', to: 'The Adversary (ha-satan)', type: 'identified_with' },               // Matt 12:24 prince of demons
  { from: 'Samael', to: 'The Adversary (ha-satan)', type: 'identified_with' },                  // Jewish mystical tradition
  { from: 'Belial', to: 'The Adversary (ha-satan)', type: 'identified_with' },                  // 2 Cor 6:15 antithesis to Christ
  { from: 'Samael', to: 'Gadreel', type: 'identified_with' },                                   // both identified with Eden serpent

  // === Corrupted elohim → foreign gods & principalities (Deut 32:8-9 / Heiser worldview) ===
  // The elohim assigned to the nations after Babel became the gods/principalities the nations worshipped.
  { from: 'The Elohim', to: 'Baal', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Molech', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Asherah', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Dagon', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Marduk', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Tammuz', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Chemosh', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Prince of Persia', type: 'corrupted_to' },
  { from: 'The Elohim', to: 'Prince of Greece', type: 'corrupted_to' },

  // === Special relationships ===
  { from: 'The Whore of Babylon', to: 'The Beast', type: 'rides_upon' },  // Rev 17:3
  { from: 'Samael', to: 'Lilith', type: 'consort' },                       // Kabbalistic (Zohar)
]

// Visual style per relationship type. Tweak colors/widths here to taste.
export const RELATIONSHIP_STYLES = {
  led: {
    label: 'led',
    stroke: '#c9a84c',          // gold — authority / empowerment
    strokeWidth: 2,
    animated: true,
  },
  adversary: {
    label: 'opposed',
    stroke: '#dc2626',          // red — opposition
    strokeWidth: 2.5,
    animated: true,
  },
  identified_with: {
    label: 'is',
    stroke: '#9ca3af',          // silver — equivalence
    strokeWidth: 1.5,
    strokeDasharray: '5 5',
  },
  corrupted_to: {
    label: 'became',
    stroke: '#ea580c',          // amber — corruption flow
    strokeWidth: 1.5,
    strokeDasharray: '3 3',
    animated: true,
  },
  rides_upon: {
    label: 'rides',
    stroke: '#a855f7',          // purple — Babylon connection
    strokeWidth: 2,
  },
  consort: {
    label: 'consort',
    stroke: '#ec4899',          // pink — paired
    strokeWidth: 1.5,
  },
}