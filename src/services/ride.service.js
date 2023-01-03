const db = require('../db/db');
const logger = require('../../utils/logger');

const getRide = (skip,limit) => {
    return new Promise((resolve,reject) => {
        //Adding Validation 
        if ( isNaN(limit) || isNaN(skip) || skip < 0 || limit < 1) {
            resolve({
            error_code: 'INVALID_PAGINATION_VALUES',
            message: 'Pagination Value Should Be Number And Greater Than Or Equal to 1',
            });
        }
        db.all('SELECT * FROM Rides LIMIT ? OFFSET ?',[limit,skip], function (err, rows) {
            if (err) {
                logger.error(`Error :: ${err}`);
                resolve({ 
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }
    
            if (rows.length === 0) {
                resolve({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }
    
            db.all('SELECT count(*) as count FROM Rides', function (err, countOfRide) {
                if (err) {
                    logger.error(`Error :: ${err}`);
                    resolve({ 
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }
    
                if (rows.length === 0) {
                    resolve({
                        error_code: 'RIDES_NOT_FOUND_ERROR',
                        message: 'Could not find any rides'
                    });
                }
    
                resolve({rides:rows,TotalRides:countOfRide[0].count});
            });
    
        });
    })
}

const getRideById = (id) => {
    return new Promise((resolve,reject) => {
        db.all('SELECT * FROM Rides WHERE rideID=?', [id],function (err, rows) {
            if (err) {
                logger.error(`Error :: ${err}`);
                resolve({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                resolve({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            resolve(rows);
        });
    })
} 

const bookRide = (body) => {
    return new Promise((resolve,reject) => {

    const startLatitude = Number(body.start_lat);
    const startLongitude = Number(body.start_long);
    const endLatitude = Number(body.end_lat);
    const endLongitude = Number(body.end_long);
    const riderName = body.rider_name;
    const driverName = body.driver_name;
    const driverVehicle = body.driver_vehicle;

    if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
        resolve({
            error_code: 'VALIDATION_ERROR',
            message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
        });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
        resolve({
            error_code: 'VALIDATION_ERROR',
            message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
        });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
        resolve({
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string'
        });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
        resolve({
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string'
        });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
        resolve({
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string'
        });
    }

    var values = [body.start_lat, body.start_long, body.end_lat, body.end_long, body.rider_name, body.driver_name, body.driver_vehicle];
    
    const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
        if (err) {
            logger.error(`Error :: ${err}`);
            resolve({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }

        db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
            if (err) {
                logger.error(`Error :: ${err}`);
                resolve({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            resolve(rows);
        });
    });
    });


}
module.exports = {
    getRide,
    getRideById,
    bookRide
}