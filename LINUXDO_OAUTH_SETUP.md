# LinuxDo OAuth2 集成设置指南

本指南将帮助您为 Pingvin Share 配置 LinuxDo OAuth2 认证。

## 实现的功能

✅ 后端 LinuxDo OAuth2 提供商
✅ 前端图标支持（使用 Linux 图标）
✅ 中英文国际化支持
✅ 管理员配置界面支持

## 设置步骤

### 1. 在 LinuxDo 创建 OAuth 应用

1. 访问 LinuxDo 开发者设置页面：`https://connect.linux.do/dash/sso`
2. 申请新接入
3. 设置回调 URL：`https://your-domain.com/api/oauth/callback/linuxdo`
4. 获取 Client ID 和 Client Secret

### 2. 配置 Pingvin Share

在管理员配置页面（`/admin/config`）的"社交登录"部分：

1. **启用 LinuxDo**：勾选启用选项
2. **LinuxDo Client ID**：输入从 LinuxDo 获取的 Client ID
3. **LinuxDo Client Secret**：输入从 LinuxDo 获取的 Client Secret

### 3. 测试登录

配置完成后，用户可以在登录页面看到 LinuxDo 登录选项，点击即可使用 LinuxDo 账户登录。

## 技术实现详情

### 后端修改

1. **配置文件** (`backend/prisma/seed/config.seed.ts`)
   - 添加了 `linuxdo-enabled`、`linuxdo-clientId`、`linuxdo-clientSecret` 配置项

2. **LinuxDo 提供商** (`backend/src/oauth/provider/linuxdo.provider.ts`)
   - 实现了 LinuxDo OAuth2 认证流程
   - 使用 LinuxDo API 端点：
     - 授权：`https://connect.linux.do/oauth2/authorize`
     - 令牌：`https://connect.linux.do/oauth2/token`
     - 用户信息：`https://connect.linux.do/api/user`

3. **OAuth 模块注册** (`backend/src/oauth/oauth.module.ts`)
   - 将 LinuxDoProvider 注册到 OAuth 模块

4. **DTO 更新** (`backend/src/oauth/dto/oauthSignIn.dto.ts`)
   - 在支持的提供商列表中添加了 "linuxdo"

### 前端修改

1. **图标支持** (`frontend/src/utils/oauth.util.tsx`)
   - 为 LinuxDo 添加了 Linux 图标

2. **国际化支持**
   - 英文 (`frontend/src/i18n/translations/en-US.ts`)
   - 中文 (`frontend/src/i18n/translations/zh-CN.ts`)
   - 添加了登录按钮、账户关联、管理配置等相关文本

## OAuth2 流程

1. 用户点击"使用 LinuxDo 登录"
2. 重定向到 LinuxDo 授权页面
3. 用户授权后返回到 Pingvin Share
4. 后端使用授权码获取访问令牌
5. 使用访问令牌获取用户信息
6. 创建或关联用户账户

## API 端点

- **认证启动**：`GET /api/oauth/auth/linuxdo`
- **回调处理**：`GET /api/oauth/callback/linuxdo`
- **账户解绑**：`POST /api/oauth/unlink/linuxdo`

## 配置示例

```yaml
oauth:
  linuxdo-enabled: "true"
  linuxdo-clientId: "your_client_id_here"
  linuxdo-clientSecret: "your_client_secret_here"
```

## 注意事项

- 确保回调 URL 与 LinuxDo 应用配置中的完全一致
- LinuxDo OAuth 应用需要有读取用户基本信息的权限
- 用户的 LinuxDo 账户必须有验证的邮箱地址 