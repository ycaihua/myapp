# myapp

基于 FastAPI + React 的用户管理后台，B/S 架构，提供 REST API 与自动生成的 API 文档。

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Python 3.9+、FastAPI、SQLAlchemy、SQLite |
| 前端 | React、Tailwind CSS、Vite |

## 快速开始

### 后端

```bash
# 安装依赖
pip install -e .

# 启动 API 服务（端口 8000，支持热重载）
uvicorn myapp.app:app --reload --port 8000
```

启动后访问：
- API 文档（Swagger）：http://localhost:8000/docs
- API 文档（ReDoc）：http://localhost:8000/redoc

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问管理后台：http://localhost:5173

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users` | 用户列表（支持 `skip` / `limit`） |
| POST | `/api/users` | 新增用户 |
| GET | `/api/users/{id}` | 用户详情 |
| DELETE | `/api/users/{id}` | 删除用户 |
| GET | `/health` | 健康检查 |

## 开发

```bash
# 运行全部测试
pytest -v

# 运行单个测试文件
pytest tests/test_users_api.py -v
```

## 项目结构

```
myapp/
├── myapp/
│   ├── app.py          # FastAPI 实例、CORS、路由注册
│   ├── database.py     # SQLite 连接与 Session
│   ├── models.py       # User ORM 模型
│   ├── schemas.py      # Pydantic 请求/响应模型
│   ├── main.py         # CLI 入口（启动 uvicorn）
│   └── routers/
│       └── users.py    # 用户 CRUD 端点
├── tests/
│   ├── test_main.py
│   └── test_users_api.py
├── frontend/           # React + Tailwind CSS 前端
│   └── src/
│       ├── api/        # axios 封装
│       ├── components/ # Layout、Sidebar、ConfirmModal
│       └── pages/      # UserList、UserCreate、UserDetail
└── pyproject.toml
```
