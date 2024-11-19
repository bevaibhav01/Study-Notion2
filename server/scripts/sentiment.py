from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import sys
import json

def analyze_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    sentiment_score = analyzer.polarity_scores(text)
    return sentiment_score

if __name__ == "__main__":
    text = sys.argv[1]
    result = analyze_sentiment(text)
    print(json.dumps(result))  # Ensure valid JSON is printed
