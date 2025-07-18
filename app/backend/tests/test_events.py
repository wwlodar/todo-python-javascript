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


def test_update_event(test_db):
    helper = Helper()
    helper.create_user(
        client=client,
        username="TestClient",
    )
    token = helper.login_user(
        client=client,
        username="TestClient",
    )

    # Create an event first
    data = {
        "title": "Initial Event",
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
    event_id = response.json()["event_id"]

    # Update the event
    update_data = {
        "title": "Updated Event Title",
    }

    update_response = client.put(
        f"api/v1/events/{event_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Event Title"
    assert update_response.json()["event_id"] == event_id


def test_get_events(test_db):
    helper = Helper()
    helper.create_user(
        client=client,
        username="TestClient",
    )
    token = helper.login_user(
        client=client,
        username="TestClient",
    )

    # Create an event first
    data = {
        "title": "Event for Retrieval",
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

    data = {
        "title": "Another event",
        "date": dt.datetime.now(timezone.utc)
        .replace(hour=1, microsecond=0)
        .astimezone()
        .isoformat(),
    }

    response = client.post(
        "api/v1/events",
        json=data,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200

    # Retrieve the events
    get_response = client.get(
        "api/v1/events",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert get_response.status_code == 200
    assert isinstance(get_response.json(), list)
    assert len(get_response.json()) == 2
    assert get_response.json()[0]["title"] == "Event for Retrieval"
    assert get_response.json()[1]["title"] == "Another event"
