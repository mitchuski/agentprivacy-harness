import { writeFileSync } from 'node:fs';

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
  ["What is the maximum duration of power outage this guide prepares a household for?", "a power outage lasting up to seventy-two hours"],
  ["What climate is the guide written for, and what does it assume about a generator?", "It is written for a temperate climate and assumes no backup generator."],
  ["In what order should the sections be worked through, and which matter most?", "Work through the sections in order; the earlier sections cover the preparations that matter most."],
  ["How much water should be stored per person per day, and what is the total per person for the outage?", "Store four litres of water per person per day, which means twelve litres per person for the full seventy-two hours."],
  ["How is the stored-water allowance split between uses?", "Half of that allowance is for drinking, and the other half covers cooking and basic hygiene."],
  ["What kind of containers should hold stored water, where kept, and how often replaced?", "Store the water in food-grade containers, keep the containers out of direct sunlight, and replace stored water every six months."],
  ["When should you fill the bathtub, and what is that water for and not for?", "If a storm is forecast and you have advance warning, also fill the bathtub; bathtub water is for flushing toilets and washing, never for drinking."],
  ["How much non-perishable food should be kept on the dedicated shelf?", "Keep a dedicated shelf of non-perishable food sufficient for three days."],
  ["What are the good non-perishable food choices?", "Good choices are canned beans, canned fish, peanut butter, crackers, dried fruit, and shelf-stable milk."],
  ["What kind of foods and can opener should you have, and why?", "Choose foods that require no cooking, and make sure you own a manual can opener, because an electric one will be useless."],
  ["In what order should food be eaten during the outage?", "Eat the perishable food from the refrigerator first, then the food from the freezer, and only then open the emergency shelf."],
  ["How long does an unopened refrigerator keep food safe?", "An unopened refrigerator keeps food safe for about four hours."],
  ["How long do a full freezer and a half-full freezer hold a safe temperature, and what follows?", "A full freezer holds a safe temperature for about forty-eight hours, but a half-full freezer holds it for only about twenty-four hours, so it is worth keeping the freezer consolidated and full, even if some of the space is taken up by containers of frozen water."],
  ["What should you do with the refrigerator and freezer doors?", "Keep both doors closed as much as possible and tape a note to each door as a reminder."],
  ["When should perishable food be discarded?", "Any perishable food that has spent more than two hours above four degrees Celsius should be discarded; when in doubt, throw it out."],
  ["What primary light source should you use, what should you avoid, and why?", "Use battery-powered LED lanterns or headlamps as your primary light source, and avoid candles entirely, since candles are a leading cause of house fires during outages."],
  ["How many lights and spare batteries should be stored?", "Store at least one light per person, plus two spare sets of batteries for each light."],
  ["Where should headlamps and lanterns be placed?", "Keep one headlamp beside each bed and one lantern in the kitchen, and place them where they can be found in the dark."],
  ["What must you never run indoors, in a garage, or near a window, and why?", "Never run a camping stove, barbecue, or generator indoors, in a garage, or near a window, because each of these produces carbon monoxide, which is odourless and can be fatal."],
  ["What carbon monoxide alarm coverage is required?", "Install at least one battery-powered carbon monoxide alarm on each floor where people sleep."],
  ["What should you do to stay warm in cold weather during an outage?", "In cold weather, choose one small room on a south-facing side of the home, close its door, and gather everyone there; layered clothing and blankets are safer than any improvised heater."],
  ["Below what indoor temperature, and under what condition, should you relocate, and to where?", "If the indoor temperature falls below ten degrees Celsius and you cannot maintain warmth, relocate to a warming centre or a neighbour's home."],
  ["What radio should you keep, and what should you know before the outage begins?", "Keep a battery-powered or hand-crank radio for emergency broadcasts, and know the frequency of your local emergency station before the outage begins."],
  ["When should you charge phones and power banks, and how many times does a 20,000 mAh bank recharge a phone?", "Charge every phone and power bank whenever a storm is forecast; a full modern power bank of twenty thousand milliamp-hours will recharge a typical phone roughly four times."],
  ["What phone setting and contact plan should you establish at outage start, and why texts?", "Put your phone in low-power mode at the start of the outage, and agree in advance on one out-of-area contact whom every member of the household will text, because text messages get through congested networks more reliably than voice calls."],
  ["What medical supplies should you keep and how should you manage them?", "Keep a first-aid kit and a seven-day supply of every prescription medication, and rotate the medications so they stay in date."],
  ["How long does refrigerated medication like insulin last at room temperature, and what should you confirm?", "Refrigerated medication such as insulin generally remains usable at room temperature for up to twenty-eight days, but confirm the rule for your specific medication with a pharmacist before an emergency happens."],
  ["What phone numbers should you write on paper, and why?", "Write down the phone numbers of your pharmacy, your doctor, and the poison-control line on paper, because a dead phone is not a phone book."],
  ["How long should you wait before switching major appliances back on, and why?", "Wait five minutes before switching major appliances back on, so the grid can stabilise."],
  ["When can freezer food be safely refrozen after power returns?", "Check the freezer: if food still contains ice crystals, it can be safely refrozen."],
  ["Within what timeframe should you restock, and starting with what?", "Restock everything used during the outage within one week, starting with water and batteries."],
  ["What final note and follow-up action should you take after the outage?", "Finally, write a one-page note about what was missing or awkward, and fix at least one of those gaps before the next outage arrives."]
];

