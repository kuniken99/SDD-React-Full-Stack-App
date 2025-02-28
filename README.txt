## Django Backend Setup
1. Open a new terminal

2. Create a virtual environment
python -m venv env

3. Activate it
.\env\Scripts\activate

4. Install dependencies
pip install -r requirements.txt

5. Apply migrations
cd backend
python manage.py makemigrations
python manage.py migrate

6. Run the Django server
python manage.py runserver



## React Frontend Setup
1. Open another terminal

2. Navigate to Frontend directory
cd frontend

3. Install dependencies
npm install

4. Start React development server
npm run dev



## Django Admin:
URL: http://127.0.0.1:8000/admin/api/user/

Username: kennedy.tan@uon.edu.au
Pwd: kennedyDjangoAdmin