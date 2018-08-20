from flask import *
import sqlite3
import datetime

db = 'data.db'

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
        conn = sqlite3.connect(db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        try:
            c.execute('''CREATE TABLE users (user text, email text, pass text, timing timestamp);''')  # run a CREATE TABLE command
        except:
            pass
        c.execute('''INSERT into users VALUES (?,?,?,?);''', (username, email, password, datetime.datetime.now()))
        conn.commit()
        conn.close()
        return jsonify(success=True, username=username, email=email)
    except:
        return jsonify(success=False)

@app.route('/signin', methods=['GET'])
def sign_in():
    try:
        username = request.args.get('user')
        password = request.args.get('pass')
        conn = sqlite3.connect(db)  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        try:
            c.execute('''CREATE TABLE users (user text, email text, pass text, timing timestamp);''')  # run a CREATE TABLE command
        except:
            pass
        rows = c.execute(
            '''SELECT * FROM users WHERE user = ? AND pass = ? LIMIT 1;''',
            (username, password)).fetchall()
        conn.commit()
        conn.close()
        return jsonify(success=True) if len(rows) > 0 else jsonify(success=False)
    except:
        return jsonify(success=False)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5555)
