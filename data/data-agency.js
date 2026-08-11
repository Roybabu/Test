/* ============================================================================
   AGENCY (DEALER) WORKSHOPS
   ============================================================================

   These are manufacturer-authorised dealer / distributor bodyshops.
   Edit this file to add, change or remove agency workshops.

   TO ADD A WORKSHOP: copy the template below, paste it anywhere between the
   [ and ] brackets, and fill it in. Keep the comma at the end.

     {
       name:    "Workshop name (Emirate)",
       makes:   ["Toyota", "Lexus"],
       emirate: "Dubai",
       address: "Al Quoz Industrial Area 3, Dubai",
       phone:   "04 123 4567",
       hours:   "Sat–Thu 8am–7pm, Fri closed",
       notes:   "Anything worth knowing before dispatch."
     },

   RULES — the page will not load if these are broken:
     • Every value goes inside "double quotes".
     • Every line inside { } ends with a comma, except the last one.
     • Every } is followed by a comma.
     • Lists like makes: [...] use commas between items.
     • Leave a field as "" if you don't know it yet. Don't delete the line.

   FIELD NOTES:
     makes   — the car brands this workshop is authorised to repair.
     emirate — must be spelled exactly as one of:
               "Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"
     phone   — free text, any format.
     hours   — optional, free text. Shown on the card and included when a
               visitor copies the workshop details.
     notes   — shown on the card. Good place for "verify address before dispatch".

   Agency workshops don't take an insurer panel — insurers are only used for
   non-agency workshops (see data-nonagency.js).
   ============================================================================ */

