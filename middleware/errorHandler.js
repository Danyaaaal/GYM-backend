const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
  
    // Check if the error is a custom one with a status code and message
    if (err.statusCode && err.message) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      // If the error is not a custom one, return a generic 500 internal server error
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export default errorHandler;
  