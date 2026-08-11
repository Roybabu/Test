# Font audit

All ten design stylesheets were audited. The application actually declares these font families:

- Board: Archivo, Inter, Roboto Mono
- Jobcard: IBM Plex Sans, IBM Plex Mono (self-hosted)
- Pocket: Manrope
- Nightdesk: Inter, Space Grotesk, JetBrains Mono
- Signpost: Barlow, Barlow Semi Condensed
- Index: Fraunces, Inter
- Blocks: Anton, Archivo
- Splitdesk: DM Sans, DM Mono
- Clay: Fredoka, Nunito
- Neu: Poppins

Google Fonts stylesheets are no longer loaded from `index.html`. Each design loads only its own font stylesheet when selected; unused designs are warmed lazily after the interface becomes interactive. Jobcard uses locally hosted IBM Plex files. Only the primary Inter stylesheet is preloaded for the default Board design.
