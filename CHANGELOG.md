# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-05-07

### Added

- 后端重构为 FastAPI REST API，端口 8000，自动生成 Swagger / ReDoc 文档
- SQLAlchemy + SQLite 数据库，User 模型（id、name、email、phone、created_at）
- 用户 CRUD 端点：列表、新增、详情、删除
- React + Tailwind CSS 前端管理后台（Vite 构建）
- 新中式现代极简设计：暖木色系、思源宋体（Noto Serif SC）、`#B8492C` 强调色
- 左侧导航 + 右侧内容布局，包含用户列表、新增、详情三个页面
- API 测试套件（`tests/test_users_api.py`，使用 `StaticPool` 内存数据库隔离）

### Changed

- `myapp/main.py` 由打印 Hello 改为启动 uvicorn 服务器
- `pyproject.toml` 版本升至 0.2.0，新增 FastAPI / SQLAlchemy / Pydantic / httpx 依赖

### Fixed

- 侧边栏菜单文字加粗（`font-semibold`）

## [0.1.0] - 2026-05-07

### Added

- Initial project setup with `pyproject.toml`
- `myapp` CLI entry point
- pytest test suite

[Unreleased]: https://github.com/ycaihua/myapp/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/ycaihua/myapp/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ycaihua/myapp/releases/tag/v0.1.0
