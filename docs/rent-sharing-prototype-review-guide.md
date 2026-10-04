# Meeting prototype: your review guide

Use this with the [working prototype checkpoint plan](rent-sharing-prototype-checkpoint-plan.md). The checkpoints help you steer a prototype while it is being built; they are not an approval process for launching the eventual website.

## Prepare one realistic example

Bring a rent month with a total, due date, coordinator, and three roommates with unequal shares. Include one partial contribution and one corrected entry. You can use fictional names and amounts. The implementer will put a ready-to-use version in the prototype and provide a reset action at each hands-on review.

## Checkpoint 1 — Money story

The implementer gives you a one-page scenario card with two possible payment flows. Choose whether the prototype shows roommates paying the coordinator before landlord payment or reimbursing the coordinator afterward. Check whether “recorded,” “remaining,” and “fully received” mean what you expect. The calculations and status words wait for this choice; app setup can proceed.

## Checkpoint 2 — Monthly task

The implementer gives you a runnable local app with sample and blank states. Without coaching, create a rent month, change a share, record and correct a partial contribution, reload, and create the next month. Notice whether the current month and future defaults behave as you expect. A confusing or broken step is fixed before the diagram is connected to it.

## Checkpoint 3 — Sankey

The implementer gives you a live diagram with unpaid, partial, and fully received examples and a matching text list. Try reading the amounts from the diagram first. Collapse two branches into “Others,” explain its total, then expand it. Repeat at phone width. Say where the flow direction or labels mislead you; those findings shape the final export.

## Checkpoint 4 — Meeting rehearsal

The implementer gives you the runnable build, a backup file, an exported image, and a short demo path. Run the demo without coaching. Ask someone new to the project to read a person's share and remaining amount from the image. Import the backup into a fresh browser. Broken or misleading steps are fixed and rehearsed again before the meeting.

For any finding, send: **task → expected result → actual result → impact**. For example: “Collapsed two small shares → expected their sum under Others → saw no member count → could not tell who was hidden.”
