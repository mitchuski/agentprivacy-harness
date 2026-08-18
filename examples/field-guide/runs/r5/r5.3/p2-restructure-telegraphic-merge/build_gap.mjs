import { writeFileSync } from 'node:fs';

const dir = 'C:/Users/mitch/dual-agent-harness/examples/field-guide/runs/r5/r5.3/p2-restructure-telegraphic-merge/';

const facts = [
  "This guide explains how to prepare an ordinary household to manage safely and comfortably through a power outage lasting up to seventy-two hours.",
  "It is written for a temperate climate and assumes no backup generator.",
  "Work through the sections in order; the earlier sections cover the preparations that matter most.",
  "Store four litres of water per person per day, which means twelve litres per person for the full seventy-two hours.",
  "Half of that allowance is for drinking, and the other half covers cooking and basic hygiene.",
  "Store the water in food-grade containers, keep the containers out of direct sunlight, and replace stored water every six months.",
  "If a storm is forecast and you have advance warning, also fill the bathtub; bathtub water is for flushing toilets and washing, never for drinking.",
  "Keep a dedicated shelf of non-perishable food sufficient for three days.",
  "Good choices are canned beans, canned fish, peanut butter, crackers, dried fruit, and shelf-stable milk.",
  "Choose foods that require no cooking, and make sure you own a manual can opener, because an electric one will be useless.",
  "Eat the perishable food from the refrigerator first, then the food from the freezer, and only then open the emergency shelf.",
  "An unopened refrigerator keeps food safe for about four hours.",
  "A full freezer holds a safe temperature for about forty-eight hours, but a half-full freezer holds it for only about twenty-four hours, so it is worth keeping the freezer consolidated and full, even if some of the space is taken up by containers of frozen water.",
  "Keep both doors closed as much as possible and tape a note to each door as a reminder.",
  "Any perishable food that has spent more than two hours above four degrees Celsius should be discarded; when in doubt, throw it out.",
  "Use battery-powered LED lanterns or headlamps as your primary light source, and avoid candles entirely, since candles are a leading cause of house fires during outages.",
  "Store at least one light per person, plus two spare sets of batteries for each light.",
  "Keep one headlamp beside each bed and one lantern in the kitchen, and place them where they can be found in the dark.",
  "Never run a camping stove, barbecue, or generator indoors, in a garage, or near a window, because each of these produces carbon monoxide, which is odourless and can be fatal.",
  "Install at least one battery-powered carbon monoxide alarm on each floor where people sleep.",
  "In cold weather, choose one small room on a south-facing side of the home, close its door, and gather everyone there; layered clothing and blankets are safer than any improvised heater.",
  "If the indoor temperature falls below ten degrees Celsius and you cannot maintain warmth, relocate to a warming centre or a neighbour's home.",
  "Keep a battery-powered or hand-crank radio for emergency broadcasts, and know the frequency of your local emergency station before the outage begins.",
  "Charge every phone and power bank whenever a storm is forecast; a full modern power bank of twenty thousand milliamp-hours will recharge a typical phone roughly four times.",
  "Put your phone in low-power mode at the start of the outage, and agree in advance on one out-of-area contact whom every member of the household will text, because text messages get through congested networks more reliably than voice calls.",
  "Keep a first-aid kit and a seven-day supply of every prescription medication, and rotate the medications so they stay in date.",
  "Refrigerated medication such as insulin generally remains usable at room temperature for up to twenty-eight days, but confirm the rule for your specific medication with a pharmacist before an emergency happens.",
  "Write down the phone numbers of your pharmacy, your doctor, and the poison-control line on paper, because a dead phone is not a phone book.",
  "Wait five minutes before switching major appliances back on, so the grid can stabilise.",
  "Check the freezer: if food still contains ice crystals, it can be safely refrozen.",
  "Restock everything used during the outage within one week, starting with water and batteries.",
  "Finally, write a one-page note about what was missing or awkward, and fix at least one of those gaps before the next outage arrives."
];

