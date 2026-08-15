function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : 'Upload failed';
    return res.status(400).json({ message });
  }

  if (err.message === 'Only JPEG and PNG images are allowed') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something went wrong' });
}

module.exports = errorHandler;