const seedHex = "bbb9099d9daa30ddac53e0b9250e9a36293636605fc66e10c795e8a1bbc24485";
const hProposal = "9bd99da429419226d13bf4c22046f65d90a127c346b1b5e3c5b2a77dce45b414";
const salt = "8bcc6ebb04880ef0a1c472c73bd8bcb15868537f67d4c57eada6608f73d84a24";
const hSource = "011a4f3530017e0e6f394f1011efc9ee0233d96966cee000f0d5875d31d05b58";
const mode = "census";
const drawIndices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];

const drawArr = drawIndices.map((idx) => {
  const [q, a] = questions[idx - 1];
  return { fact: "F" + idx, question: q, expectedAnswer: a };
});
const drawText = JSON.stringify(drawArr, null, 2);

const factList = facts.map((f, i) => "F" + (i + 1) + ": " + f).join("\n");

const transcript = [
  "GAP TRANSCRIPT — seat HOLD-APART (Gap, xor), SALTED census mode",
  "instance: examples/field-guide  run: r5/r5.1  proposal: p2-restructure-labelled-dense-sections",
  "",
  "== 1. NUMBERED FACT CENSUS (original guide, artifact/GUIDE.md) ==",
  "Body split into sentences on '.', '!', '?' in reading order; every checkable-fact sentence indexed F1..F32.",
  "Population N = 32 (matches this instance's declared census). If a re-count differs, the round is void.",
  "",
  factList,
  "",
  "== 2. CANONICAL SERIALIZATION ==",
  "proposal_canon.json = JSON of the proposal artifact, recursive sorted keys, no whitespace, no trailing newline.",
  "byte length = 4239.",
  "",
  "== 3. HASH COMMANDS (re-derivable by any third party) ==",
  "hProposal = sha256(proposal_canon.json):",
  "  $ sha256sum proposal_canon.json",
  "  => 9bd99da429419226d13bf4c22046f65d90a127c346b1b5e3c5b2a77dce45b414",
  "  matches GIVEN hProposal. OK.",
  "",
  "seed = sha256(hSource || hProposal || salt)  [salted Fiat-Shamir; the run salt secret the proposer never saw is folded via salt]:",
  "  $ printf '%s%s%s' <hSource> <hProposal> <salt> | sha256sum",
  "  => bbb9099d9daa30ddac53e0b9250e9a36293636605fc66e10c795e8a1bbc24485",
  "  matches GIVEN seedHex. OK.",
  "",
  "== 4. DRAW ==",
  "mode = census: the engine draws every fact index 1..32 in order (detection 1.0). Indices are engine-code-derived (engine/gap.mjs); not recomputed here.",
  "drawIndices = [1..32].",
  "For each drawn Fi, one comprehension question with its expected answer quoted verbatim from the original sentence Fi (see 'draw').",
  "",
  "The proposer saw none of these witnesses; they derive only from the artifact hash and the run salt (T2/GR-4)."
].join("\n");

const gap = { seedHex, hProposal, salt, hSource, mode, drawIndices, draw: drawText, transcript };

const outPath = 'C:/Users/mitch/dual-agent-harness/examples/field-guide/runs/r5/r5.1/p2-restructure-labelled-dense-sections/gap.json';
writeFileSync(outPath, JSON.stringify(gap, null, 2), { encoding: 'utf8' });
console.log("facts_count=" + facts.length);
console.log("questions_count=" + questions.length);
console.log("draw_count=" + drawArr.length);
console.log("wrote " + outPath);
