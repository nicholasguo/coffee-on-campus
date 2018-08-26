import sqlite3
from flask import *

db = 'profiles.db'

def initialize_db():
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        try:
            c.execute(
                '''CREATE TABLE profiles (user text, name text, image text, college text, year text, major text, description text);''')  # run a CREATE TABLE command
        except:
            pass

def create_profile(user):
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        rows = c.execute('''SELECT * FROM profiles WHERE user = ?;''',(user,)).fetchone()
        if rows is None:
            c.execute('''INSERT into profiles VALUES (?,'','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaWsjTM9wIYQ-L9K5yj7MvBI222lgSd3fpML3zmdwQ8oPHS1Y4','','','','');''', (user,))


def update_profile(user, name=None, image=None, college=None, year=None, major=None, description=None):
    with sqlite3.connect(db) as conn: # connect to that database (will create if it doesn't already exist)
        c = conn.cursor()  # make cursor into database (allows us to execute commands)
        if name is not None:
            c.execute('''UPDATE profiles SET name = ? WHERE user = ?;''', (name, user))
        if image is not None:
            c.execute('''UPDATE profiles SET image = ? WHERE user = ?;''', (image, user))
        if college is not None:
            c.execute('''UPDATE profiles SET college = ? WHERE user = ?;''', (college, user))
        if year is not None:
            c.execute('''UPDATE profiles SET year = ? WHERE user = ?;''', (year, user))
        if major is not None:
            c.execute('''UPDATE profiles SET major = ? WHERE user = ?;''', (major, user))
        if description is not None:
            c.execute('''UPDATE profiles SET description = ? WHERE user = ?;''', (description, user))
    return jsonify(success=True)


def get_profile(user):
    create_profile(user)
    conn = sqlite3.connect(db)  # connect to that database (will create if it doesn't already exist)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()  # make cursor into database (allows us to execute commands)
    rows = c.execute('''SELECT * FROM profiles WHERE user = ?;''', (user,)).fetchone()
    return jsonify(dict(rows))

def get_name(user):
    create_profile(user)
    conn = sqlite3.connect(db)  # connect to that database (will create if it doesn't already exist)
    c = conn.cursor()  # make cursor into database (allows us to execute commands)
    rows = c.execute('''SELECT name FROM profiles WHERE user = ?;''', (user,)).fetchone()
    return rows[0]

