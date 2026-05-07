"""API tests for user CRUD endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from myapp.database import Base, get_db

# StaticPool 确保所有连接共享同一内存数据库
TEST_DATABASE_URL = "sqlite://"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# 导入 app 并替换 lifespan 所用的 engine（必须在 TestClient 实例化前完成）
import myapp.app as app_module

app_module.engine = test_engine  # patch lifespan 使用测试引擎

from myapp.app import app  # noqa: E402

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield


def test_create_user():
    r = client.post("/api/users", json={"name": "张三", "email": "zhang@example.com"})
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "张三"
    assert data["email"] == "zhang@example.com"
    assert "id" in data


def test_list_users():
    client.post("/api/users", json={"name": "张三", "email": "zhang@example.com"})
    r = client.get("/api/users")
    assert r.status_code == 200
    assert len(r.json()) == 1


def test_get_user():
    r = client.post("/api/users", json={"name": "李四", "email": "li@example.com"})
    uid = r.json()["id"]
    r = client.get(f"/api/users/{uid}")
    assert r.status_code == 200
    assert r.json()["name"] == "李四"


def test_get_user_not_found():
    r = client.get("/api/users/9999")
    assert r.status_code == 404


def test_delete_user():
    r = client.post("/api/users", json={"name": "王五", "email": "wang@example.com"})
    uid = r.json()["id"]
    r = client.delete(f"/api/users/{uid}")
    assert r.status_code == 204
    r = client.get(f"/api/users/{uid}")
    assert r.status_code == 404


def test_duplicate_email():
    client.post("/api/users", json={"name": "张三", "email": "dup@example.com"})
    r = client.post("/api/users", json={"name": "张三2", "email": "dup@example.com"})
    assert r.status_code == 400
