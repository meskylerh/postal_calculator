const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// tell it to use the public directory as one where static files live
app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.sendFile(path.join(__dirname+'/public/Postal.html')))
    .get('/rate', getRate)
    .listen(port, function() {
  console.log('Node app is running on port', port);
});



function getRate(req, res) {
   let weight = req.query.weight;
   let type = req.query.type;  
   let cost;
   
 switch (String(type)) {
        case "letter-stamped"://Letters (Stamped)
            if (weight > 3) {
                cost = 1.00;
            } else{
                cost = 0.55 + (Math.floor(weight - 1) * .15);
            }
            break;
        case "letter-metered"://Letters (Metered)
            if (weight > 3) {
                cost = 0.95;
            } else {
                cost = 0.50 + (Math.floor(weight - 1) * .15);
            }
            break;
        case "large-envelope"://Large Envelopes (Flats)
            cost = 1 + (Math.floor(weight - 1) * .15);
            break;
        case "first-class-retail-package"://First-Class Package Service—Retail
            if (weight > 12) {
                cost = 5.71;
            } else if (weight > 8) {
                cost = 5.19;
            } else if (weight > 4) {
                cost = 4.39;
            } else {
                cost = 3.66;
            }
            break;
        default:
            console.log("error: no type specified");
            break;
    }


	// Set up a JSON object of the values we want to pass along to the EJS result page
	const params = {cost: cost.toFixed(2), type, weight};

	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	res.render('result', params);

}