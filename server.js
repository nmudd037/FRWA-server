const app = require('./app');

//Handling Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION !!: Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

//4) Start Server
const port = process.env.PORT || 5001;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Handling Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION !!: Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
