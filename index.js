'use strict';

const port = 8010;

const bodyParser = require('body-parser');

const db = require('./src/db/db');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const logger  = require('./utils/logger');

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

const app = require('./src/app')(db);

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.listen(port, () => logger.info(`App started and listening on port ${port}`));