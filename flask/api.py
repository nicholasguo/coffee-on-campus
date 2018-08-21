from flask import *
import sqlite3
import auth
import profile

db = 'data.db'


def initialize_db():
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        try:
            c.execute(
                '''CREATE TABLE users (user text, name text, college text, class text);''')  # run a CREATE TABLE command
        except:
            pass
        try:
            c.execute(
                '''CREATE TABLE profiles (user text, email text, pass text, timing timestamp);''')  # run a CREATE TABLE command
        except:
            pass

app = Flask(__name__)

@app.route('/')
def cakes():
    return 'Yummy cakes!'

@app.route('/signup', methods=['POST'])
def sign_up():
    try:
        username = request.json['user']
        password = request.json['pass']
        email = request.json['email']
        return auth.add_user(username, password, email)
    except:
        return jsonify(success=False, reason='Server Error')

@app.route('/signin', methods=['GET'])
def sign_in():
    try:
        username = request.args.get('user')
        password = request.args.get('pass')
        return auth.log_in(username, password)
    except:
        return jsonify(success=False, reason='Server Error')


@app.route('/signin', methods=['GET'])
def get_profile():
    try:
        username = request.args.get('user')
        return profile.get_profile(username)
    except:
        return jsonify(success=False, reason='Server Error')

if __name__ == '__main__':
    initialize_db()
    app.run(debug=True, host='0.0.0.0', port = 5555)
