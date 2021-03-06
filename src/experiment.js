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
        "stroop": "Ebben a k??s??rletben arra vagyunk k??v??ncsiak, hogy az emberek hogyan oldanak fel vizu??lis ingerek feldolgoz??sa k??zben l??trej??v?? konfliktusokat. A k??s??rlet alatt k??l??nb??z?? sz??n?? bet??kkel ??rt sz??nek nevei fognak felvillanni a k??perny??n, ezekre itt l??thatsz 2 p??ld??t:",
        "primeprobe": "Ebben a k??s??rletben arra vagyunk k??v??ncsiak, hogy az emberek hogyan figyelnek a vizu??lis ingerekre. Minden pr??b??ban el??sz??r h??rom azonos sz??t fogsz l??tni egym??s f??l??tt a k??perny?? k??zep??n. A h??rom sz?? minden pr??b??ban csak Fel, Le, Bal ??s Jobb lehet. A h??rom sz?? nagyon gyorsan fog felvillanni, majd elt??nni. Ezut??n egy sz??t fogsz l??tni a k??perny?? k??zep??n. Ez a sz?? is Bal, Jobb, Fel vagy Le lesz."
    },
    "instructions_detail": {
        "stroop": "A feladatod az lesz, hogy meghat??rozd, milyen sz??nnel van ??rva a sz??, mik??zben a sz?? jelent??s??t figyelmen k??v??l hagyod. Teh??t a fenti 2 p??ld??ra a helyes v??laszok a piros ??s a s??rga. Mindegyik sz??n n??gy v??laszbillenty?? (x; c; n; m) valamelyik??hez lesz hozz??rendelve. Azt, hogy melyik sz??n melyik v??laszbillenty??h??z tartozik, k??s??bb, a gyakorl?? r??sz alatt lesz alkalmad megtanulni. K??r??nk, hogy olyan gyorsan v??laszolj, amennyire ez lehets??ges hib??z??s n??lk??l!",
        "primeprobe": "A feladatod az lesz, hogy minden pr??ba sor??n beazonos??tsd a m??sodikk??nt felvillan??, egyed??l??ll?? sz??t (ne az els??k??nt felvillan?? h??rom sz??t), ??s arra reag??lj a megfelel?? billenty?? megnyom??s??val. Az egyes szavakhoz tartoz?? billenty??ket a k??vetkez?? oldalon l??v?? t??bl??zatban l??thatod ??s a gyakorl??r??sz alatt memoriz??lhatod. Igyekezz minden pr??b??n??l olyan gyorsan v??laszolni, amennyire hib??z??s n??lk??l lehets??ges!"
    },
    "mapping_key": {
        "stroop": ["x", "c", "n", "m"],
        "primeprobe": ["f", "g", "n", "j"]
    },
    "mapping_stimulus": {
        "stroop": ["PIROS", "Z??LD", "K??K", "S??RGA"],
        "primeprobe": ["BAL", "JOBB", "LE", "FEL"]
    },
    "start_practice": {
        "stroop": "Az al??bbi t??bl??zatban l??thatod, hogy melyik bet??sz??nhez melyik gomb tartozik, illetve, hogy melyik gombot melyik ujjaddal kell megnyomnod. A feladatod teh??t, hogy ezek alapj??n reag??lj a felvillan?? szavak bet??sz??n??re. Minden sz?? megjelen??se el??tt egy '+' jelet fogsz l??tni, ez jelzi, hogy a k??vetkez?? sz??ra kell k??sz??ln??d.",
        "primeprobe": "Az al??bbi t??bl??zatban l??thatod, hogy melyik sz??hoz melyik gomb tartozik, illetve, hogy melyik gombot melyik ujjaddal kell megnyomnod. A feladatod teh??t, hogy minden pr??ba sor??n ezek szerint reag??lj a m??sodikk??nt felvillan?? sz??ra."
    },
    "end_practice": {
      "stroop": "Most k??vetkezik a n??gy k??s??rleti szakasz, amelyek 'A' ??s 'B' r??szekb??l ??llnak. Ezek sor??n m??r nem lesz a k??perny??n, hogy melyik sz??nhez melyik gomb tartozik, valamint nem fogsz visszajelz??st kapni arr??l, hogy helyesen v??laszolt??l-e.",
      "primeprobe": "Most k??vetkezik a n??gy k??s??rleti szakasz, amelyek 'A' ??s 'B' r??szekb??l ??llnak. Ezek sor??n m??r nem lesz a k??perny??n, hogy melyik sz??hoz melyik gomb tartozik, valamint nem fogsz visszajelz??st kapni arr??l, hogy helyesen v??laszolt??l-e."
  },
    "end_calibration": {
        "stroop": "A most k??vetkez?? 'B' r??szben limit??lt id??d lesz reag??lni, ez??rt tal??n gyorsabbnak fog t??nni a feladat. Igyekezz mindig a k??vetkez?? sz?? megjelen??se el??tt reag??lni (ha megl??tod a '+' jelet, m??r a k??vetkez?? sz??ra kell k??sz??ln??d) ??s ??gyelj arra, hogy helyesen v??laszolj!",
        "primeprobe": "A feladatod a most k??vetkez?? 'B' r??szben is ugyanaz lesz, viszont kevesebb id??d lesz reag??lni, ez??rt gyorsabbnak fog t??nni a feladat. Igyekezz az id??korl??ton bel??l reag??lni ??s ??gyelj arra, hogy helyesen v??laszolj!"
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
    <h1>T??j??koztat?? nyilatkozat</h1> 
    <p>
      Egy tudom??nyos kutat??sban veszel r??szt, amelynek t??mavezet??je Dr. Acz??l Bal??zs,
      az ELTE Affekt??v Pszichol??gia Tansz??k??nek kutat??ja. A kutat??s c??lja megvizsg??lni
      a korl??tozott v??laszad??si id?? hat??s??t a konfliktusadapt??ci??ra.
    </p>
    <p>
      Az ELTE PPK Affekt??v Pszichol??gia Tansz??k Metatudom??ny Kutat??csoportja mint
      adatkezel?? szigor??an bizalmasan kezel minden olyan szem??lyes inform??ci??t,
      amit a kutat??s keretein bel??l gy??jt??nk ??ssze. Ezeket k??ddal ell??tva, 
      biztons??gos sz??m??t??g??peken t??roljuk. A kezelt adatok a k??vetkez??k:
      NEPTUN-k??d, ??letkor, nem, iskolai v??gzetts??g. Az azonos??t??s??ra alkalmas
      adatokat (NEPTUN-k??d) arra haszn??ljuk fel, hogy regisztr??lhassuk a
      kutat??sban val?? r??szv??tel??rt j??r?? kurzuspontokat, ezut??n t??r??lni fogjuk ??ket. 
      V??laszaid semmilyen m??don nem lesznek hozz??d k??thet??k. Szem??lyes adataidat
      m??s adatkezel??nek, adatfeldolgoz??nak nem adjuk ??t, ??m az anonimiz??lt
      (szem??lyes azonos??t??sra nem alkalmas) adataid m??s kutat??kkal megosztjuk.
      E t??ny??ll??s r??szleteit a ???Hozz??j??rul??s adatkezel??shez??? c. dokumentum 
      tartalmazza <a target="_blank" href="http://metasciencelab.elte.hu/hozzajarulas-adatkezeleshez">ITT</a>.
      Az adatkezel??sr??l sz??l?? szab??lyoz??sr??l r??szletesebben pedig
      <a target="_blank" href="https://ppk.elte.hu/file/Hozzajarulas_adatkezeleshez_melleklet_2018.pdf.">ITT</a> t??j??koz??dhatsz.
    </p>
    <p>
      A kutat??sban val?? r??szv??tel teljesen ??nk??ntes. A vizsg??latot b??rmikor
      indokl??s n??lk??l megszak??thatod, vagy a k??rd??sek megv??laszol??s??t megtagadhatod
      a b??ng??sz??ablak bez??r??s??val. Ha b??rmilyen k??rd??sed, agg??lyod vagy panaszod van
      a k??s??rlettel kapcsolatban, k??rlek, keresd Sz??kely Zsuzs??t (szekely.zsuzsa.mail@gmail.com)!
      <p>A ???Hozz??j??rul??s az adatkezel??shez??? c. dokumentumot elolvastam ??s a benne foglaltakat elfogadom.</p>
    </p>
    <p class=${informedProceed? null: 'alert'}>A tov??bbl??p??shez kattints a R??szt veszek gombra!</p>
  </div>`},
      // canvas_size: [300, 300],
      choices: ['R??szt veszek', 'Nem veszek r??szt'],
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
        <h1>Beleegyez?? nyilatkozat</h1>
        <p>
    Felel??ss??gem teljes tudat??ban kijelentem, hogy a mai napon az E??tv??s Lor??nd
    Tudom??nyegyetem, Dr. Acz??l Bal??zs kutat??svezet?? ??ltal v??gzett vizsg??latban
    ??nk??nt veszek r??szt. A vizsg??lat jelleg??r??l annak megkezd??se el??tt kiel??g??t??
    t??j??koztat??st kaptam. Elm??ltam 18 ??ves. Nem szenvedek semmilyen pszichi??triai
    betegs??gben. A vizsg??lat idej??n alkohol vagy drogok hat??sa alatt nem ??llok.
    Tudom??sul veszem, hogy az azonos??t??somra alkalmas szem??lyi adataimat bizalmasan
    kezelik. Hozz??j??rulok ahhoz, hogy a vizsg??lat sor??n a r??lam felvett, szem??lyem
    azonos??t??s??ra nem alkalmas adatok m??s kutat??k sz??m??ra is hozz??f??rhet??k legyenek.
    Fenntartom a jogot arra, hogy a vizsg??lat sor??n annak folytat??s??t??l b??rmikor
    el??llhassak. Ilyen esetben a r??lam addig felvett adatokat t??r??lni kell.
    Tudom??sul veszem, hogy csak a teljesen befejezett kit??lt??s??rt kapok pontot a
    Pszichol??giai k??s??rletben ??s tudom??nyos aktivit??sban val?? r??szv??tel c??m??
    kurzuson.
  </p>
  <br>
  <h3>A kutat??sban val?? r??szv??tel k??r??lm??nyeir??l r??szletes t??j??koztat??st kaptam, a felt??telekkel egyet??rtek.</h3>
  <p class=${consentProceed ? null : 'alert'}>A tov??bbl??p??shez kattints a R??szt veszek gombra!</p>
  </div>
  `},
      choices: ['R??szt veszek', 'Nem veszek r??szt'],
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
      {prompt: 'Mi a NEPTUN k??dod?', placeholder: 'neptun', required: true}
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
      <h1 style="color: yellow;">K??K</h1>
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
  <h1>Instrukci??k</h1>
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
    A gyakorl??st k??vet??en a k??s??rlet 4 szakaszb??l fog ??llni, ezek mindegyike 2 r??szre ('A' ??s 'B') oszlik.
    A 4 szakasz egyenk??nt kb. 8 percet vesz ig??nybe, k??z??tt??k r??vid sz??netet tarthatsz.
  </p>
  <p>
    K??r??nk, hogy a feladatot sz??m??t??g??pen v??gezd el (ne telefonon, tableten stb.)!
    Nagyon fontos, hogy a k??s??rlet sor??n v??gig tudj ??sszpontos??tani, ez??rt k??r??nk, hogy ne csin??lj semmi m??st,
    mik??zben a feladatot csin??lod! Ha 70% feletti pontoss??ggal oldod meg a feladatot, valamint, ha elv??gzed a feladat mindk??t r??sz??t,
    akkor 2 pontot kapsz a ???Pszichol??giai k??s??rletben ??s tudom??nyos aktivit??sban val?? r??szv??tel??? nev?? kurzuson.
    Ha a megold??sod pontoss??ga 70%-n??l alacsonyabb lesz (ami egy ??sszer?? hat??r az el??z?? kutat??sok f??ny??ben),
    illetve ha csak az egyik r??szt teljes??ted, akkor nem kapsz pontot a kit??lt??s??rt.
    Ne felejtsd el megadni a Neptun-k??dod a k??s??rlet v??g??n, hogy be??rhassuk a pontjaid!
  </p>
  Nyomd meg a Space billenty??t a folytat??shoz!
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
  <th>V??LASZGOMB</th>
  <th>INGER</th>
