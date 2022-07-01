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
import SurveyTextPlugin from "@jspsych/plugin-survey-text";

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  // Get task
  // This code should be changed to jatos js once it is running on jatos see https://www.jatos.org/jatos.js-Reference.html
  // If you want to send the task in jatos query url use jatos.urlQueryParameters.task
  var task = 'stroop';
  // var task = 'primeprobe';
  
  // Load task specific information
  var taskData = {
    "instructions_intro": {
        "stroop": "Ebben a kísérletben arra vagyunk kíváncsiak, hogy az emberek hogyan oldanak fel vizuális ingerek feldolgozása közben létrejövő konfliktusokat. A kísérlet alatt különböző színű betűkkel írt színek nevei fognak felvillanni a képernyőn, ezekre itt láthatsz 2 példát:",
        "primeprobe": "Ebben a kísérletben arra vagyunk kíváncsiak, hogy az emberek hogyan figyelnek a vizuális ingerekre. Minden próbában először három azonos szót fogsz látni egymás fölött a képernyő közepén. A három szó minden próbában csak Fel, Le, Bal és Jobb lehet. A három szó nagyon gyorsan fog felvillanni, majd eltűnni. Ezután egy szót fogsz látni a képernyő közepén. Ez a szó is Bal, Jobb, Fel vagy Le lesz."
    },
    "instructions_detail": {
        "stroop": "A feladatod az lesz, hogy meghatározd, milyen színnel van írva a szó, miközben a szó jelentését figyelmen kívül hagyod. Tehát a fenti 2 példára a helyes válaszok a piros és a sárga. Mindegyik szín négy válaszbillentyű (x; c; n; m) valamelyikéhez lesz hozzárendelve. Azt, hogy melyik szín melyik válaszbillentyűhöz tartozik, később, a gyakorló rész alatt lesz alkalmad megtanulni. Kérünk, hogy olyan gyorsan válaszolj, amennyire ez lehetséges hibázás nélkül!",
        "primeprobe": "A feladatod az lesz, hogy minden próba során beazonosítsd a másodikként felvillanó, egyedülálló szót (ne az elsőként felvillanó három szót), és arra reagálj a megfelelő billentyű megnyomásával. Az egyes szavakhoz tartozó billentyűket a következő oldalon lévő táblázatban láthatod és a gyakorlórész alatt memorizálhatod. Igyekezz minden próbánál olyan gyorsan válaszolni, amennyire hibázás nélkül lehetséges!"
    },
    "mapping_key": {
        "stroop": ["x", "c", "n", "m"],
        "primeprobe": ["f", "g", "n", "j"]
    },
    "mapping_stimulus": {
        "stroop": ["PIROS", "ZÖLD", "KÉK", "SÁRGA"],
        "primeprobe": ["BAL", "JOBB", "LE", "FEL"]
    },
    "start_practice": {
        "stroop": "Az alábbi táblázatban láthatod, hogy melyik betűszínhez melyik gomb tartozik, illetve, hogy melyik gombot melyik ujjaddal kell megnyomnod. A feladatod tehát, hogy ezek alapján reagálj a felvillanó szavak betűszínére. Minden szó megjelenése előtt egy '+' jelet fogsz látni, ez jelzi, hogy a következő szóra kell készülnöd.",
        "primeprobe": "Az alábbi táblázatban láthatod, hogy melyik szóhoz melyik gomb tartozik, illetve, hogy melyik gombot melyik ujjaddal kell megnyomnod. A feladatod tehát, hogy minden próba során ezek szerint reagálj a másodikként felvillanó szóra."
    },
    "end_practice": {
      "stroop": "Most következik a négy kísérleti szakasz, amelyek 'A' és 'B' részekből állnak. Ezek során már nem lesz a képernyőn, hogy melyik színhez melyik gomb tartozik, valamint nem fogsz visszajelzést kapni arról, hogy helyesen válaszoltál-e.",
      "primeprobe": "Most következik a négy kísérleti szakasz, amelyek 'A' és 'B' részekből állnak. Ezek során már nem lesz a képernyőn, hogy melyik szóhoz melyik gomb tartozik, valamint nem fogsz visszajelzést kapni arról, hogy helyesen válaszoltál-e."
  },
    "end_calibration": {
        "stroop": "A most következő 'B' részben limitált időd lesz reagálni, ezért talán gyorsabbnak fog tűnni a feladat. Igyekezz mindig a következő szó megjelenése előtt reagálni (ha meglátod a '+' jelet, már a következő szóra kell készülnöd) és ügyelj arra, hogy helyesen válaszolj!",
        "primeprobe": "A feladatod a most következő 'B' részben is ugyanaz lesz, viszont kevesebb időd lesz reagálni, ezért gyorsabbnak fog tűnni a feladat. Igyekezz az időkorláton belül reagálni és ügyelj arra, hogy helyesen válaszolj!"
    }
}

  const jsPsych = initJsPsych({
    // on_finish: function() {
    //   jatos.endStudy(jsPsych.data.get().csv());
    // }
  });

  const timeline = [];
  
  // Generate a random subject ID with 15 characters
  var participant_id = jsPsych.randomization.randomID(15);

  // Add data to all rows of the participant
  jsPsych.data.addProperties({
    participant_id: participant_id,
    conflict_task: task
  });

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

  // // Preload assets
  // timeline.push({
  //   type: PreloadPlugin,
  //   images: assetPaths.images,
  //   audio: assetPaths.audio,
  //   video: assetPaths.video,
  // });

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
      tartalmazza <a target="_blank" href="http://metasciencelab.elte.hu/hozzajarulas-adatkezeleshez">ITT</a>.
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
    <p class=${informedProceed? null: 'alert'}>A továbblépéshez kattints a Részt veszek gombra!</p>
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
      },
      data: {
        task: 'informed'
      },
      save_trial_parameters: {
        stimulus: false
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
  <p class=${consentProceed ? null : 'alert'}>A továbblépéshez kattints a Részt veszek gombra!</p>
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
      },
      data: {
        task: 'consent'
      },
      save_trial_parameters: {
        stimulus: false
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

  // Neptun id
  const neptun = {
    type: SurveyTextPlugin,
    questions: [
      {prompt: 'Mi a NEPTUN kódod?', placeholder: 'neptun', required: true}
    ],
    data: {
      task: 'neptun'
    }
  }

  // Example
  if (task === 'stroop') {
    var example = `
    <div style="display: inline-block;">
      <h1 style="color:red;">PIROS</h1>
      <h1 style="color: yellow;">KÉK</h1>
    </div>`
  } else if (task === 'primeprobe') {
    var example = `
    <div style="width: 50%; display: inline-block;">
      <div style="float: left; width: 50%; padding-top:60px; padding-bottom:60px; text-align:center; vertical-align: middle;">
        <h1 style="color:black;">Le</h1>
      </div>
      <div style="float: left; width: 50%;">
        <h1 style="color:black;">Fel</h1>
        <h1 style="color:black;">Fel</h1>
        <h1 style="color:black;">Fel</h1>
      </div>      
    </div>`
  }

  // Create instructions
  const instructionsScreen = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
  <div>
  <h1>Instrukciók</h1>
  <p>
    ${taskData.instructions_intro[task]}
  </p>
  <br>
  ${example}
  <br>
  <p>
  ${taskData.instructions_detail[task]}
  </p>
  <p>
    A gyakorlást követően a kísérlet 4 szakaszból fog állni, ezek mindegyike 2 részre ('A' és 'B') oszlik.
    A 4 szakasz egyenként kb. 8 percet vesz igénybe, közöttük rövid szünetet tarthatsz.
  </p>
  <p>
    Kérünk, hogy a feladatot számítógépen végezd el (ne telefonon, tableten stb.)!
    Nagyon fontos, hogy a kísérlet során végig tudj összpontosítani, ezért kérünk, hogy ne csinálj semmi mást,
    miközben a feladatot csinálod! Ha 70% feletti pontossággal oldod meg a feladatot, valamint, ha elvégzed a feladat mindkét részét,
    akkor 2 pontot kapsz a „Pszichológiai kísérletben és tudományos aktivitásban való részvétel” nevű kurzuson.
    Ha a megoldásod pontossága 70%-nál alacsonyabb lesz (ami egy ésszerű határ az előző kutatások fényében),
    illetve ha csak az egyik részt teljesíted, akkor nem kapsz pontot a kitöltésért.
    Ne felejtsd el megadni a Neptun-kódod a kísérlet végén, hogy beírhassuk a pontjaid!
  </p>
  Nyomd meg a Space billentyűt a folytatáshoz!
  </div>
  `,
    choices: [" "],
    data: {
      task: 'instructions'
    },
    save_trial_parameters: {
      stimulus: false
    }
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
  <td>${taskData.mapping_key[task][0]}</td>
  <td>${taskData.mapping_stimulus[task][0]}</td>
</tr>
<tr style="font-weight: normal;">
  <td>bal mutató</td>
  <td>${taskData.mapping_key[task][1]}</td>
  <td>${taskData.mapping_stimulus[task][1]}</td>
</tr>
<tr style="font-weight: normal;">
  <td>jobb mutató</td>
  <td>${taskData.mapping_key[task][2]}</td>
  <td>${taskData.mapping_stimulus[task][2]}</td>
</tr>
<tr style="font-weight: normal;">
  <td>jobb középső</td>
  <td>${taskData.mapping_key[task][3]}</td>
  <td>${taskData.mapping_stimulus[task][3]}</td>
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
      },
      save_trial_parameters: {
        stimulus: false
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
    ${taskData.start_practice[task]}
  </p>
  <p>A gyakorlás megkezdéséhez helyezd az ujjaid a megfelelő gombokra és nyomd meg a Space billentyűt!</p>
  <br>
  ${keyResponseMapping}
  </div>
  `,
    choices: [" "],
    data: {
      task: 'start_practice'
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  // Practice phase
  // Create pseudo random practice stimuli
  // TRUE value should be 24 false
  const practiceStimuli = getRandomTrials(24, task = task, false);

  // Define template for fixation cross
  var fixationCross = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<div style="font-size:60px; color: gray;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: {
      task: 'fixation'
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  if (task === 'stroop') {
   var helpBar = `x = <span class="dot" style="background-color:red;"></span> c = <span class="dot" style="background-color:green;"></span>  n = <span class="dot" style="background-color:blue"></span>  m = <span class="dot" style="background-color:yellow;"></span>` 
  } else if (task === 'primeprobe') {
    var helpBar = `f = <span style="font-weight: bold;">BAL</span> g = <span style="font-weight: bold;">JOBB</span>  n = <span style="font-weight: bold;">LE</span>  j = <span style="font-weight: bold;">FEL</span>`
  }

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
    choices: taskData.mapping_key[task],
    prompt: `
        <br>
        <div style="display: inline-block; color:black; font-weight:normal; font-size: 30px;">
          ${helpBar}
        </div>`,
    data: {
      task: 'practice_trial',
      correct_response: jsPsych.timelineVariable('correctResponse'),
      color: jsPsych.timelineVariable('color'),
      word: jsPsych.timelineVariable('word')
    },
    on_finish: function (data) {
      // Score the response as correct or incorrect.
      if (jsPsych.pluginAPI.compareKeys(data.response, data.correct_response)) {
        data.correct = true;
      } else {
        data.correct = false;
      }
    },
    on_start: function(trial) {
      if (task === 'stroop') {
        trial.response_ends_trial = true
        trial.trial_duration = null
        trial.stimulus_duration = 250
      } else if (task === 'primeprobe') {
        trial.response_ends_trial = false
        trial.trial_duration = 2000
        trial.stimulus_duration = 133
      }
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  // Define prime for the primeprobe task for practice
  var primePractice = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function() {
      return `
        <div style="display: block; color:black; font-weight:bold; font-size: 30px;">
          ${jsPsych.timelineVariable('prime')}<br>
          ${jsPsych.timelineVariable('prime')}<br>
          ${jsPsych.timelineVariable('prime')}<br>
        </div>`
    },
    choices: "NO_KEYS",
    trial_duration: 166,
    stimulus_duration: 133,
    data: {
      task: 'prime',
      prime: jsPsych.timelineVariable('prime')
    },
    save_trial_parameters: {
      stimulus: false
    }
  }

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
          </div>`; 
        // the parameter value has to be returned from the function
      } else {
        return `
        <div style="font-size: 36px; font-weight: bold; color: grey;">
          Helytelen
        </div>`; 
        // the parameter value has to be returned from the function
      }
    },
    prompt: `
    <br>
    <div style="display: inline-block; color:black; font-weight:normal; font-size: 30px;">
      ${helpBar}
    </div>`,
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: {
      task: 'feedback'
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  // Define timeline based on task
  if (task === 'stroop') {
    var practiceBlockTimeline = [fixationCross, practiceTrial, feedback];
  } else if (task === 'primeprobe') {
    var practiceBlockTimeline = [primePractice, practiceTrial, feedback];
  }
  
  var practiceBlock = {
    timeline: practiceBlockTimeline,
    timeline_variables: practiceStimuli
  };

  // End practice phase
  var endPractice = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div>
        <h2>Gyakorlás vége</h2>
        <p>
          ${taskData.end_practice[task]}
        </p>
        <p>
          Tartsd az ujjaid a megfelelő gombokon és nyomd
          meg a Space billentyűt az első 'A' rész megkezdéséhez!
        </p>
        ${keyResponseMapping}
      </div>`,
    choices: [" "],
    data: { 
      task: 'end_practice'
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  // Calibration phase
  if (task === 'stroop') {
    var numberTestTrials = 80
  } else if (task === 'primeprobe') {
    var numberTestTrials = 96
  }

  const blockLoopData = [
    { blockId: '1', testStimuli: getRandomTrials(numberTestTrials, task = task, true), calibrationStimuli: getRandomCalibrationTrials(28, task = task) },
    { blockId: '2', testStimuli: getRandomTrials(numberTestTrials, task = task, true), calibrationStimuli: getRandomCalibrationTrials(28, task = task) },
    { blockId: '3', testStimuli: getRandomTrials(numberTestTrials, task = task, true), calibrationStimuli: getRandomCalibrationTrials(28, task = task) },
    { blockId: '4', testStimuli: getRandomTrials(numberTestTrials, task = task, true), calibrationStimuli: getRandomCalibrationTrials(28, task = task) },
  ];

  var index = 0;
  var block_data
  var trial_data

  // Define template for fixation cross
  var calibrationFixationCross = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<div style="font-size:60px; color: gray;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: {
      task: 'fixation'
    },
    save_trial_parameters: {
      stimulus: false
    },
    on_start: function() {
      block_data = jsPsych.timelineVariable('calibrationStimuli')
      trial_data = block_data[index]
    }
  };

  if (task === 'stroop') {
    var helpBar = `x = <span class="dot" style="background-color:red;"></span> c = <span class="dot" style="background-color:green;"></span>  n = <span class="dot" style="background-color:blue"></span>  m = <span class="dot" style="background-color:yellow;"></span>`
  } else if (task === 'primeprobe') {
    var helpBar = `f = <span style="font-weight: bold;">BAL</span> g = <span style="font-weight: bold;">JOBB</span>  n = <span style="font-weight: bold;">LE</span>  j = <span style="font-weight: bold;">FEL</span>`
  }

  // Define a template for a calibration stroop trial
  var calibrationTrial = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      return `<div style="font-size: 36px; font-weight: bold; color: ${trial_data.color}">
            ${trial_data.word}
            </div>`
    },
    choices: taskData.mapping_key[task],
    data: {
      task: 'calibration_trial',
      correct_response: function () {
        return trial_data.correctResponse
      },
      color: function () {
        return trial_data.color
      },
      word: function () {
        return trial_data.word
      },
      prime: function() {
        if (task === 'stroop') {
          return ""
        } else if (task === 'primeprobe') {
          return trial_data.prime
        }
      },
      block_id: function() {
        return jsPsych.timelineVariable('blockId')
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
    },
    on_start: function(trial) {
      if (task === 'stroop') {
        trial.response_ends_trial = true
        trial.trial_duration = null
        trial.stimulus_duration = 250
      } else if (task === 'primeprobe') {
        trial.response_ends_trial = false
        trial.trial_duration = 2000
        trial.stimulus_duration = 133
      }
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  // Define prime for the primeprobe task for test
  var primeCalibration = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      return `
          <div style="display: block; color:black; font-weight: bold; font-size: 30px;">
            ${trial_data.prime}<br>
            ${trial_data.prime}<br>
            ${trial_data.prime}<br>
          </div>`
    },
    choices: "NO_KEYS",
    trial_duration: 166,
    stimulus_duration: 133,
    data: {
      task: 'prime',
      prime: function() {
        // Get data for the specific trial
        // For some reason data function is ran first, then stimulus, then on_start event
        // As every trial is preceeded by a prime this will influence the trial
        // data for the calibrationTrial screen as well
        block_data = jsPsych.timelineVariable('calibrationStimuli');
        trial_data = block_data[index];
        return trial_data.prime
      }
    },
    save_trial_parameters: {
      stimulus: false
    }
  }

  // Define timeline based on task
  if (task === 'stroop') {
    var calibrationBlockTimeline  = [calibrationFixationCross, calibrationTrial]
  } else if (task === 'primeprobe') {
    var calibrationBlockTimeline  = [primeCalibration, calibrationTrial]
  }

  var calibrationBlock = {
    timeline: calibrationBlockTimeline,
    data: {
      block_id: function() {
        return jsPsych.timelineVariable('blockId')
      }
    },
    loop_function() {
      if (index == blockLoopData[jsPsych.timelineVariable('blockId') - 1].calibrationStimuli.length) {
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
              ${taskData.end_calibration[task]}
              <br>
              Továbbra is tartsd az ujjaid a megfelelő gombokon és nyomd meg a Space billentyűt a 'B' rész megkezdéséhez!
            </p>
            ${keyResponseMapping}
          </div>`,
    choices: [" "],
    data: {
      task: 'end_calibration',
      block_id: function() {
        return jsPsych.timelineVariable('blockId')
      }
    },
    on_start: function () {
      index = 0;
      deadline = jsPsych.data.get().filter({task: 'calibration_trial', correct: true, block_id: jsPsych.timelineVariable('blockId')}).select('rt').mean();
      deadline = Math.ceil(deadline)

      if (deadline === undefined | isNaN(deadline)) {
        jsPsych.endExperiment('A kísérlet végetért, mert túl sok hibát követtél el az "A" rész alatt. Kérlek, hogy vedd fel a kapcsolatot a kísérletvezetővel.');
      }
      // For primeprobe add prime time
      if (task === 'primeprobe') {
        deadline = deadline + 166
      }
    },
    save_trial_parameters: {
      stimulus: false
    }
};

  // Test phase
  // Define prime for the primeprobe task for test
  var primeTest = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      return `
            <div style="display: block; color:black; font-weight: bold; font-size: 30px;">
              ${trial_data.prime}<br>
              ${trial_data.prime}<br>
              ${trial_data.prime}<br>
            </div>`
    },
    choices: "NO_KEYS",
    trial_duration: 166,
    stimulus_duration: 133,
    data: {
      task: 'prime',
      prime: function() {
        block_data = jsPsych.timelineVariable('testStimuli')
        trial_data = block_data[index]
        return trial_data.prime
      }
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  var testFixationCross = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<div style="font-size:60px; color: gray;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: {
      task: 'fixation'
    },
    save_trial_parameters: {
      stimulus: false
    },
    on_start: function() {
      block_data = jsPsych.timelineVariable('testStimuli')
      trial_data = block_data[index]
    }
  };

  var testTrial = {
    // Define a template for a test stroop trial
    type: HtmlKeyboardResponsePlugin,
    // HTML template for test trial
    stimulus: function () {
      return `<div style="font-size: 36px; font-weight: bold; color: ${trial_data.color}">
      ${trial_data.word}
      </div>`
    },
    choices: taskData.mapping_key[task],
    data: {
      task: 'test_trial',
      correct_response: function() {
        return trial_data.correctResponse
      },
      color: function () {
        return trial_data.color
      },
      word: function () {
        return trial_data.word
      },
      prime: function() {
        if (task === 'stroop') {
          return ""
        } else if (task === 'primeprobe') {
          return trial_data.prime
        }
      },
      block_id: function() {
        return jsPsych.timelineVariable('blockId')
      },
      deadline: function() {
        return deadline
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
    },
    on_start: function(trial) {
      // trial duration is set by the personal deadline of the participant per block
      trial.trial_duration = deadline;

      if (task === 'stroop') {
        trial.response_ends_trial = true
        trial.stimulus_duration = 250
      } else if (task === 'primeprobe') {
        trial.response_ends_trial = false
        trial.stimulus_duration = 133
      }
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  // Define timeline by task
  if (task === 'stroop') {
    var testBlockTimeline = [testFixationCross, testTrial]
  } else if (task === 'primeprobe') {
    var testBlockTimeline = [primeTest, testTrial]
  }

  var testBlock = {
    timeline: testBlockTimeline,
    data: {
      block_id: function() {
        return jsPsych.timelineVariable('blockId')
      }
    },
    loop_function() {
      if (index == blockLoopData[jsPsych.timelineVariable('blockId') - 1].testStimuli.length) {
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
          return jsPsych.timelineVariable('blockId')
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
    },
    save_trial_parameters: {
      stimulus: false
    }
  }

  var blockLoop = {
    timeline: [
      countDownScreen,
      calibrationBlock, endCalibration,
      countDownScreen, testBlock,
      betweenBlock
    ],
    timeline_variables: blockLoopData
  }

  // End of experiment screen
  var endExperiment = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
    <div>
    <h1>Kész</h1>
    <p>
      Köszönjük a részvételt!
    </p>
    <p>
      Ne feledd, hogy csak akkor kapod meg a pontot,
      ha a feladat mindkét verzióját teljesíted és mind a kétszer megadod a Neptun-kódodat!
    </p>
    <p>
      Ha bármi kérdésed vagy megjegyzésed van, kérlek, vedd fel a kapcsolatot Székely Zsuzsával, a kutatás vezetőjével ezen az email címen: szekely.zsuzsa.mail@gmail.com!
    </p>
    <p style="color: red; font-weight: bold;">
    Nyomj meg egy gombot, hogy befejezd a kísérletet és rögzítsd az eredményed.
    </p>
    </div>
    `,
    data: {
      task: 'end_experiment'
    },
    save_trial_parameters: {
      stimulus: false
    }
  };

  timeline.push(
    informedScreen,
    consentScreen,
    neptun,
    instructionsScreen,
    startPracticeScreen,
    countDownScreen,
    practiceBlock,
    endPractice,
    blockLoop,
    endExperiment
  );

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
