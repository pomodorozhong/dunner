# Bill split: How do we make it?

## Scope and outcome

Build a small browser-based portfolio project that helps one upfront payer create a bill, track reimbursements, and export a clear payment request. The MVP supports one currency per bill and 2–8 named participants. Bills are saved locally, with no accounts or backend. The only shareable output is an image; payments happen outside the app.

The exported image must stand on its own. Each recipient should be able to identify themselves and understand their share, the amount recorded as paid, and the amount still owed.

## MVP requirements

The creator can create, edit, and delete a bill; split it equally or assign custom amounts; and manually record partial or full reimbursements. Shares must reconcile exactly to the bill total, and incorrect entries must be easy to correct.

The live chart, accessible text list, and exported image use the same state. Before sharing, the creator can preview the image, adjust participant display labels, and choose a neutral bill title. The app must handle empty bills, invalid totals, rounding, overpayment, fully settled bills, and failed exports.

Read-only share links, receipt scanning, item-level splits, recurring groups, multi-bill balances, multiple upfront payers, multiple currencies, and debt simplification are deferred. Themes, celebrations, and deeper personalization come after readability is proven.

## Money, payments, and edits

### Calculation and status rules

- Store amounts in the currency's smallest unit and state the rounding rule. For equal splits with a remainder, distribute extra smallest units deterministically and show the resulting shares before sharing.
- Every share is nonnegative, and shares sum to the final bill total. A reimbursement cannot exceed the participant's outstanding amount without an explicit correction flow.
- **Amount owed = assigned share − covered amount.** The upfront payer's own share is covered by their original payment; for everyone else, covered amount is the sum of recorded reimbursements. Treatment of refunds and excess reimbursements remains an open decision below.
- The app records what the payer says they received; it does not verify a bank transfer. Label reimbursements **“recorded as paid”** rather than implying payment-provider confirmation.
- Before saving a changed split, show its effect on recorded reimbursements and outstanding amounts.

### Open decision: edits after reimbursements — high severity

An edit preview alone does not resolve every financial state. If someone has reimbursed $40 and their share becomes $30, the formula produces −$10 owed. Removing a reimbursed participant or changing the upfront payer can also leave the bill's amounts and payment records inconsistent.

Before implementing these edits, decide which are blocked and which require an explicit refund or correction flow. Preserve actual recorded reimbursements when shares change; never silently reduce or erase them to reconcile a new split. Correcting an incorrect payment entry and recording a real refund must be distinct actions.

The rules must define how excess reimbursements appear in participant amounts, totals, status labels, and exports, as well as when participant removal or payer changes are allowed. Validate the rules with three cases: a share reduced below the amount reimbursed, removal of a reimbursed participant, and a payer change after partial settlement.

## Sharing, privacy, and presentation

Numbers and status labels take precedence over motion or ornament. Use text, patterns, and shape cues so meaning does not depend on color, and give the chart an equivalent accessible list. Let the creator review exact recipient amounts and everything the image reveals before sharing. After a correction, they can export a newly dated image without starting a new bill.

Offer first-name or initial display, recognizable aliases, and neutral bill titles. Display-label changes must retain the same participant and payment records internally.

### Open decision: private labels and recognition — medium severity

Privacy controls can make recipients hard to identify. Two people labeled “Alex” or “A” may not know which obligation is theirs, even if the creator finds the preview clear.

Require distinct participant display labels in the export. Surface collisions after privacy controls are applied and require the creator to resolve them before exporting. The final interaction for choosing recognizable aliases or disambiguating labels still needs to be designed.

Validate recognition with recipients using only the privacy-adjusted image, including duplicate first names and initials. Each person should be able to identify their own row and amount owed without coaching.

## Validation and release gate

The main product risk is comprehension: slice size represents **share**, while fill represents **payment progress**. A visually rich pie may make a simple obligation confusing. If people misread the static image, simplify the encoding or reduce decoration before shipping it as a payment request.

The primary measure is **the percentage of created bills for which recipients can correctly state their share, amount already recorded as paid, and amount still owed after viewing only the exported image**. In usability sessions, aim for at least 90% correct answers across these three questions before emphasizing visual polish.

Test with at least five people who recently received a bill-splitting request, comparing the image against their current way of asking for reimbursement. Ask what the chart means, what they would pay, and whether the request feels comfortable to receive. Include small phone previews, grayscale viewing, long names, partial payments, and the recipient-recognition cases above.

Supporting measures are time to create and export a bill, corrected splits after review, actual image sharing, recorded settlement completion, and recipient interest in making their own chart. Treat recipient interest as an early signal of word-of-mouth potential, not a guaranteed result of attractive visuals.

## Delivery sequence

1. **Make a moodboard.** Gather references for expressive pies, poster-like layouts, typography, color, texture, and motion. Identify what feels distinctive and remains clear at phone preview size.
2. **Prototype the information model.** Draw the chart and export with realistic uneven splits and partial payments. Clarify “paid” versus “owed” and resolve the edit and privacy decisions above.
3. **Build bill entry and tracking.** Calculate and review shares, record reimbursements, and implement the agreed correction and edit rules.
4. **Build one chart system.** Generate live interactions and deterministic static exports from the same data, with privacy controls and image preview.
5. **Pilot image sharing.** Run usability sessions with real groups to assess amounts, recipient recognition, privacy, legibility, and comfort.
6. **Polish based on evidence.** Improve legibility, tone, and delight once recipients consistently understand the amounts.
