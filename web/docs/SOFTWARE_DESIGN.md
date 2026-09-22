# 软件设计说明

软件名称：消化内科住院医师规范化培训辅助教学系统 V24.0；内部版本 24.0.0。

```text
index.html
 ├─ data.js / training_data.js / v4_data.js：题库
 ├─ v4.js … v21.js / v23.js：既有图谱和流程交互
 ├─ js/core.js：纯规则、随机、日计划冻结、导出校验
 ├─ js/auth.js：账户、同步、离线入口
 ├─ js/records.js：轮次、作答、复盘、教师反馈与导出
 └─ js/learning.js：学习/自测、导航、缺图处理
       │ 本机同源 HTTP JSON
 server.py → backend.py
 ├─ SQLite private/gi24.sqlite3
 └─ 可选 Responses API：模拟患者问答
```

核心规则和数据管理拆成独立模块，既有内镜可视化保留兼容层，未做全站重构。旧 v22 账户实现停用。

规则采用规范化、明确同义白名单、完整目标匹配和否定/条件检查，没有词向量、编辑距离医学纠错或临床语义模型。关键词覆盖无法识别全部安全错误和完整性问题。教师判断合理替代答案。

每日任务首次生成后保存 ID、版本和时间；复习间隔按 1/3/7/14/30 天启发式递增，未达当前练习阈值次日复习。未验证这一算法的教育效果。

| 接口 | 用途与限制 |
|---|---|
| GET /api/health | 软件和问答配置状态 |
| POST /api/register | 学员注册，不接受教师角色 |
| POST /api/login、/api/logout | 限速登录、服务端会话和注销 |
| GET /api/me | 当前账户 |
| GET/POST /api/profile | 个人档案、修订号及追加记录 |
| GET /api/teacher | 教师查看学员及反馈 |
| POST /api/review | 教师反馈，关联现有轮次 |
| POST /api/ai | 登录、明确启用、限速问答 |

请求检查 Host、Origin、自定义头和 8 MB 体积上限。静态服务不公开 private、Python、测试目录、隐藏文件或上级路径。随机会话 12 小时过期，Cookie 使用 HttpOnly/SameSite=Strict；本机 HTTP 不使用 Secure。公网需另行部署设计。

users 保存账户、研究编号和 PBKDF2 派生密码；profiles 保存兼容档案与修订号；attempts 以用户/轮次唯一保留 JSON；reviews 独立保存反馈。已同步轮次不能通过接口覆盖或删除，事务冲突不部分写入。

记录由客户端提交前生成，可被熟悉开发工具的用户修改；主机管理员也能修改数据库。此版不是防作弊或不可抵赖审计系统。题库答案在前端可访问，不能作认证考试。

离线 localStorage 无身份隔离。服务器模式未提交草稿只在内存。内容/规则更新需升级版本并跑回归，实际签审文件另外存档。`scripts/build_metadata.cjs` 重建哈希、来源线索及 patient_bank.json，会覆盖空白审核模板；签审后的台账先存档。来源网址不等于许可证核验。

可选问答按 [OpenAI Responses 官方接口](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)实现，默认教学无需网络。
