# 🎅 Three.js Cartoon Noordpool Kerstscène

Een sfeervolle, interactieve 3D-scène op de Noordpool, gebouwd met **Three.js** in een levendige **cartoonstijl** (cel-shading met `MeshToonMaterial`, felle kleuren en lage-poly vormen). Geoptimaliseerd voor een stabiele **60 fps** op laptops.

---

## 🌟 Aanwezige Elementen & Features

1. ❄️ **Besneeuwde ondergrond & nachtelijke hemel**:
   - Glooiend wit sneeuwvlak met subtiele vertex-displacement heuvels.
   - Hemelkoepel met diepblauw-paarse gradient.
   - 600 fonkelende sterren met sinusoïdale opacity-animatie.

2. 🔴 **Echte Noordpool (90°N)**:
   - Rood-wit diagonaal gestreepte zuurstokpaal (candy cane spiraal).
   - Helderrode bol op de top.
   - Rustiek houten uithangbord met opschrift **"NORTH POLE"**.

3. 🏠 **Werkplaats van de Kerstman**:
   - Volledig opgebouwd uit primitieve geometrieën (boxen, piramide/cone dak).
   - Gloeiende gele ramen met warme lichtinval op de sneeuw.
   - **Geanimeerde cartoon-schoorsteen**:
     - Speelse cartoon-wobble en wiegende beweging.
     - 'Squash & stretch' chugging-cadans alsof de speelgoedovens volop draaien.
     - Vuurrode gloed in de schoorsteenopening.
     - Dynamisch opstijgende, uitdijende en vervagende rookpluimen die de wiegende beweging volgen.
   - Gedetailleerd uithangbord **"Santa's Workshop"**.
   - Sneeuwrand op het dak.

4. 🎄 **Zeven Kerstbomen met Knipperende Lichten**:
   - Meervoudig gelaagde kronen met verschillende groentinten en gouden sterren.
   - Veelkleurige lichtjes die onafhankelijk en asynchroon fonkelen via sinusgolven.

5. 🌨️ **Vallende Sneeuw (Particle System)**:
   - 3.000 unieke sneeuwvlokken via GPU-vriendelijke `BufferGeometry` + `Points`.
   - Zachte radiale gradiënt textuur.
   - Realistische dwarrel-animatie (horizontale sway) en automatische reset bovenin.

6. 🦌 **Geanimeerd Rendier (Rudolph)**:
   - Cartoon rendier met gewei en een oplichtende rode neus.
   - Begint direct bij het inladen automatisch te draven langs een gesloten `CatmullRomCurve3`-lus rond de werkplaats.
   - Realistische loopbeweging: waggelende cadans (verticale bob) en alternerende dravende poten in de looprichting.

7. 🎁 **Klikbaar Cadeau (Raycasting)**:
   - Rood cadeau met gouden linten en strik dat zachtjes zweeft en roteert.
   - Interactieve muisaanwijzer (`cursor: pointer`) bij hoveren.
   - Bij een klik springt het deksel naar achteren open.
   - 150 kleurrijke confetti-deeltjes barsten omhoog onder invloed van zwaartekracht.
   - Een oplichtende gouden ster met zwevende vonken stijgt als verrassing uit het geopende doosje.
   - Sluit automatisch weer na 30 seconden (de ster trekt zich terug en het deksel klapt dicht), waarna je het opnieuw kunt openen en vieren!
   - Feestelijke glinsterende arpeggio-fanfare bij het uitpakken!

8. 🎵 **Feestelijke Themamuziek & Geluidseffecten**:
   - Geïntegreerde **Web Audio API synthesiser**: geen externe downloads of netwerkafhankelijkheden nodig.
   - Sfeervolle medley van klassieke kerstmelodieën:
     - **Jingle Bells** (vrolijk tempo met arrensleebellen en wandelende baslijn).
     - **We Wish You A Merry Christmas** (knusse 3/4 wals met feestelijke harmonieën).
   - Authentiek speeldoosje- / celesta-geluid met magische 2.76x boventonen, zachte akkoorden en rinkelde sleebellen.
   - **Autoplay bij pagina-inladen**: start direct zodra de pagina opent (of direct bij de eerste klik als de browser autoplay beperkt).
   - **Muziekknop rechtsboven**:
     - Schakel de muziek op elk moment in of uit met één klik (`🔊 Muziek: Aan` / `🔇 Muziek: Uit`).
     - Geanimeerde equalizer-staafjes die meedeinen op de muziek.
     - Sneltoets: druk op de toets **'M'** om het geluid direct te dempen of weer te starten.
     - Vloeiende fade-in en fade-out (geen harde klikken).

