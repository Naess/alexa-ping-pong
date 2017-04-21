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
          // Intialize the score
          resetScore(event);
          // event.session.attributes.team1 // Access sample
          // event.session.attributes.team2 // Access sample
          // Read Score
        //   readScore(event);
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "AddPoint":
            break;

          case "SubtractPoint":
            break;

          case "ResetGame":
            break;

          case "ReadScore":
            break;

          case "EndGame":
          context.succeed(
            generateResponse(
              buildSpeechletResponse("Thanks for playing Ping Pong!", true)
            )
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

readScore = () => {
          generateResponse(
            buildSpeechletResponse("Player 1 Score is "+event.session.attributes.team1, false),
            {team1: 0, team2: 0}
          )
}

resetScore = (event) => {
  event.session.attributes.team1 = 0;
  event.session.attributes.team2 = 0;
}
