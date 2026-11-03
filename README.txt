GENESIS WEBSITE
Double-click index.html. Every page in this folder is fully self-contained
(CSS, JavaScript and images are built in), so it works wherever you put it.
Just keep all the .html files together in the same folder so the links work.

TO EDIT: open the source/ folder, change js/data.js (products, prices, downloads,
articles, payments, company details), css/style.css or the .html files, then run
  python3 build.py
inside source/. That regenerates the self-contained pages in source/dist/.

Payments (js/data.js -> PAYMENTS): blank = demo mode, no money is taken.
PayFast: add merchantId + merchantKey (use sandbox first), plus server-side signature/ITN checks.
Google Pay: demo only; live use needs a Google merchant ID, a gateway and a server.
Accounts, carts and orders are stored in the visitor's browser only.
Download files are placeholders: replace with real installers.
