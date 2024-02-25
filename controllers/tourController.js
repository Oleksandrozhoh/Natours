const fs = require('fs');
const { route } = require('../app');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

////////////////////////////////////////
// route middleware
exports.checkId =
  ('id',
  (req, res, next, val) => {
    if (!tours.some((tour) => tour.id === val * 1))
      return res.status(404).json({ status: 'fail', message: 'invalid id' });
    next();
  });

////////////////////////////////////////
// route handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'sucsess',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours: tours },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  res.status(200).json({ status: 'success', data: { tour: tours.find((tour) => tour.id === id) } });
};

exports.postTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({ status: 'sucsess', data: { tour: newTour } });
  });
};

exports.patchTour = (req, res) => {
  const id = Number(req.params.id);
  // TODO code to update the tour record by id
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here ...>' } });
};

exports.deleteTour = (req, res) => {
  const id = Number(req.params.id);
  // TODO code to update the tour record by id
  res.status(204).json({ status: 'success', data: { tour: null } });
};