const agencyWorkshops = [

  {
    name:    "Gargash Enterprises — Mercedes-Benz (Dubai)",
    makes:   ["Mercedes-Benz", "Maybach"],
    emirate: "Dubai",
    address: "14 19th St, Al Quoz Industrial Area 3, Dubai",
    phone:   "",
    notes:   "Corrected to the actual body/collision repair address (Gargash Enterprises Al Quoz) — not the Sheikh Zayed Road showroom. Also operates in Sharjah and Abu Dhabi, exact bodyshop addresses there unconfirmed."
  },

  {
    name:    "Al Futtaim Auto Centers — Toyota, Lexus, Volvo, Jeep, Honda, Dodge, BYD (Dubai)",
    makes:   ["Toyota", "Lexus", "Volvo", "Jeep", "Honda", "Dodge", "BYD"],
    emirate: "Dubai",
    address: "Al Rashidiya / Umm Ramool, Dubai",
    phone:   "",
    notes:   "This is the actual shared body/collision repair network for these Al-Futtaim/Trading Enterprises brands — corrected from the Sheikh Zayed Road / Festival City showroom addresses. BYD also routes through this network."
  },

  {
    name:    "Al Futtaim Auto Centers — Toyota, Lexus, Volvo, Jeep, Honda, Dodge, BYD (Sharjah)",
    makes:   ["Toyota", "Lexus", "Volvo", "Jeep", "Honda", "Dodge", "BYD"],
    emirate: "Sharjah",
    address: "Industrial Area 4, Sharjah (near Lulu Al Wadha)",
    phone:   "",
    notes:   "Confirmed Sharjah branch of the shared Al-Futtaim/Trading Enterprises bodyshop network."
  },

  {
    name:    "Al Futtaim Motors — Honda (Abu Dhabi)",
    makes:   ["Honda"],
    emirate: "Abu Dhabi",
    address: "M-15, Musaffah, Abu Dhabi",
    phone:   "",
    notes:   "Confirmed separate Abu Dhabi Honda bodyshop branch."
  },

  {
    name:    "Trading Enterprises — Jeep, Chrysler, Dodge, RAM (Dubai)",
    makes:   ["Jeep", "Chrysler", "Dodge", "RAM"],
    emirate: "Dubai",
    address: "Al Rashidiya / Umm Ramool, Dubai",
    phone:   "",
    notes:   "Jeep/Dodge repairs route through the shared Al Futtaim Auto Centers network in Dubai. In Abu Dhabi, Jeep body repair is instead handled by a separate company, Western Motors (see separate entry) — do not send Abu Dhabi Jeep claims here."
  },

  {
    name:    "Western Motors — Jeep (Abu Dhabi)",
    makes:   ["Jeep"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi (exact address not confirmed)",
    phone:   "",
    notes:   "Handles Jeep body/collision repairs in Abu Dhabi — a separate company from the Dubai Trading Enterprises/Al Futtaim Auto Centers network. Verify exact address before dispatch."
  },

  {
    name:    "Trading Enterprises — Volvo (Dubai)",
    makes:   ["Volvo"],
    emirate: "Dubai",
    address: "Al Rashidiya / Umm Ramool, Dubai",
    phone:   "",
    notes:   "Shares the Al Futtaim Auto Centers bodyshop network — corrected from the Festival City showroom address."
  },

  {
    name:    "Arabian Automobiles (AW Rostamani) — Nissan (Dubai)",
    makes:   ["Nissan"],
    emirate: "Dubai",
    address: "Aweer, Dubai",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address (Aweer branch) — not the Sheikh Zayed Road/Deira showroom. Exclusive Nissan distributor for Dubai, Sharjah and the Northern Emirates."
  },

  {
    name:    "Arabian Automobiles (AW Rostamani) — Nissan (Sharjah)",
    makes:   ["Nissan"],
    emirate: "Sharjah",
    address: "Muhammad Bin Zayed Road, Sharjah",
    phone:   "",
    notes:   "Confirmed dedicated Sharjah bodyshop branch."
  },

  {
    name:    "Arabian Automobiles (AW Rostamani) — Infiniti (Dubai)",
    makes:   ["Infiniti"],
    emirate: "Dubai",
    address: "Aweer, Dubai",
    phone:   "",
    notes:   "Shares the AAC Nissan bodyshop at Aweer. Dubai & Northern Emirates."
  },

  {
    name:    "Arabian Automobiles (AW Rostamani) — Renault (Dubai)",
    makes:   ["Renault"],
    emirate: "Dubai",
    address: "Aweer, Dubai",
    phone:   "",
    notes:   "Shares the AAC Nissan bodyshop at Aweer. Dubai & Northern Emirates."
  },

  {
    name:    "Al Masaood Automobiles — Nissan, Infiniti, Renault (Abu Dhabi)",
    makes:   ["Nissan", "Infiniti", "Renault"],
    emirate: "Abu Dhabi",
    address: "Mussaffah, Abu Dhabi (also Al Ain, Al Dhafra)",
    phone:   "",
    notes:   "Distributor for Abu Dhabi, Al Ain and the Al Dhafra region — separate from AAC (Dubai)."
  },

  {
    name:    "Al Nabooda Automobiles — Volkswagen (Dubai)",
    makes:   ["Volkswagen"],
    emirate: "Dubai",
    address: "Jebel Ali Industrial Area, Dubai (DIC)",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address — not the Sheikh Zayed Road showroom. NOT nationwide: Abu Dhabi VW is a separate distributor, Ali & Sons Motors (see separate entry) — do not send Abu Dhabi VW claims here."
  },

  {
    name:    "Ali & Sons Motors — Volkswagen (Abu Dhabi)",
    makes:   ["Volkswagen"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi (exact address not confirmed)",
    phone:   "",
    notes:   "Separate VW distributor for Abu Dhabi, distinct from Al Nabooda (Dubai). Verify exact address before dispatch."
  },

  {
    name:    "Al Nabooda Automobiles — Audi (Dubai)",
    makes:   ["Audi"],
    emirate: "Dubai",
    address: "Jebel Ali Industrial Area, Dubai (DIC)",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address — not the Sheikh Zayed Road showroom. Abu Dhabi Audi coverage not separately confirmed (unlike VW and Porsche, which do have confirmed separate Abu Dhabi distributors) — verify before assuming nationwide coverage."
  },

  {
    name:    "Al Nabooda Automobiles — Porsche (Dubai)",
    makes:   ["Porsche"],
    emirate: "Dubai",
    address: "Jebel Ali Industrial Area, Dubai (DIC)",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address. NOT nationwide: Abu Dhabi Porsche is handled separately by Porsche Centre (see separate entry) — do not send Abu Dhabi Porsche claims here."
  },

  {
    name:    "Porsche Centre — Porsche (Abu Dhabi)",
    makes:   ["Porsche"],
    emirate: "Abu Dhabi",
    address: "Musaffah, Abu Dhabi",
    phone:   "",
    notes:   "Separate Porsche distributor/bodyshop for Abu Dhabi, distinct from Al Nabooda (Dubai)."
  },

  {
    name:    "AGMC — BMW, MINI (Dubai)",
    makes:   ["BMW", "MINI"],
    emirate: "Dubai",
    address: "Al Quoz (Street 15A), Dubai",
    phone:   "800 2462",
    notes:   "Corrected to the actual bodyshop address — not Sheikh Zayed Road/Motor City. AGMC covers DUBAI, SHARJAH and the Northern Emirates only — NOT Abu Dhabi or Al Ain (see Abu Dhabi Motors entry)."
  },

  {
    name:    "AGMC — Rolls-Royce (Dubai)",
    makes:   ["Rolls-Royce"],
    emirate: "Dubai",
    address: "Al Quoz (Street 15A), Dubai",
    phone:   "",
    notes:   "Shares the AGMC BMW/MINI bodyshop at Al Quoz. Dubai, Sharjah and Northern Emirates only — not Abu Dhabi/Al Ain."
  },

  {
    name:    "Abu Dhabi Motors (Al Saqer Group) — BMW, MINI, BMW Alpina (Abu Dhabi)",
    makes:   ["BMW", "MINI", "BMW Alpina"],
    emirate: "Abu Dhabi",
    address: "Airport Road, Abu Dhabi",
    phone:   "02 507 5800",
    notes:   "Separate BMW distributor covering ONLY Abu Dhabi and Al Ain — do not send Abu Dhabi/Al Ain claims to AGMC (Dubai). Note: their Rolls-Royce bodyshop is at a DIFFERENT physical location (Musaffah 3, see separate entry), even though same parent distributor."
  },

  {
    name:    "Abu Dhabi Motors — Rolls-Royce (Abu Dhabi)",
    makes:   ["Rolls-Royce"],
    emirate: "Abu Dhabi",
    address: "Musaffah 3, Abu Dhabi (near Al Ahlia Hospital)",
    phone:   "",
    notes:   "Separate physical bodyshop from the BMW/MINI Abu Dhabi Motors location on Airport Road, though same parent distributor."
  },

  {
    name:    "AGMC — BMW, MINI (Sharjah branch)",
    makes:   ["BMW", "MINI"],
    emirate: "Sharjah",
    address: "Third Industrial Street, Sharjah",
    phone:   "800 2462",
    notes:   "Same AGMC distributor as the Dubai entry — this is their dedicated Sharjah service centre."
  },

  {
    name:    "Juma Al Majid Group — Kia (Dubai)",
    makes:   ["Kia"],
    emirate: "Dubai",
    address: "Al Quoz 2, Dubai",
    phone:   "800 542823",
    notes:   "Corrected to the actual bodyshop address — not Sheikh Zayed Road/Deira. Sole Kia distributor for the UAE since 1988."
  },

  {
    name:    "Juma Al Majid Group — Kia (Sharjah)",
    makes:   ["Kia"],
    emirate: "Sharjah",
    address: "Sharjah",
    phone:   "",
    notes:   "Confirmed Sharjah bodyshop branch."
  },

  {
    name:    "Juma Al Majid Group — Kia, Hyundai (Abu Dhabi)",
    makes:   ["Kia", "Hyundai"],
    emirate: "Abu Dhabi",
    address: "Mussaffah Industrial Area 12, Abu Dhabi",
    phone:   "",
    notes:   "Confirmed shared Abu Dhabi bodyshop branch for both Kia and Hyundai."
  },

  {
    name:    "Juma Al Majid Group — Hyundai (Dubai)",
    makes:   ["Hyundai"],
    emirate: "Dubai",
    address: "Al Quoz 2, Dubai",
    phone:   "800 4986324",
    notes:   "Corrected to the actual bodyshop address, shared with the Kia bodyshop."
  },

  {
    name:    "Juma Al Majid Group — Genesis (Dubai)",
    makes:   ["Genesis"],
    emirate: "Dubai",
    address: "Dubai (exact bodyshop not separately confirmed)",
    phone:   "",
    notes:   "Genesis is listed alongside Kia/Hyundai under Juma Al Majid Group; likely shares the Al Quoz 2 network but not separately confirmed — verify before dispatch."
  },

  {
    name:    "GENAVCO (Juma Al Majid Group) — Isuzu",
    makes:   ["Isuzu"],
    emirate: "Dubai",
    address: "Al Karama",
    phone:   "+971 4 396 1000",
    notes:   "UAE-wide Isuzu distributor, focused on trucks/pickups."
  },

  {
    name:    "Al Tayer Motors — Ford, Lincoln, Land Rover (Dubai)",
    makes:   ["Ford", "Lincoln", "Land Rover"],
    emirate: "Dubai",
    address: "Al Quoz, Dubai",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address — not Sheikh Zayed Road/Garhoud. Land Rover confirmed at this same address; Jaguar bodywork routing not separately confirmed by this source (see separate Jaguar entry)."
  },

  {
    name:    "Al Tayer Motors — Jaguar",
    makes:   ["Jaguar"],
    emirate: "Dubai",
    address: "Sheikh Zayed Road, Dubai",
    phone:   "",
    notes:   "Address unconfirmed against the internal claims-routing reference (which lists Ford/Lincoln/Land Rover together but does not separately name Jaguar) — verify before dispatch, may share the Al Quoz bodyshop."
  },

  {
    name:    "Al Tayer Motors — Ferrari, Maserati",
    makes:   ["Ferrari", "Maserati"],
    emirate: "Dubai",
    address: "Al Manara",
    phone:   "",
    notes:   "Not covered in the internal claims-routing reference used to correct the rest of this list — address unverified against that source."
  },

  {
    name:    "Al Habtoor Motors — Mitsubishi, JAC (Dubai)",
    makes:   ["Mitsubishi", "JAC"],
    emirate: "Dubai",
    address: "Dubai (DIC)",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address — not Deira. JAC bodywork is confirmed at this same location, grouped with Mitsubishi."
  },

  {
    name:    "Al Habtoor Motors — Mitsubishi (Abu Dhabi)",
    makes:   ["Mitsubishi"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi",
    phone:   "",
    notes:   "Confirmed separate Abu Dhabi Mitsubishi bodyshop branch."
  },

  {
    name:    "Al Habtoor Motors — Bentley, Bugatti, FUSO",
    makes:   ["Bentley", "Bugatti", "FUSO"],
    emirate: "Dubai",
    address: "Dubai (nationwide)",
    phone:   "",
    notes:   "Also sole distributor of Pagani and Rimac in the UAE. Addresses not confirmed against the internal claims-routing reference."
  },

  {
    name:    "Galadari Automobiles — Mazda (Dubai)",
    makes:   ["Mazda"],
    emirate: "Dubai",
    address: "Al Quoz, Dubai (behind Khaleej Times)",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address — not Al Ittihad Road/Deira. Confirmed separate branch/contact also exists in Fujairah. Sole Mazda distributor for the UAE."
  },

  {
    name:    "Galadari Automobiles — Mahindra",
    makes:   ["Mahindra"],
    emirate: "Dubai",
    address: "Dubai (nationwide)",
    phone:   "",
    notes:   "Galadari is also the sole UAE distributor for Mahindra."
  },

  {
    name:    "Al Rostamani Trading Company — Suzuki (Sharjah)",
    makes:   ["Suzuki"],
    emirate: "Sharjah",
    address: "Sharjah",
    phone:   "",
    notes:   "Suzuki claims are NOT handled in Dubai — this Sharjah branch is the nearest confirmed bodyshop."
  },

  {
    name:    "Al Rostamani Trading Company — Suzuki (Al Ain)",
    makes:   ["Suzuki"],
    emirate: "Abu Dhabi",
    address: "Al Ain",
    phone:   "",
    notes:   "Confirmed Al Ain branch (Al Ain falls under Abu Dhabi emirate)."
  },

  {
    name:    "Swaidan Trading (Al Naboodah Group) — Peugeot (Dubai)",
    makes:   ["Peugeot"],
    emirate: "Dubai",
    address: "Dubai",
    phone:   "",
    notes:   "Also operates in Abu Dhabi (see separate entry) — corrects the earlier assumption that Swaidan only covered Dubai/Northern Emirates."
  },

  {
    name:    "Swaidan Trading (Al Naboodah Group) — Peugeot (Abu Dhabi)",
    makes:   ["Peugeot"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi",
    phone:   "",
    notes:   "Confirmed separate Abu Dhabi Peugeot bodyshop branch."
  },

  {
    name:    "Al Ghandi Auto — GMC, Chevrolet, Cadillac (Dubai & Northern Emirates)",
    makes:   ["GMC", "Chevrolet", "Cadillac"],
    emirate: "Dubai",
    address: "Dubai",
    phone:   "",
    notes:   "GMC dealer 25+ years, Chevrolet since 2008, Cadillac since 2019. NOT the Abu Dhabi contact for Chevrolet/GMC — that is a separate company, Bin Hamoodah Auto (see separate entry). A third name, Liberty Auto, was also noted for Chevrolet in the internal reference without an address — unconfirmed, worth verifying separately."
  },

  {
    name:    "Bin Hamoodah Auto — Chevrolet, GMC (Abu Dhabi)",
    makes:   ["Chevrolet", "GMC"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi (Main)",
    phone:   "",
    notes:   "Separate distributor for Chevrolet/GMC in Abu Dhabi, confirmed via internal claims-routing reference. Handles Chevrolet/GMC only — not Cadillac."
  },

  {
    name:    "Union Motors — Changan",
    makes:   ["Changan"],
    emirate: "Dubai",
    address: "Al Quoz, Street 1, Dubai",
    phone:   "",
    notes:   "Corrected to the actual bodyshop address — not Al Ittihad Road/Al Khabeesi/Deira. Sole exclusive Changan distributor in the UAE, 4 locations nationwide."
  },

  {
    name:    "Galadari Automobiles — OMODA & JAECOO",
    makes:   ["Omoda", "Jaecoo"],
    emirate: "Sharjah",
    address: "Sharjah, Ras Al Khaimah, Fujairah",
    phone:   "",
    notes:   "Galadari is exclusive OMODA/JAECOO distributor for Sharjah, RAK and Fujairah only."
  },

  {
    name:    "Galadari Automobiles — Lynk & Co",
    makes:   ["Lynk & Co"],
    emirate: "Dubai",
    address: "Dubai (nationwide)",
    phone:   "",
    notes:   "Galadari became official Lynk & Co distributor for the UAE."
  },

  {
    name:    "AGMC — Geely (Dubai)",
    makes:   ["Geely"],
    emirate: "Dubai",
    address: "Al Quoz (Street 15A), Dubai",
    phone:   "800 43359",
    notes:   "Shares the same AGMC bodyshop as BMW/MINI/Rolls-Royce at Al Quoz — corrected from the earlier flagship-showroom description."
  },

  {
    name:    "AGMC — Geely (Abu Dhabi)",
    makes:   ["Geely"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi facility (opened after the Dubai flagship)",
    phone:   "800 43359",
    notes:   "Not separately confirmed by the internal claims-routing reference (which only names the Dubai AGMC location for Geely) — verify current branch address before dispatch."
  },

  {
    name:    "AGMC — Geely (Sharjah)",
    makes:   ["Geely"],
    emirate: "Sharjah",
    address: "Sharjah facility",
    phone:   "800 43359",
    notes:   "Not separately confirmed by the internal claims-routing reference — verify current branch address before dispatch."
  },

  {
    name:    "Al Khoory Automobiles — Subaru",
    makes:   ["Subaru"],
    emirate: "Dubai",
    address: "Al Quoz, Dubai",
    phone:   "",
    notes:   "Authorised Subaru distributor bodyshop in Dubai."
  },

  {
    name:    "Inter Emirates Motors — MG (Dubai)",
    makes:   ["MG"],
    emirate: "Dubai",
    address: "Al Quoz, Dubai",
    phone:   "",
    notes:   "Authorised MG distributor bodyshop in Dubai."
  },

  {
    name:    "Inter Emirates Motors — MG (Abu Dhabi)",
    makes:   ["MG"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi",
    phone:   "",
    notes:   "Confirmed separate Abu Dhabi MG branch."
  },

  {
    name:    "Gargash Motor — GAC",
    makes:   ["GAC"],
    emirate: "Dubai",
    address: "Dubai (exact bodyshop address not confirmed)",
    phone:   "",
    notes:   "Separate line of business from Gargash Enterprises' Mercedes-Benz operation — same family group, different brand/workshop. Verify exact address before dispatch."
  },

  {
    name:    "Swaidan Trading — GWM / Great Wall Motors (Dubai)",
    makes:   ["GWM"],
    emirate: "Dubai",
    address: "Dubai",
    phone:   "",
    notes:   "GWM claims contact noted alongside Peugeot under Swaidan Trading in Dubai."
  },

  {
    name:    "Swaidan Trading — GWM / Great Wall Motors (Abu Dhabi)",
    makes:   ["GWM"],
    emirate: "Abu Dhabi",
    address: "Abu Dhabi",
    phone:   "",
    notes:   "GWM claims contact noted alongside Peugeot under Swaidan Trading in Abu Dhabi."
  },

  {
    name:    "Al Khalid Auto — Bestune",
    makes:   ["Bestune"],
    emirate: "Dubai",
    address: "The Curve Building, Sheikh Zayed Road, Al Quoz 3, Dubai",
    phone:   "800800800",
    notes:   "Authorised Bestune distributor bodyshop in Dubai."
  },

  {
    name:    "Western Motors — Opel",
    makes:   ["Opel"],
    emirate: "Dubai",
    address: "Dubai (exact address not confirmed)",
    phone:   "",
    notes:   "Same company handles Jeep body repairs in Abu Dhabi (see separate Jeep entry) — emirate/branch for Opel specifically was not clearly specified in the source reference. Verify before dispatch."
  },

  {
    name:    "Gargash Auto Repair LLC — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Dubai",
    address: "Al Quoz Ind Area 4, street 7B, Dubai 184011",
    phone:   "+971 4 258 4460",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "XA Auto General Repairing Co LLC (XpressAuto) — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Dubai",
    address: "22nd St, Dubai",
    phone:   "+971 4 269 5906",
    notes:   "Trades as XpressAuto. Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "PAL EV Motorworks — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Dubai",
    address: "75th Street, 598 Community, Dubai 20317",
    phone:   "+971 4 880 0890",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "PAL EV, Al Quoz — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Dubai",
    address: "20B St, Al Qouz Industrial Area 4, Dubai",
    phone:   "+971 4 340 6448",
    notes:   "Separate branch from PAL EV Motorworks. Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "Pitstop Automotive Services LLC — Branch of Abu Dhabi — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Abu Dhabi",
    address: "M28 Ata 2 Street, Abu Dhabi",
    phone:   "800 7727",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list. Only this Pitstop branch is confirmed Tesla-approved."
  },

  {
    name:    "Technical Resources Est — Tesla Approved Body Shop (Abu Dhabi)",
    makes:   ["Tesla"],
    emirate: "Abu Dhabi",
    address: "20 As Salami 8 St, Abu Dhabi",
    phone:   "+971 2 676 3685",
    notes:   "Trades as TR Premium Car Care. Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "Technical Resources / Premium Car Care — Tesla Approved Body Shop (Dubai)",
    makes:   ["Tesla"],
    emirate: "Dubai",
    address: "Al Quoz Industrial Area 3, Dubai",
    phone:   "+971 4 323 6690 / 800 822",
    notes:   "Dubai branch of Technical Resources Est. Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "Run and Drive — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Dubai",
    address: "8 3A Street, Dubai",
    phone:   "+971 56 991 1334",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "Private Car Auto Service Center LLC - SPC — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Abu Dhabi",
    address: "26 Al Beewar 1 St, Al Ain, Abu Dhabi",
    phone:   "+971 600 500999",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list. Located in Al Ain (Abu Dhabi emirate)."
  },

  {
    name:    "Pitstop Automotive Services LLC — Tesla Approved Body Shop (Al Sajaah, Sharjah)",
    makes:   ["Tesla"],
    emirate: "Sharjah",
    address: "Al Sajaah, Sharjah 32626",
    phone:   "800 7727",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list. Listed contact is an insurance coordinator email (insurancecoordinator@pitstopauto.ae), suggesting a direct claims-handling contact."
  },

  {
    name:    "EVS Ajman — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Ajman",
    address: "Sheikh Rashid Bin Abdulaziz St, Ajman",
    phone:   "+971 56 455 6555",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "KM Auto Center — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Ras Al Khaimah",
    address: "Sheikh Abdulla Bin Mohamed Rd, Ras Al Khaimah 9717",
    phone:   "+971 7 268 6070",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

  {
    name:    "Drivetech by FNCT Workshop — Tesla Approved Body Shop",
    makes:   ["Tesla"],
    emirate: "Fujairah",
    address: "Al Hail Industrial Area, Fujairah 1772",
    phone:   "800 22533",
    notes:   "Tesla-authorized body shop — from Tesla's official approved body shop list."
  },

];
