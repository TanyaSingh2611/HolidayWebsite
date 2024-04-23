const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1664121799972-98e5aa03d31b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
        set: (v)=>v===""?"https://plus.unsplash.com/premium_photo-1664121799972-98e5aa03d31b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D":v
      
       
    },
    //image: Object,
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;