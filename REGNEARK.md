# Sådan retter du hjemmesiden

Hjemmesiden henter en række oplysninger direkte fra ét regneark. Retter du i
regnearket, retter du på hjemmesiden — der skal ikke andet til.

Regnearket hedder **Bundsgård Privat Pasningsordning - INFO**, og det er kun
den ene fane, hjemmesiden læser.

**Ændringer slår igennem med det samme.** Gem i regnearket, hent hjemmesiden
igen — `Ctrl + R` (Windows) eller `Cmd + R` (Mac) — og rettelsen er der. Det er
en rigtig genindlæsning, der skal til; klikker du bare rundt mellem siderne,
henter den ikke noget nyt.

> **Vigtigt:** Regnearket er delt, så alle med linket kan læse det. Skriv
> derfor aldrig personlige oplysninger om børn eller familier i det.

---

## Sådan er arket bygget op

Der er tre kolonner:

| Kolonne | Hvad der står i den |
| --- | --- |
| **A** | Hvad det er — dagene, spørgsmålet, overskriften |
| **B** | Selve indholdet — tidspunktet, svaret, teksten |
| **C** | En lille indstilling. Står der `Dæmpet`, vises teksten i kolonne B i en lysere grå |

Arket er delt op i **blokke**. En blok begynder med en linje, hvor der står en
firkant og et navn i kolonne A — for eksempel `# Åbningstider`. Alt hvad der
står under den linje, hører til den blok, indtil den næste `#`-linje begynder.

**Tre regler, og så er du kørende:**

1. **Slet aldrig en `#`-linje.** Det er den, der fortæller hjemmesiden, hvad
   der kommer nedenunder.
2. **Tomme linjer er i orden.** Du må gerne have luft mellem blokkene.
3. **Store og små bogstaver er lige meget** i `#`-linjerne og i de faste ord
   som `Fodnote` og `Intro`. `# Åbningstider` og `# åbningstider` er det samme.

Alt hvad der står *over* den allerførste `#`-linje, bliver ikke vist nogen
steder. Der kan du skrive noter til dig selv.

### Hvis du sletter noget

Det er med vilje bygget, så du ikke kan komme til at ødelægge siden:

- **Sletter du en enkelt linje** — for eksempel et spørgsmål — forsvinder den
  fra hjemmesiden. Resten står, som det gjorde.
- **Tømmer du en hel blok, men lader `#`-linjen stå** — så skriver hjemmesiden
  selv, at oplysningen kommer senere. Det er sådan, du håndterer ferie­datoer,
  du endnu ikke kender.
- **Sletter du hele blokken, `#`-linjen med** — så bliver hjemmesiden bare ved
  med at vise det, den viste før. Der sker ikke noget.

**Seglet er den ene undtagelse.** Det forsvinder fra forsiden, uanset *hvordan*
du fjerner det: tømmer du feltet, sletter du linjen, eller sletter du hele
`# Stempel`-blokken. Sådan er det med vilje — et segl, der lover en ledig plads,
må aldrig blive stående, fordi en linje er røget ved et uheld.

---

## Blokkene, én for én

### `# Åbningstider`

Den her bruges tre steder: på **Praktisk information**, nederst på **alle
sider**, og i den lille stribe af tal på **forsiden**.

| A | B | C |
| --- | --- | --- |
| Mandag – torsdag | 6.00 – 15.30 | |
| Fredag | 6.00 – 15.00 | |
| Weekend | Lukket | Dæmpet |
| Fodnote | Har I brug for at aflevere tidligere en enkelt dag, finder vi ud af det. | |

Skriver du et rigtigt klokkeslæt i kolonne B — altså to tider med en streg
imellem, som `6.00 – 15.30` — regnes linjen som en åbningstid og kommer med
ned i bunden af alle siderne. Skriver du noget andet, som `Lukket`, står den
kun på Praktisk information. Åbner I en lørdag, skriver du bare tiderne ind, og
så følger resten med af sig selv.

`Fodnote` er den lille grå linje under kortet. Vil du ikke have den, sletter du
linjen.

### `# Stempel`

Det røde laksegl på forsiden.

| A | B |
| --- | --- |
| Tekst | Ledige pladser |
| Måned og år | August 2027 |

**Tøm feltet ud for `Måned og år`, og seglet forsvinder helt fra forsiden.**
Skriv en måned ind igen, og det kommer tilbage. Der må stå hvad som helst —
`Januar 2028`, `Til sommer` — teksten tilpasser selv sin størrelse, så den
passer i seglet. Hold det kort; to ord ser bedst ud.

Så længe der står noget i feltet, **vises** seglet. Er du i tvivl om, hvorfor
det er der, så kig i den celle først.

