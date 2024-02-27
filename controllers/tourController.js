const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

////////////////////////////////////////
// route middleware
exports.checkId =
  ('id',
  (req, res, next, val) => {
    if (!tours.some((tour) => tour.id === val * 1))
      return res.status(404).json({ status: 'Bad request', message: 'invalid id' });
    next();
  });

exports.checkBody = (req, res, next) => {
  if (!(req.body.name && req.body.duration))
    return res.status(400).json({ status: 'fail', message: 'Missing name or duration in request body' });
  next();
};

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
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
    res.status(201).json({ status: 'sucsess', data: { tour: newTour } });
  });
};

exports.patchTour = (req, res) => {
  // TODO code to update the tour record by id
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here ...>' } });
};

exports.deleteTour = (req, res) => {
  // TODO code to update the tour record by id
  res.status(204).json({ status: 'success', data: { tour: null } });
};
