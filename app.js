const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

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

////////////////////////////////////////////////////////////////
// routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', postTour);
app.route('/api/v1/tours').get(getAllTours).post(postTour);

// app.get(`/api/v1/tours/:id`, getTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour);
app.route('/api/v1/tours/:id').get(getTour).patch(patchTour).delete(deleteTour);

////////////////////////////////////////////////////////////////
// starting the server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