const questions = [
  ["How long a power outage is this guide written to help a household manage?", "up to seventy-two hours"],
  ["What climate is the guide written for, and what backup does it assume?", "a temperate climate and assumes no backup generator"],
  ["In what order should the sections be worked through, and which matter most?", "in order; the earlier sections cover the preparations that matter most"],
  ["How much water should you store per person per day, and how much total for the full 72 hours?", "four litres of water per person per day, which means twelve litres per person for the full seventy-two hours"],
  ["How is the water allowance split between uses?", "Half of that allowance is for drinking, and the other half covers cooking and basic hygiene"],
  ["What container type, storage condition, and replacement interval apply to stored water?", "food-grade containers, keep the containers out of direct sunlight, and replace stored water every six months"],
  ["What is bathtub water for, and what must it never be used for?", "for flushing toilets and washing, never for drinking"],
  ["How many days of non-perishable food should the dedicated shelf hold?", "three days"],
  ["Which six foods are named as good non-perishable choices?", "canned beans, canned fish, peanut butter, crackers, dried fruit, and shelf-stable milk"],
  ["What kind of can opener must you own, and why not the electric kind?", "a manual can opener, because an electric one will be useless"],
  ["In what order should you eat food during the outage?", "the perishable food from the refrigerator first, then the food from the freezer, and only then open the emergency shelf"],
  ["About how long does an unopened refrigerator keep food safe?", "about four hours"],
  ["How long does a full freezer hold a safe temperature versus a half-full one?", "A full freezer holds a safe temperature for about forty-eight hours, but a half-full freezer holds it for only about twenty-four hours"],
  ["What should you do with the two doors and each door?", "Keep both doors closed as much as possible and tape a note to each door as a reminder"],
  ["What time-and-temperature threshold means perishable food should be discarded?", "more than two hours above four degrees Celsius"],
  ["What primary light source is recommended, what should you avoid, and why?", "battery-powered LED lanterns or headlamps as your primary light source, and avoid candles entirely, since candles are a leading cause of house fires during outages"],
  ["How many lights per person and how many spare battery sets should you store?", "at least one light per person, plus two spare sets of batteries for each light"],
  ["Where should you keep a headlamp and where a lantern?", "one headlamp beside each bed and one lantern in the kitchen"],
  ["Where must you never run a camping stove, barbecue, or generator, and why?", "indoors, in a garage, or near a window, because each of these produces carbon monoxide, which is odourless and can be fatal"],
  ["How many carbon monoxide alarms should you install and where?", "at least one battery-powered carbon monoxide alarm on each floor where people sleep"],
  ["In cold weather, which room should you gather in, and what beats an improvised heater?", "one small room on a south-facing side of the home ... layered clothing and blankets are safer than any improvised heater"],
  ["Below what indoor temperature should you relocate, and to where?", "below ten degrees Celsius ... relocate to a warming centre or a neighbour's home"],
  ["What kind of radio should you keep, and what should you know before the outage?", "a battery-powered or hand-crank radio for emergency broadcasts, and know the frequency of your local emergency station before the outage begins"],
  ["Roughly how many times will a full 20,000 mAh power bank recharge a typical phone?", "a full modern power bank of twenty thousand milliamp-hours will recharge a typical phone roughly four times"],
  ["What phone mode should you set, what contact should you agree on, and why text?", "low-power mode at the start of the outage, and agree in advance on one out-of-area contact whom every member of the household will text, because text messages get through congested networks more reliably than voice calls"],
  ["How many days of every prescription medication should you keep, and how do you keep them in date?", "a seven-day supply of every prescription medication, and rotate the medications so they stay in date"],
  ["How long does refrigerated medication like insulin last at room temperature, and who confirms the rule?", "up to twenty-eight days, but confirm the rule for your specific medication with a pharmacist before an emergency happens"],
  ["Which phone numbers should you write on paper, and why?", "your pharmacy, your doctor, and the poison-control line on paper, because a dead phone is not a phone book"],
  ["How long should you wait before switching major appliances back on?", "five minutes"],
  ["When can food in the freezer be safely refrozen?", "if food still contains ice crystals, it can be safely refrozen"],
  ["Within what time should you restock, and starting with what?", "within one week, starting with water and batteries"],
  ["What note should you write afterward, and what should you fix before the next outage?", "a one-page note about what was missing or awkward, and fix at least one of those gaps before the next outage arrives"]
];

