We’re in ./audience-store. Build the homepage so it shows the marketplace of unsold items.
From the PRD: The homepage should display a feed of items that are currently for sale — name, price, and seller info. Keep it simple and clear.
From the spec: An item is “for sale” when purchasedById is null. Order newest first (createdAt DESC).
Acceptance criteria: Homepage only shows unsold items. Each card shows name, price (credits), and seller’s email. If there are none, show an empty state message (“No items for sale yet”). “Buy” button should appear but stay disabled for now.
Tasks:
Update app/page.tsx to query Items where purchasedById is null and sort newest first.
Create a new src/components/ItemCard.tsx to render name, price, seller email, and a disabled Buy button.
Handle empty state with a friendly message.
Output: app/page.tsx and ItemCard.tsx contents.