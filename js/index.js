/*  ------------

1    8
            8    4
4    5
                    2    4
2    7
            2    3
3    6

                              8    2 ==========>    [2]

1    5
            5    3
                    3    8
            6    8
7    6

-----------------*/

let formObject = {};
let roundWinners = [];
let roundLosers = [];
let obj = {
  upperBrackets: {},
  lowerBrackets: {},
  finals: [],
  finalWinner: {},
};
let count = 1;
let gameNumber = 1;

$("#tournament-form").change((e) => {
  e.preventDefault();
  formObject[e.target.name] = e.target.value;
  if (e.target.name == "names")
    formObject[e.target.name] = e.target.value.split(",");
});

$("#submit-form").on("click", (e) => {
  if (formObject.participants && formObject.names && formObject.tournament) {
    roundsCreator(formObject.participants / 2, "upperBrackets");
    roundsCreator(formObject.participants / 2, "lowerBrackets");
    tournamentGenerator(formObject.participants);
    $("#tournament-name > p").text(`${formObject.tournament} tournament`);
  }
});

let tournamentName = formObject.tournament;
let names = formObject.names;
let tournamentGenerator = (participantsNumber) => {
  let participants = parseInt(participantsNumber);
  let maxGamesNum = 2 * (participants - 1);
  let rounds = participants / 2;
  let minGamesNum = 2 * (participants - 1) + 1;
  let organizedPlayers = participantsGenerator(participants);

  for (i = 0; i <= rounds; i++) {
    if (count == 1) {
      obj.upperBrackets.round1.list = pairPlayers(organizedPlayers);
      bracketsCreator(obj.upperBrackets.round1.list, "upperBrackets", 1);
      oddRounds(
        obj.upperBrackets.round1.list,
        obj.upperBrackets.round1.number,
        4,
        4,
        "upperBrackets"
      );
    } else if (count == 2) {
      bracketsCreator(obj.lowerBrackets.round1.list, "lowerBrackets", 1);
      bracketsCreator(obj.upperBrackets.round2.list, "upperBrackets", 2);
      evenRounds(
        obj.upperBrackets.round2.list,
        obj.upperBrackets.round2.number,
        obj.lowerBrackets.round1.list,
        1,
        2,
        2
      );
    } else if (count == 3) {
      bracketsCreator(obj.lowerBrackets.round2.list, "lowerBrackets", 2);
      oddRounds(
        obj.lowerBrackets.round2.list,
        obj.lowerBrackets.round2.number,
        2,
        2,
        "lowerBrackets"
      );
    } else if (count == 4) {
      bracketsCreator(obj.lowerBrackets.round3.list, "lowerBrackets", 3);
      bracketsCreator(obj.upperBrackets.round3.list, "upperBrackets", 3);
      evenRounds(
        obj.upperBrackets.round3.list,
        obj.upperBrackets.round3.number,
        obj.lowerBrackets.round3.list,
        3,
        1,
        1
      );
    } else if (count == 5) {
      bracketsCreator(obj.lowerBrackets.round4.list, "lowerBrackets", 4);
      oddRounds(
        obj.lowerBrackets.round4.list,
        obj.lowerBrackets.round4.number,
        1,
        1,
        "lowerBrackets"
      );
    } else if (count == 6) {
      obj.upperBrackets.round4.list.push(obj.finals);
      bracketsCreator(obj.upperBrackets.round4.list, "upperBrackets", 4);
      fainals(obj.upperBrackets.round4.list, 4);
    }
  }

  return obj;
};

