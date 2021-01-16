# Events254
> Events application for Kenya

## Development 
1. Clone
2. npm install
3. npm run dev --spa

## Production
1. npm run lint
2. npm run test
3. npm run run build
3. npm start --spa

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

