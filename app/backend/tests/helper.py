import os

from app.backend.core.models import User


class Helper:
    TEST_PASSWORD = os.getenv("TEST_PASSWORD", "TestPassword1234")

    def create_user(
        self, client, username, password=TEST_PASSWORD, email="test@email.com"
    ):
        response = client.post(
            "api/v1/register",
            json={
                "username": username,
                "email": email,
                "password": password,
            },
        )
        return response.json()

    def login_user(self, client, username, password=TEST_PASSWORD):
        response = client.post(
            "api/v1/login",
            data={
                "username": username,
                "password": password,
            },
        )
        return response.json()["access_token"]

    def get_user_id(self, db_session, username):
        user = db_session.query(User).filter(User.username == username).first()
        if not user:
            raise ValueError(
                f"User with username '{username}' not found in DB."
            )
        return user.user_id