let oddRounds = (
  currentRound,
  currentRoundNumber,
  winnersLength,
  losersLength,
  bracketsPlace
) => {
  roundWinners = [];
  let roundLosersFilter = [];
  currentRound.forEach((bracket, index) => {
    currentRound[index].forEach((player, pIndex) => {
      $(
        `#${bracketsPlace} > #round${currentRoundNumber} > div > #bracket${currentRoundNumber}${
          index + 1
        }`
      )
        .find(`#player${player.index}`)
        .on("click", (e) => {
          console.log(e);
          player.wins++;
          roundWinners.push(player);
          if (currentRound[index].indexOf(player) == 0) {
            currentRound[index][pIndex + 1].loses++;
            roundLosers.push(currentRound[index][pIndex + 1]);
          } else {
            currentRound[index][pIndex - 1].loses++;
            roundLosers.push(currentRound[index][pIndex - 1]);
          }
          if (roundWinners.length == winnersLength) {
            if (winnersLength == 1) {
              obj.finals.push(roundWinners[0]);
              count++;
              tournamentGenerator(roundWinners.length);
              return;
            } else {
              for (key in obj) {
                if (key == bracketsPlace) {
                  console.log(obj[key]);
                  obj[key][`round${parseInt(currentRoundNumber) + 1}`] = {
                    list: pairPlayers(roundWinners),
                    number: `${parseInt(currentRoundNumber) + 1}`,
                  };
                }
              }
              if (
                roundLosers.length == losersLength &&
                bracketsPlace == "upperBrackets"
              ) {
                obj.lowerBrackets[`round${currentRoundNumber}`] = {
                  list: pairPlayers(roundLosers),
                  number: `${currentRoundNumber}`,
                };
              }
              count++;
              tournamentGenerator(roundWinners.length);
              return;
            }
          }
        });
    });
  });
  roundLosers = [];
};

let evenRounds = (
  currentRound,
  currentRoundNumber,
  lowerRound,
  currentLowerRoundNumber,
  winnersLength,
  losersLength
) => {
  roundWinners = [];
  let roundLosersFilter = [];
  let upperWinners = [];
  let lowerWinners = [];
  currentRound.forEach((bracket, index) => {
    currentRound[index].forEach((player, pIndex) => {
      $(
        `#upperBrackets > #round${currentRoundNumber} > div > #bracket${currentRoundNumber}${
          index + 1
        }`
      )
        .find(`#player${player.index}`)
        .on("click", (e) => {
          console.log(e);
          player.wins++;
          upperWinners.push(player);
          if (currentRound[index].indexOf(player) == 0) {
            currentRound[index][pIndex + 1].loses++;
            roundLosers.push(currentRound[index][pIndex + 1]);
          } else {
            currentRound[index][pIndex - 1].loses++;
            roundLosers.push(currentRound[index][pIndex - 1]);
          }
          if (upperWinners.length == winnersLength) {
            lowerRound.forEach((lowerBracket, lowerIndex) => {
              lowerRound[lowerIndex].forEach((lowerPlayer, lPIndex) => {
                $(
                  `#lowerBrackets > #round${currentLowerRoundNumber} > div > #bracket${currentLowerRoundNumber}${
                    lowerIndex + 1
                  }`
                )
                  .find(`#player${lowerPlayer.index}`)
                  .on("click", (e) => {
                    lowerPlayer.wins++;
                    lowerWinners.push(lowerPlayer);
                    if (lowerRound[lowerIndex].indexOf(lowerPlayer) == 0) {
                      lowerRound[lowerIndex][lPIndex + 1].loses++;
                      roundLosers.push(lowerRound[lowerIndex][lPIndex + 1]);
                    } else {
                      lowerRound[lowerIndex][lPIndex - 1].loses++;
                      roundLosers.push(lowerRound[lowerIndex][lPIndex - 1]);
                    }
                    roundLosersFilter = roundLosers.filter((a) => a.loses < 2);
                    if (lowerWinners.length == winnersLength) {
                      if (roundLosersFilter.length == losersLength) {
                        let lowerWinnersWithUpperLosers = [];
                        roundLosersFilter.forEach((d, i) => {
                          lowerWinnersWithUpperLosers.push(d);
                          lowerWinnersWithUpperLosers.push(lowerWinners[i]);
                        });
                        obj.lowerBrackets[
                          `round${parseInt(currentLowerRoundNumber) + 1}`
                        ] = {
                          list: pairPlayers(lowerWinnersWithUpperLosers),
                          number: `${parseInt(currentLowerRoundNumber) + 1}`,
                        };
                        if (upperWinners.length === 1) {
                          obj.finals.push(upperWinners[0]);
                        } else {
                          obj.upperBrackets[
                            `round${parseInt(currentRoundNumber) + 1}`
                          ] = {
                            list: pairPlayers(upperWinners),
                            number: `${parseInt(currentRoundNumber) + 1}`,
                          };
                        }
                        count++;
                        tournamentGenerator(winnersLength);
                      }
                    }
                  });
              });
            });
          }
        });
    });
  });

  roundLosers = [];
};