9. 🧝 **Elfendorpje in de verte (Elf Village)**:
   - Gelegen op glooiende besneeuwde heuvelruggen achter de werkplaats van de Kerstman.
   - Rustieke houten welkomstboog met opschrift **"✨ ELFENDORP ✨"** en warme lantaarns.
   - Diverse unieke elfenhuisjes:
     - **Klokkentoren**: Geanimeerde roterende gouden ster, feestelijke klok (11:55) en belfort met gouden bel.
     - **Paddenstoelhuisje**: Ronde mintgroene wanden, grote rode paddenstoelkap met sneeuwstippen en stenen schoorsteen.
     - **Peperkoekhuisje**: Warme peperkoekgevels met glazuurranden, zuurstokkolommen en knusse ramen.
     - **Speelgoedbakkerij & Werkplaats**: Vakwerkwanden en winkelraam met warme gloed.
     - **Postkantoor & Verlanglijstjesdepot**: Houten blokhut met kleine rode brievenbus.
     - **Sterrenkijkertoren**: Observatieplatform met miniatuurtelescoop gericht op de sterrenhemel.
     - **Hobbithuisje**: Ronde houten deur en patrijspoortraam genesteld in de sneeuwheuvel.
     - **Berghuisjes**: Knusse alpenhutjes hoog op de achterste bergrug voor extra dieptewerking.
   - **Levendige animaties**:
     - Opstijgende, zachtjes deinende en vervagende cartoon rookpluimpjes uit alle schoorstenen.
     - Zwaaiende vriendelijke cartoon-elf bij de dorpsentree.
     - Cadeaudragende elf die vrolijk over het dorpsplein stapt.
     - Lantaarnaansteker-elf op het heuvelpad.
     - Sfeervolle slingerende lichtsnoeren (guirlandes) tussen de gebouwen met fonkelende lampjes.
     - Gezellige dorpskerstboom met stapels cadeautjes en een schattige sneeuwpop.

9. 🖱️ **OrbitControls**:
   - Vrij rondkijken en roteren met de linkermuisknop.
   - Zoomen met het scrollwiel (bereik vergroot om ook het verre dorpje prachtig te overzien).
   - Hoekbegrenzing zodat de camera niet onder het sneeuwvlak kan duiken.

---

## 🚀 Hoe te openen / starten

Omdat browsers om veiligheidsredenen ES Modules blokkeren bij het direct openen via `file://`, start je eenvoudig een lokale mini-server:

### Optie 1: Met Node.js (Aanbevolen)
Open een terminal in deze map en voer uit:
```bash
node server.js
```
Open vervolgens in je browser:
👉 **[http://localhost:3000](http://localhost:3000)**

*(Of gebruik `npm start`)*

### Optie 2: Met VS Code Live Server
Klik rechtsonder in VS Code op **"Go Live"** op `index.html`.

---

## 📂 Projectstructuur

```
antigravity_three.js/
├── index.html              ← HTML entry met importmap voor Three.js CDN
├── package.json            ← Start script (npm start)
├── server.js               ← Lichtgewicht ingebouwde Node.js webserver
├── README.md               ← Documentatie
├── css/
│   └── style.css           ← Fullscreen styling en interactieve cursor
└── js/
    ├── main.js             ← Initialiseert alle componenten en start de loop
    ├── audio.js            ← Web Audio synthesiser voor kerstmuziek & knopbediening
    ├── scene.js            ← Scene, camera, WebGLRenderer, mist en maanlicht
    ├── controls.js         ← OrbitControls met vloeiende damping en hoeklimieten
    ├── ground.js           ← Sneeuwvlak, nachthemel en fonkelende sterren
    ├── northPole.js        ← Rood-wit gestreepte Noordpoolpaal met bord
    ├── workshop.js         ← Werkplaats van de Kerstman uit 3D primitieven
    ├── trees.js            ← 7 kerstbomen met knipperende feestverlichting
    ├── snow.js             ← 3.000 vallende sneeuwvlokjes (BufferGeometry Points)
    ├── reindeer.js         ← Rudolph met automatische draf- en padanimatie
    ├── gift.js             ← Zwevend cadeau met raycasting, openspringend deksel en confetti
    ├── elfVillage.js       ← Elfendorpje in de verte met heuvels, huisjes, animaties en elfjes
    └── animate.js          ← Render loop met delta-time update flow
```
