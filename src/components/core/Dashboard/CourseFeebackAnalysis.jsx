import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement, // For Pie chart
} from 'chart.js';
import WordCloud from 'react-wordcloud'; // Import word cloud

// Register the necessary chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement);

const CourseFeedbackAnalysis = () => {
  const { courseId } = useParams(); // Get the courseId from the URL
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch course details including reviews and sentiment analysis using POST request
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.post('http://localhost:4000/api/v1/course/getCourseDetails', { courseId }); 
        // Sending courseId in the body
        console.log(response.data.data,"data of review")
        setCourseDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseDetails || !courseDetails.courseDetails) {
    return <div>Course details not found.</div>;
  }

  const { courseDetails: course } = courseDetails;

  // Check if ratingAndReviews exists before accessing its length
  const reviews = course.ratingAndReviews || [];

  // Average Rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Rating Distribution
  const ratingData = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    ratingData[review.rating - 1] += 1;
  });

  // Sentiment Data for Bar Chart
  const sentimentData = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  reviews.forEach((review) => {
    if (review.sentimentCategory === 'positive') sentimentData.positive += 1;
    if (review.sentimentCategory === 'neutral') sentimentData.neutral += 1;
    if (review.sentimentCategory === 'negative') sentimentData.negative += 1;
  });

  const sentimentChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderColor: ['#388E3C', '#FFB300', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };

  const sentimentChartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Pie Chart for Sentiment Distribution
  const sentimentPieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  // Pie Chart for Rating Distribution
  const ratingPieData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        data: ratingData,
        backgroundColor: ['#F44336', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3'],
      },
    ],
  };

  // Function to get most common key phrases (now showing top 10)
  const getMostCommonKeyPhrases = () => {
    const keyPhrasesMap = {};

    // Loop through reviews and count key phrases
    reviews.forEach((review) => {
      if (review.keyPhrases) {
        review.keyPhrases.forEach((phrase) => {
          keyPhrasesMap[phrase] = (keyPhrasesMap[phrase] || 0) + 1;
        });
      }
    });

    // Convert the map to an array of [phrase, count] pairs
    const sortedKeyPhrases = Object.entries(keyPhrasesMap)
      .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
      .slice(0, 10); // Get the top 10 most common key phrases

    return sortedKeyPhrases;
  };

  const mostCommonKeyPhrases = getMostCommonKeyPhrases();

  // Sentiment Trend Over Time (assuming we have date data in reviews)
  const sentimentTrend = reviews.reduce((acc, review) => {
    const date = new Date(review.date);
    const month = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format as MM-YYYY
    acc[month] = acc[month] || { positive: 0, neutral: 0, negative: 0 };
    acc[month][review.sentimentCategory] += 1;
    return acc;
  }, {});

  const trendData = {
    labels: Object.keys(sentimentTrend),
    datasets: [
      {
        label: 'Positive',
        data: Object.values(sentimentTrend).map((data) => data.positive),
        borderColor: '#4CAF50',
        fill: false,
      },
      {
        label: 'Neutral',
        data: Object.values(sentimentTrend).map((data) => data.neutral),
        borderColor: '#FFC107',
        fill: false,
      },
      {
        label: 'Negative',
        data: Object.values(sentimentTrend).map((data) => data.negative),
        borderColor: '#F44336',
        fill: false,
      },
    ],
  };

  // Instructor Response Rate
  const responseRate = (reviews.filter((review) => review.instructorResponse).length / reviews.length) * 100;

  // Suggestions from Students
  const suggestions = reviews.filter((review) => review.review.toLowerCase().includes('improve') || review.review.toLowerCase().includes('better'));


  // Helper function for Cosine Similarity Calculation
  const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    for (const key in vecA) {
      if (vecB[key]) {
        dotProduct += vecA[key] * vecB[key];
      }
      magA += vecA[key] * vecA[key];
      magB += vecB[key] * vecB[key];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    return dotProduct / (magA * magB);
  };

  // TF-IDF Function to Convert Reviews into Vectors
  const tfidf = (reviews) => {
    const termFrequency = {};
    const documentFrequency = {};
    const numReviews = reviews.length;

    reviews.forEach((review, index) => {
      const words = review.toLowerCase().split(/\s+/);
      const uniqueWords = new Set(words);

      uniqueWords.forEach((word) => {
        if (!termFrequency[word]) termFrequency[word] = {};
        if (!termFrequency[word][index]) termFrequency[word][index] = 0;
        termFrequency[word][index] += 1;

        if (!documentFrequency[word]) documentFrequency[word] = 0;
        documentFrequency[word] += 1;
      });
    });

    const tfidfVectors = reviews.map((review, index) => {
      const words = review.toLowerCase().split(/\s+/);
      const vector = {};

      words.forEach((word) => {
        const tf = termFrequency[word][index] / words.length; // Term Frequency
        const idf = Math.log(numReviews / (documentFrequency[word] + 1)); // Inverse Document Frequency
        vector[word] = tf * idf;
      });

      return vector;
    });

    return tfidfVectors;
  };

  // Function to get the "most suggested" reviews (central reviews)
  const getMostSuggestedReviews = () => {
    const tfidfVectors = tfidf(reviews.map(review => review.review)); // Get the text reviews
    const reviewSimilarityCounts = new Array(reviews.length).fill(0);

    // Calculate similarity between each pair of reviews
    for (let i = 0; i < reviews.length; i++) {
      for (let j = 0; j < reviews.length; j++) {
        if (i !== j) {
          const similarity = cosineSimilarity(tfidfVectors[i], tfidfVectors[j]);
          if (similarity > 0.5) { // Threshold for similarity (e.g., 0.5)
            reviewSimilarityCounts[i] += 1; // Increase the count for review i if it's similar to review j
          }
        }
      }
    }

    // Sort reviews by how many reviews they are similar to (in descending order)
    const sortedReviewIndexes = [...reviewSimilarityCounts.keys()].sort((a, b) => reviewSimilarityCounts[b] - reviewSimilarityCounts[a]);

    // Return the top 5 reviews with the highest similarity counts
    return sortedReviewIndexes.slice(0, 5).map(index => reviews[index].review);
  };

  // Get the top 5 most suggested reviews
  const mostSuggestedReviews = getMostSuggestedReviews();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">{course.courseName}</h1>
      <p className="text-white">{course.courseDescription}</p>

      {/* Average Rating */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Average Rating</h2>
        <p className="text-white">{averageRating.toFixed(2)} / 5</p>
      </div>

      {/* Rating Distribution Pie Chart */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Rating Distribution</h2>
        <div className="mt-4" style={{ height: '400px' }}>
          <Pie data={ratingPieData} />
        </div>
      </div>

      {/* Sentiment Distribution Pie Chart */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Sentiment Distribution</h2>
        <div className="mt-4" style={{ height: '400px' }}>
          <Pie data={sentimentPieData} />
        </div>
      </div>

      {/* Sentiment Analysis Bar Chart */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Sentiment Analysis Graph</h2>
        <div className="mt-4" style={{ height: '300px' }}>
          <Bar data={sentimentChartData} options={sentimentChartOptions} />
        </div>
      </div>

      {/* Sentiment Trend Over Time */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Sentiment Trend Over Time</h2>
        <div className="mt-4" style={{ height: '300px' }}>
          <Line data={trendData} options={sentimentChartOptions} />
        </div>
      </div>

      {/* Most Common Key Phrases */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Most Common Key Phrases</h2>
        {mostCommonKeyPhrases.length > 0 ? (
          <ul className="text-white">
            {mostCommonKeyPhrases.map(([phrase, count], index) => (
              <li key={index} className="mb-2">
                <strong>{phrase}:</strong> {count} occurrences
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No key phrases found.</p>
        )}
      </div>

      {/* Word Cloud for Key Phrases */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Word Cloud</h2>
        <div className="mt-4" style={{ height: '300px' }}>
          <WordCloud words={mostCommonKeyPhrases.map(([phrase, count]) => ({ text: phrase, value: count }))} />
        </div>
      </div>

      {/* Instructor Response Rate */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Instructor Response Rate</h2>
        <p className="text-white">{responseRate.toFixed(2)}%</p>
      </div>

      {/* Suggestions from Students */}
      <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">{course.courseName}</h1>
      <p className="text-white">{course.courseDescription}</p>

      {/* Average Rating */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Average Rating</h2>
        <p className="text-white">{(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(2)} / 5</p>
      </div>

      {/* Suggestions from Students (Top 5 most suggested reviews) */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-white">Suggestions from Students</h2>
        {mostSuggestedReviews.length > 0 ? (
          <ul className="text-white">
            {mostSuggestedReviews.map((review, index) => (
              <li key={index} className="mb-2">
                {review}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No suggestions found.</p>
        )}
      </div>

      {/* Other sections like charts */}
    </div>
    </div>
  );
};

export default CourseFeedbackAnalysis;
