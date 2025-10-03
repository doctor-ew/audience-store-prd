Add a server action to create listings.

- Create/Update src/lib/validation.ts with CreateItemSchema { name: string(min 2), description: string(min 10), price: number(int, positive) }.
- Create app/sell/actions.ts:
  export async function createItem(input: { name: string; description: string; price: number })
  - Must validate with CreateItemSchema
  - Require a logged-in user (stub getSession or use existing auth util if present; throw if none)
  - Create Item linked to the session user as seller
  - Return { id } on success, with safe logging (no PII)

Return file contents only; no routes or UI yet.
