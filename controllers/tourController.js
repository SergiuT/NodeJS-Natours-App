const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
};

exports.getOneTour = (req, res) => {
    console.log(req.requestTime);
    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail'
        }) 
    }

    const tour = tours.find(el => {
        if (el.id === id) {
            return el;
        }
    });

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
};

exports.createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'updatedTour'
        }
    });
};

exports.deleteTour = (req, res) => {

    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};