import datetime as dt
from datetime import timezone

from app.backend.tests.conftest import client


def test_create_new_event(test_db):
    register = client.post(
        "api/v1/register",
        json={
            "password": "Password1234!",
            "username": "foobar",
            "email": "foobar@test.com",
        },
    )
    assert register.status_code == 200

    login = client.post(
        "api/v1/login",
        data={
            "password": "Password1234!",
            "username": "foobar",
        },
    )

    assert login.status_code == 200

    token = login.json()["access_token"]
    # {'title': 'Event title', 'date': '2024-06-24T15:25:23+02:00'}
    data = {
        "title": "Event title",
        "date": dt.datetime.now(timezone.utc)
        .replace(microsecond=0)
        .astimezone()
        .isoformat(),
    }

    response = client.post(
        "api/v1/events",
        json=data,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "date" in response.json()
    assert response.json()["event_id"] == 1
    assert response.json()["title"] == "Event title"
    assert response.json()["happened"] is False
    assert "user_id" in response.json()
