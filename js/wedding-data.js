/**
 * wedding-data.js — Editable configuration for the Wedding Invitation
 * Edit any text, date, schedule, venue, RSVP contact, or media path below.
 */

window.WEDDING_DATA = {
  couple: {
    groom: "Salman",
    bride: "Maheen",
    subtitle: "Two Souls <br />One Destiny <br />A Lifetime written by Allah",
  },

  wedding: {
    dateLabel: "30.07.27",
    dateISO: "2027-07-30T14:00:00+05:30",
    eventTitle: "Walima Celebration",
    invitationNote:
      "Dear Family & Friends,<br />With the grace of Almighty Allah, we cordially invite you to celebrate the Walima ceremony of <strong>Saaid Bashir</strong> & <strong>Ayesha Choudhary</strong> as they unite their lives in love, blessings, and faith.",
  },

  schedule: [
    { title: "Guest Arrival", time: "2:00 PM" },
    { title: "Lunch", time: "2:30 PM" },
  ],

  venue: {
    name: "Mujgund",
    address: "HMT Srinagar",
    mapsUrl: "https://share.google/dB7g1H3ZVYxp0CFsR",
  },

  rsvp: {
    title: "RSVP",
    name: "Ronak Bashir",
    phone: "+91 7889640197",
    whatsapp: "7889640197",
  },

  media: {
    overlayImage: "./assets/media/ribbon-cover.jpg",
    sealVideo: "./assets/media/ribbon-open.mp4",
    heroVideo: "./assets/media/hero-swans.mp4",
    audio: "./assets/media/wedding-music.mp3",
    ogImage: "./assets/media/og-image.jpg",
  },
};
