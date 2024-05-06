# Memory Tile Game

### Steps to setup the app

- Clone the repository

```bash
  git clone https://github.com/prackode/mem-game.git
```

- Backend setup:

```bash
  cd backend
  pip install -r requirements.txt
  python manage.py makemigrations
  python manage.py migrate
  python manage.py runserver
```
- Frontend setup 
```bash
  cd frontend
  npm install
  npm start
```

### Tech Stack

- Django Rest Framework (DRF)
- React.Js
- JWT Tokens
- Axios
- CORS

### Features

- User authorization using JWT token
- Proper validations
- Responsive
- Decent UI