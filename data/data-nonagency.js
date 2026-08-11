/* ============================================================================
   NON-AGENCY WORKSHOPS
   ============================================================================

   Independent workshops that sit on one or more insurer repair panels.
   Edit this file to add, change or remove non-agency workshops.

   TO ADD A WORKSHOP: copy the template below, paste it anywhere between the
   [ and ] brackets, and fill it in. Keep the comma at the end.

     {
       name:     "Workshop name",
       emirate:  "Dubai",
       address:  "Al Quoz Industrial Area 4, Dubai",
       phone:    "050 123 4567",
       hours:    "Sat–Thu 8am–7pm, Fri closed",
       insurers: [
         "GIG Gulf (formerly AXA Gulf)",
         "Tokio Marine"
       ],
       notes:    "Anything worth knowing before dispatch."
     },

   RULES — the page will not load if these are broken:
     • Every value goes inside "double quotes".
     • Every line inside { } ends with a comma, except the last one.
     • Every } is followed by a comma.
     • Lists like insurers: [...] use commas between items.
     • Leave a field as "" or [] if you don't know it yet. Don't delete the line.

   FIELD NOTES:
     hours    — optional, free text. Shown on the card and included when a
                visitor copies the workshop details. Leave the line out if
                you don't know them.
     emirate  — must be spelled exactly as one of:
                "Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"
     insurers — which insurer panels approve this workshop. This drives the
                insurer filter, so spell each name EXACTLY as it appears in
                data-insurers.js, or the filter won't match. Panels currently
                in use:
                  "Dubai National Insurance & Reinsurance Company (DNIRC)"
                  "GIG Gulf (formerly AXA Gulf)"
                  "Insurance House"
                  "Sukoon Insurance (formerly Oman Insurance Company)"
                  "Tokio Marine"
                  "United Fidelity Insurance Company"
     makes    — optional. Leave it out and the workshop is treated as
                "All makes" (it will show up for every car brand searched).
                Only add makes: ["BMW", "Mercedes-Benz"] if the workshop is
                genuinely brand-restricted.
   ============================================================================ */

