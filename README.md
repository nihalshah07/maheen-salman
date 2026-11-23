# Saaid Bashir & Ayesha Choudhary — Wedding Invitation Webpage

A static HTML, CSS, and JavaScript wedding invitation webpage recreating every visual asset, typeface, video transition, audio player, and scroll animation from the reference invitation — ready to deploy directly to **GitHub Pages**.

## Project Structure

```text
saaid-weds-ayesha/
├── index.html              # Main HTML5 structure
├── css/
│   ├── fonts.css           # Self-hosted @font-face declarations
│   └── styles.css          # Layout, responsive rules, cards & animations
├── js/
│   ├── wedding-data.js     # Editable names, date, schedule, venue & RSVP config
│   └── script.js           # Wax-seal video intro, music toggle, countdown & scroll effects
└── assets/
    ├── media/              # Envelope image, wax-seal video, lakeside swans video, music & OG preview
    ├── images/             # Floral bouquets, torn parchment edges, Bismillah, rose & gold flourishes
    └── fonts/              # Self-hosted WOFF/WOFF2 font files
```

## Customizing Details

Edit `js/wedding-data.js` to change:
- **Couple names & subtitle** (`couple.groom`, `couple.bride`, `couple.subtitle`)
- **Date & countdown target** (`wedding.dateLabel`, `wedding.dateISO`, `wedding.eventTitle`, `wedding.invitationNote`)
  - *Note:* When `wedding.dateISO` is in the future, the live `Days : Hours : Minutes : Seconds` flip countdown is shown; once the date passes, it displays `See you there!`.
- **Schedule** (`schedule` array)
- **Venue & Google Maps link** (`venue.name`, `venue.address`, `venue.mapsUrl`)
- **RSVP contact, Call & WhatsApp buttons** (`rsvp.name`, `rsvp.phone`, `rsvp.whatsapp`)

## Deploying to GitHub Pages

1. Create a new repository on GitHub (for example, `wedding-invitation`).
2. Upload or push all files and folders inside `saaid-weds-ayesha/` to the root of your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial wedding invitation webpage"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In your GitHub repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, and click **Save**.
5. Your live wedding invitation URL will appear in ~1 minute at `https://<your-username>.github.io/<your-repo>/`.
