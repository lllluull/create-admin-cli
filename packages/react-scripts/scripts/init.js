process.on('unhandledRejection', err => {
    throw err;
  });


module.exports = function() {
  console.log(11111111)
}