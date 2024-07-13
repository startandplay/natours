const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('View engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

//serve public static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP Headers
//app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

//Development  logging
if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'));
}
//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requestes from this IP, please try again in the hour!',
});
app.use('/api', limiter);

//Body Parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//DATA sanitization aginst NoSQL query injection
app.use(mongoSanitize());

//DATA sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whiteList: [
      'duration',
      'ratingratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize',
      'price',
      'logout',
    ],
  }),
);

// TEST middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handlers not existein routes Should be placed at the final routs calls
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app; // the entry point is server.js
