const mongoose = require('mongoose');
const env = require('./environment');
main().catch((err)=> {console.log(err)});

async function main() {
    await mongoose.connect(`mongodb://0.0.0.0:27017/${env.db}`);
    console.log('connection successful to DB');
}
