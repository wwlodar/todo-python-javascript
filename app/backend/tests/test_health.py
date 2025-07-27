def test_health(test_db, client):
    response = client.get("api/v1/health")
    assert response.status_code == 200
    assert response.content == b'{"status":"It works!"}'
