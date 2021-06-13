require('dotenv').config(); 
const express = require('express');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node'); 
const cors = require('cors');
const lyricsFinder = require('lyrics-finder');

const port = 3001 || process.env.PORT; 
app.listen(port, () => {
    console.log(`connected to port: ${port}`);
}); 

//middlewares 
app.use(cors());

app.use(express.json());


//routes 
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken; 
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT,  
        clientId: process.env.CLIENT, 
        clientSecret: process.env.SECRET,
        refreshToken,
    }); 

    spotifyApi.refreshAccessToken()
    .then(data => {
      res.json({
        //accessToken: data.body.accessToken,
        //expiresIn: data.body.expiresIn,
        accessToken: data.body.access_token, 
        expiresIn: data.body.expires_in
        
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code; 
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT,
        clientId: process.env.CLIENT, 
        clientSecret: process.env.SECRET, 
    }); 

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token, 
            refreshToken: data.body.refresh_token, 
            expiresIn: data.body.expires_in,
        }); 
    }).catch( () => {
        res.sendStatus(400); 
    }); 

}); 

app.get('/lyrics', async (req, res) => {
    const lyrics = 
    (await lyricsFinder(req.query.artist, req.query.track)) || 'No lyrics found!'; 
    res.json({lyrics}); 
})

 