`Tekst` er de to ord øverst i seglet. Lader du den stå tom, står der
"Ledige pladser".

### Kortene på Praktisk information

Hvert kort på siden er sin egen blok, og **`#`-linjens navn er kortets
overskrift**. Kortene står på siden i samme rækkefølge som i arket.

| A | B | C |
| --- | --- | --- |
| # Ferie og lukkedage | | |
| Uge 29 og 30 | Sommerferie | |
| Uge 42 | Efterårsferie | |
| 23. dec – 1. jan | Jul og nytår | |
| Fodnote | Datoerne meldes ud i god tid ved årets start. | |
| Tom tekst | Årets lukkedage er ikke meldt ud endnu. | |

Fire ord har en særlig betydning i kolonne A. Alt andet bliver til en linje på
kortet:

| Ord i kolonne A | Hvad det gør |
| --- | --- |
| `Titel` | Bruger teksten i B som overskrift i stedet for `#`-navnet |
| `Intro` | En lille tekst øverst på kortet, over linjerne |
| `Fodnote` | En grå linje nederst på kortet |
| `Tom tekst` | Det, der skal stå, hvis kortet ikke har nogen linjer |

**Kender du ikke feriedatoerne endnu?** Slet linjerne, men lad `#`-linjen og
`Tom tekst` stå. Så skifter kortet udseende — det får en stiplet ramme — og
skriver din tekst i stedet. Det ser ud som en besked, ikke som en fejl.

**Vil du have et helt nyt kort?** Lav en ny `#`-linje med den overskrift, du
vil have, og skriv linjerne under. Kortet dukker op på siden af sig selv.

### `# Godt at vide`

De fire små afsnit nederst på Praktisk information. Kolonne A er overskriften,
kolonne B er teksten.

| A | B |
| --- | --- |
| Indkøring | Vi bruger som regel en uge. Første dag er kort og med jer … |
| Mad | Jeg laver morgenmad, frokost og eftermiddagsmad … |

Tilføj en linje, og der kommer et afsnit mere.

### `# Spørgsmål og svar`

"Ofte stillede spørgsmål" nederst på Praktisk information. Spørgsmålet i
kolonne A, svaret i kolonne B.

| A | B |
| --- | --- |
| Hvordan søger vi tilskud? | I søger tilskuddet hos Egedal Kommune, når … |
| Hvad skal vi selv have med? | Skiftetøj, overtøj efter årstiden og … |

En ny linje bliver til et nyt spørgsmål, man kan klappe ud. Der er ingen
grænse for, hvor mange der må være. Er der ikke noget i blokken, forsvinder
hele afsnittet fra siden.

### `# Billeder`

Billederne på **Galleri**-siden.

| A | B | C |
| --- | --- | --- |
| Link til billedet | Billedtekst | Alt-tekst (må gerne være tom) |
| https://drive.google.com/file/d/1AbC…/view?usp=sharing | Mandag morgen. Det tager tyve minutter at komme ud ad døren. | To børn løber gennem haven |

**Sådan får du et billede ind:**

1. Læg billedet i Google Drive-mappen.
2. Højreklik på det → **Del** → sørg for, at der står **"Alle med linket"**.
   Gør du ikke det, kan hjemmesiden ikke se billedet.
3. Vælg **Kopiér link**.
4. Sæt linket ind i kolonne A på en ny linje, og skriv en billedtekst i B.

Billederne står på siden i samme rækkefølge som i arket, så du bestemmer selv,
hvilke der bliver store, ved at flytte rundt på linjerne. Du behøver ikke gøre
noget ved størrelsen på billederne — hjemmesiden henter dem selv i den
størrelse, der passer til skærmen.

Kolonne C er en beskrivelse for blinde og svagtseende. Lader du den stå tom,
bruges billedteksten.

---

## Hvis noget ser forkert ud

| Det ser sådan ud | Sandsynligvis fordi |
| --- | --- |
| Et billede mangler og der står en stiplet firkant | Filen er ikke delt med "Alle med linket", eller linket er ikke kopieret helt |
| Et kort har fået en stiplet ramme | Blokken har ingen linjer — det er sådan, det skal se ud |
| Ændringen er der ikke endnu | Du har klikket rundt på siden i stedet for at hente den igen — tryk `Ctrl + R` |
| En hel blok mangler på siden | `#`-linjen er blevet slettet eller stavet forkert |
| Hjemmesiden viser gamle oplysninger | Delingen på regnearket er blevet slået fra — sig til, så kigger vi på det |

Hjemmesiden går aldrig ned af noget, du skriver i arket. Kan den ikke forstå
noget, viser den bare det, den viste før.