let fainals = (currentRound, currentRoundNumber) => {
  currentRound.forEach((bracket, index) => {
    currentRound[index].forEach((player) => {
      $(
        `#round${currentRoundNumber} > div > #bracket${currentRoundNumber}${
          index + 1
        }`
      )
        .find(`#player${player.index}`)
        .on("click", (e) => {
          player.wins++;
          obj.finalWinner = player;
          $("#winner-index").append(`
          <p>${player.index}</p>
          `);
          $("#winner-name").append(`
          <p>${player.name}</p>
          `);
          return;
        });
    });
  });

  roundLosers = [];
};

let participantsGenerator = (numOfPlayers) => {
  let rounds = Math.log(numOfPlayers) / Math.log(2) - 1;
  let plays = [1, 2];
  for (var i = 0; i < rounds; i++) {
    plays = nextLayer(plays);
  }
  return plays;
};

let nextLayer = (plays) => {
  let out = [];
  let length = plays.length * 2 + 1;
  plays.forEach((d) => {
    out.push(d);
    out.push(length - d);
  });
  return out;
};

let pairPlayers = (arrayOfPlays) => {
  let arr = [];
  for (i = 0; i < arrayOfPlays.length; i++) {
    if (typeof arrayOfPlays[i] == "number") {
      if (i % 2 !== 0) {
        arr.push([
          {
            index: arrayOfPlays[i - 1],
            wins: 0,
            loses: 0,
            name: formObject.names[i - 1],
          },
          {
            index: arrayOfPlays[i],
            wins: 0,
            loses: 0,
            name: formObject.names[i],
          },
        ]);
      }
    } else {
      if (i % 2 !== 0) arr.push([arrayOfPlays[i - 1], arrayOfPlays[i]]);
    }
  }
  return arr;
};

let roundsCreator = (roundsNum, bracketPlace) => {
  for (i = 0; i < roundsNum; i++) {
    $(`#${bracketPlace}`).append(
      `
      <div class="rounds" id="round${i + 1}">
      </div>
      `
    );
    if (bracketPlace == "upperBrackets") {
      obj.upperBrackets[`round${i + 1}`] = {
        number: `${i + 1}`,
        list: [],
      };
    } else {
      obj.lowerBrackets[`round${i + 1}`] = {
        number: `${i + 1}`,
        list: [],
      };
    }
  }
};

let bracketsCreator = (numberOfBrackets, bracketPlace, currentRound) => {
  let roundNum = currentRound;
  for (i = 0; i < numberOfBrackets.length; i++) {
    $(`#${bracketPlace} > #round${roundNum}`).append(
      `<div class="display-flex">
        <span class="game-number">${gameNumber++}</span>
        <div class="brackets" id="bracket${roundNum}${i + 1}"></div>

      </div>
        `
    );
    for (j = 0; j < numberOfBrackets[i].length; j++) {
      if (j % 2 !== 0) {
        $(
          `#${bracketPlace} > #round${roundNum} > div > #bracket${roundNum}${
            i + 1
          }`
        ).append(
          `
          <div class="players" id="player${numberOfBrackets[i][j - 1].index}">
            <div class="player-index">
              <p>${numberOfBrackets[i][j - 1].index}</p>
            </div>
            <div class="player-name">
              <p>${numberOfBrackets[i][j - 1].name}</p>
            </div>
          </div>
          <hr class="line" />
          <div class="players" id="player${numberOfBrackets[i][j].index}">
            <div class="player-index">
              <p>${numberOfBrackets[i][j].index}</p>
            </div>
            <div class="player-name">
              <p>${numberOfBrackets[i][j].name}</p>
            </div>
          </div>
          `
        );
      }
    }
    if (i % 2 !== 0) {
      $(`#${bracketPlace} > #round${roundNum} > div`).append(
        `
      <hr class="line" />
      `
      );
    }
  }
};
