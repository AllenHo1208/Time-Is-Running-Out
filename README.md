# Time-Is-Running-Out

## Run the app in local
1. Obtain an [Unsplash API Client ID](https://unsplash.com/developers)
2. Replace the actual Unsplash Client ID for `/js/unsplashPhotoSearcher.js` > `<UNSPLASH_API_CLIENT_ID>`
3. Run `node server.js` in command prompt.

## Run the app in Heroku
1. Register a [Heroku](https://www.heroku.com) Account
2. Deploy the app to Heroku and run it.

### Heroku Command References
```
heroku login
heroku create <APP_NAME>
git push heroku master

# start app
heroku ps:scale web=1 OR heroku ps:scale worker=1
heroku open

# stop app
heroku ps:scale web=0

# view logs
heroku logs --tail
```