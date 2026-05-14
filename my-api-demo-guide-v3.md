# Claude Code 实战演示方案：FastAPI 项目全流程 + Agent 进阶

> **目标受众**：技术团队 / 开发者  
> **演示时长**：90 分钟  
> **演示主线**：CLAUDE.md 讲解 → 生成项目骨架 → 写测试 → 修 Bug → 代码审查 → 自定义 Agent → Agent 踩坑与调优 → 前端管理页面 → 发版 → 优势与局限 → 各角色使用建议  
> **核心传递**：Claude Code 是 agentic CLI，覆盖真实开发全流程；CLAUDE.md 是让每次代码生成架构一致的关键；Agent 是把流程固化为可复用工具的机制

---

## 一、演示前准备

```bash
# 确认 Claude Code 已安装
claude --version

# 确认 gh CLI 已登录
gh auth status

# 确认 Python 环境
python --version   # >= 3.10

# 确认 Node.js 环境（场景 7 需要）
node --version     # >= 18
npm --version

# Windows：若 npm 报"禁止运行"，执行一次
powershell -Command "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force"
```

**Agent 演示准备（场景 6.5 需要）：**

```bash
# 确认 Agent 定义文件已存在
cat .claude/agents/pyrevieweragent.md

# 确认报告目录存在（不存在时 Agent 会自动创建）
ls .claude/reports/
```

---

## 二、演示流程（共 8 个场景 + 4 个 Agent 子场景）

---

### 前置讲解：CLAUDE.md — 架构约定的载体（3 分钟）

**讲解要点**：在建项目之前，先了解 CLAUDE.md 是什么——它是 Claude Code 每次对话开始时自动加载的"项目手册"，决定了后续所有代码生成的风格与约束。

#### 打开本项目的 CLAUDE.md

```bash
cat CLAUDE.md
```

观众看到本项目实际使用的 CLAUDE.md，包含两大块：

**① UI 设计系统**

```markdown
## UI 设计系统
风格：新中式现代极简 + 暖木色

### 色彩
| 角色     | 色值      | 用途                  |
|---------|---------|----------------------|
| 强调色   | #B8492C | 主按钮、链接、激活态    |
| 暖木浅底 | #FAF7F2 | 页面背景              |
| 正文深色 | #2C2416 | 主标题、正文           |

禁止使用冷灰（gray-*）、蓝色系、绿色系。
字体：'Noto Serif SC'，'思源宋体'，Georgia，serif
```

**② 开发规范**

```markdown
## 开发规范
- 最小改动：只改任务相关代码
- 测试是交付门控：每次完成前必须运行 pytest / vitest
- 新增第三方包须写入 requirements.txt / package.json
```

**口播：**

> "这个文件已经提交在项目里，所有人 clone 之后共享同一套规范。
> 更重要的是——**它在每次对话开始时自动加载**，不需要每次在 prompt 里重复说明。
> 没有 CLAUDE.md 时，同一句需求描述每次生成的架构都不同；有了它，输出才可预期。
> 接下来建项目骨架，Claude 会自动遵循这里的规范。"

#### 如何生成 CLAUDE.md（补充说明）

如果是全新项目还没有 CLAUDE.md，运行：

```
> /init
```

Claude 扫描整个项目，把架构决策、代码约定、测试要求提炼成文字写入 CLAUDE.md，提交 git 即可全队共享。

---

### 场景 1：自然语言建项目骨架（5 分钟）

**演示要点**：一句话描述需求，Claude 询问细节后自动生成可运行项目；CLAUDE.md 已加载，骨架自动遵循项目约定

**操作（在本项目目录下执行）：**

```
> 帮我创建一个 Python FastAPI 项目骨架
```

Claude 会**主动追问**细节（框架偏好、路由模块划分、是否需要测试），确认后生成骨架。

**生成的项目结构（遵循 CLAUDE.md 约定）：**

```
app/
├── __init__.py
├── main.py              # 应用入口，包含路由挂载
├── core/
│   └── config.py        # 配置，从环境变量读取
├── api/
│   └── v1/
│       └── health.py    # /health 端点
└── models/
    └── base.py          # 基础响应模型
requirements.txt
tests/
└── test_health.py
```

