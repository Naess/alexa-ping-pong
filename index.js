var https = require('https')

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Starting Ping Pong! Red Team 0, Blue Team 0!", false),
            {team1: 0, team2: 0}
          )
          // event.session.attributes.team1 // Access sample
          // event.session.attributes.team2 // Access sample
        )
        // Intialize the score
        resetScore(event);
        break;

      case "IntentRequest":
        // Intent Request

        switch(event.request.intent.name) {
          case "AddPoint":

            var prompt = '',
                team = event.request.intent.slots.TeamName.value || '';

            event.session.attributes.team1 = event.session.attributes.team1 || 0;
            event.session.attributes.team2 = event.session.attributes.team2 || 0;

            if ((team.toLowerCase().indexOf('one') > -1) || (team.indexOf('1') > -1)) {
              if (event.session.attributes.team1 < 21) {
                event.session.attributes.team1++;
              }
              prompt+= readScore(event.session.attributes);
            } else if ((team.toLowerCase().indexOf('two') > -1) || (team.indexOf('2') > -1)) {
              if (event.session.attributes.team2 < 21) {
                event.session.attributes.team2++;
              }
              prompt+= readScore(event.session.attributes);
            } else {
              prompt+="Sorry. I couldn't understand your command. Please say it again.";
            }

            if (event.session.attributes.team1 >= 21) {
              prompt+= " Team 1 wins! Would you like to play again?";
            } else if (event.session.attributes.team2 >= 21) {
              prompt+= " Team 2 wins! Would you like to play again?";
            }

            context.succeed(
                generateResponse(
                    buildSpeechletResponse(prompt, false),
                    event.session.attributes
                )
            );
            break;

          case "SubtractPoint":
            var prompt = '',
                team = event.request.intent.slots.TeamName.value || '';

            event.session.attributes.team1 = event.session.attributes.team1 || 0;
            event.session.attributes.team2 = event.session.attributes.team2 || 0;

            if ((team.toLowerCase().indexOf('one') > -1) || (team.indexOf('1') > -1)) {
              if (event.session.attributes.team1 > 0) {
                event.session.attributes.team1--;
              }
              prompt+= readScore(event.session.attributes);
            } else if ((team.toLowerCase().indexOf('two') > -1) || (team.indexOf('2') > -1)) {
              if (event.session.attributes.team2 > 0) {
                event.session.attributes.team2--;
              }
              prompt+= readScore(event.session.attributes);
            } else {
              prompt+="Sorry. I couldn't understand your command. Please say it again.";
            }

            context.succeed(
                generateResponse(
                    buildSpeechletResponse(prompt, false),
                    event.session.attributes
                )
            );
            break;

          case "ResetGame":
            break;

          case "ReadScore":
            var scoreString = readScore(event.session.attributes);

            context.succeed(
              generateResponse(
                buildSpeechletResponse("The current score is "+scoreString, false),
                event.session.attributes
              )
            );
            break;

          case "EndGame":
            context.succeed(
              generateResponse(
                buildSpeechletResponse("Thanks for playing Ping Pong!", true)
              )
            );
            // End the session here
            break;

          default:
            throw "Invalid intent"
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession, reprompt) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession,
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: reprompt || ''
      }
    }
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}

readScore = (attributes) => {
    var responseString = "Team 1 has "+attributes.team1+". Team 2 has "+attributes.team2+".";
    return responseString;
}

resetScore = (event) => {
  event.session.attributes.team1 = 0;
  event.session.attributes.team2 = 0;
}
