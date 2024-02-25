const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const port = '3000';
const server = '127.0.0.1';

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from server side', app: 'Natours' });
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'sucsess',
    results: tours.length,
    data: { tours: tours },
  });
});

app.get(`/api/v1/tours/:id`, (req, res) => {
  const id = Number(req.params.id);
  if (!tours.some((tour) => tour.id === id)) res.status(404).json({ status: 'fail', message: 'invalid id' });
  res.status(200).json({ status: 'success', data: { tour: tours.find((tour) => tour.id === id) } });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!tours.some((tour) => tour.id === id)) res.status(404).json({ status: 'fail', message: 'invalid id' });
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here ...>' } });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({ status: 'sucsess', data: { tour: newTour } });
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
