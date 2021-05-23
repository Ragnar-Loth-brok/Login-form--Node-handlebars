const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_MONGO}`, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
}).then(()=> console.log('Database Connected!'
)).catch((error)=> console.log('Database connection denied!'))