const nonAgencyWorkshops = [

  {
    name:     "Aarya Auto / Aarya Garage",
    emirate:  "Abu Dhabi",
    address:  "Musaffah M-40, Abu Dhabi",
    phone:    "(+971) 050 386 1850",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "United Fidelity Insurance Company",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Aarya Auto Repairs",
    emirate:  "Abu Dhabi",
    address:  "Abu Dhabi",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Aarya Auto Repairs LLC",
    emirate:  "Abu Dhabi",
    address:  "Musaffah",
    phone:    "0563148959",
    insurers: ["GIG Gulf (formerly AXA Gulf)", "Insurance House"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Al Arabia Auto Maintenance Workshop",
    emirate:  "Abu Dhabi",
    address:  "Al Maqta, Abu Dhabi",
    phone:    "(+971) 02 558 6480 / (+971) 56 422 8794",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch. Sukoon panel lists address as: Um Al Nour, Abu Dhabi."
  },

  {
    name:     "Amigo Automotive Service LLC",
    emirate:  "Abu Dhabi",
    address:  "Abu Dhabi",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Auto Trust",
    emirate:  "Abu Dhabi",
    address:  "Mussafah",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Autosport LLC",
    emirate:  "Abu Dhabi",
    address:  "Musaffah",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Challenge Car Service Center",
    emirate:  "Abu Dhabi",
    address:  "Al Ain",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Elite Motors Workshop LLC",
    emirate:  "Abu Dhabi",
    address:  "Abu Dhabi",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Elite Workshop",
    emirate:  "Abu Dhabi",
    address:  "Industrial Area, Al Ain",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Elite Workshop",
    emirate:  "Abu Dhabi",
    address:  "Mussafah",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Exotic Auto Services LLC",
    emirate:  "Abu Dhabi",
    address:  "Abu Dhabi",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Grand Tourer / Grand Tourer Workshop",
    emirate:  "Abu Dhabi",
    address:  "Musaffah",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)", "United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf, United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Paradise Autocare Center",
    emirate:  "Abu Dhabi",
    address:  "Al Ain",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Paradise Garage",
    emirate:  "Abu Dhabi",
    address:  "Al Ain",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "RAK Arabia",
    emirate:  "Abu Dhabi",
    address:  "Mussafah",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Rafi Auto Workshop / Rafi Garage",
    emirate:  "Abu Dhabi",
    address:  "Musaffah",
    phone:    "",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "GIG Gulf (formerly AXA Gulf)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Smart Autocare LLC",
    emirate:  "Abu Dhabi",
    address:  "Musaffah M-13, Abu Dhabi",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Triple S Garage",
    emirate:  "Abu Dhabi",
    address:  "Musaffah M-13, Abu Dhabi",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "World Linck",
    emirate:  "Abu Dhabi",
    address:  "Industrial Area, Al Ain",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "World Link Auto Centre",
    emirate:  "Abu Dhabi",
    address:  "Al Ain",
    phone:    "(+971) 03 721 8219 / (+971) 055 794 7300 / (+971) 055 201 0689",
    insurers: ["Tokio Marine", "Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Al Arabia Auto Maintenance Workshop",
    emirate:  "Ajman",
    address:  "Al Rashidiya 1, Ajman",
    phone:    "(+971) 06 574 1422 (ext. 867) / (+971) 054 791 9973",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Amari Cars Maintenance",
    emirate:  "Ajman",
    address:  "Ajman",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Motor World",
    emirate:  "Ajman",
    address:  "Ajman",
    phone:    "(+971) 54 990 7961 / (+971) 054 990 7951",
    insurers: [
      "United Fidelity Insurance Company",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "A.R Garage",
    emirate:  "Dubai",
    address:  "Umm Ramoul/Rashdiya/Ras Al Khor",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "AG Cars",
    emirate:  "Dubai",
    address:  "Deira/Quasis",
    phone:    "(+971) 60 054 0045 / (+971) 056 177 2649 / (+971) 050 627 1410",
    insurers: ["Tokio Marine", "Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch. Sukoon panel lists address as: 26th Street, Al Quoz Industrial Area 4, opposite Dewa Sub Station, Al Quoz, Dubai. Sukoon panel lists address as: 8 - Al Khabeesi Road, opposite Hamarain Centre, Deira, Dubai. Sukoon panel lists address as: Industrial Area, Dubai Investments Park (DIP), Dubai."
  },

  {
    name:     "Aarya Auto Repairs",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "(+971) 04 341 7728 / (+971) 050 233 8739",
    insurers: ["Tokio Marine", "Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Aarya Garage",
    emirate:  "Dubai",
    address:  "Ind 4, Al Quoz",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Al Arabia Auto Maintenance Workshop Al Quoz",
    emirate:  "Dubai",
    address:  "Al Qouz, Dubai",
    phone:    "(+971) 04 320 1884 / (+971) 052 601 3075 / (+971) 056 219 2794",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Al Emad Auto Workshop LLC",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Al Kayed Workshop",
    emirate:  "Dubai",
    address:  "Deira",
    phone:    "(+971) 04 269 3333 / (+971) 056 501 7786",
    insurers: ["Tokio Marine", "Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Al Sahari Garage",
    emirate:  "Dubai",
    address:  "Umm Ramoul/Rashdiya/Ras Al Khor",
    phone:    "0525630702",
    insurers: ["Tokio Marine", "Insurance House"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Auto Glass Middle East LLC",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Auto Tech Automotives",
    emirate:  "Dubai",
    address:  "Ras Al Khor",
    phone:    "(+971) 04 3205551 / (+971) 055 3280561",
    insurers: [
      "Tokio Marine",
      "Sukoon Insurance (formerly Oman Insurance Company)",
      "Insurance House"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Auto Trust",
    emirate:  "Dubai",
    address:  "Ras Al Khoor",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Autodeal Automotive Service",
    emirate:  "Dubai",
    address:  "Umm Ramoul/Rashdiya/Ras Al Khor",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Autosport LLC",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Autotrust Dubai",
    emirate:  "Dubai",
    address:  "Ras Al Khor Industrial Area 1",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Axis Auto Garage",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "Tokio Marine"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Bobber & Chopper Motorcycles Repairing LLC",
    emirate:  "Dubai",
    address:  "Dubai",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Boby Auto Garage",
    emirate:  "Dubai",
    address:  "Umm Ramool, Dubai",
    phone:    "0522069434",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "Insurance House"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Burj Al Arab",
    emirate:  "Dubai",
    address:  "Dubai/Deira Al Khubaisi",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "CAM Auto Centre",
    emirate:  "Dubai",
    address:  "Dubai Investment Park - 1",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Emirates Transport",
    emirate:  "Dubai",
    address:  "Dubai",
    phone:    "(+971) 52 783 0146 / (+971) 50 744 2823",
    insurers: [
      "GIG Gulf (formerly AXA Gulf)",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Frankfurt Auto Dubai",
    emirate:  "Dubai",
    address:  "Al Rashidia, Dubai",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Gargash Auto Repair / Gargash Auto Repair Workshop Al Qusais",
    emirate:  "Dubai",
    address:  "Al Qusais",
    phone:    "(+971) 04 267 9971 / (+971) 056 6899131 / (+971) 056 4156702",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "GIG Gulf (formerly AXA Gulf)",
      "Sukoon Insurance (formerly Oman Insurance Company)",
      "Insurance House"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Gargash Auto Repair / Gargash Auto Repair Workshop Al Quoz",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "(+971) 04 258 4460 / (+971) 056 689 9161 / (+971) 056 219 6723",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "GIG Gulf (formerly AXA Gulf)",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Golden Workshop",
    emirate:  "Dubai",
    address:  "Umm Ramoul/Rashdiya/Ras Al Khor",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Golden Workshop Car Repairing",
    emirate:  "Dubai",
    address:  "24b, Dubai",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Hotline Auto Workshop",
    emirate:  "Dubai",
    address:  "Umm Ramool, Dubai",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Jahan",
    emirate:  "Dubai",
    address:  "Al Rashidia, Dubai",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "King Road Garage",
    emirate:  "Dubai",
    address:  "Muhaisnah 4, Al Qusais",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Liwa Automobile Services",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Majestic Car Care LLC",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Mohd. Ishaq Khan Garage",
    emirate:  "Dubai",
    address:  "Al Qusais Industrial Area No. 1",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "N K Auto Maint Workshop / NK Auto",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)", "United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf, United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "PAL Auto Garage",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "PAL Auto Garage",
    emirate:  "Dubai",
    address:  "Deira",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "PAL Platina",
    emirate:  "Dubai",
    address:  "DIP",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Perfect Shine Auto Care Center",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Platinum Motor Cars Repairing",
    emirate:  "Dubai",
    address:  "Quasis",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Prime Max Auto Maintenance",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Regent Mechanical Service LLC / Regent Mechanical Services LLC",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "GIG Gulf (formerly AXA Gulf)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Rover Auto Centre",
    emirate:  "Dubai",
    address:  "Al Quoz Industrial Area 4 - Dubai",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Smart Auto Care LLC AL Quoz",
    emirate:  "Dubai",
    address:  "Ashok Leyland Service Centre - 29 9B Street - Al Quoz - Dubai",
    phone:    "(+971) 04 203 9839 / (+971) 056 4083182",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Smart Auto Care LLC Rashidiya",
    emirate:  "Dubai",
    address:  "PBNO 1200 - 13 8b St - Al Rashidiya - Dubai",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Star Square Deal Motors",
    emirate:  "Dubai",
    address:  "Al Quoz",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Top Gear Services",
    emirate:  "Dubai",
    address:  "Umm Ramoul/Rashdiya/Ras Al Khor",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "United Motors Auto Workshop",
    emirate:  "Dubai",
    address:  "Umm Ramoul/Rashdiya/Ras Al Khor",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Vertex Auto / Vertex Auto Service Center LLC",
    emirate:  "Dubai",
    address:  "Ras Al Khor",
    phone:    "",
    insurers: ["Tokio Marine", "United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine, United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Al Shaji Auto Rep. Workshop",
    emirate:  "Fujairah",
    address:  "Fujairah",
    phone:    "0507897420",
    insurers: ["GIG Gulf (formerly AXA Gulf)", "Tokio Marine", "Insurance House"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf, Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Emirates Transport",
    emirate:  "Fujairah",
    address:  "Al Hail, Fujairah",
    phone:    "(+971) 09 202 9154 / (+971) 054 309 1336 / (+971) 056 615 8205",
    insurers: [
      "Tokio Marine",
      "United Fidelity Insurance Company",
      "Sukoon Insurance (formerly Oman Insurance Company)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine, United Fidelity Insurance Company). Verify current contact details before dispatch. Sukoon panel lists address as: Al Hayl, Near Traffic Department (Murror), Fujairah."
  },

  {
    name:     "MK Motors",
    emirate:  "Fujairah",
    address:  "Fujairah",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "AG Cars (RAK)",
    emirate:  "Ras Al Khaimah",
    address:  "RAK",
    phone:    "(+971) 60 054 0045 / (+971) 050 428 9861 / (+971) 052 607 6618",
    insurers: ["Tokio Marine", "Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Al Arabia Auto Maintenance RAK",
    emirate:  "Ras Al Khaimah",
    address:  "Ras Al Khaimah",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Burj Al Arab",
    emirate:  "Ras Al Khaimah",
    address:  "Ras Al Khaimah",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Lamsi Garage",
    emirate:  "Ras Al Khaimah",
    address:  "Ras Al Khaimah",
    phone:    "",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "GIG Gulf (formerly AXA Gulf)"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "RAK Arabia / RAK Arabia Auto Services",
    emirate:  "Ras Al Khaimah",
    address:  "RAK",
    phone:    "",
    insurers: ["Tokio Marine", "United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine, United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Red Fox",
    emirate:  "Ras Al Khaimah",
    address:  "Ras Al Khaimah",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Al Arabia (Auto Maintenance) / Al Arabia Auto Maint Workshop / Al Arabia Auto Maintenance Workshop LLC SP",
    emirate:  "Sharjah",
    address:  "Industrial 17, Sharjah",
    phone:    "",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "GIG Gulf (formerly AXA Gulf)",
      "Tokio Marine"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, GIG Gulf, Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Al Deema Auto Maint. Workshop",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Al Mamlkah Garage",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Bin Sandal Mechanical Station",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "0509395489",
    insurers: ["Tokio Marine", "Insurance House"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Dhanya Auto Care Center",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "0569863490",
    insurers: ["GIG Gulf (formerly AXA Gulf)", "Insurance House"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Frankfurt Auto Services",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Gear One Auto Maint",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "NK Auto",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["United Fidelity Insurance Company"],
    notes:    "Non-agency workshop compiled from insurer garage lists (United Fidelity Insurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "Nasir Kalaji Auto Maint",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "North Star Auto Maintenance",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["Tokio Marine"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Samrah Auto Repairing / Samrah Auto Repairing Workshop / Samrah Auto Repairing Workshop LLC",
    emirate:  "Sharjah",
    address:  "Industrial Area 12, Sharjah",
    phone:    "",
    insurers: [
      "Dubai National Insurance & Reinsurance Company (DNIRC)",
      "GIG Gulf (formerly AXA Gulf)",
      "Tokio Marine"
    ],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company, GIG Gulf, Tokio Marine). Verify current contact details before dispatch."
  },

  {
    name:     "Smart Auto Care",
    emirate:  "Sharjah",
    address:  "Sharjah",
    phone:    "",
    insurers: ["GIG Gulf (formerly AXA Gulf)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (GIG Gulf). Verify current contact details before dispatch."
  },

  {
    name:     "Smart Autocare LLC",
    emirate:  "Sharjah",
    address:  "Industrial Area No 6, Sharjah",
    phone:    "",
    insurers: ["Dubai National Insurance & Reinsurance Company (DNIRC)"],
    notes:    "Non-agency workshop compiled from insurer garage lists (Dubai National Insurance & Reinsurance Company). Verify current contact details before dispatch."
  },

  {
    name:     "AutoGlass",
    emirate:  "Dubai",
    address:  "Sheikh Zayed Road Times Square Service Road, Warehouse 4, Al Quoz, Dubai",
    phone:    "(+971) 04 380 6004 / (+971) 050 110 8093 / 800 288 645 277",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Anne."
  },

  {
    name:     "Motor World Workshop LLC (Al Kayed)",
    emirate:  "Dubai",
    address:  "13 9B street, Al Quoz Industrial Area 3, Dubai",
    phone:    "(+971) 04 286 3336 / (+971) 054 990 7957 / (+971) 052 672 1117",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Hussain."
  },

  {
    name:     "Denso Auto Repairing Workshop",
    emirate:  "Dubai",
    address:  "34th Aman Street, Al Qusais Industrial Area 5, Dubai",
    phone:    "(+971) 04 288 8776 / (+971) 056 524 2212",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Subramanian."
  },

  {
    name:     "Elite Motors Workshop LLC",
    emirate:  "Abu Dhabi",
    address:  "Al Lujayn, 7th Street, Sanaya, Al Ain",
    phone:    "(+971) 050 688 1045",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Abid Ahmed."
  },

  {
    name:     "AG Car Services",
    emirate:  "Abu Dhabi",
    address:  "13th Street, M 37, Abu Dhabi",
    phone:    "(+971) 60 054 0045 / (+971) 056 908 7871 / (+971) 050 428 9821 / (+971) 050 627 1658",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Faizal Khader / Azim Khan."
  },

  {
    name:     "Emirates Transport",
    emirate:  "Abu Dhabi",
    address:  "Musaffah M-40, Opposite Three Star Gift, Abu Dhabi",
    phone:    "(+971) 02 201 9724 / (+971) 050 680 4599 / (+971) 050 225 7521",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Waqas / Ahmed."
  },

  {
    name:     "Alsa Automotive Engineering",
    emirate:  "Abu Dhabi",
    address:  "Mussafah Industrial Area, M39, Abu Dhabi",
    phone:    "(+971) 02 554 4166 / (+971) 056 422 0477 / (+971) 056 996 0364",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Christia / Hashem."
  },

  {
    name:     "Elite Motors Workshop LLC (Al Kayed)",
    emirate:  "Abu Dhabi",
    address:  "Musaffah, M-11, Abu Dhabi",
    phone:    "(+971) 02 554 5433 / (+971) 56 501 7812",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Danish."
  },

  {
    name:     "2000 Auto Workshop",
    emirate:  "Abu Dhabi",
    address:  "12th Street, Musaffah, M-33, Abu Dhabi",
    phone:    "(+971) 02 551 5645 / (+971) 50 536 8825 / (+971) 050 224 4209",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Anshad / Shamseer."
  },

  {
    name:     "Dharagima Auto",
    emirate:  "Abu Dhabi",
    address:  "Musaffah, M-9, Abu Dhabi",
    phone:    "(+971) 02 555 3420 / (+971) 506 704 0864 / (+971) 050 617 5830",
    insurers: [
      "Sukoon Insurance (formerly Oman Insurance Company)",
      "Insurance House"
    ],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Ahmed Younes / Bilal / Atef Nemer."
  },

  {
    name:     "Smart Auto Care",
    emirate:  "Abu Dhabi",
    address:  "Swaidhan Trading LLC, Abu Dhabi",
    phone:    "(+971) 02 554 6822 / (+971) 056 408 3182",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Riyas Hamsa."
  },

  {
    name:     "Emirates Transport",
    emirate:  "Ajman",
    address:  "Al Jurf No. 1, opposite International Indian School, Ajman",
    phone:    "(+971) 04 233 6547 / (+971) 55 222 3721",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Iyad."
  },

  {
    name:     "Al Arabia Auto Services",
    emirate:  "Ras Al Khaimah",
    address:  "Al Dhaid South, behind RAK Transport Authority, Ras Al Khaimah",
    phone:    "(+971) 07 227 5917 / (+971) 052 601 3032",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Abdul Hameed / Habeeb Meeadh."
  },

  {
    name:     "Emirates Transport",
    emirate:  "Ras Al Khaimah",
    address:  "Al Sharisha Area, after Julfar Traffic Signal, Ras Al Khaimah",
    phone:    "(+971) 07 207 4908 / (+971) 07 207 4974 / (+971) 056 614 7024",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Unni Raj / El Hadi."
  },

  {
    name:     "AG Cars Services",
    emirate:  "Sharjah",
    address:  "Industrial Area 13, near Ramez Hyper Market, Sharjah",
    phone:    "(+971) 60 054 0045 / (+971) 050 627 1953 / (+971) 050 428 0649 / (+971) 050 429 0716",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Mohammed Fada / Jayaprakash / Shiji."
  },

  {
    name:     "Al Arabia Auto Services",
    emirate:  "Sharjah",
    address:  "Industrial Area No.17, Ardh Al Maahed, Sharjah",
    phone:    "(+971) 06 574 1422 / (+971) 052 609 7120",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Anujith Divakar / Jittu Joy."
  },

  {
    name:     "Emirates Transport - Luxury",
    emirate:  "Sharjah",
    address:  "Industrial Area 12, opposite FEWA, Sharjah",
    phone:    "(+971) 04 204 2489 / (+971) 55 563 2424",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Abdul Razak."
  },

  {
    name:     "Al Amana Auto Wash & Repair Garage",
    emirate:  "Sharjah",
    address:  "St. No.10, Behind Geco Complex, Maleha St, Sharjah",
    phone:    "971065352010 / (+971) 050 6284727 / (+971) 050 3749269",
    insurers: ["Sukoon Insurance (formerly Oman Insurance Company)"],
    notes:    "Non-agency workshop from Sukoon's Key Partner Garage list. Contact: Vishnu / Bala."
  },

  {
    name:     "Alshoala Mechanical Workshop L.L.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0561212229",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "National Tech Auto Services - L.L.C - S.P.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0565345904",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Technical Elite Auto Repairing Workshop",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0507914199",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "E Trust Motors Auto Repair",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0506999626",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Jars Al Feddi Car Services Center L.L.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0506206235",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "New Castle Auto Repair Garage L.L.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0558992871",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Corniche Auto Repair Workshop",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0506422718",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Rida Automechanical Repairs",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0556221144",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Alshatie Auto Services Workshop L.L.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0555999336",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Mubashir Auto Repair Workshop L.L.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0508262042",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Seapal Auto Repairs",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0558992872",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Zodiac Automobile Repair Sole Proprietorship L.L.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0565099984",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Karnak Auto Repair Car Services",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0505638656",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Ogaily Auto Repair Workshop",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0506147173",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Grand Tourer Workshop",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0502002986",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Smart Motor Auto Repair",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0521285675",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Skyline Auto Repair Workshop L.L.C",
    emirate:  "Abu Dhabi",
    address:  "MUSSAFAH",
    phone:    "0529801474",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Dynatrade Auto Services Centre LLC",
    emirate:  "Abu Dhabi",
    address:  "MAFRAQ",
    phone:    "0566808837",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Run And Drive Main. & Gen. Repair Of Vehicles L.L.C",
    emirate:  "Dubai",
    address:  "RASHIDIYA",
    phone:    "0501898076",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Abdulhafidh Aljassmi Garage",
    emirate:  "Dubai",
    address:  "AL QUSAIS",
    phone:    "0529119351",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Autozone Motors Workshop",
    emirate:  "Dubai",
    address:  "RASHIDIYA",
    phone:    "0547094189",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Dynatrade Auto Services Centre LLC",
    emirate:  "Dubai",
    address:  "Nad Al Hamar",
    phone:    "0565366061",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Dynatrade Auto Services Centre LLC",
    emirate:  "Dubai",
    address:  "AL QUOZ",
    phone:    "0502157527",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Regent Mechanical Services",
    emirate:  "Dubai",
    address:  "AL QUOZ",
    phone:    "0586411847",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Raya Al Bayda Workshop",
    emirate:  "Sharjah",
    address:  "SHARJAH",
    phone:    "0505813356",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Sayda Car Repairing Workshop",
    emirate:  "Sharjah",
    address:  "SHARJAH",
    phone:    "0559399500",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Arizona Auto Repairs Workshop",
    emirate:  "Sharjah",
    address:  "SHARJAH",
    phone:    "0506777994",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Dynatrade Auto Services Centre LLC",
    emirate:  "Sharjah",
    address:  "SHARJAH",
    phone:    "0507845062",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Paradise Auto Care Centre L.L.C",
    emirate:  "Abu Dhabi",
    address:  "AL AIN",
    phone:    "0563510057",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Baroon Garage",
    emirate:  "Abu Dhabi",
    address:  "AL AIN",
    phone:    "0529233330",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Extra Zoom Auto Repair",
    emirate:  "Abu Dhabi",
    address:  "AL AIN",
    phone:    "0506101501",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Jaddaf Auto Garage L.L.C",
    emirate:  "Abu Dhabi",
    address:  "AL AIN",
    phone:    "0558681628",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Al Bawadi Garage",
    emirate:  "Abu Dhabi",
    address:  "AL AIN",
    phone:    "0557099551",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Dynatrade Auto Services Centre LLC",
    emirate:  "Abu Dhabi",
    address:  "AL AIN",
    phone:    "0504629756",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Car Center Garage",
    emirate:  "Ras Al Khaimah",
    address:  "RAK",
    phone:    "0502613613",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "AG Cars",
    emirate:  "Ras Al Khaimah",
    address:  "RAK",
    phone:    "0504289861",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Burj Al Arab Auto Care",
    emirate:  "Ras Al Khaimah",
    address:  "RAK",
    phone:    "0568822997",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Online Garage",
    emirate:  "Ajman",
    address:  "AJMAN",
    phone:    "0544777098",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Abdulhafidh Aljassmi Garage",
    emirate:  "Umm Al Quwain",
    address:  "U.A.Q",
    phone:    "0528621074",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

  {
    name:     "Dynatrade Auto Services Centre LLC",
    emirate:  "Abu Dhabi",
    address:  "AL RUWAIS",
    phone:    "0566808837",
    insurers: ["Insurance House"],
    notes:    "Non-agency workshop from Insurance House's garage list — used for both EV and ICE claims (Insurance House does not maintain separate networks for the two)."
  },

];
