import pytest
from backend import create_app



@pytest.fixture()
def app():
    app = create_app()
    yield app

@pytest.fixture()
def client(app):
    return app.test_client()

def func(x):
    return x + 1


### some very simple tests since we don't have much to cover,
### other than a single webpage at the moment
def test_logo(client):
    response = client.get("/index.html")
    assert b"ember-logo.png" in response.data

def test_include_bootstrap(client):
    response = client.get("/index.html")
    assert b"bootstrap.bundle.min.js" in response.data

def test_serve_logo(client):
    response = client.get("/files/ember-logo.png")
    assert response.status_code == 200

def test_serve_chat(client):
    response = client.get("/files/chat.json")
    assert b"user_color" in response.data

def test_serve_js(client):
    response = client.get("/js/ember.js")
    assert b"parseEmotesInMessage" in response.data
