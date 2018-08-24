import sqlite3
import datetime
from flask import *

db = 'matches.db'

def initialize_db():
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        try:
            c.execute(
                '''CREATE TABLE matches (user text, other_user text, time timestamp);''')  # run a CREATE TABLE command
        except:
            pass

        try:
            c.execute(
                '''CREATE TABLE requests (user text, done boolean, time timestamp);''')  # run a CREATE TABLE command
        except:
            pass

def request_too_recent(user):
    two_minutes_ago = datetime.datetime.now() - datetime.timedelta(seconds=5)
    with sqlite3.connect(db) as conn:  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        rows = c.execute('''SELECT * FROM requests WHERE user = ? AND time > ?;''',
                         (user, two_minutes_ago)).fetchone()
        return rows is not None

def request_exists(user):
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        rows = c.execute('''SELECT * FROM requests WHERE user = (?) AND done = ?;''', (user, False)).fetchone()
        return rows is not None

def add_request(user):
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        rows = c.execute('''SELECT * FROM requests WHERE user = (?);''', (user, )).fetchone()
        if rows is None:
            c.execute('''INSERT into requests VALUES (?,?,?);''', (user, True, datetime.datetime.now()))

def make_request(user):
    if request_exists(user):
        return jsonify(success=False, reason='Request was already made')
    if request_too_recent(user):
        return jsonify(success=False, reason='Wait before making another request')
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        rows = c.execute('''SELECT * FROM requests WHERE done = ? ORDER BY time DESC;''', (False,)).fetchall()
        print(rows)

        for row in rows:
            other_user = dict(row)['user']
            if not already_matched(user, other_user):
                c.execute('''INSERT into matches VALUES (?,?,?);''', (user, other_user, datetime.datetime.now()))
                c.execute('''INSERT into matches VALUES (?,?,?);''', (other_user, user, datetime.datetime.now()))
                c.execute('''UPDATE requests SET done = ?, time = ? WHERE user = (?);''',
                          (True, datetime.datetime.now(), other_user))
                c.execute('''UPDATE requests SET done = ?, time = ? WHERE user = (?);''',
                          (True, datetime.datetime.now(), user))
                return jsonify(success=True, matched=True)

        c.execute('''UPDATE requests SET done = ?, time = ? WHERE user = (?);''',
                  (False, datetime.datetime.now(), user))

    return jsonify(success=True, matched=False)

def already_matched(user, other_user):
    with sqlite3.connect(db) as conn:  # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        rows = c.execute('''SELECT * FROM matches WHERE user = (?) AND other_user = (?);''', (user, other_user)).fetchone()
        return rows is not None

def get_matches(user):
    two_minutes_ago = datetime.datetime.now() - datetime.timedelta(seconds=5)
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        rows = c.execute('''SELECT * FROM matches WHERE user = ? AND time < ? ORDER BY time DESC;''',
                         (user, two_minutes_ago)).fetchall()
        return [{'key': dict(row)['other_user']} for row in rows]