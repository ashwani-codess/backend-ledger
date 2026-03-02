const mongoose= require('mongoose')



function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is connectes to db ")
    })
    .catch(err=>{
        console.log("error connecting to our db");
        process.exit(1)
    })
}


mongoose.connection.once("open", () => {

 console.log("Connected DB:", mongoose.connection.name);

});

module.exports=connectToDB