**讲解要点：**

> "注意它按照 CLAUDE.md 里的约定组织了目录结构——
> `app/api/v1/` 的路由分层、`models/` 的模型分离、测试目录同步生成。
> 如果没有 CLAUDE.md，每次生成的目录结构都不一样：
> 有时叫 `routers/`，有时叫 `api/`，有时配置在 `config.py`，有时在 `settings.py`。"

**验证启动：**

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
# 访问 http://localhost:8000/docs
```

---

### 场景 2：Plan Mode + 批量任务（8 分钟）

**演示要点**：复杂任务先规划再执行，用 Plan Mode 做需求对齐

**操作（在提示词中触发 Plan Mode）：**

```
> pytest 单元测试覆盖核心逻辑，并且增加一个 health check 端点
> use plan mode
```

观众会看到 Claude 输出一份**结构化计划**：

```
## 计划摘要
| 文件                    | 操作                              |
|------------------------|-----------------------------------|
| main.py                | 新增 GET /health 端点             |
| requirements.txt       | 添加 pytest、httpx、pytest-cov    |
| tests/conftest.py      | 新建：共享 TestClient fixture     |
| tests/test_main.py     | 新建：测试 / 和 /health           |
| tests/test_users.py    | 新建：测试用户路由                |
| tests/test_items.py    | 新建：测试商品路由，含 422 校验   |
```

**讲解要点：**

> "Plan Mode 是我用 Claude Code 的核心姿势。它先列计划让你审核，
> 你可以在这里改需求、砍 scope，确认之后再动手。
> 比让它直接开干更可控，避免改了一堆不是你想要的东西。"

**计划确认后执行，结果：**

```bash
pytest tests/ -v
# 10 passed in 0.07s
```

**生成的 health check 端点：**

```python
@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "version": app.version}
```

---

### 场景 3：文档生成（2 分钟）

**演示要点**：无需模板，Claude 自动理解项目结构生成文档

**操作：**

```
> 对上面的项目增加 README
```

Claude 读取所有路由文件后生成包含以下内容的 README：

- 环境要求 & 安装步骤
- 启动命令
- 完整 API 端点表格（含请求体示例）
- 测试运行命令

**讲解要点：**

> "它没有用模板，是真的读了 main.py 和所有 router 文件，
> 把端点、参数、示例都扒出来写进文档。"

---

### 场景 4：Git 操作 + 推送 GitHub（5 分钟）

**演示要点**：完整的 git 工作流，包括 .gitignore 处理

**操作：**

```
> 把这些改动 commit 一下，并且提交到 github
```

Claude 会：

1. 检测到没有 git 仓库 → 询问是否初始化
2. 发现没有 GitHub 仓库 → 询问仓库名称和可见性
3. 检测到 `__pycache__` 被纳入 → **主动修正**，生成 `.gitignore` 并清理

**讲解要点：**

> "注意它发现把 `__pycache__` 提交进去了，自动帮我加了 .gitignore 并清理掉——
> 这种'做了还会检查'的行为，就是 agentic 和补全工具的本质区别。"

**创建私有仓库：**

```
> 先帮我在 github 创建一个 private 仓库
```

```bash
gh repo create my-api --private --source=. --remote=origin --push
# → https://github.com/ycaihua/my-api
```

**验证 GitHub 仓库内容：**

```
> 验证一下 github 上的仓库内容是否正确
```

Claude 调用 `gh api` 检查文件树和 commit 历史，输出验证报告。

---

### 场景 5：Bug 修复三步法（10 分钟）

**演示要点**：从用户反馈到修复验证的完整闭环

---

#### 📌 模拟 Bug 说明（演示者必读）

##### Bug 的来源

本次演示中的 bug **不是自然产生的**，而是在场景 1 建项目后**故意注入**的，目的是制造一个真实感强、便于讲解的修复场景。

注入命令：

```
> 在新建用户时模拟一个服务器 500 错误的代码
```

Claude 在 `app/routers/users.py` 中新增了 `POST /users/` 端点，并在里面写死了 500 错误：

```python
# app/routers/users.py（注入 bug 后）
@router.post("/")
def create_user(user: User):
    raise HTTPException(status_code=500, detail="Internal Server Error")
