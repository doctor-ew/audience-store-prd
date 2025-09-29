We’re in ./audience-store. Build the Sell page so users can list a new item and connect it to the createItem server action you just made.
From the PRD: Users should be able to list a product with a Name, Description, and Price. The form should validate and show helpful errors. After a successful listing, send them back to the homepage.
From the spec: Item has fields name, description, price, sellerId. A listing belongs to the logged-in user and only works when they’re authenticated.
Acceptance criteria:
If not logged in, redirect to /login.
Show a form with name, description, and price.
Validate and show field-level error messages.
On success, create the item via createItem and navigate back to the homepage.
Tasks:
Add a new page at app/sell/page.tsx that checks if the user is logged in. If not, push them to /login.
Create a src/components/SellForm.tsx with controlled inputs for name, description, price.
On submit, call createItem. Show inline errors and a success state before redirecting.
Keep styling minimal with Tailwind so it’s easy to follow.
Output: the new app/sell/page.tsx and src/components/SellForm.tsx files.