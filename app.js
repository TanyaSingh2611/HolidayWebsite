const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./Schema.js");

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

app.engine('ejs',ejsMate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("Connected to Database");
}).catch((err)=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send("Hy I m a root");
});

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=> el.message.join(","));
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//show route
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing =await Listing.findById(id);
   // console.log(listing);
    res.render("listings/show.ejs",{listing});
}))

//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
   
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //console.log(Listing.findById(id));
    res.redirect(`/listings`);
    
    
}));

app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    res.redirect(`/listings`);
    
    
}));


// app.get("/testListing",async(req,res)=>{
//    let sampleListing = new Listing({
//      title: "New Villa",
//      description: "By the beach",
//      price: 1200,
//      location: "Calangute,Goa",
//      country:"India",
//    });
   
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("Successfull Testing")

// });

//Index Route
app.get("/listings", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    //console.log(id);
    const listing =await Listing.findById(id);

    res.render("listings/edit.ejs",{listing});
}))



//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

app.post("/listings",validateListing, wrapAsync( async(req,res,next)=>{
       

        let result = listingSchema.validate(req.body);
        console.log(result);
        if(result.err){
            throw new ExpressError(400,"Send a valid data for the listing");
        }
        const newListing = new Listing(req.body.listing); 
        await newListing.save();
        //console.log(newListing);
        res.redirect("/listings");
   
    
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})


app.use((err,req,res,next)=>{
   let {statusCode=500, message="Something went Wrong"} = err;

    res.status(statusCode).render("error.ejs", { message });
})



app.listen(8080, ()=>{
    console.log("Server is listening to port : 8080");
});