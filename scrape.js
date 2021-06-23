const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  exphbs = require('express-handlebars'),
  // permet de refaire le module maison
  service = require("./indeed-job-scraper"),
  port = 4000;

// Handlebars
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// console.log('module: ', service)
let url = 'https://www.indeed.fr'

app
  .get('/', (req, res) => {
    res.render('home')
  })
  .post('/', (req, res) => {
    console.log('COntrolller post: ', req.body)

    if (req.body.chooseLang === 'fr') url = 'https://www.indeed.fr'
    if (req.body.chooseLang === 'us') url = 'https://www.indeed.com'
    if (req.body.chooseLang === 'de') url = 'https://www.indeed.de'

    service.PARAMS.queryAny = req.body.search  //set the query of search
    service.PARAMS.salary = "30K"
    service.PARAMS.fromAge = 2   //get jobs with at max 2 days from now
    service.PARAMS.maxPerPage = 10   //set how many jobs per page to visit
    service.PARAMS.pageLimit = 5
    // service.PARAMS.location = 44

    //first : to get the fetched jobs as an array of objects
    service.getJobs(url).then((jobs) => {
      console.log('Emploie', jobs)

      res.render('home', {
        jobs
      })

    }).catch((error) => {
      console.log(error)
    })

  })

// queryAll 	 : "",
// queryAny 	 : "",
// queryNot 	 : "",
// queryPhrase   : "",
// queryTitle    : "",
// queryCompany  : "",
// hireType  	 : "",
// level		 : "",
// salary		 : "",
// location 	 : "",
// radius		 : "",
// sort 		 : "",
// siteType 	 : "",
// jobType 	     : "",
// fromDays 	 : "",
// duplicate     : "",
// maxPerPage    : "",
// pageLimit     : "",
//you have two ways to work with

// //first : to get the fetched jobs as an array of objects
// service.getJobs().then((jobs) => {
//   console.log(jobs)
// }).catch((error) => {
//   console.log(error)
// })

//seconde : to generate a PDF file with a specified path contains the fetched jobs
// service.getPdf("./jobs.pdf").then((path) => {
//   console.log(path)
// }).catch((error) => {
//   console.log(error)
// })

// Ici on lance notre application
app.listen(port, function () {
  console.log(`écoute le port ${port}, lancé à : ${new Date().toLocaleString()}`);
})