import datetime as dt
from datetime import timezone

from app.backend.tests.conftest import client
from app.backend.tests.helper import Helper


def test_create_new_event(test_db):
    helper = Helper()
    helper.create_user(
        client=client,
        username="TestClient",
    )
    token = helper.login_user(
        client=client,
        username="TestClient",
    )

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
