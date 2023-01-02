'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi:'3.0.0',
        info : {
            title:'Backend Coding Test',
            description:'tets',
            version:'1.0.0'
        },
        servers:[
            {
                url:'http://localhost:8010/'
            }
        ]
    },
    apis:['./src/app.js']
}

const swaggerSpec = swaggerJSDoc(options);



db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);

    app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});