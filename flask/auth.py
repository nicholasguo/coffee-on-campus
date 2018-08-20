import sqlite3
import datetime
from flask import *

db = 'data.db'

def add_user(username, password, email):
    if username_exists(username):
        return jsonify(success=False, reason='Username already exists')
    if email_exists(email):
        return jsonify(success=False, reason='Email already exists')

    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        c.execute('''INSERT into users VALUES (?,?,?,?);''', (username, email, password, datetime.datetime.now()))

    return jsonify(success=True, username=username)

def username_exists(username):
    conn = sqlite3.connect(db)  # connect to that database (will create if it doesn't already exist)
    c = conn.cursor()  # make cursor into database (allows us to execute commands)
    rows = c.execute(
        '''SELECT * FROM users WHERE user = ? LIMIT 1;''',
        (username,)).fetchall()
    return len(rows) > 0

def email_exists(email):
    conn = sqlite3.connect(db)  # connect to that database (will create if it doesn't already exist)
    c = conn.cursor()  # make cursor into database (allows us to execute commands)
    rows = c.execute(
        '''SELECT * FROM users WHERE email = ? LIMIT 1;''',
        (email,)).fetchall()
    return len(rows) > 0

def log_in(username, password):
    conn = sqlite3.connect(db)  # connect to that database (will create if it doesn't already exist)
    c = conn.cursor()  # make cursor into database (allows us to execute commands)
    rows = c.execute(
        '''SELECT * FROM users WHERE user = ? AND pass = ? LIMIT 1;''',
        (username, password)).fetchall()
    return jsonify(success=True) if len(rows) > 0 else jsonify(success=False, reason='Invalid username/password')