```

此时 `User` 模型只有 `name` 字段，没有 `items` 字段，也没有任何输入校验。

##### Bug 的本质

这个 bug 复合了两层问题：

| 层次 | 问题 | 表现 |
|------|------|------|
| **第一层**（显性） | 端点无条件抛出 500 | 所有请求都失败 |
| **第二层**（隐性） | `User` 模型缺少 `items` 字段及空值校验 | 即使修掉 500，空 items 也不会被拦截 |

演示时 Claude 会**同时发现并修复两层问题**——这是比只修显性 bug 更有说服力的演示效果。

##### 为什么这样设计 Bug

1. **真实感**：500 是生产环境最常见的报警类型，观众有代入感
2. **有层次**：表层 bug 容易发现，深层的校验缺失需要理解业务逻辑才能发现，体现 Claude 的分析深度
3. **可延伸**：修完这个 bug 后，自然引出场景 6 的"全库同类问题扫描"

##### 演示前的准备步骤

如果需要**从头复现**这个演示，bug 注入的时机在场景 4（git push）之后：

```
# 1. 先完成场景 1-4（建项目、加测试、推 GitHub）
# 2. 然后注入 bug
> 在新建用户时模拟一个服务器 500 错误的代码

# 3. 确认 bug 已注入
> 把这个改动 commit 并推送到 github

# 4. 进入场景 5，用用户反馈语气触发修复流程
```

注入后的端点行为（用于现场验证 bug 存在）：

```bash
curl -X POST http://localhost:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie", "items": []}'
# 预期输出：{"detail":"Internal Server Error"}  HTTP 500
```

##### 修复后的预期行为对照

| 请求 | 修复前 | 修复后 |
|------|--------|--------|
| `items: []`（空数组） | 500 Internal Server Error | 422 Unprocessable Entity |
| `items` 字段缺失 | 500 Internal Server Error | 422 Unprocessable Entity |
| `items: ["book"]`（合法） | 500 Internal Server Error | 200 + 用户数据 |
| `name: ""`（空用户名） | 500 Internal Server Error | 422 Unprocessable Entity |

> **演示小技巧**：场景 5 开始前，可以先现场跑一次 `curl` 让观众亲眼看到 500，
> 再把 bug 报告丢给 Claude，效果比直接看代码更有冲击力。

---

**用真实用户语气报 bug：**

```
> 用户反馈：调用 POST /users 创建用户时，
> 如果 items 数组为空就 500 报错。
> 期望应该返回 400 + 友好的错误信息。
> 
> 请：
> 1. 先复现这个 bug
> 2. 定位根因
> 3. 给出修复方案让我审核
```

**观众会看到 Claude：**

**① 自己复现（不需要你提供 stack trace）**

```python
client.post('/users/', json={'name': 'Charlie', 'items': []})
# → 500 {'detail': 'Internal Server Error'}
```

**② 定位根因**

> "`users.py:23` — `create_user()` 无条件 `raise HTTPException(status_code=500)`，
> `User` 模型里也没有 `items` 字段，所以空数组的校验根本不存在。"

**③ 给出修复方案供审核**

```python
@router.post("/")
def create_user(user: User):
    if not user.items:
        raise HTTPException(status_code=400, detail="items 不能为空")
    return {"id": 3, **user.model_dump()}
