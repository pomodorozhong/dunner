# Bill split: How do we make it?

## MVP requirements

Build this as a small browser-based portfolio project. Save bills locally, with no accounts or backend. The only shareable output is the exported image; the app does not process payments or connect to banks.

**Must have**

- Create, edit, and delete a bill with 2–8 named participants and one upfront payer.
- Equal and custom-amount splits, with exact reconciliation to the total.
- Manual marking of partial and full reimbursements, with easy correction.
- Live chart, equivalent text list, and exported image generated from the same state.
- Image preview, privacy controls for names and bill title, and a way to delete the local bill.
- Empty, invalid-total, rounding, overpayment, fully settled, and failed-export states.

**Later**

- Read-only share link with a clear snapshot/current-state distinction.
- Receipt scanning and item-level splitting; recurring groups and multi-bill balances.
- Multiple upfront payers, multiple currencies, and debt simplification.
- Themes, celebrations, and deeper personalization once readability is proven.

## Money and status rules

- Store amounts in the currency's smallest unit and use a stated rounding rule. For an equal split with a remainder, distribute the extra smallest units deterministically and display the resulting amounts before sharing.
- Every participant's share is nonnegative, and the shares must sum to the final bill total. A reimbursement cannot exceed that participant's outstanding amount without an explicit correction flow.
- **Amount owed = assigned share − covered amount.** For the upfront payer, their own share is covered by their original payment; for others, covered amount is the sum of recorded reimbursements.
- The app records what the payer says they received; it does not verify a bank transfer. Label these entries **“recorded as paid”** rather than claiming payment-provider confirmation.
- A changed split must surface any effect on previously recorded reimbursements before the edit is saved.

## Experience principles

1. **Exact before expressive.** Numbers and status labels take precedence over motion or ornament.
2. **No color-only meaning.** Use text, patterns, and shape cues; ensure the chart has an equivalent accessible list.
3. **No surprise debt.** Let the creator review the final image and recipient amounts before sharing.
4. **Make correction easy.** Let the creator edit a wrong amount and export a newly dated image without starting a new bill.
5. **Protect the group.** Offer first-name/initial display, neutral bill titles, and a preview of exactly what a shared image reveals.

## Success criteria and validation

The primary measure is **the percentage of created bills for which recipients can correctly state their share, amount already recorded as paid, and amount still owed after viewing only the exported image**. In usability sessions, aim for at least 90% correct answers across these three questions before emphasizing visual polish.

Supporting measures: time to create and export a bill; rate of corrected splits after review; whether creators actually share the image; recorded settlement completion; and whether recipients express interest in making their own chart. Treat that last measure as an early signal of word-of-mouth potential, not a guaranteed outcome of attractive visuals.

Test the concept with at least five people who recently received a bill-splitting request. Compare the image against their current way of asking for reimbursement. Ask each recipient what the chart means without coaching, what they would pay, and whether the request feels comfortable to receive. Test small phone previews, grayscale viewing, long names, and partial payments.

## Suggested delivery sequence

1. **Make a moodboard:** Gather references for expressive pies, poster-like image layouts, typography, color, texture, and motion. Identify what feels distinctive and what still reads clearly at phone preview size.
2. **Prototype the information model:** Draw the chart and export with realistic bills, including uneven splits and partial payments. Resolve any ambiguity in “paid” versus “owed.”
3. **Build bill entry and tracking:** Enter a total and participants, calculate and review shares, then manually mark reimbursements. No payment processing or bank integration.
4. **Build one chart system:** Live interactions and deterministic static export from the same data.
5. **Pilot image sharing:** Export the image, review its privacy and legibility, and run usability sessions with real groups.
6. **Polish based on evidence:** Improve legibility, tone, and delight after recipients consistently understand the amounts.

## Main product risk

A visually rich pie can make a simple obligation look confusing, especially when slice size means **share** while the fill means **payment progress**. The release gate is comprehension: if people misread the chart in static form, simplify the encoding or reduce decoration before shipping it as a payment request.
