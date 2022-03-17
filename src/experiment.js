/**
 * @title deadline-cse
 * @description Investigating the effect of reaction time deadline on CSE.
 * @version 0.1.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 * @audioDir audio
 * @videoDir video
 * @miscDir misc
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response"
import PreloadPlugin from "@jspsych/plugin-preload";

// Calculate range
function range(stop) {
  var result = [];
  for (var i = 0; i < stop; i += 1) {
    result.push(i);
  }
  return result;
}

// Shuffle the content of an array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {

    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

function getRandomTrials(numberOfTrials, addFirstTrial) {
  var redBlock = [[["ZÖLD", "green", "con", "c"], ["PIROS", "red", "con", "x"]], [["PIROS", "green", "inc", "c"], ["ZÖLD", "red", "inc", "x"]]]
  var blueBlock = [[["KÉK", "blue", "con", "n"], ["SÁRGA", "yellow", "con", "m"]], [["KÉK", "yellow", "inc", "m"], ["SÁRGA", "blue", "inc", "n"]]]

  var repetition = numberOfTrials / 8

console.log(repetition)

  var listOne = []
  for (const i in range(repetition)) {
    for (const j in range(redBlock.length)) {
      for (const k in range(redBlock[j].length)) {
        listOne.push(redBlock[j][k])
      }
    }
  }

  listOne = shuffleArray(listOne)

  var listTwo = []
  for (const i in range(repetition)) {
    for (const j in range(blueBlock.length)) {
      for (const k in range(blueBlock[j].length)) {
        listTwo.push(blueBlock[j][k])
      }
    }
  }

  listTwo = shuffleArray(listTwo)

  var trialList = []
  for (const i in range(listOne.length)) {
    trialList.push(listOne[i])
    trialList.push(listTwo[i])
  }

  var loopData = []
  trialList.forEach(element => {
    loopData.push({ word: element[0], color: element[1], congruency: element[2], correctResponse: element[3] });
  });

  // Add one random in the beginning as the first trial
  if (addFirstTrial) {
    const firstTrial = blueBlock[Math.floor(Math.random() * 2)][Math.floor(Math.random() * 2)]
    loopData.unshift({ word: firstTrial[0], color: firstTrial[1], congruency: firstTrial[2], correctResponse: firstTrial[3] })
  }

  return loopData
}

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  const jsPsych = initJsPsych();

  const timeline = [];

  // Create pseudo random trials
  const testTrials = getRandomTrials(80, true)

  var testTemplate = {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<p style="color: gray;">+</p>',
        choiches: "NO_KEYS",
        trial_duration: 1000
      },
      {
        
      }
    ]
  }

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

  // Welcome screen
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: "<p>Welcome to deadline-cse!<p/>",
  });

  // Informed
  var informedScreen = {
    type: HtmlButtonResponsePlugin,
    stimulus:
      `<div> 
    <h1>Tájékoztató nyilatkozat</h1> 
    <p>
      Egy tudományos kutatásban veszel részt, amelynek témavezetője Dr. Aczél Balázs,
      az ELTE Affektív Pszichológia Tanszékének kutatója. A kutatás célja megvizsgálni
      a korlátozott válaszadási idő hatását a konfliktusadaptációra.
    </p>
    <p>
      Az ELTE PPK Affektív Pszichológia Tanszék Metatudomány Kutatócsoportja mint
      adatkezelő szigorúan bizalmasan kezel minden olyan személyes információt,
      amit a kutatás keretein belül gyűjtünk össze. Ezeket kóddal ellátva, 
      biztonságos számítógépeken tároljuk. A kezelt adatok a következők:
      NEPTUN-kód, életkor, nem, iskolai végzettség. Az azonosítására alkalmas
      adatokat (NEPTUN-kód) arra használjuk fel, hogy regisztrálhassuk a
      kutatásban való részvételért járó kurzuspontokat, ezután törölni fogjuk őket. 
      Válaszaid semmilyen módon nem lesznek hozzád köthetők. Személyes adataidat
      más adatkezelőnek, adatfeldolgozónak nem adjuk át, ám az anonimizált
      (személyes azonosításra nem alkalmas) adataid más kutatókkal megosztjuk.
      E tényállás részleteit a „Hozzájárulás adatkezeléshez” c. dokumentum 
      tartalmazza <a target="_blank" href="http://decisionlab.elte.hu/hozzajarulas-adatkezeleshez/">ITT</a>.
      Az adatkezelésről szóló szabályozásról részletesebben pedig
      <a target="_blank" href="https://ppk.elte.hu/file/Hozzajarulas_adatkezeleshez_melleklet_2018.pdf.">ITT</a> tájékozódhatsz.
    </p>
    <p>
      A kutatásban való részvétel teljesen önkéntes. A vizsgálatot bármikor
      indoklás nélkül megszakíthatod, vagy a kérdések megválaszolását megtagadhatod
      a böngészőablak bezárásával. Ha bármilyen kérdésed, aggályod vagy panaszod van
      a kísérlettel kapcsolatban, kérlek, keresd Székely Zsuzsát (szekely.zsuzsa.mail@gmail.com)!
      <p>A „Hozzájárulás az adatkezeléshez” c. dokumentumot elolvastam és a benne foglaltakat elfogadom.</p>
    </p>
  </div>`,
    // canvas_size: [300, 300],
    choices: ['Részt veszek', 'Nem veszek részt'],
    prompt: '<p>A továbblépéshez kérem kattintson a Részt veszek gombra.</p>'
  };

  timeline.push(informedScreen);

  var consentScreen = {
    type: HtmlButtonResponsePlugin,
    stimulus:
      `<div>
        <h1>Beleegyező nyilatkozat</h1>
        <p>
    Felelősségem teljes tudatában kijelentem, hogy a mai napon az Eötvös Loránd
    Tudományegyetem, Dr. Aczél Balázs kutatásvezető által végzett vizsgálatban
    önként veszek részt. A vizsgálat jellegéről annak megkezdése előtt kielégítő
    tájékoztatást kaptam. Elmúltam 18 éves. Nem szenvedek semmilyen pszichiátriai
    betegségben. A vizsgálat idején alkohol vagy drogok hatása alatt nem állok.
    Tudomásul veszem, hogy az azonosításomra alkalmas személyi adataimat bizalmasan
    kezelik. Hozzájárulok ahhoz, hogy a vizsgálat során a rólam felvett, személyem
    azonosítására nem alkalmas adatok más kutatók számára is hozzáférhetők legyenek.
    Fenntartom a jogot arra, hogy a vizsgálat során annak folytatásától bármikor
    elállhassak. Ilyen esetben a rólam addig felvett adatokat törölni kell.
    Tudomásul veszem, hogy csak a teljesen befejezett kitöltésért kapok pontot a
    Pszichológiai kísérletben és tudományos aktivitásban való részvétel című
    kurzuson.
  </p>
  <br>
  <h3>A kutatásban való részvétel körülményeiről részletes tájékoztatást kaptam, a feltételekkel egyetértek.</h3>
  </div>
  `,
    choices: ['Részt veszek', 'Nem veszek részt'],
    prompt: '<p>A továbblépéshez kérem kattintson a Részt veszek gombra.</p>'
  };

  timeline.push(consentScreen);

  // Create instructions
  const instructionsScreen = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
  <div>
  <h1>Instrukciók</h1>
  <p>
    Ebben a kísérletben arra vagyunk kíváncsiak, hogy az emberek hogyan oldanak
    fel vizuális ingerek feldolgozása közben létrejövő konfliktusokat.
    A kísérlet alatt különböző színű betűkkel írt színek nevei fognak felvillanni a képernyőn,
    ezekre itt láthatsz 2 példát:
  </p>
  <br>
  <div style="display: inline-block;">
    <h1 style="color:red;">PIROS</h1>
    <h1 style="color: yellow;">KÉK</h1>
  </div>
  <p>
    A feladatod az lesz, hogy meghatározd, milyen színnel van írva a szó,
    miközben a szó jelentését figyelmen kívül hagyod. Tehát a fenti 2 példára
    a helyes válaszok a piros és a sárga. Mindegyik szín négy válaszbillentyű (x; c; n; m)
    valamelyikéhez lesz hozzárendelve. Azt, hogy melyik szín melyik válaszbillentyűhöz tartozik,
    később, a gyakorló rész alatt lesz alkalmad megtanulni. Kérünk, hogy olyan gyorsan válaszolj,
    amennyire ez lehetséges hibázás nélkül!
  </p>
  <p>
    A gyakorlást követően a kísérlet 4 szakaszból fog állni, ezek mindegyike 2 részre ('A' és 'B') oszlik.
    A 4 szakasz egyenként kb. 8 percet vesz igénybe, közöttük rövid szünetet tarthatsz.
  </p>
  <p>
    Kérünk, hogy a feladatot számítógépen végezd el (ne telefonon, tableten stb.)!  A kísérlet csak Mozilla Firefox
    és Safari böngészőkben működik megfelelően, ezért kérünk, hogy ezek valamelyikében végezd el, egy új böngészőablakban!
    Nagyon fontos, hogy a kísérlet során végig tudj összpontosítani, ezért kérünk, hogy ne csinálj semmi mást,
    miközben a feladatot csinálod! Vedd figyelembe, hogy ha a megoldásod pontossága 70%-nál alacsonyabb
    lesz, ami egy ésszerű határ az előző kutatások fényében, akkor nem kapsz pontot a kitöltésért.
    Ha 70% feletti pontossággal oldod meg a feladatot, valamint, ha elvégzed a feladat másik verzióját is,
    akkor 1.5 pontot kapsz a „Pszichológiai kísérletben és tudományos aktivitásban való részvétel” nevű kurzuson.
    Ehhez ne felejtsd el megadni a Neptun-kódod a kísérlet végén!
  </p>
  Nyomd meg a Space billentyűt a folytatáshoz!
  </div>
  `,
    choices: [" "]
  };

  timeline.push(instructionsScreen);

  // Table for key-response mapping
  const keyResponseMapping = `
<table>
<tr>
  <th>UJJ</th>
  <th>VÁLASZGOMB</th>
  <th>INGER</th>
</tr>
<tr>
  <td>bal középső</td>
  <td>x</td>
  <td>piros</td>
</tr>
<tr>
  <td>bal mutató</td>
  <td>c</td>
  <td>zöld</td>
</tr>
<tr>
  <td>jobb mutató</td>
  <td>n</td>
  <td>kék</td>
</tr>
<tr>
  <td>jobb középső</td>
  <td>m</td>
  <td>sárga</td>
</tr>
</table>
`

  // Start of practice page
  const startPracticeScreen = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
  <div>
  <h2>Gyakorlás</2>
  <p>
    Az alábbi táblázatban láthatod, hogy melyik betűszínhez melyik gomb tartozik,
    illetve, hogy melyik gombot melyik ujjaddal kell megnyomnod.
    A feladatod tehát, hogy ezek alapján reagálj a felvillanó szavak betűszínére.
    Minden szó megjelenése előtt egy '+' jelet fogsz látni, ez jelzi, hogy a következő szóra kell készülnöd.
  </p>
  <p>A gyakorlás megkezdéséhez helyezd az ujjaid a megfelelő gombokra és nyomd meg a Space billentyűt!</p>
  ${keyResponseMapping}
  </div>
  `,
    choices: [" "]
  };

  timeline.push(startPracticeScreen);

  // // Define a template for a test stroop trial
  // var trial = {
  //   type: jsPsychHtmlKeyboardResponse,


  // }

  // var trial = {
  //   type: jsPsychHtmlKeyboardResponse,
  //   stimulus: '<p style="font-size:36px; color:green;">BLUE</p>',
  //   choices: ['x', 'c', 'n', 'm'],
  //   prompt: "<p>Is the ink color (r)ed, (g)reen, or (b)lue?</p>"
  // };


  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
