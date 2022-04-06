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
  export function getRandomTrials(numberOfTrials, addFirstTrial) {
    var redBlock = [[["ZÖLD", "green", "con", "c"], ["PIROS", "red", "con", "x"]], [["PIROS", "green", "inc", "c"], ["ZÖLD", "red", "inc", "x"]]]
    var blueBlock = [[["KÉK", "blue", "con", "n"], ["SÁRGA", "yellow", "con", "m"]], [["KÉK", "yellow", "inc", "m"], ["SÁRGA", "blue", "inc", "n"]]]
  
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
      loopData.push({ word: element[0], color: element[1], congruency: element[2], correctResponse: element[3] });
    });
  
    // Add one random in the beginning as the first trial
    if (addFirstTrial) {
      const firstTrial = blueBlock[Math.floor(Math.random() * 2)][Math.floor(Math.random() * 2)]
      loopData.unshift({ word: firstTrial[0], color: firstTrial[1], congruency: firstTrial[2], correctResponse: firstTrial[3] })
    }
  
    return loopData
  }

  // For the calibration trials
export function getRandomCalibrationTrials(numberOfTrials) {
  var redBlock = [[["ZÖLD", "green", "con", "c"], ["PIROS", "red", "con", "x"]], [["PIROS", "green", "inc", "c"], ["ZÖLD", "red", "inc", "x"]]]
  var blueBlock = [[["KÉK", "blue", "con", "n"], ["SÁRGA", "yellow", "con", "m"]], [["KÉK", "yellow", "inc", "m"], ["SÁRGA", "blue", "inc", "n"]]]
  
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
    calibrationLoopData.push({ word: element[0], color: element[1], congruency: element[2], correctResponse: element[3] });
  })

  return calibrationLoopData
}