</tr>
<tr style="font-weight: normal;">
  <td>bal k??z??ps??</td>
  <td>${taskData.mapping_key[task][0]}</td>
  <td>${taskData.mapping_stimulus[task][0]}</td>
</tr>
<tr style="font-weight: normal;">
  <td>bal mutat??</td>
  <td>${taskData.mapping_key[task][1]}</td>
  <td>${taskData.mapping_stimulus[task][1]}</td>
</tr>
<tr style="font-weight: normal;">
  <td>jobb mutat??</td>
  <td>${taskData.mapping_key[task][2]}</td>
  <td>${taskData.mapping_stimulus[task][2]}</td>
</tr>
<tr style="font-weight: normal;">
  <td>jobb k??z??ps??</td>
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
  <h2>Gyakorl??s</2>
  <p style="font-weight: normal;">
    ${taskData.start_practice[task]}
  </p>
  <p>A gyakorl??s megkezd??s??hez helyezd az ujjaid a megfelel?? gombokra ??s nyomd meg a Space billenty??t!</p>
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
        <h2>Gyakorl??s v??ge</h2>
        <p>
          ${taskData.end_practice[task]}
        </p>
        <p>
          Tartsd az ujjaid a megfelel?? gombokon ??s nyomd
          meg a Space billenty??t az els?? 'A' r??sz megkezd??s??hez!
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
            <h2>'A' r??sz v??ge</h2>
            <p>
              ${taskData.end_calibration[task]}
              <br>
              Tov??bbra is tartsd az ujjaid a megfelel?? gombokon ??s nyomd meg a Space billenty??t a 'B' r??sz megkezd??s??hez!
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
        jsPsych.endExperiment('A k??s??rlet v??get??rt, mert t??l sok hib??t k??vett??l el az "A" r??sz alatt. K??rlek, hogy vedd fel a kapcsolatot a k??s??rletvezet??vel.');
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
    <h2>Ez a szakasz v??get ??rt.</2>
    <p>
      A k??vetkez?? el??tt tarthatsz egy r??vid sz??netet.
      A folytat??shoz helyezd az ujjaid a megfelel?? gombokra ??s nyomd meg a Space billenty??t!
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
    <h1>K??sz</h1>
    <p>
      K??sz??nj??k a r??szv??telt!
    </p>
    <p>
      Ne feledd, hogy csak akkor kapod meg a pontot,
      ha a feladat mindk??t verzi??j??t teljes??ted ??s mind a k??tszer megadod a Neptun-k??dodat!
    </p>
    <p>
      Ha b??rmi k??rd??sed vagy megjegyz??sed van, k??rlek, vedd fel a kapcsolatot Sz??kely Zsuzs??val, a kutat??s vezet??j??vel ezen az email c??men: szekely.zsuzsa.mail@gmail.com!
    </p>
    <p style="color: red; font-weight: bold;">
    Nyomj meg egy gombot, hogy befejezd a k??s??rletet ??s r??gz??tsd az eredm??nyed.
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
