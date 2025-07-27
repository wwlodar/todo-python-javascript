import datetime as dt
from datetime import timezone

from freezegun import freeze_time

from app.backend.core.models import Event
from app.backend.tests.helper import Helper


@freeze_time("2025-11-11 11:00:00")
def test_create_new_event(test_db, client):
    helper = Helper()
    helper.create_user(
        client=client,
        username="TestClient",
    )
    token = helper.login_user(
        client=client,
        username="TestClient",
    )

    tomorrow = dt.datetime.now(timezone.utc) + dt.timedelta(days=1)
    data = {
        "title": "Event title",
        "date": tomorrow.astimezone().isoformat(),
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


def test_update_event(test_db, client):
    helper = Helper()
    helper.create_user(
        client=client,
        username="TestClient",
    )
    token = helper.login_user(
        client=client,
        username="TestClient",
    )
    event = Event(
        title="Initial Event",
        date=dt.datetime.now(timezone.utc),
        user_id=helper.get_user_id(test_db, "TestClient"),
    )
    test_db.add(event)
    test_db.commit()

    # Update the event
    update_data = {
        "title": "Updated Event Title",
    }

    update_response = client.put(
        f"api/v1/events/{event.event_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Event Title"
    assert update_response.json()["event_id"] == event.event_id


def test_get_events(test_db, client):
    helper = Helper()
    helper.create_user(
        client=client,
        username="TestClient",
    )
    token = helper.login_user(
        client=client,
        username="TestClient",
    )

    event = Event(
        title="Sample Event",
        date=dt.datetime.now(timezone.utc),
        user_id=helper.get_user_id(test_db, "TestClient"),
    )
    test_db.add(event)
    test_db.commit()

    event2 = Event(
        title="Another event",
        date=dt.datetime.now(timezone.utc)
        .replace(hour=1, microsecond=0)
        .astimezone(),
        user_id=helper.get_user_id(test_db, "TestClient"),
    )
    test_db.add(event2)
    test_db.commit()

    # Retrieve the events
    get_response = client.get(
        "api/v1/events",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert get_response.status_code == 200
    assert isinstance(get_response.json(), list)
    assert len(get_response.json()) == 2
    assert get_response.json()[0]["title"] == "Sample Event"
    assert get_response.json()[1]["title"] == "Another event"


@freeze_time("2025-11-11 11:00:00")
def test_get_one_event(test_db, client):
    helper = Helper()
    helper.create_user(client=client, username="TestClient")
    token = helper.login_user(client=client, username="TestClient")

    event = Event(
        title="Sample Event",
        date=dt.datetime.now(timezone.utc) + dt.timedelta(days=1),
        user_id=helper.get_user_id(test_db, "TestClient"),
    )
    test_db.add(event)
    test_db.commit()
    event_id = event.event_id

    response = client.get(
        f"api/v1/event/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    assert response.json()["title"] == "Sample Event"
    assert response.json()["event_id"] == event_id
    assert response.json()["happened"] is False