```

**确认后执行，测试全绿：**

```bash
pytest tests/ -v
# 13 passed in 0.07s
```

**讲解要点：**

> "复现 → 定位 → 方案审核 → 修复 → 回归测试，一个完整闭环。
> 注意我从头到尾没告诉它 stack trace 在哪，它自己找到的。"

---

### 场景 6：全代码库安全扫描（8 分钟）

**演示要点**：从一个 bug 延伸到全局同类问题排查

**操作（接上一个场景）：**

```
> 这个 bug 的根因是什么类型？
> 我们有没有可能在代码库其他地方有类似问题？扫一下
```

**Claude 给出根因分类：**

> "这个 bug 属于**输入验证缺失（Missing Input Validation）**——
> 客户端的错误输入，却以服务端错误的形式暴露出去。"

**然后自动扫描，发现 3 处类似问题：**

| 文件 | 字段 | 问题 | 风险 |
|------|------|------|------|
| `items.py` | `name: str` | 未校验空字符串 | 无效名称写入 |
| `items.py` | `price: float` | 未校验负数或零 | `price=-1` 可正常创建 |
| `users.py` | `name: str` | 未校验空字符串 | 无效用户名写入 |

**修复方案（Pydantic Field 约束）：**

```python
# 统一在模型层拦截，返回 422，无需手写 if 判断
class Item(BaseModel):
    name: str = Field(min_length=1)
    price: float = Field(gt=0)
    in_stock: bool = True

class User(BaseModel):
    name: str = Field(min_length=1)
    items: List[str] = Field(min_length=1)
```

**修复后测试：**

```bash
pytest tests/ -v
# 17 passed in 0.09s
```

**讲解要点：**

> "这是最有冲击力的演示——从一个 bug 出发，让它做全代码库的同类问题扫描。
> 人工做这件事可能需要半天，Claude Code 两分钟扫完并给出修复建议。"

**演示者过渡口播（衔接 6.5）：**

> "这就是内置能力的上限——每次都要靠 prompt 重新告诉它扫什么、怎么扫、输出什么格式。
> 如果你的团队每周要做一次安全审查，每次重写 prompt 成本高，输出格式也不稳定。
>
> Claude Code 有一个机制可以解决这个问题：**自定义 Agent**——
> 把这套流程一次性写进一个定义文件，之后一行命令就能复现同样的行为，
> 而且输出的是格式化的报告文件。
> 我们来看它的工作原理，以及——怎么把它用对。"

---

### 场景 6.5：pyreview Skill — 一行命令出报告（5 分钟）

**演示要点**：Skill 是在主 Claude 上下文中运行的斜杠命令，调用简单、写文件可靠；是把审查流程固化的第一步

#### 调用演示

```
> /pyreview app/demo.py
```

观众看到 Claude 依次执行：

1. 自动运行 `pytest tests/ -v`，记录通过/失败数
2. 读取指定文件（自动排除 `.venv` / `node_modules`）
3. 检查代码质量问题 + 安全问题
4. 生成时间戳，调用 Write 工具写入 `.claude/reports/review-YYYYMMDD-HHMMSS.md`

```bash
ls .claude/reports/
# review-20260512-105052.md  ← 新文件自动出现
```

#### 与场景 6（内联扫描）对比

| 维度 | 场景 6：内联扫描 | 场景 6.5：/pyreview Skill |
|------|----------------|--------------------------|
| 调用方式 | 自然语言 prompt | `/pyreview 文件路径` |
| 输出形式 | 聊天窗口文字 | 磁盘 `.md` 报告文件 |
| 格式一致性 | 每次不同 | 固定模板 |
| 可归档进 git | 否 | 是 |
| 写文件可靠性 | — | 高（主 Claude 上下文直接调用 Write） |

**讲解要点：**

> "Skill 在主 Claude 上下文里运行——这意味着写文件的 Write 工具调用非常可靠，
> 不会像 subagent 那样跳步。
> 这是把审查流程固化的最简单方式：一个斜杠命令，报告自动出来，格式固定，可以归档进 git。
>
> 接下来看更进一步的方式：**自定义 Agent**——
> 它有独立的上下文和工具权限声明，可以做更复杂的定制，
> 但调用时有一些需要注意的规则，我们来一起看。"

---

### 场景 6.6：自定义 Agent — pyrevieweragent（5 分钟）

**演示要点**：Agent 是可复用、可版本化的专属工具，把团队经验固化为一行命令

#### 解读 Agent 定义文件

打开 `.claude/agents/pyrevieweragent.md`，指出三个核心要素：

```yaml
---
name: pyrevieweragent          # 调用名：/project:pyrevieweragent
tools: Read, Grep, Glob, Write, Bash   # 权限声明：这个 Agent 能用哪些工具
---
# 正文：行为规范，定义了 7 个必须执行的步骤
```

**7 步骤的设计意图：**

| 步骤 | 操作 | 意图 |
|------|------|------|
| 1 | 运行 pytest | 先跑测试，有回归才有审查意义 |
| 2-4 | 读文件 + 质量检查 + 安全检查 | 核心审查逻辑 |
| 5-6 | 获取时间戳 + 创建目录 | 为报告文件做准备 |
| 7 | 写入报告文件 | 产出可归档的 `.md` 报告 |

**口播：**

> "注意这里声明了 `Write` 工具权限——Agent 不只是分析，它会把结果写成报告文件存到磁盘。
> 这就是和内置扫描的本质区别：内置扫描的结果在聊天窗口里，Agent 的结果是可版本化的文件。"

#### 正确调用演示

```
> /project:pyrevieweragent app/demo.py
```

观众看到 Agent 依次执行 7 步，最终生成报告：

```bash
ls .claude/reports/
# review-agent-20260512-120329.md
```

打开报告，展示格式：

```markdown
# 代码审查报告
- 审查文件：app/demo.py
- 审查时间：2026-05-12 12:03:29

