// Alexa Random Quote Skill
// Based on the sample fact skill: alexa/skill-sample-nodejs-fact
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require("ask-sdk-core");
const i18n = require("i18next");
const sprintf = require("i18next-sprintf-postprocessor");

// core functionality for quote skill
const GetRandomQuoteHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return (
      request.type === "LaunchRequest" ||
      (request.type === "IntentRequest" &&
        request.intent.name === "GetRandomQuoteIntent")
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    // gets a random quote by assigning an array to the variable
    // the random item from the array will be selected by the i18next library
    // the i18next library is set up in the Request Interceptor
    const randomQuote = requestAttributes.t("QUOTES");
    // concatenates a standard message with the random quote
    const speakOutput =
      requestAttributes.t("GET_QUOTE_MESSAGE") +
      randomQuote.author +
      ": " +
      randomQuote.quote;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(requestAttributes.t("SKILL_NAME"), randomQuote.quote)
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("HELP_MESSAGE"))
      .reprompt(requestAttributes.t("HELP_REPROMPT"))
      .getResponse();
  }
};

const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("FALLBACK_MESSAGE"))
      .reprompt(requestAttributes.t("FALLBACK_REPROMPT"))
      .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("STOP_MESSAGE"))
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("ERROR_MESSAGE"))
      .reprompt(requestAttributes.t("ERROR_MESSAGE"))
      .getResponse();
  }
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: "sprintf",
        sprintf: values
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetRandomQuoteHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

