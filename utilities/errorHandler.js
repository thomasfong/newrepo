module.exports = {
  handleErrors: (err, req, res, next) => {
    console.error(err.stack);
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';
    
    res.status(status);
    
    if (req.accepts('html')) {
      res.render('errors/error', {
        title: `Error ${status}`,
        nav: req.nav || '',
        status,
        message,
      });
    } else if (req.accepts('json')) {
      res.json({ error: { status, message } });
    } else {
      res.type('txt').send(`Error ${status}: ${message}`);
    }
  },
  
  notFound: (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
};