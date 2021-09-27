const express = require('express');
const bodyParser = require('body-parser');
const { uuid } = require('uuidv4');
const methodOverride = require('method-override');

const twitterData = require('./data.json');
const path = require('path');
const app = express();

// specify root directory from which to serve static assets
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(methodOverride('_method'));

// set default engine extension when omitted
app.set('view engine', 'ejs');
// set directory for application's views
app.set('views', path.join(__dirname, 'views'));

let tweets = [
  {
    name: 'vincent',
    tweet: 'Potatos be tasty!',
    date: '2021-09-01',
    id: uuid(),
  },
  {
    name: 'vincent',
    tweet: 'I once was an adventurer like you...',
    date: '2021-07-22',
    id: uuid(),
  },
  {
    name: 'nini',
    tweet: 'This shit is whack!',
    date: '2021-05-01',
    id: uuid(),
  },
  {
    name: 'nini',
    tweet: "Why can't I hold all these limes?",
    date: '2021-03-03',
    id: uuid(),
  },
  {
    name: 'ivan',
    tweet: 'Gimme licorice!',
    date: '2019-01-15',
    id: uuid(),
  },
  {
    name: 'ivan',
    tweet: 'So you chose death!',
    date: '2019-01-15',
    id: uuid(),
  },
];
// root
// READ
app.get('/', function (req, res) {
  // renders view and sends rendered HTML string to client
  const myTweets = tweets.filter((t) => t.name === 'me');
  res.render('home', { data: { ...twitterData, myTweets } });
});

app.get('/:user', function (req, res) {
  const { user } = req.params;
  const data = twitterData[user];
  const userTweets = tweets.filter((t) => t.name === user);
  console.log({ ...data, userTweets });
  res.render('userpage', { ...data, userTweets });
});

// New Tweets
// CREATE
app.post('/:user/new', function (req, res) {
  const { user } = req.params;
  const { text } = req.body;
  console.log(`New Tweet by: ${user}`);
  console.log(text);
  tweets.push({
    name: user,
    tweet: text,
    date: new Date().toISOString(),
    id: uuid(),
  });
  console.log(tweets);
  res.redirect(`/${user}`);
});

// UPDATE
app.get('/:user/:id/edit', function (req, res) {
  const { id } = req.params;
  const tweet = tweets.find((t) => t.id === id);

  console.log(`edit tweet - id: ${id}`);
  res.render('edit', { tweet });
});

app.patch('/:id', (req, res) => {
  const { id } = req.params;
  const newTweetText = req.body.tweet;
  const foundTweet = tweets.find((t) => t.id === id);
  foundTweet.tweet = newTweetText;
  res.redirect('/');
});

// DESTROY
app.delete('/:user/:id', (req, res) => {
  const { id } = req.params;
  tweets = tweets.filter((t) => t.id !== id);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('NOW LISTENING ON PORT 3000!');
});
