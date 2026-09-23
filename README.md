# Geriatric Care Assessment Form

A single-page assessment form for a visiting nurse. React 19 + TypeScript +
Mantine + Zod. All validation rules live in one Zod schema; the UI only
wires them up.

## Running it

    yarn install
    yarn dev        # http://localhost:5173

## Checks

    yarn test       # typecheck, format, lint, tests, build
    yarn vitest     # tests only

## Structure

    src/features/assessment/
      schema.ts                the Zod schema (given by the brief, unchanged)
      AssessmentForm.tsx       the form
      mobilityOptions.ts       Select options derived from MOBILITY
      sampleData.ts            the valid fixture (invented data)
      schema.test.ts           age boundary
      AssessmentForm.test.tsx  submit path

## Decisions

- Draft vs parsed values. Empty initial values cannot satisfy `Assessment`,
  so the form's state is a mapped type derived from it rather than a second
  hand-written interface. The submit handler calls `assessmentSchema.parse()`
  once, after validation has passed, to get a real `Assessment` for the
  success panel.
- No clamping on the number inputs. Mantine's `NumberInput` rewrites
  out-of-range values by default. That is turned off so an invalid clinical
  score reaches Zod and is rejected rather than silently corrected.
- Dates are `YYYY-MM-DD` strings throughout. No `Date` objects, matching
  `z.iso.date()`.
- `allowDeselect={false}` on the mobility Select so the value can never
  become `null`.

## Not done

- <anything you ran out of time for, or "nothing">

## Time spent

Roughly <N> hours.

## Data

All patient data in this repo is invented.
