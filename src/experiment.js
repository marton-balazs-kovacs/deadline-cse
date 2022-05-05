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
import {getRandomTrials, getRandomCalibrationTrials} from "./utils.js"

import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response"
import PreloadPlugin from "@jspsych/plugin-preload";

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  const jsPsych = initJsPsych({
    // Comment out if do not want to show data on finish
    on_finish: function() {
      jsPsych.data.displayData('csv');
    }
  });

  const timeline = [];
  
  // generate a random subject ID with 15 characters
  var participant_id = jsPsych.randomization.randomID(15);

  // Add data to all rows of the participant
  jsPsych.data.addProperties({
    participant_id: participant_id
  });

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

  var informedProceed = true

  // Informed
  var informedScreen = {
    timeline: [{
      type: HtmlButtonResponsePlugin,
      stimulus: function() {
      return  `<div> 
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
    <p class=${informedProceed? null: 'alert'}>A továbblépéshez kérem kattintson a Részt veszek gombra.</p>
  </div>`},
      // canvas_size: [300, 300],
      choices: ['Részt veszek', 'Nem veszek részt'],
      on_finish: function (data) {
        // agree is 0, not agree is 1 as a response
        if (data.response === 0) {
          informedProceed = true
        } else {
          informedProceed = false
        }
      }
    }],
    loop_function: function(){
      if(informedProceed){
        return false;
      } else {
        return true;
      }
    }
  };

  var consentProceed = true

  var consentScreen = {
    timeline: [{
      type: HtmlButtonResponsePlugin,
      stimulus: function () {
        return `<div>
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
  <p class=${consentProceed ? null : 'alert'}>A továbblépéshez kérem kattintson a Részt veszek gombra.</p>
  </div>
  `},
      choices: ['Részt veszek', 'Nem veszek részt'],
      on_finish: function (data) {
        // agree is 0, not agree is 1 as a response
        if (data.response === 0) {
          consentProceed = true
        } else {
          consentProceed = false
        }
      }
    }],
    loop_function: function () {
      if (consentProceed) {
        return false;
      } else {
        return true;
      }
    }
  };

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

  // Table for key-response mapping
  const keyResponseMapping = `
<table style="margin-left: auto; margin-right: auto;">
<tr>
  <th>UJJ</th>
  <th>VÁLASZGOMB</th>
  <th>INGER</th>
</tr>
<tr style="font-weight: normal;">
  <td>bal középső</td>
  <td>x</td>
  <td>piros</td>
</tr>
<tr style="font-weight: normal;">
  <td>bal mutató</td>
  <td>c</td>
  <td>zöld</td>
</tr>
<tr style="font-weight: normal;">
  <td>jobb mutató</td>
  <td>n</td>
  <td>kék</td>
</tr>
<tr style="font-weight: normal;">
  <td>jobb középső</td>
  <td>m</td>
  <td>sárga</td>
</tr>
</table>
`

  // Count down page
  const countDownScreen = {
    timeline: [{
      type: HtmlKeyboardResponsePlugin,
      stimulus: function() {
        return `<h1>${jsPsych.timelineVariable("count")}</h1>`
      },
      choices: "NO_KEYS",
      trial_duration: 1000,
      data: {
        task: 'countdown'
      }
    }],
    timeline_variables: [
      {count: '3'},
      {count: '2'},
      {count: '1'}
    ]
  }

  // Start of practice page
  const startPracticeScreen = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
  <div>
  <h2>Gyakorlás</2>
  <p style="font-weight: normal;">
    Az alábbi táblázatban láthatod, hogy melyik betűszínhez melyik gomb tartozik,
    illetve, hogy melyik gombot melyik ujjaddal kell megnyomnod.
    A feladatod tehát, hogy ezek alapján reagálj a felvillanó szavak betűszínére.
    Minden szó megjelenése előtt egy '+' jelet fogsz látni, ez jelzi, hogy a következő szóra kell készülnöd.
  </p>
  <p>A gyakorlás megkezdéséhez helyezd az ujjaid a megfelelő gombokra és nyomd meg a Space billentyűt!</p>
  <br>
  ${keyResponseMapping}
  </div>
  `,
    choices: [" "]
  };

  // Practice phase
  // Create pseudo random practice stimuli
  // TRUE value should be 24 false
  const practiceStimuli = getRandomTrials(4, false);

  // Define template for fixation cross
  var fixationCross = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<div style="font-size:60px; color: gray;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: {
      task: 'fixation'
    }
  };

  var practiceTrial = {
    // Define a template for a practice stroop trial
    type: HtmlKeyboardResponsePlugin,
    // HTML template for practice trial
    stimulus: function () {
      return `
      <div style="font-size: 36px; font-weight: bold; color: ${jsPsych.timelineVariable('color')}">
      ${jsPsych.timelineVariable('word')}
      </div>
      `
    },
    choiches: ['x', 'c', 'n', 'm'],
    trial_duration: null,
    stimulus_duration: 250,
    prompt: `
        <div style="display: inline-block; color:black; font-weight:normal; font-size: 36px;">
          x = <span class="dot" style="background-color:red;"></span> c = <span class="dot" style="background-color:green;"></span>  n = <span class="dot" style="background-color:blue"></span>  m = <span class="dot" style="background-color:yellow;"></span>
        </div>`,
    data: {
      task: 'practice_trial',
      correct_response: jsPsych.timelineVariable('correctResponse')
    },
    on_finish: function (data) {
      // Score the response as correct or incorrect.
      if (jsPsych.pluginAPI.compareKeys(data.response, data.correct_response)) {
        data.correct = true;
      } else {
        data.correct = false;
      }
    }
  };

  // Define a template for a feedback trial
  var feedback = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function() {
      // The feedback stimulus is a dynamic parameter because we can't know in advance whether
      // the stimulus should be 'correct' or 'incorrect'.
      // Instead, this function will check the accuracy of the last response and use that information to set
      // the stimulus value on each trial.
      var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
      if(last_trial_correct){
        return `
          <div style="font-size: 36px; font-weight: bold; color: grey;">
            Helyes
            <br>
            <div style="display: inline-block; color:black; font-weight:normal;">
              x = <span class="dot" style="background-color:red;"></span> c = <span class="dot" style="background-color:green;"></span>  n = <span class="dot" style="background-color:blue"></span>  m = <span class="dot" style="background-color:yellow;"></span>
            </div>
          </div>`; 
        // the parameter value has to be returned from the function
      } else {
        return `
        <div style="font-size: 36px; font-weight: bold; color: grey;">
          Helytelen
          <br>
          <div style="display: inline-block; color:black; font-weight:normal;">
            x = <span class="dot" style="background-color:red;"></span> c = <span class="dot" style="background-color:green;"></span>  n = <span class="dot" style="background-color:blue"></span>  m = <span class="dot" style="background-color:yellow;"></span>
          </div>
        </div>`; 
        // the parameter value has to be returned from the function
      }
    },
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: {
      task: 'feedback'
    }
  };

  var practiceBlock = {
    timeline: [fixationCross, practiceTrial, feedback],
    timeline_variables: practiceStimuli
  }

  // End practice phase
  var endPractice = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div>
        <h2>Gyakorlás vége</h2>
        <p>
          Most következik a négy kísérleti szakasz, amelyek 'A' és 'B' részekből állnak.
          Ezek során már nem lesz a képernyőn, hogy melyik színhez
          melyik gomb tartozik, valamint nem fogsz visszajelzést kapni arról, hogy
          helyesen válaszoltál-e. Tartsd az ujjaid a megfelelő gombokon és nyomd
          meg a Space billentyűt az első 'A' rész megkezdéséhez!
        </p>
        ${keyResponseMapping}
      </div>`,
    choices: [" "],
    data: { 
      task: 'end_practice'
    }
  };

  // Calibration phase
  const blockLoopData = [
    { blockId: '1', testStimuli: getRandomTrials(4, true), calibrationStimuli: getRandomCalibrationTrials(4) },
    { blockId: '2', testStimuli: getRandomTrials(4, true), calibrationStimuli: getRandomCalibrationTrials(4) },
    { blockId: '3', testStimuli: getRandomTrials(4, true), calibrationStimuli: getRandomCalibrationTrials(4) },
    { blockId: '4', testStimuli: getRandomTrials(4, true), calibrationStimuli: getRandomCalibrationTrials(4) },
  ];

  var index = 0;

  // Define a template for a calibration stroop trial
  var calibrationTrial = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      var block_data = jsPsych.timelineVariable('calibrationStimuli')
      var trial_data = block_data[index]

      return `<div style="font-size: 36px; font-weight: bold; color: ${trial_data.color}">
            ${trial_data.word}
            </div>`
    },
    choiches: ['x', 'c', 'n', 'm'],
    trial_duration: null,
    stimulus_duration: 250,
    data: {
      task: 'calibration_trial',
      correct_response: function() {
        var block_data = jsPsych.timelineVariable('calibrationStimuli')
        var trial_data = block_data[index]
        return trial_data.correctResponse
      }
    },
    on_finish: function (data) {
      // Score the response as correct or incorrect.
      if (jsPsych.pluginAPI.compareKeys(data.response, data.correct_response)) {
        data.correct = true;
      } else {
        data.correct = false;
      }

      index++
    }
  };

  var calibrationBlock = {
    timeline: [fixationCross, calibrationTrial],
    data: {
      block_id: function() {
        jsPsych.timelineVariable('blockId')
      }
    },
    loop_function() {
      if (index == blockLoopData[jsPsych.timelineVariable('blockId') - 1]) {
        return false;
      } else {
        return true;
      }
    }
  };

  var deadline

  // End calibration phase
  var endCalibration = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
          <div>
            <h2>'A' rész vége</h2>
            <p>
              A most következő 'B' részben limitált időd lesz reagálni, ezért talán gyorsabbnak fog tűnni a feladat.
              Igyekezz mindig a következő szó megjelenése előtt reagálni (ha meglátod a '+' jelet, már a következő szóra kell készülnöd)
              és ügyelj arra, hogy helyesen válaszolj!
              <br>
              Továbbra is tartsd az ujjaid a megfelelő gombokon és nyomd meg a Space billentyűt a 'B' rész megkezdéséhez!
            </p>
            ${keyResponseMapping}
          </div>`,
    choices: [" "],
    data: {
      task: 'end_calibration',
      block_id: function() {
        jsPsych.timelineVariable('blockId')
      }
    },
    on_start: function () {
      index = 0;
      var deadline = jsPsych.data.get().filter({task: 'calibration_trial', correct: true}).select('rt').mean();
      if (deadline === undefined) {
        jsPsych.endExperiment("A kísérlet végetért, mert túl sok hibát követtél el az 'A' rész alatt. Kérlek, hogy vedd fel a kapcsolatot a kísérletvezetővel.");
      }
    }
};

  // Test phase
  var testTrial = {
    // Define a template for a test stroop trial
    type: HtmlKeyboardResponsePlugin,
    // HTML template for test trial
    stimulus: function () {
      var block_data = jsPsych.timelineVariable('testStimuli')
      var trial_data = block_data[index]

      return `<div style="font-size: 36px; font-weight: bold; color: ${trial_data.color}">
      ${trial_data.word}
      </div>`
    },
    choiches: ['x', 'c', 'n', 'm'],
    // trial duration is set by the personal deadline of the participant per block
    trial_duration: deadline,
    stimulus_duration: 250,
    data: {
      task: 'test_trial',
      correct_response: function() {
        var block_data = jsPsych.timelineVariable('testStimuli')
        var trial_data = block_data[index]
        return trial_data.correctResponse
      }
    },
    on_finish: function (data) {
      // Score the response as correct or incorrect.
      if (jsPsych.pluginAPI.compareKeys(data.response, data.correct_response)) {
        data.correct = true;
      } else {
        data.correct = false;
      }

      index++
    }
  };

  var testBlock = {
    timeline: [fixationCross, testTrial],
    data: {
      block_id: function() {
        jsPsych.timelineVariable('blockId')
      }
    },
    loop_function() {
      if (index == blockLoopData[jsPsych.timelineVariable('blockId')].testStimuli.length) {
        return false;
      } else {
        return true;
      }
    }
  };

  // Between block phase
  var betweenBlock = {
    timeline: [{
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
    <div class='betweenblock'>
    <h2>Ez a szakasz véget ért.</2>
    <p>
      A következő előtt tarthatsz egy rövid szünetet.
      A folytatáshoz helyezd az ujjaid a megfelelő gombokra és nyomd meg a Space billentyűt!
    </p>
    ${keyResponseMapping}
    </div>
    `,
      choices: [" "],
      data: {
        task: 'end_calibration',
        block_id: function() {
          jsPsych.timelineVariable('blockId')
        }
      },
      on_start: function () {
        index = 0
      }
    }],
    conditional_function: function () {
      if (jsPsych.timelineVariable('blockId') != 4) {
        true
      } else {
        false
      }
    }
  }

  var blockLoop = {
    timeline: [
      // countDownScreen,
      calibrationBlock, endCalibration,
      // countDownScreen, testBlock,
      betweenBlock],
    timeline_variables: blockLoopData
  }

  // End of experiment screen
  var endExperiment = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
    <div>
    <h1>Kész</h1>
    <p>
      A kísérlet véget ért, 80%-os pontossággal teljesítetted a tesztet. Köszönjük a részvételt!
    </p>
    <p>
      A kutatásban való részvételedet a Neptun-kódod megadásával igazolhatod,
      amit <a target="_blank" href="https://forms.gle/HxaQDSy5wdsStJyM8">ERRE</a> a linkre kattintva tudsz megtenni. Ne feledd, hogy csak akkor kapod meg a pontot,
      ha a feladat mindkét verzióját teljesíted és mind a kétszer megadod a Neptun-kódodat!
    </p>
    <p>
      Ha bármi kérdésed vagy megjegyzésed van, kérlek, vedd fel a kapcsolatot Székely Zsuzsával, a kutatás vezetőjével ezen az email címen: szekely.zsuzsa.mail@gmail.com!
    </p>
    </div>
    `,
    choices: [" "],
    data: {
      task: 'end_experiment'
    }
  };

  timeline.push(
    // informedScreen,
    // consentScreen,
    // instructionsScreen,
    // startPracticeScreen,
    // countDownScreen,
    // practiceBlock,
    // endPractice,
    blockLoop,
    endExperiment
  );

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
