'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const logger = require('../utils/logger');
const rideController = require('../src/controllers/ride.controller');

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
    app.post('/rides', jsonParser, rideController.bookRide);

/**
 * @swagger
 * /rides:
 *   get:
 *     summary: Returns the list of all the rides
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *              type: integer
 *         description: The number of items to skip before starting to collect the result set
 *       - in: query
 *         name: limit
 *         schema:
 *              type: integer
 *         description: The numbers of items to return
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
    app.get('/rides',rideController.getRide);

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

    app.get('/rides/:id', rideController.getRideById);

    return app;
};
