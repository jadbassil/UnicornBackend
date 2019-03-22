const express = require('express');
const router = express.Router();
const OAuthServer = require('express-oauth-server');

//const oauth = new OAuthServer({model: Model});

const html = "<form action=\"http://localhost:3000/oauth/authorize\" method=\"post\">\n<input type=\"submit\" value=\"authorize\"/>\n</form>";
    
const oauth = new OAuthServer({model: Model});


router.get('/authorize', (req, res) => {
    res.contentType('text/html');
    res.send(html);
});

router.post('/authorize', (req, res) =>{

});


module.exports = router;