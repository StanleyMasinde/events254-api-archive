# Events254
> Events application for Kenya

## Development 
1. Clone
2. npm install
3. npm run dev --spa

## API only develoment
If by any chance you might need to only run the api server alone you can do that by running the following
`yarn dev:api` or `npm run dev:api`.
 *Please not that the api server does not have the `/api` prefix eg getting users is as simple as `/users` because `/api/users` will result in a 404 response*

## Production
1. npm run lint
2. npm run test
3. npm run run build
3. npm start --spa

## Mail setup
Both dev and prod send real worl emails. Please be sure to setup your SMTP settings in the `.env` like below for [mailhog](https://github.com/mailhog)
```
MAIL_HOST=0.0.0.0
MAIL_PORT=1025
MAIL_USERNAME=''
MAIL_PASSWORD=''
SECURE=false

```

## API Routes
> Route prefix `/api/auth`

| Path       | Method | Description                            | Body                |
|:-----------|:-------|:---------------------------------------|:--------------------|
|`/register` | POST   | Register a new user                    |*name,email,password*|
|`/login`    | POST   | Login a user                           |*email,password*     |
|`/user`     | GET    | Fetch the currently authenticated user |*none*               |
|`/logout`   | POST   | Logout a user                          |*none                |

> Route prefix `/api/events`

| Path     | Method | Description        | Body                |
|:---------|:-------|:-------------------|:--------------------|
|`/`       | GET    | Get all events     | *N/A*               |
|`/`       | POST   | Create a new event | *Not finalized yet* |
|`/:event` | GET    | Get an event by id | *N/A*               |
|`/:event` | PUT    | Update an event    | *Event body*        |
|`/:event` | DELETE | Delete an event    | *Delete an event*   |

## Mobile Devices
> The above routes work for mobile devices only that mobile devices do not make use of sessions
In order to use the above authenticated routes from mobile or desktop,
1. You need to pass `X-requested-with` header along with your request and set the value to mobile (We only have for mobile now bit works with desktop applications)
2. On login or logout with the above header you will receive an API token. Use this token to access authenticated routes. See the example below for the route used to get the current user
```javascript
app.get('/auth/user')
    .set('X-requested-with', 'mobile')
    .set('Authorization', `Bearer ${token}`)
```
3. Please note that the token are long lived and for now we accept requests from any endpoint. This is bound to change before we move to production. Confused? This simply means that we will only allow requests for applications we trust and know.
