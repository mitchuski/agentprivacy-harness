import { writeFileSync } from 'node:fs';

const dir = 'C:/Users/mitch/dual-agent-harness/examples/field-guide/runs/r2/r2.2/p2-restructure-merge-terse-prose/';
const seedHex = 'a85595a55f796c951188bfb33229cd2b8c4d9f759be92fdc6f015644d24c9f94';

const draw = [
  { fact: 'F9', question: 'Which specific non-perishable foods does the guide name as good choices for the dedicated shelf?',
    expected: 'Good choices are canned beans, canned fish, peanut butter, crackers, dried fruit, and shelf-stable milk.' },
  { fact: 'F25', question: 'What mode should you put your phone in at the start of the outage, and why is texting one out-of-area contact preferred over calling?',
    expected: 'Put your phone in low-power mode at the start of the outage, and agree in advance on one out-of-area contact whom every member of the household will text, because text messages get through congested networks more reliably than voice calls.' },
  { fact: 'F32', question: 'As the final step when power returns, what note should you write and what should you fix before the next outage?',
    expected: 'Finally, write a one-page note about what was missing or awkward, and fix at least one of those gaps before the next outage arrives.' },
  { fact: 'F22', question: 'Below what indoor temperature, if you cannot maintain warmth, should you relocate, and to where?',
    expected: 'If the indoor temperature falls below ten degrees Celsius and you cannot maintain warmth, relocate to a warming centre or a neighbour’s home.' },
  { fact: 'F13', question: 'For about how long does a full freezer hold a safe temperature versus a half-full freezer?',
    expected: 'A full freezer holds a safe temperature for about forty-eight hours, but a half-full freezer holds it for only about twenty-four hours, so it is worth keeping the freezer consolidated and full, even if some of the space is taken up by containers of frozen water.' },
  { fact: 'F16', question: 'What should be used as the primary light source, what should be avoided entirely, and why?',
    expected: 'Use battery-powered LED lanterns or headlamps as your primary light source, and avoid candles entirely, since candles are a leading cause of house fires during outages.' },
  { fact: 'F5', question: 'How is the stored daily water allowance divided between drinking and other uses?',
    expected: 'Half of that allowance is for drinking, and the other half covers cooking and basic hygiene.' },
  { fact: 'F31', question: 'Within what timeframe should everything used during the outage be restocked, and starting with what?',
    expected: 'Restock everything used during the outage within one week, starting with water and batteries.' }
];

