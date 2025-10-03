We’re in ./audience-store. Make the “Buy” button real now that we have a purchase action.
From the PRD: Users click Buy to spend credits and remove the item from the feed.
Acceptance criteria:
Show Buy only if logged in and not the seller.
Disable or hide if user is seller or not logged in.
Show error messages (credits, already sold).
Tasks:
Update src/components/ItemCard.tsx:
If user logged out → hide or disable Buy.
If user is seller → disable Buy.
Otherwise call purchaseItem on click, show loading state, handle error messages.
On success, refresh or mutate state so the sold item disappears.
Output: updated ItemCard.tsx.