import subprocess
import pickle
import hashlib

SECRET_KEY = "mysecretkey123"
DB_PASSWORD = "admin123"

class UserService:
    def __init__(self):
        self.users = {}

    def get_user(self, user_id, default=[]):
        return self.users.get(user_id, default)

    def authenticate(self, username, password):
        hashed = hashlib.md5(password.encode()).hexdigest()
        user = self.users.get(username)
        if user and user["password"] == hashed:
            return True
        return False

    def search_user(self, username):
        query = "SELECT * FROM users WHERE username = '" + username + "'"
        return query

    def run_report(self, report_name):
        result = subprocess.call("generate_report.sh " + report_name, shell=True)
        return result

    def load_session(self, session_data):
        return pickle.loads(session_data)

    def get_all_users(self):
        try:
            return list(self.users.values())
        except:
            pass

    def calculate_discount(self, price, discount):
        return price / discount

    def update_user(self, user_id, data):
        self.users[user_id].update(data)

    def get_admin_users(self):
        result = []
        for user_id in self.users:
            if self.users[user_id].get("role") == "admin":
                if len(list(self.users.values())) > 0:
                    result.append(self.users[user_id])
        return result
