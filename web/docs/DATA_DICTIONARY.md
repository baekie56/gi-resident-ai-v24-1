# 数据字典

软件 24.0.0；题库 2026-09-06.1；规则 conservative-1。

| 字段 | 定义及限制 |
|---|---|
| participantId | 随机研究编号；服务端指定或离线生成 |
| id / attemptId | 单轮训练标识 |
| caseId / caseFamily | 项目 ID；family 当前等于 ID，外部平行组需另建 |
| kind / mode | 模块；learn / selftest，同一题库 |
| softwareVersion / bankVersion / ruleVersion | 生成记录时版本 |
| startedAt / finishedAt / durationSeconds | 客户端时间与墙钟用时，包含停顿和时钟偏差 |
| responses | 原始选项/步骤事件，不同模块结构不同 |
| responses.order / selected | 展示顺序中的原始索引 / 选中原题索引 |
| responses.correct | 符合预设步骤，非临床裁定 |
| responses.step / note | 内镜步骤与事件说明，无连续鼠标轨迹 |
| freeText / chat / orderedTests | 病例原始文字、问答、教学检查 |
| reportValues / completeness | 报告字段和填写完整度 |
| decisionScore | 模块预设决策或流程分；不同模块不能直接混合 |
| ruleCoverage / ruleDetails | 表达或报告覆盖，非医学正确率 |
| hints | 病例文本即时核对次数，不是所有提示暴露 |
| firstAttempt | 同用户 kind+caseId 的首次非退出轮次，不保证从未见题 |
| aiUsed / aiModel / promptVersion | 实际成功联网使用及模型/提示版本 |
| status / safetyReview | pending-review、safety-review、abandoned；风险标签不穷尽安全错误 |
| reviewDue / reviewStreak | 启发式复习到期和连续计数 |

教师反馈单独保存学员、轮次、教师、状态、文字和创建时间，不改原始分数或将其变成“合格”。复核情况以反馈表为准。

## 管理员操作日志

服务器账户模式另以追加方式保存 `activity_events`。主要事件包括登录、退出、打开首页、进入功能、开始训练、提交作答、完成训练、中途退出、档案同步和管理员复核。每条事件保存随机事件 ID、研究账号、客户端发生时间、服务器接收时间、页面或项目、关联训练 ID 及最少必要详情。管理员工作台显示最近操作；原始完成轮次同时独立保存到 `attempts` 表，不能由后续档案同步覆盖或删除。

客户端时间可能受设备时钟影响，正式分析应同时参考服务器接收时间。页面停留并不等于有效学习；累计训练时长来自已完成轮次的开始与结束时间，包括中途停顿。

研究导出按 `js/core.js` 的 researchRows 白名单，实际列见导出首行。默认排除原始叙述；逐题分析需按获准范围导出带文本 JSON，CSV 不展开全部响应。学习备份不是匿名研究数据。

不要事后删掉退出和低分病例。预先确定首次、重练、退出、自测及联网使用的分析规则。学员是主要分析单位，多轮数据需考虑学员内聚类；多个轮次不等于多个独立样本。不同模块不得直接平均成能力分，版本变化后须评估能否合并。
