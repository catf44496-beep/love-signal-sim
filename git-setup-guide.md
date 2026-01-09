# Git 上传项目指南

## 第一步：安装 Git（如果还没安装）

1. 访问 https://git-scm.com/download/win 下载 Git for Windows
2. 安装时选择默认选项即可
3. 安装完成后，重启终端

## 第二步：检查 Git 安装

打开 PowerShell 或 CMD，运行：
```bash
git --version
```

## 第三步：配置 Git（首次使用需要）

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

## 第四步：在项目中初始化 Git 仓库

在项目目录下运行：
```bash
cd C:\Users\windfun\love-signal-sim
git init
```

## 第五步：添加文件到 Git

```bash
git add .
```

## 第六步：提交代码

```bash
git commit -m "Initial commit: love-signal-sim project"
```

## 第七步：在 GitHub/Gitee 等平台创建仓库

### GitHub 方式：
1. 访问 https://github.com 并登录
2. 点击右上角 "+" 号，选择 "New repository"
3. 输入仓库名称（例如：love-signal-sim）
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

### Gitee 方式（国内推荐，速度更快）：
1. 访问 https://gitee.com 并登录
2. 点击右上角 "+" 号，选择 "新建仓库"
3. 输入仓库名称（例如：love-signal-sim）
4. **不要**勾选 "使用 Readme 文件初始化这个仓库"
5. 点击 "创建"

## 第八步：连接到远程仓库并推送

创建仓库后，平台会显示命令，类似这样：

### GitHub:
```bash
git remote add origin https://github.com/你的用户名/love-signal-sim.git
git branch -M main
git push -u origin main
```

### Gitee:
```bash
git remote add origin https://gitee.com/你的用户名/love-signal-sim.git
git branch -M main
git push -u origin main
```

## 后续更新代码

当你修改代码后，使用以下命令更新到 Git：

```bash
git add .
git commit -m "描述你的修改内容"
git push
```

## 常见问题

### 如果 push 时要求输入用户名和密码：
- GitHub: 需要使用 Personal Access Token 代替密码
  - 设置路径：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Gitee: 可以直接使用账号密码，或设置 SSH 密钥

### 如果想使用 SSH 方式（推荐）：
1. 生成 SSH 密钥：`ssh-keygen -t rsa -C "你的邮箱"`
2. 将公钥添加到 GitHub/Gitee 账户的 SSH 密钥设置中
3. 使用 SSH 地址：`git@github.com:用户名/仓库名.git`
