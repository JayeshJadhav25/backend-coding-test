'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();



module.exports = (db) => {
/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       required:
 *         - start_lat
 *         - start_long
 *         - end_lat
 *         - end_long
 *         - rider_name
 *         - driver_name
 *         - driver_vehicle
 *       properties:
 *         start_lat:
 *           type: number
 *           minimum: -90,
 *           maximum: 90,
 *           description: Starting Latitude
 *         start_long:
 *           type: number
 *           minimum: -180,
 *           maximum: 180,
 *           description: Starting Longitude
 *         end_lat:
 *           type: number
 *           minimum: -90,
 *           maximum: 90,
 *           description: Ending Latitude
 *         end_long:
 *           type: number
 *           minimum: -180,
 *           maximum: 180,
 *           description: Ending Longitude
 *         rider_name:
 *           type: string
 *           description: Rider Name
 *         driver_name:
 *           type: string
 *           description: Driver Name
 *         driver_vehicle:
 *           type: string
 *           description: Driver Vehicle
 *       example:
 *         start_lat: 40
 *         start_long: 30 
 *         end_lat: 30
 *         end_long: 40
 *         rider_name: Jayesh
 *         driver_name: Mahesh
 *         driver_vehicle: Car
 */

 /**
  * @swagger
  * tags:
  *   name: Rides
  *   description: The Rides managing API
  */


 /**
 * @swagger
 * /health:
 *   get:
 *     summary: This api check the health
 *     responses:
 *       200:
 *         description: It will return healthy if server is properly running
 */

    app.get('/health', (req, res) => res.send('Healthy'));

    /**
 * @swagger
 * /rides:
 *   post:
 *     summary: Book a new ride
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ride'
 *     responses:
 *       200:
 *         description: The ride was successfully book
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Ride'
 */
    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
        
        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                res.send(rows);
            });
        });
    });

/**
 * @swagger
 * /rides:
 *   get:
 *     summary: Returns the list of all the rides
 *     tags: [Rides]
 *     responses:
 *       200:
 *         description: The list of the Rides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
    app.get('/rides', (req, res) => {
        db.all('SELECT * FROM Rides', function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });


/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     summary: Get the rides by id
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The rides id
 *     responses:
 *       200:
 *         description: The rides details by id
 *         contens:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Ride'
 */

    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

    return app;
};
