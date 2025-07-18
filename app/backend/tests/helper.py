import os


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
