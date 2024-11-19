const path = require('src\components\core\Dashboard\CourseFeebackAnalysis.jsx');

module.exports = {
  // Other configurations...
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "child_process": false, // Since `child_process` doesn't work in the browser, we can ignore it.
    }
  },
  // Other configurations...
};
