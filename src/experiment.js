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

  // Instructions
  var instructionsScreen = {
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

  timeline.push(instructionsScreen);

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
