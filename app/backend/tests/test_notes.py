from app.backend.tests.helper import Helper


def test_create_new_note(test_db, client):
    helper = Helper()
    helper.create_user(
        client=client,
        username="TestClient",
    )
    token = helper.login_user(
        client=client,
        username="TestClient",
    )

    data = {"title": "Note title"}

    response = client.post(
        "api/v1/notes",
        json=data,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "date_added" in response.json()
    assert response.json()["note_id"] == 1
    assert response.json()["title"] == "Note title"
    assert response.json()["done"] is False
    assert "user_id" in response.json()