## 🧪 测试结果
- 测试状态：✅ 通过 / 通过：1 个

## 🔴 安全问题
- `app/demo.py:4` — 硬编码密钥：API_KEY 明文写入源码
- `app/demo.py:12` — SQL 注入：字符串拼接构造 SQL
...
```

**讲解要点：**

> "调用方式就一行——文件路径传进去，报告自动出来，格式统一，时间戳标记，可以归档进 git。
> 团队 clone 仓库就拥有同一套审查流程，不需要每个人重新写 prompt。
> 这就是把经验固化成工具的价值。"

---

### 场景 6.7：Agent 踩坑 — prompt 覆盖行为（8 分钟）

**演示要点**：在 prompt 里描述行为会覆盖 Agent 定义；文字指令无法强制 LLM 调用工具——这是 subagent 架构的根本局限

**口播引子：**

> "但这个 Agent 不是一开始就能正常运行的。让我们重现一下第一次踩的坑——
> 这个坑非常典型，很多人初次用 subagent 都会踩到。"

#### 演示错误调用姿势

```
> 请用 pyrevieweragent 审查 app/ 目录下的所有 Python 文件，
> 检查代码质量和安全问题，给我一份详细报告
```

观众看到：Agent 执行了代码分析，输出了分析文字，但是……

```bash
ls .claude/reports/
# 没有新文件生成
```

```
> 为什么没有生成报告文件？
```

**口播：**

> "Agent 读了代码，分析了结果，把内容输出出来了——但是没有调用 Write 工具写文件。为什么？"

#### 追查根本原因

对比两种调用方式：

| 调用方式 | prompt 传给 Agent 的信息 | Agent 的行为 |
|----------|------------------------|------------|
| **错误**：`用 pyrevieweragent 审查...给我报告` | "审查...给报告" 整段覆盖了 Agent 的原始角色 | 把"给报告"理解为输出文字，没有触发 Write 工具 |
| **正确**：`/project:pyrevieweragent app/demo.py` | 只有文件路径，上下文干净 | 按定义文件完整执行 7 步，Write 工具被触发 |

**口播：**

> "这里有一个很多人没想清楚的机制问题：
> Agent 的定义文件是它的'系统提示'，调用时的 prompt 是'用户输入'。
> 当你在 prompt 里写了'帮我做 X'，这段描述会覆盖或干扰 Agent 的原始角色定义。
> Agent 看到'给报告'，它就理解为——把分析结果作为文字输出给你，任务完成。"

#### 尝试加强约束语言（故意走弯路）

展示修改 Agent 定义文件，在步骤 7 加上：

```
**此步骤是任务的终止条件，未写入文件则任务未完成，不得结束。**
```

再次用错误 prompt 调用——结果仍然没有写文件。

**口播：**

> "加了更强的约束语言，依然没有用。
> 这说明问题不在措辞，在于 subagent 的架构本身：
>
> **文字是建议，工具调用是行为，两者不等价。**
>
> LLM 不是状态机。你写'必须执行步骤 7'，不等于它一定会调用 Write 工具。
> 这是 LLM 的本质特性，不是 Claude Code 的 bug。
> 理解这一点，是用好 Agent 的前提。"

---

### 场景 6.8：Agent 调优 — 正确调用姿势（7 分钟）

**演示要点**：两种可靠方案 + 三条调用原则；理解 Agent 的工作边界

#### 方案一：prompt 只传路径

```
> /project:pyrevieweragent app/demo.py app/routers/users.py
```

观众看到 Agent 完整执行 7 步，报告文件出现在 `.claude/reports/`。

**口播：**

> "注意 prompt 只有文件路径，没有任何行为描述。
> Agent 接收到的上下文很干净，它完全按照定义文件的 7 步走，写文件这步自然被触发。
> 行为已经在定义文件里了，prompt 里重复描述只会产生干扰。"

#### 方案二：主 Claude 接管写文件

对于必须在 prompt 里描述行为的场景，另一种有效解法：

```
第一步：让 Agent 只做分析
> 用 pyrevieweragent 分析 app/demo.py，把分析结果给我

