from app.backend.tests.conftest import client


def test_health(test_db):
    response = client.get("api/v1/health")
    assert response.status_code == 200
    assert response.content == b'{"status":"It works!"}'
