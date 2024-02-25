const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

////////////////////////////////////////////////////////////////
// middlewares
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

const port = '3000';
const server = '127.0.0.1';

////////////////////////////////////////////////////////////////
// get tours data from DB/dataFile
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

////////////////////////////////////////////////////////////////
// rout handler functions
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'sucsess',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours: tours },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  if (!tours.some((tour) => tour.id === id)) return res.status(404).json({ status: 'fail', message: 'invalid id' });
  res.status(200).json({ status: 'success', data: { tour: tours.find((tour) => tour.id === id) } });
};

const postTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({ status: 'sucsess', data: { tour: newTour } });
  });
};

const patchTour = (req, res) => {
  const id = Number(req.params.id);
  if (!tours.some((tour) => tour.id === id)) res.status(404).json({ status: 'fail', message: 'invalid id' });
  // TODO code to update the tour record by id
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here ...>' } });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (!tours.some((tour) => tour.id === id)) res.status(404).json({ status: 'fail', message: 'invalid id' });
  // TODO code to update the tour record by id
  res.status(204).json({ status: 'success', data: { tour: null } });
};

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
const createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
const getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
const updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
const deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};

////////////////////////////////////////////////////////////////
// routes
const tourRouter = express.Router();
tourRouter.route('/').get(getAllTours).post(postTour);
tourRouter.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);
app.use('/api/v1/tours', tourRouter);

const userRouter = express.Router();
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
app.use('/api/v1/users', userRouter);

////////////////////////////////////////////////////////////////
// starting the server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