第二步：主 Claude 拿到结果后自行写文件
> 把这份分析结果写入 .claude/reports/review-agent-{时间戳}.md
```

**口播：**

> "如果你的场景必须在 prompt 里描述行为，另一个解法是：
> 让 Agent 只负责分析，不负责写文件；
> 主 Claude 拿到分析结果之后，自己调用 Write 工具写报告。
> 写文件的动作放在主 Claude 层，工具调用就可靠了。"

#### 三条调用原则

**第一条：prompt 只传数据，不描述行为**

```
✅ /project:pyrevieweragent app/demo.py
❌ 请用 pyrevieweragent 审查 app/demo.py 并给我一份详细报告
```

行为已经在 Agent 定义文件里了，重复描述会产生干扰。

**第二条：需要可靠触发的工具调用，放到主 Claude 层**

写文件、发送通知等有副作用的操作，在主 Claude 层执行比依赖 subagent 更可靠。

**第三条：Agent 定义文件提交 git，像共享 Makefile 一样**

```bash
git add .claude/agents/pyrevieweragent.md
git commit -m "feat: 添加代码审查 Agent"
# 团队所有成员 clone 后即可使用同一套审查流程
```

**讲解要点：**

> "这三条原则背后是同一个认知：
> Agent 定义文件负责行为规范，prompt 负责传数据，主 Claude 负责可靠的副作用操作。
> 职责分层清楚了，Agent 才能稳定运行。"

---

### 场景 7：前端管理页面（15 分钟）

**演示要点**：用自然语言描述 UI 设计风格，Claude 完成前后端全栈交付

**操作（触发 Plan Mode）：**

```
> 增加后端管理页面，包括用户管理，使用左边导航菜单，右边操作页面结构，
> 需要有用户新增，删除，详情，列表三个页面
> 新中式现代极简 + 暖木色，衬线字体（思源宋体），暖红色（#B8492C）作为唯一强调色
> 前端框架 Tailwind CSS + React 跨平台
> 执行前需要先使用 plan，待我确认后再执行。
```

**观众会看到 Claude 同时规划前后端改动：**

```
后端改动：
  main.py       → 添加 CORS 中间件 + 静态文件挂载 /admin
  users.py      → 新增 DELETE /users/{id} 端点

前端新建 frontend/ 目录：
  vite.config.ts        → 开发代理，/users 转发到 :8000
  tailwind.config.js    → 设计 token（accent/#B8492C、surface、sidebar）
  src/api/users.ts      → fetch 封装
  src/components/       → Layout、Sidebar、ConfirmDialog
  src/pages/            → UserList、UserDetail、UserCreate、UserDelete