const drawIndices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];

const draw = drawIndices.map(i => ({
  fact: 'F' + i,
  question: questions[i-1][0],
  expectedAnswer: questions[i-1][1],
  sourceSentence: facts[i-1]
}));

const factListText = facts.map((f, i) => 'F' + (i+1) + ': ' + f).join('\n');

const transcript = [
  '=== HOLD-APART (Gap ⿻) transcript — SALTED census mode ===',
  'Instance: examples/field-guide  Run: r5/r5.3  Proposal: p2-restructure-telegraphic-merge',
  '',
  '--- Step 1: numbered fact enumeration of the ORIGINAL guide ---',
  'Source: examples/field-guide/artifact/GUIDE.md. Body split into sentences on . ! ? in reading order;',
  'every checkable-fact sentence (quantity/duration/temperature/item/instruction) indexed from F1 upward,',
  'including the three-sentence intro paragraph. Count = 32, matching this instance\'s declared census N=32.',
  '',
  factListText,
  '',
  '--- Step 2: canonical serialization of the proposal artifact ---',
  'Rule: JSON.parse the verbatim proposal, then serialize with recursively sorted object keys, no whitespace,',
  'no trailing newline (engine/gap canonicalizer canon.mjs; scalars/arrays via JSON.stringify). Exact bytes',
  'persisted to proposal_canon.json (5368 bytes).',
  '',
  '--- Step 3: hash / seed derivation (SALTED — engine-authoritative, re-derived here) ---',
  'Exact hash command (reproducible by any third party):',
  '  sha256sum proposal_canon.json',
  '  => f92057c8722531975ab86e41de253e1d9afb2c00563ea0aa21aa92c8cef31022  (== GIVEN hProposal)',
  'Salted seed derivation (hex-string concatenation, then sha256):',
  '  seed = SHA-256( hSource || hProposal || salt )',
  '  hSource   = 011a4f3530017e0e6f394f1011efc9ee0233d96966cee000f0d5875d31d05b58',
  '  hProposal = f92057c8722531975ab86e41de253e1d9afb2c00563ea0aa21aa92c8cef31022',
  '  salt      = 6d667819deeb7517186fe45a0a3b7e1c9d8dbfd89383e64a46da9ebbfea29977',
  '  node -e "createHash(\'sha256\').update(hSource+hProposal+salt).digest(\'hex\')"',
  '  => 1f745fdebecf3d58fa5e4dda67998ad76150dc26ab497e026b50af641cfb996f  (== GIVEN seedHex)',
  'The run salt secret was never seen by the proposer; salt = sha256(saltSecret || hProposal). Engine seed and',
  'draw are authoritative; this seat re-derived and confirmed them, and did not recompute or second-guess them.',
  '',
  '--- Step 4: draw ---',
  'Mode = census. Draw rule: all N=32 fact indices, in order, without replacement.',
  'drawIndices (1-based) = [' + drawIndices.join(',') + ']',
  'For each drawn fact, one comprehension question with its expected answer quoted from the original sentence',
  '(see draw[] / draw field). Witnesses derived solely from the proposal-hash-seeded engine draw over the',
  'original guide; none suggested by the proposer (GR-4/T2).'
].join('\n');

const out = {
  seedHex: '1f745fdebecf3d58fa5e4dda67998ad76150dc26ab497e026b50af641cfb996f',
  hProposal: 'f92057c8722531975ab86e41de253e1d9afb2c00563ea0aa21aa92c8cef31022',
  salt: '6d667819deeb7517186fe45a0a3b7e1c9d8dbfd89383e64a46da9ebbfea29977',
  hSource: '011a4f3530017e0e6f394f1011efc9ee0233d96966cee000f0d5875d31d05b58',
  mode: 'census',
  drawIndices,
  draw: JSON.stringify(draw),
  transcript
};

writeFileSync(dir + 'gap.json', JSON.stringify(out, null, 2), { encoding: 'utf8' });
console.log('gap.json written. facts=' + facts.length + ' questions=' + questions.length + ' draw=' + draw.length);
