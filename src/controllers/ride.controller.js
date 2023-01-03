const rideService = require('../services/ride.service');

const bookRide = async (req,res) => {
    try {
        const result = await rideService.bookRide(req.body)
        res.send(result);
    } catch(err) {
        res.status(500).json({message:'Something Went Wrong'})
    }
}

const getRide =async (req,res) => {
    try {
        const result = await rideService.getRide(req.query.skip,req.query.limit)
        res.send(result);
    } catch(err) {
        res.status(500).json({message:'Something Went Wrong'})
    }
}

const getRideById = async(req,res) => {
    try {
        const result = await rideService.getRideById(req.params.id)
        res.send(result);
    } catch(err) {
        res.status(500).json({message:'Something Went Wrong'})
    }
}
module.exports = {
    bookRide,
    getRide,
    getRideById
}