```

**讲解要点：**

> "注意它不是只写前端——它同时规划了后端需要加 CORS、加 DELETE 接口，
> 然后前后端作为一个整体方案提交给我审核。这就是跨栈的 agentic 工作方式。"

**计划确认后执行，Claude 依次完成：**

1. 后端 CORS + DELETE 端点 → 跑 pytest 验证（19 passed）
2. `npm create vite` 脚手架 + Tailwind 配置
3. 设计系统 token 写入 `tailwind.config.js`
4. API 封装层、布局组件、四个页面组件
5. `npm run build` 编译验证（无报错）

**启动验证：**

```bash
# 终端 1
uvicorn main:app --reload --port 8000

# 终端 2
cd frontend && npm run dev
# → http://localhost:5173
```

**展示效果：**
- 左侧暖木色导航栏，active 状态显示 #B8492C 左边框
- 右侧用户列表表格，行内"查看详情 / 删除"操作
- 新增用户表单，含客户端校验
- 删除确认弹窗（独立路由，非 modal 覆盖）

**即时微调演示（可选）：**

```
> jietu/1.png 是运行后台截图，把左边的字体加粗
```

Claude 读取截图 → 定位到 `Sidebar.tsx` 对应 class → 直接修改，Vite 热更新生效。

**讲解要点：**

> "从自然语言的设计描述，到可运行的全栈页面，中间没有 Figma、没有手写 CSS——
> 它读了截图，知道你在说哪里，直接改代码。这是真正的多模态 agentic 开发。"

---

### 场景 8：CHANGELOG 管理 + 版本发布（5 分钟）

**演示要点**：工程化的版本管理，不只是写代码

**生成 CHANGELOG：**

```
> 帮我生成 CHANGELOG 记录这几次改动
```

Claude 读取 `git log`，按 Keep a Changelog 规范分类输出：

```markdown
## [Unreleased]
### Added
- React + Tailwind CSS 管理后台，新中式极简风格
- DELETE /users/{id} 端点，CORS 中间件
- 19 个后端测试全部通过
```

**发布 v0.3.0：**

```
> 把 [Unreleased] 发布为 v0.3.0
```

Claude 一并处理：
1. CHANGELOG 中 `[Unreleased]` → `[0.3.0] - 2026-05-07`
2. `main.py` 版本号同步更新
3. `test_main.py` 中版本断言同步更新
4. commit + push + 创建 GitHub Release

```bash
# 结果
https://github.com/ycaihua/my-api/releases/tag/v0.3.0
```

---

## 三、核心能力总结

| 能力 | 演示场景 | 关键口播 |
|------|----------|---------|
| **多轮交互建项目** | 场景 1 | 主动追问细节，不假设 |
| **CLAUDE.md 架构约定** | 场景 1.5 | `/init` 生成项目手册，确保每次代码生成架构一致；提交 git 全队共享 |
| **Plan Mode** | 场景 2 | 先规划再执行，可审核可修改 |
| **文档自动生成** | 场景 3 | 读代码写文档，非模板填充 |
| **完整 git 工作流** | 场景 4 | 自动处理 .gitignore、gh CLI |
| **Bug 修复闭环** | 场景 5 | 自复现 → 定位 → 审核 → 验证 |
| **全库安全扫描** | 场景 6 | 从单点 bug 延伸到系统性排查 |
| **pyreview Skill** | 场景 6.5 | `/pyreview 文件路径`，主 Claude 上下文运行，写文件可靠，报告可归档 |
| **自定义 Agent** | 场景 6.6 | Agent 有独立上下文和工具权限，适合更复杂的定制审查流程 |
| **Agent 踩坑理解** | 场景 6.7 | 文字是建议，工具调用是行为，两者不等价 |
| **Agent 调优** | 场景 6.8 | prompt 只传数据；副作用操作放主 Claude 层 |
| **全栈前端生成** | 场景 7 | 自然语言设计稿 → 可运行 React 页面，读截图微调 |
| **版本发布管理** | 场景 8 | CHANGELOG + 版本号 + GitHub Release 联动 |

---

## 四、Claude Code 编码的优势与不足

### ✅ 优势

| 优势 | 说明 |
|------|------|
| **自然语言驱动** | 需求直接转代码，减少沟通转译损耗，降低入门门槛 |
| **全项目上下文** | 跨文件/跨栈理解整个项目，不只是单文件补全 |
| **测试闭环** | 自己运行测试验证结果，不只是生成代码甩给你 |
| **重复性工作加速** | CRUD、文档、测试用例、安全扫描等模板化工作效率大幅提升 |
| **Plan Mode 可审核** | 先列计划再动手，复杂任务可在执行前调整 scope，不是黑盒操作 |
| **流程固化能力** | CLAUDE.md 约束架构一致性；Skill 固化单步流程；Agent 封装多步复杂流程——三层工具让团队经验可复用 |

### ⚠️ 不足

| 不足 | 说明 | 应对方式 |
|------|------|---------|
| **输出不确定性** | LLM 采样每次略有差异，同一需求可能生成不同结构 | 写好 CLAUDE.md，明确约束架构和代码规范 |
| **复杂业务逻辑需把关** | 能实现代码，不理解业务目标，可能生成"技术上正确但业务上错误"的代码 | 人工审核逻辑正确性，不能只看测试通过 |
| **长对话质量退化** | 上下文过长时生成质量下降，容易"忘记"早期约定 | 定期 `/compact` 压缩上下文，或开新对话 |
| **无法替代架构决策** | 能执行方案，不能替你判断该不该做、技术选型是否合理 | 架构决策由人主导，Claude 负责落地实现 |
| **测试覆盖不全** | 生成的测试偏向正常路径，异常场景和边界值覆盖不足 | 人工补充边界场景，结合 `/pyreview` 做安全扫描 |

---

## 五、各角色使用建议

### 产品经理

**适合的场景：**
- 自然语言描述需求，快速验证技术可行性
- 生成 API 接口设计草稿，作为开发评审的起点
- 生成需求说明模板、用户故事框架

**注意事项：**
- 不要让 Claude 替你做产品决策——它会给出"技术上可行"的方案，但不会告诉你"应不应该做"
- 生成的技术方案须经开发团队确认合理性后再进入排期

**建议工作流：**
```
需求描述 → Claude 生成 API 设计草稿 → 开发评审确认 → 正式排期
```

---

### 开发人员

**适合的场景：**
- 项目初始化：`/init` 生成 CLAUDE.md，提交 git，全队共享架构约定
- 复杂任务：Plan Mode 先看计划再执行，避免大范围意外修改
- Bug 修复：自复现 → 定位根因 → 审核方案 → 验证测试，完整闭环
- 代码审查：`/pyreview 文件路径` 快速出安全报告；pyrevieweragent 做团队共享的定制化审查

**注意事项：**
- 测试通过 ≠ 业务逻辑正确，测试验证的是代码行为，人工审核业务合理性
- 长对话要定期 `/compact`，防止质量退化
- `git push`、数据库迁移等不可逆操作，即使 Claude 建议，也需人工确认

**建议工作流：**
```
写好 CLAUDE.md → Plan Mode 确认计划 → 执行 → 跑测试 → /pyreview 安全扫描 → 人工审查结果
```

---

### 测试人员

**适合的场景：**
- 生成测试用例框架（正常路径、参数校验、错误码覆盖）
- `/pyreview 文件路径` 快速做安全漏洞扫描，生成结构化报告
- Bug 复现脚本生成（curl 命令、pytest case）
- 边界值测试用例提示（空字符串、负数、超长输入等）

**注意事项：**
- LLM 生成的测试偏向正常路径，异常场景和边界条件需人工补充
- `/pyreview` 安全扫描结果需人工复核，不能作为唯一的安全门控——建议配合 `bandit`（静态安全分析）使用
- 测试报告由 Claude 生成，结论由人判断

**建议工作流：**
```
Claude 生成测试框架 → 人工补充边界场景 → /pyreview 安全扫描 → 汇总报告 → 人工复核结论
```
