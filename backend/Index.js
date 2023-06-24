const express = require("express") ;
const path = require("path") ;
const bodyParser = require("body-parser")
const mongoose = require("mongoose") ;

const connectionStirng = "mongodb://127.0.0.1:27017/eadfinalex"; 

mongoose.connect(connectionStirng).then(()=>{
    console.log("connected with db");
}).catch(err =>{
    console.log(err); 
}); 

const Schema = mongoose.Schema ;
const recipesSchema = new Schema({
    title: String,
    description: String, 
    ingredients: String,
    instructions: String
})
const Recipe = mongoose.model('recipes', recipesSchema) ;

const app = express() ;
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})) ;


app.set('view engine', 'ejs') ;




app.get('/', async (req, res)=>{
    
   const recipes = await Recipe.find(); 
   res.render("home", {recipes});
})



app.get('/recipe/new', (req, res)=>{
   res.render("newRecipe") ;
})





app.get('/recipe/dosearch', (req, res)=>{
    res.render("searchRecipe") ;
 })

 app.get('/recipe/updaterecipe', async (req, res)=>{
    const recipes = await Recipe.find(); 
    res.render("update", {recipes}) ;
 })


 app.get('/recipe/search', (req, res)=>{
    // const newRecipe = new Recipe(req.body); 
    // newRecipe.get().then(item =>{
        res.redirect('/');
    // }).catch(err=>{
    //     res.redirect("/recipe/dosearch");
    // })
})


 app.get('/', async (req, res)=>{
    
    const {title} = req.body ;

    const recipes = await Recipe.find(); 

    res.render("searched", {title});
 })
 

 
const recipeMiddleware = (req, res, next) =>{
    const {title, description, ingredients, instructions} = req.body ;
    if(!title || !description || !ingredients || !instructions) return res.redirect('/recipe/new') ;
    next() ;
}

app.post('/recipe/save', recipeMiddleware, (req, res)=>{
    const newRecipe = new Recipe(req.body); 
    newRecipe.save().then(item =>{
        res.redirect('/');
    }).catch(err=>{
        res.redirect("/recipe/new");
    })
})


app.post('/api', (req, res)=>{
    res.json(req.body) ;
})



app.listen(4000, ()=>{
    console.log("server starts listing on port 4000"); 
})