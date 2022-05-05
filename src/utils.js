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
  
  // calculate the average of an array
  const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  
  // Create pseudo-random trial orders ----------------------------------------------------------
  // For the test trials
  export function getRandomTrials(numberOfTrials, task, addFirstTrial) {
    if (task === 'stroop') {
      var redBlock = [[["ZÖLD", "green", "con", "c"], ["PIROS", "red", "con", "x"]], [["PIROS", "green", "inc", "c"], ["ZÖLD", "red", "inc", "x"]]]
      var blueBlock = [[["KÉK", "blue", "con", "n"], ["SÁRGA", "yellow", "con", "m"]], [["KÉK", "yellow", "inc", "m"], ["SÁRGA", "blue", "inc", "n"]]]
    } else if (task === 'primeprobe') {
      var redBlock = [[["LE", "LE", "con", "n", "black"], ["FEL", "FEL", "con", "j", "black"]], [["FEL", "LE", "inc", "j", "black"], ["LE", "FEL", "inc", "n", "black"]]]
      var blueBlock = [[["BAL", "BAL", "con", "f", "black"], ["JOBB", "JOBB", "con", "g", "black"]], [["BAL", "JOBB", "inc", "f", "black"], ["JOBB", "BAL", "inc", "g", "black"]]]
    }
  
    var repetition = numberOfTrials / 8
  
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
      if (task === 'stroop') {
        loopData.push({ word: element[0], color: element[1], congruency: element[2], correctResponse: element[3] });
      } else if (task === 'primeprobe') {
        loopData.push({ word: element[0], prime: element[1], congruency: element[2], correctResponse: element[3], color: element[4] });
      }
    });
  
    // Add one random in the beginning as the first trial
    if (addFirstTrial) {
      const firstTrial = blueBlock[Math.floor(Math.random() * 2)][Math.floor(Math.random() * 2)]
      if (task === 'stroop') {
        loopData.unshift({ word: firstTrial[0], color: firstTrial[1], congruency: firstTrial[2], correctResponse: firstTrial[3] });
      } else if (task === 'primeprobe') {
        loopData.unshift({ word: firstTrial[0], prime: firstTrial[1], color: firstTrial[2], congruency: firstTrial[3], correctResponse: firstTrial[4] });
      }
    }
  
    return loopData
  }

  // For the calibration trials
export function getRandomCalibrationTrials(numberOfTrials, task) {
  // TODO add font size
  if (task === 'stroop') {
    var redBlock = [[["ZÖLD", "green", "con", "c"], ["PIROS", "red", "con", "x"]], [["PIROS", "green", "inc", "c"], ["ZÖLD", "red", "inc", "x"]]]
    var blueBlock = [[["KÉK", "blue", "con", "n"], ["SÁRGA", "yellow", "con", "m"]], [["KÉK", "yellow", "inc", "m"], ["SÁRGA", "blue", "inc", "n"]]]
  } else if (task === 'primeprobe') {
    var redBlock = [[["LE", "LE", "con", "n", "black"], ["FEL", "FEL", "con", "j", "black"]], [["FEL", "LE", "inc", "j", "black"], ["LE", "FEL", "inc", "n", "black"]]]
    var blueBlock = [[["BAL", "BAL", "con", "f", "black"], ["JOBB", "JOBB", "con", "g", "black"]], [["BAL", "JOBB", "inc", "f", "black"], ["JOBB", "BAL", "inc", "g", "black"]]]
  }
  
  const repetition = numberOfTrials / 4

  var listCalibrationOne = []
  for (const i in range(repetition)) {
    for (const k in range(redBlock[0].length)) {
      listCalibrationOne.push(redBlock[0][k])
    }
  }

  listCalibrationOne = shuffleArray(listCalibrationOne)

  var listCalibrationTwo = []
  for (const i in range(repetition)) {
    for (const k in range(blueBlock[0].length)) {
      listCalibrationTwo.push(blueBlock[0][k])
    }
  }

  listCalibrationTwo = shuffleArray(listCalibrationTwo)

  var trialCalibrationList = []
  for (const i in range(listCalibrationOne.length)) {
    trialCalibrationList.push(listCalibrationOne[i])
    trialCalibrationList.push(listCalibrationTwo[i])
  }

  var calibrationLoopData = []
  trialCalibrationList.forEach(element => {
    if (task === 'stroop') {
      calibrationLoopData.push({ word: element[0], color: element[1], congruency: element[2], correctResponse: element[3] });
    } else if (task === 'primeprobe') {
      calibrationLoopData.push({ word: element[0], prime: element[1], congruency: element[2], correctResponse: element[3], color: element[4] });
    }
  })

  return calibrationLoopData
}