const transcript = `GAP ⿻ TRANSCRIPT — instance examples/field-guide, run r2/r2.2, proposal p2-restructure-merge-terse-prose

=== STEP 1 · NUMBERED FACT LIST (original artifact/GUIDE.md, body split on . ! ?) ===
F1  This guide explains how to prepare an ordinary household to manage safely and comfortably through a power outage lasting up to seventy-two hours.
F2  It is written for a temperate climate and assumes no backup generator.
F3  Work through the sections in order; the earlier sections cover the preparations that matter most.
F4  Store four litres of water per person per day, which means twelve litres per person for the full seventy-two hours.
F5  Half of that allowance is for drinking, and the other half covers cooking and basic hygiene.
F6  Store the water in food-grade containers, keep the containers out of direct sunlight, and replace stored water every six months.
F7  If a storm is forecast and you have advance warning, also fill the bathtub; bathtub water is for flushing toilets and washing, never for drinking.
F8  Keep a dedicated shelf of non-perishable food sufficient for three days.
F9  Good choices are canned beans, canned fish, peanut butter, crackers, dried fruit, and shelf-stable milk.
F10 Choose foods that require no cooking, and make sure you own a manual can opener, because an electric one will be useless.
F11 Eat the perishable food from the refrigerator first, then the food from the freezer, and only then open the emergency shelf.
F12 An unopened refrigerator keeps food safe for about four hours.
F13 A full freezer holds a safe temperature for about forty-eight hours, but a half-full freezer holds it for only about twenty-four hours, so it is worth keeping the freezer consolidated and full, even if some of the space is taken up by containers of frozen water.
F14 Keep both doors closed as much as possible and tape a note to each door as a reminder.
F15 Any perishable food that has spent more than two hours above four degrees Celsius should be discarded; when in doubt, throw it out.
F16 Use battery-powered LED lanterns or headlamps as your primary light source, and avoid candles entirely, since candles are a leading cause of house fires during outages.
F17 Store at least one light per person, plus two spare sets of batteries for each light.
F18 Keep one headlamp beside each bed and one lantern in the kitchen, and place them where they can be found in the dark.
F19 Never run a camping stove, barbecue, or generator indoors, in a garage, or near a window, because each of these produces carbon monoxide, which is odourless and can be fatal.
F20 Install at least one battery-powered carbon monoxide alarm on each floor where people sleep.
F21 In cold weather, choose one small room on a south-facing side of the home, close its door, and gather everyone there; layered clothing and blankets are safer than any improvised heater.
F22 If the indoor temperature falls below ten degrees Celsius and you cannot maintain warmth, relocate to a warming centre or a neighbour's home.
F23 Keep a battery-powered or hand-crank radio for emergency broadcasts, and know the frequency of your local emergency station before the outage begins.
F24 Charge every phone and power bank whenever a storm is forecast; a full modern power bank of twenty thousand milliamp-hours will recharge a typical phone roughly four times.
F25 Put your phone in low-power mode at the start of the outage, and agree in advance on one out-of-area contact whom every member of the household will text, because text messages get through congested networks more reliably than voice calls.
F26 Keep a first-aid kit and a seven-day supply of every prescription medication, and rotate the medications so they stay in date.
F27 Refrigerated medication such as insulin generally remains usable at room temperature for up to twenty-eight days, but confirm the rule for your specific medication with a pharmacist before an emergency happens.
F28 Write down the phone numbers of your pharmacy, your doctor, and the poison-control line on paper, because a dead phone is not a phone book.
F29 Wait five minutes before switching major appliances back on, so the grid can stabilise.
F30 Check the freezer: if food still contains ice crystals, it can be safely refrozen.
F31 Restock everything used during the outage within one week, starting with water and batteries.
F32 Finally, write a one-page note about what was missing or awkward, and fix at least one of those gaps before the next outage arrives.
(32 facts total.)

=== STEP 2 · CANONICAL SERIALIZATION + HASH ===
Serialization rule: parse the verbatim proposal artifact, emit JSON with recursively sorted object keys and no whitespace (arrays keep order). Exact bytes saved to proposal_canon.json (5889 bytes, UTF-8).
Hash command (run in the proposal dir):
  sha256sum proposal_canon.json
Digest:
  a85595a55f796c951188bfb33229cd2b8c4d9f759be92fdc6f015644d24c9f94 *proposal_canon.json
seedHex = a85595a55f796c951188bfb33229cd2b8c4d9f759be92fdc6f015644d24c9f94
Verify: re-hashing the persisted proposal_canon.json must equal seedHex, else the round is void.

=== STEP 3 · DRAW (8 distinct facts, without replacement) ===
Rule: decode the digest as bytes b0,b1,... left to right (b0=0xa8=168, b1=0x55=85, b2=0x95=149, b3=0xa5=165, b4=0x5f=95, b5=0x79=121, b6=0x6c=108, b7=0x95=149). Remaining starts [F1..F32] in order. For draw k: idx = b_k mod (#remaining, 0-based); pick and remove remaining[idx].
  draw1: b0=168, remaining=32, 168 mod 32 = 8  -> pick F9
  draw2: b1=85,  remaining=31, 85  mod 31 = 23 -> pick F25
  draw3: b2=149, remaining=30, 149 mod 30 = 29 -> pick F32
  draw4: b3=165, remaining=29, 165 mod 29 = 20 -> pick F22
  draw5: b4=95,  remaining=28, 95  mod 28 = 11 -> pick F13
  draw6: b5=121, remaining=27, 121 mod 27 = 13 -> pick F16
  draw7: b6=108, remaining=26, 108 mod 26 = 4  -> pick F5
  draw8: b7=149, remaining=25, 149 mod 25 = 24 -> pick F31
Drawn (order): F9, F25, F32, F22, F13, F16, F5, F31 — all distinct.

=== STEP 4 · COMPREHENSION QUESTIONS (expected answers quoted from the ORIGINAL sentence) ===
See the draw array. Each expected answer is quoted verbatim from the numbered original sentence above; the prover grades the compressed document against these without ever seeing the proposer's suggestions (T2/GR-4).`;

const gap = { seedHex, draw: JSON.stringify(draw), transcript };
writeFileSync(dir + 'gap.json', JSON.stringify(gap, null, 2), 'utf8');
process.stdout.write('gap.json written\n');
