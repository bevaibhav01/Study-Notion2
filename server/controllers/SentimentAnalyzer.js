// // utils/sentimentAnalysis.js
// const sentiment = require('vader-sentiment');
// const natural = require('natural');
// const rake = require('rake-node');

// async function analyzeSentiment(review) {
//     // Tokenization using the natural library
//     const tokenizer = new natural.WordTokenizer();
//     const tokens = tokenizer.tokenize(review);

//     // Sentiment analysis using VADER
//     const sentimentResult = sentiment.SentimentIntensityAnalyzer.polarity_scores(review);
//     let sentimentCategory;
//     let sentimentScore;

//     // Determine sentiment category and score
//     if (sentimentResult.compound >= 0.05) {
//         sentimentCategory = 'positive';
//         sentimentScore = sentimentResult.compound;
//     } else if (sentimentResult.compound <= -0.05) {
//         sentimentCategory = 'negative';
//         sentimentScore = sentimentResult.compound;
//     } else {
//         sentimentCategory = 'neutral';
//         sentimentScore = 0;
//     }

//     // Key phrase extraction using RAKE
//     const keyPhrases = rake(review);

//     return { sentimentScore, sentimentCategory, keyPhrases };
// }

// module.exports = { analyzeSentiment };