// translations
const enData = {
  translation: {
    SKILL_NAME: "Random Quotes",
    GET_QUOTE_MESSAGE: "Here's your random quote by ",
    HELP_MESSAGE: "You can say give me a quote, or, you can say exit...",
    HELP_REPROMPT: "What can I help you with?",
    FALLBACK_MESSAGE: "The Random Quotes skill can't help with that. Try again",
    FALLBACK_REPROMPT: "What can I help you with?",
    ERROR_MESSAGE: "Sorry, an error occurred.",
    STOP_MESSAGE: "Goodbye!",
    // Quotes from https://github.com/mubaris/motivate
    QUOTES: [
      {
        quote: "As long as you think your past is bad you must be improving",
        author: "Louis C.K"
      },
      {
        quote: "It's okay to have a bad day",
        author: "Unknown"
      },
      {
        quote:
          "We must all suffer from one of two pains: the pain of discipline or the pain of regret. The difference is discipline weighs ounces while regret weighs tons.",
        author: "Jim Rohn"
      },
      {
        quote:
          "A ship in the harbor is safe. But that's not what ships are for.",
        author: "Unknown"
      },
      {
        quote: "You have survived every single bad day so far",
        author: "Unknown"
      },
      {
        quote:
          "Please pay attention very carefully, because this is the truest thing a stranger will ever say to you: In the face of such hopelessness as our eventual, unavoidable death, there is little sense in not at least TRYING to accomplish all your wildest dreams in life.",
        author: "Kevin Smith"
      },
      {
        quote:
          "At the age of 18, I made up my mind to never have another bad day in my life. I dove into a endless sea of gratitude from which I've never emerged.",
        author: "Patch Adams"
      },
      {
        quote:
          "When something is important enough, you do it even if the odds are not in your favor.",
        author: "Elon Musk"
      },
      {
        quote: "Look in the MIRROR...\nThat's your COMPETITION.",
        author: "Unknown"
      },
      {
        quote: "BE STRONG\nYou never know who you are inspiring",
        author: "Unknown"
      },
      {
        quote:
          "The greatest success stories were created by people who recognized a problem & turned it into an opportunity.",
        author: "Joseph Sugarman"
      },
      {
        quote: "I never wake up today with yesterday's problems.",
        author: "Anthony Saleh"
      },
      {
        quote: "If you're going through hell,\nKEEP GOING.",
        author: "Winston Churchill"
      },
      {
        quote: "Fear stops people from accomplishing their goals.",
        author: "Unknown"
      },
      {
        quote: "The boundary between what can be and your life, is your ideas",
        author: "Pat Waldron"
      },
      {
        quote:
          "Throughout life people will make you mad, disrespect you and treat you bad. Let God deal with the things they do, cause hate in your heart will consume you too.",
        author: "Will Smith"
      },
      {
        quote:
          "There are three rules.\n1. If you do not go after what you want, you will never have it.\n2. If you do not ask, the answer will always be no.\n3. If you do not step forward, you will remain in the same place.",
        author: "Unknown"
      },
      {
        quote:
          "If people are not laughing at your goals, your goals are too small",
        author: "Asim Premji"
      },
      {
        quote:
          "There are many wonderful things that will never be done if you do not do them.",
        author: "Charles D Gill"
      },
      {
        quote:
          "To the world you may be one person, but to one person you may be the world.",
        author: "Dr. Suess"
      },
      {
        quote:
          "It's never too late to be whoever you want to be. I hope you live a life you're proud of, And if you find that you're not, I hope you have the strength to start over.",
        author: "F. Scott Fitzgerald"
      },
      {
        quote:
          "Just because you took longer than others, doesn’t mean you failed.",
        author: "Unknown"
      },
      {
        quote:
          "If you hear a voice within you say 'you cannot paint', then by all means paint and that voice will be silenced.",
        author: "Vincent Van Gogh"
      },
      {
        quote:
          "Service to others is the rent you pay for your room here on earth",
        author: "Muhammad Ali"
      },
      {
        quote:
          "One of the hardest decision you'll ever face in life is choosing whether to walk away or try harder.",
        author: "Ziad K. Abdelnour"
      },
      {
        quote:
          "Don't worry if people don't like you. Most people are struggling to like themselves.",
        author: "Unknown"
      },
      {
        quote:
          "Note to self: Keep going. You’re doing great. You might not be where you want to be yet, but that’s okay. Just take it one step at a time and keep believing in yourself. And remember: No matter what happens, you can still enjoy your life and be happy.",
        author: "Lori Deschene"
      },
      {
        quote:
          "People have a way of becoming what you encourage them to be, not what you nag them to be.",
        author: "Scudder N. Parker"
      },
      {
        quote:
          "I am only one, but I am one. I cannot do everything, but I can do something. And I will not let what I cannot do interfere with what I can do.",
        author: "Edward Everett Hale"
      },
      {
        quote:
          "Don’t wait for your feelings to change to take the action. Take the action and your feelings will change.",
        author: "Barbara Baron"
      },
      {
        quote:
          "Better to do something imperfectly than to do nothing flawlessly.",
        author: "Robert H. Schuller"
      },
      {
        quote:
          "Begin doing what you want to do now. We are not living in eternity. We have only this moment, sparkling like a star in our hand-and melting like a snowflake.",
        author: "Francis Bacon Sr."
      },
      {
        quote:
          "Always concentrate on how far you’ve come, rather than how far you have left to go.",
        author: "Unknown"
      },
      {
        quote:
          "Half our life is spent trying to find something to do with the time we have rushed through life trying to save.",
        author: "Will Rogers"
      },
      {
        quote:
          "It is better to take many small steps in the right direction than to make a great leap forward only to stumble backward.",
        author: "Proverb"
      },
      {
        quote: "Act as if what you do makes a difference. It does.",
        author: "William James"
      },
      {
        quote:
          "Don’t be afraid to go out on a limb. That’s where the fruit is.",
        author: "H. Jackson Browne"
      },
      {
        quote:
          "To have striven, to have made the effort, to have been true to certain ideals–this alone is worth the struggle.",
        author: "William Penn"
      },
      {
        quote:
          "Action may not always bring happiness; but there is no happiness without action.",
        author: "Benjamin Disraeli"
      },
      {
        quote:
          "What matters is the value we’ve created in our lives, the people we’ve made happy and how much we’ve grown as people.",
        author: "Daisaku Ikeda"
      },
      {
        quote:
          "A diamond is just a piece of charcoal that handled stress exceptionally well.",
        author: "Unknown"
      },
      {
        quote: "Think like a man of action; act like a man of thought.",
        author: "Henri L. Bergson"
      },
      {
        quote:
          "If you get up one more time than you fall, you will make it through",
        author: "Chinese Proverb"
      },
      {
        quote: "He is able who thinks he is able.",
        author: "Buddha"
      },
      {
        quote: "No matter how hard the past, you can always begin again.",
        author: "Buddha"
      },
      {
        quote:
          "Life is like riding a bicycle. To keep your balance you must keep moving.",
        author: "Einstein"
      },
      {
        quote:
          "Excellence can be obtained if you care more than others think is wise, risk more than others think is safe, dream more than others think is practical, expect more than others think is possible.",
        author: "Unknown"
      },
      {
        quote:
          "Don’t fear failure so much that you refuse to try new things. The saddest summary of life contains three descriptions: could have, might have, and should have.",
        author: "Unknown"
      },
      {
        quote: "From small beginnings come great things.",
        author: "Proverb"
      },
      {
        quote: "Don’t be pushed by your problems; be led by your dreams.",
        author: "Unknown"
      },
      {
        quote: "More powerful than the will to win is the courage to begin.",
        author: "Unknown"
      },
      {
        quote:
          "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author: "Ralph Waldo Emerson"
      },
      {
        quote: "Fear is a natural reaction to moving closer to the truth.",
        author: "Pema Chodron"
      },
      {
        quote: "Commitment in the face of conflict produces character.",
        author: "Unknown"
      },
      {
        quote:
          "Don’t let today’s disappointments cast a shadow on tomorrow’s dreams.",
        author: "Unknown"
      },
      {
        quote:
          "Mistakes are always forgivable, if one has the courage to admit them",
        author: "Bruce Lee"
      },
      {
        quote:
          "If you spend too much time thinking about a thing, you'll never get it done",
        author: "Bruce Lee"
      },
      {
        quote:
          "A wise man can learn more from a foolish question than a fool can learn from a wise answer",
        author: "Bruce Lee"
      },
      {
        quote:
          "Design is not just what it looks like and feels like. Design is how it works",
        author: "Steve Jobs"
      },
      {
        quote:
          "Sometimes when you innovate, you make mistakes. It is best to admit them quickly, and get on with improving your other innovations",
        author: "Steve Jobs"
      },
      {
        quote: "Innovation distinguishes between a leader and a follower",
        author: "Steve Jobs"
      },
      {
        quote:
          "Don’t give up just because things get hard. Give up if you feel in your gut that moving on is the right choice for you.",
        author: "Lori Deschene"
      },
      {
        quote:
          "Life isn’t always fair. Some people are born into better environments. Some people have better genetics. Some are in the right place at the right time. If you’re trying to change your life, all of this is irrelevant. All that matters is that you accept where you are, figure out where you want to be, and then do what you can, today and every day, to hold your head high and keep moving forward.",
        author: "Lori Deschene"
      },
      {
        quote:
          "I survived because the fire inside me burned brighter than the fire around me.",
        author: "Joshua Graham"
      },
      {
        quote:
          "Don’t let the fear of the time it will take to accomplish something stand in the way of your doing it.",
        author: "Earl Nightingale"
      },
      {
        quote:
          "The strongest people aren’t always the people who win, but the people who don’t give up when they lose.",
        author: "Ashley Hodgeson"
      },
      {
        quote:
          "At any given moment, you have the power to say: This is not how the story is going to end.",
        author: "Christine Mason Miller"
      },
      {
        quote:
          "Life’s blows cannot break a person whose spirit is warmed by the fire of enthusiasm.",
        author: "Norman Vincent Peale"
      },
      {
        quote:
          "When you believe something can be done, really believe, your mind will find ways to do it.",
        author: "Dr. David Schwartz"
      },
      {
        quote:
          "Your belief determines your action and your action determines your results, but first you have to believe.",
        author: "Mark Victor Hansen"
      },
      {
        quote: "A man’s errors are his portals of discovery.",
        author: "James Joyce"
      },
      {
        quote:
          "Wisdom is knowing what to do next, skill is knowing how to do it, and virtue is doing it.",
        author: "David Starr Jordan"
      },
      {
        quote:
          "Never allow a person to tell you no who doesn’t have the power to say yes.",
        author: "Eleanor Roosevelt"
      },
      {
        quote:
          "Turn your face toward the sun and the shadows will fall behind you.",
        author: "Maori Proverb"
      },
      {
        quote: "Doing your best means never stop trying.",
        author: "Unknown"
      },
      {
        quote:
          "A hard fall means a high bounce…if you’re made of the right material.",
        author: "Unknown"
      },
      {
        quote:
          "People who urge you to be realistic generally want you to accept their version of reality.",
        author: "Unknown"
      },
      {
        quote:
          "To have striven, to have made the effort, to have been true to certain ideals–this alone is worth the struggle.",
        author: "William Penn"
      },
      {
        quote:
          "If we are facing in the right direction, all we have to do is keep on walking.",
        author: "Proverb"
      },
      {
        quote:
          "Excellence can be obtained if you care more than others think is wise, risk more than others think is safe, dream more than others think is practical, expect more than others think is possible.",
        author: "Unknown"
      },
      {
        quote:
          "Life’s challenges are not supposed to paralyze you, they’re supposed to help you discover who you are.",
        author: "Bernice Johnson Reagon"
      },
      {
        quote: "I cannot make my days longer so I strive to make them better.",
        author: "Henry David Thoreau"
      },
      {
        quote:
          "We all have problems. The way we solve them is what makes us different.",
        author: "Unknown"
      },
      {
        quote: "Whenever you fall, pick something up. ",
        author: "Oswald Avery"
      },
      {
        quote: "Care and diligence bring luck.",
        author: "Proverb"
      },
      {
        quote:
          "A bend in the road is not the end of the road…unless you fail to make the turn.",
        author: "Unknown"
      },
      {
        quote:
          "Stop being afraid of what could go wrong, and start being excited about what could go right.",
        author: "Unknown"
      },
      {
        quote: "What is not started today is never finished tomorrow.",
        author: "Johann Wolfgang von Goethe"
      },
      {
        quote: "Fear is a natural reaction to moving closer to the truth.",
        author: "Pema Chodron"
      },
      {
        quote: "Commitment in the face of conflict produces character.",
        author: "Unknown"
      },
      {
        quote:
          "You can do what’s reasonable or you can decide what’s possible.",
        author: "Unknown"
      },
      {
        quote:
          "If you lose today, win tomorrow. In this never-ending spirit of challenge is the heart of a victor.",
        author: "Daisaku Ikeda"
      },
      {
        quote:
          "Always bear in mind that your own resolution to succeed is more important than any other.",
        author: "Abraham Lincoln"
      },
      {
        quote:
          "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time",
        author: "Thomas Edison"
      },
      {
        quote:
          "Don't go around saying the world owes you a living. The world owes you nothing. It was here first",
        author: "Mark Twain"
      },
      {
        quote:
          "We keep moving forward, opening new doors, and doing new things, because we're curious and curiosity keeps leading us down new paths",
        author: "Walt Disney"
      },
      {
        quote: "Nothing exterior to me will ever take command of me.",
        author: "Walt Whitman"
      },
      {
        quote: "Nothing is impossible to him who will try.",
        author: "Alexander The Great"
      },
      {
        quote: "If there are no struggles, there is no progress.",
        author: "Frederick Douglas"
      },
      {
        quote:
          "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        author: "Aristotle"
      }
    ]
  }
};

const enusData = {
  translation: {
    SKILL_NAME: "Random Quotes"
  }
};

// constructs i18n and l10n data structure
const languageStrings = {
  "en-US": enusData,
  en: enData
};
