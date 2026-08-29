<div align="center">

# 🔧 Installing Jenkins: Master-Agent CI/CD Setup

![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Java](https://img.shields.io/badge/OpenJDK_11-437291?style=for-the-badge&logo=openjdk&logoColor=white)
![SSH](https://img.shields.io/badge/SSH-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Bash](https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Level](https://img.shields.io/badge/Level-Intermediate-orange?style=for-the-badge)

*A hands-on lab for installing Jenkins and configuring a simulated master-agent distributed build architecture*

</div>

---

## 📚 Table of Contents

- [📋 Lab Objectives](#-lab-objectives)
- [✅ Prerequisites](#-prerequisites)
- [🖥️ Lab Environment](#️-lab-environment)
- [🚀 Task 1: Install Jenkins Master Node](#-task-1-install-jenkins-master-node)
- [🤖 Task 2: Set Up Jenkins Agent Node](#-task-2-set-up-jenkins-agent-node)
- [🔎 Task 3: Verify Distributed Build Setup](#-task-3-verify-distributed-build-setup)
- [🔑 Key Concepts](#-key-concepts)
- [🛠️ Troubleshooting Common Issues](#️-troubleshooting-common-issues)
- [🎯 Conclusion](#-conclusion)

---

## 📋 Lab Objectives

By the end of this lab, you will be able to:

| # | Objective |
|---|-----------|
| 1 | Install Jenkins on a Linux machine using package management |
| 2 | Configure Jenkins initial setup and security settings |
| 3 | Set up a Jenkins master node for distributed builds |
| 4 | Create and configure a Jenkins agent node on the same machine |
| 5 | Establish communication between master and agent nodes |
| 6 | Verify the distributed build setup is working correctly |

---

## ✅ Prerequisites

Before starting this lab, you should have:

| Requirement | Details |
|-------------|---------|
| Linux command line | Basic understanding of Linux command line operations |
| Package management | Familiarity with package management concepts |
| Networking | Basic knowledge of networking concepts (ports, localhost) |
| User management | Understanding of user management in Linux |
| Jenkins experience | Not required — this lab guides you through everything |

---

## 🖥️ Lab Environment

> Al Nafi provides a ready-to-use Linux-based cloud machine. Simply click **Start Lab** to access your environment. The machine is bare metal with no pre-installed tools — you will install all required software during this lab.
>
> **Important Note:** All tasks in this lab are performed on a single Linux machine. A distributed environment is simulated by running both the Jenkins master and the Jenkins agent on the same system using different ports and user contexts.

---

## 🚀 Task 1: Install Jenkins Master Node

### 🧩 Subtask 1.1: Update System and Install Prerequisites

Ensure your system is up to date and install the necessary prerequisites.

```bash
# 📦 Update package repository
sudo apt update

# ☕ Install Java 11 (required for Jenkins)
sudo apt install -y openjdk-11-jdk

# 🔍 Verify Java installation
java -version
```

You should see output similar to:

```
openjdk version "11.0.x" 2023-xx-xx
OpenJDK Runtime Environment (build 11.0.x+x-Ubuntu-xubuntux.xx.x)
OpenJDK 64-Bit Server VM (build 11.0.x+x-Ubuntu-xubuntux.xx.x, mixed mode, sharing)
```

### 🧩 Subtask 1.2: Add Jenkins Repository and Install Jenkins

Add the official Jenkins repository and install Jenkins.

```bash
# 🔑 Add Jenkins repository key
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# 📝 Add Jenkins repository to sources list
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# 📦 Update package repository again
sudo apt update

# ⚙️ Install Jenkins
sudo apt install -y jenkins
```

### 🧩 Subtask 1.3: Start and Enable Jenkins Service

Start Jenkins and ensure it starts automatically on system boot.

```bash
# ▶️ Start Jenkins service
sudo systemctl start jenkins

# 🔁 Enable Jenkins to start on boot
sudo systemctl enable jenkins

# 📊 Check Jenkins service status
sudo systemctl status jenkins
```

You should see output indicating that Jenkins is `active (running)`.

### 🧩 Subtask 1.4: Configure Firewall (if needed)

If your system has a firewall enabled, allow traffic on port 8080.

```bash
# 🔥 Check if ufw is active
sudo ufw status

# 🚪 If ufw is active, allow port 8080
sudo ufw allow 8080

# ✅ Verify the rule was added
sudo ufw status
```

### 🧩 Subtask 1.5: Access Jenkins Web Interface

Jenkins runs on port 8080 by default. Let's verify it's accessible.

```bash
# 🌐 Check if Jenkins is listening on port 8080
sudo netstat -tlnp | grep :8080
```

You should see output showing Jenkins listening on port 8080.

Since we're working on a single machine, you can access Jenkins at:

```
http://localhost:8080   # (if you have a GUI browser)
```

We'll continue with command-line setup for this lab.

### 🧩 Subtask 1.6: Retrieve Initial Admin Password

Jenkins requires an initial admin password for first-time setup.

```bash
# 🔐 Get the initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

> **Important:** Copy this password — you'll need it for the web setup. The password will look something like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### 🧩 Subtask 1.7: Complete Initial Jenkins Setup via Command Line

For this lab, configure Jenkins using its configuration files directly, to avoid GUI dependency.

```bash
# 📁 Create a temporary admin user configuration
sudo mkdir -p /var/lib/jenkins/users/admin

# 📝 Create admin user config
sudo tee /var/lib/jenkins/users/admin/config.xml > /dev/null << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<user>
  <fullName>Administrator</fullName>
  <properties>
    <jenkins.security.ApiTokenProperty>
      <apiToken>
        <name>default</name>
        <value>11e8d0e0123456789abcdef0123456789a</value>
      </apiToken>
    </jenkins.security.ApiTokenProperty>
    <hudson.security.HudsonPrivateSecurityRealm_-Details>
      <passwordHash>#jbcrypt:$2a$10$DdaS0K14D1AeiVjwLBjjzuoebon1XFokXkqn8Z8NG.pOENxqDubLu</passwordHash>
    </hudson.security.HudsonPrivateSecurityRealm_-Details>
  </properties>
</user>
EOF

# 👤 Set proper ownership
sudo chown -R jenkins:jenkins /var/lib/jenkins/users/

# 🔄 Restart Jenkins to apply changes
sudo systemctl restart jenkins

# ⏳ Wait for Jenkins to start
sleep 30
```

> The password hash above corresponds to the password: `admin123`

---

## 🤖 Task 2: Set Up Jenkins Agent Node

### 🧩 Subtask 2.1: Create Jenkins Agent User

Create a separate user to run the Jenkins agent, simulating a distributed environment.

```bash
# 👤 Create jenkins-agent user
sudo useradd -m -s /bin/bash jenkins-agent

# 🔑 Set password for jenkins-agent user
echo 'jenkins-agent:agent123' | sudo chpasswd

# 📁 Create SSH directory for jenkins-agent
sudo mkdir -p /home/jenkins-agent/.ssh
sudo chown jenkins-agent:jenkins-agent /home/jenkins-agent/.ssh
sudo chmod 700 /home/jenkins-agent/.ssh
```

### 🧩 Subtask 2.2: Set Up SSH Key Authentication

Set up SSH key authentication between the Jenkins master and the agent.

```bash
# 🔑 Generate SSH key pair for jenkins user
sudo -u jenkins ssh-keygen -t rsa -b 4096 -f /var/lib/jenkins/.ssh/id_rsa -N ""

# 📋 Copy public key to jenkins-agent user
sudo cp /var/lib/jenkins/.ssh/id_rsa.pub /home/jenkins-agent/.ssh/authorized_keys

# 🔒 Set proper permissions
sudo chown jenkins-agent:jenkins-agent /home/jenkins-agent/.ssh/authorized_keys
sudo chmod 600 /home/jenkins-agent/.ssh/authorized_keys

# 🔒 Set proper ownership for jenkins SSH directory
sudo chown -R jenkins:jenkins /var/lib/jenkins/.ssh
sudo chmod 700 /var/lib/jenkins/.ssh
sudo chmod 600 /var/lib/jenkins/.ssh/id_rsa
```

### 🧩 Subtask 2.3: Test SSH Connection

Verify that the Jenkins master can connect to the agent via SSH.

```bash
# 🔌 Test SSH connection from jenkins user to jenkins-agent user
sudo -u jenkins ssh -o StrictHostKeyChecking=no jenkins-agent@localhost "echo 'SSH connection successful'"
```

You should see the message: `SSH connection successful`

### 🧩 Subtask 2.4: Create Agent Working Directory

Create a working directory for the Jenkins agent.

```bash
# 📁 Create agent working directory
sudo mkdir -p /home/jenkins-agent/jenkins-agent
sudo chown jenkins-agent:jenkins-agent /home/jenkins-agent/jenkins-agent

# ☕ Install Java for the agent (if not already available)
# The agent needs Java to run
sudo -u jenkins-agent mkdir -p /home/jenkins-agent/tools
```

### 🧩 Subtask 2.5: Download Jenkins Agent JAR

Download the Jenkins agent JAR file used to connect the agent to the master.

```bash
# ⬇️ Download agent.jar from Jenkins master
sudo -u jenkins-agent wget http://localhost:8080/jnlpJars/agent.jar -O /home/jenkins-agent/agent.jar

# ⚙️ Make it executable
sudo chmod +x /home/jenkins-agent/agent.jar
```

### 🧩 Subtask 2.6: Configure Jenkins Master for Agent Connection

Configure the Jenkins master to accept the agent connection by creating the necessary configuration files.

```bash
# 📁 Create nodes directory
sudo mkdir -p /var/lib/jenkins/nodes/agent-1

# 📝 Create agent node configuration
sudo tee /var/lib/jenkins/nodes/agent-1/config.xml > /dev/null << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<slave>
  <name>agent-1</name>
  <description>Jenkins Agent Node 1</description>
  <remoteFS>/home/jenkins-agent/jenkins-agent</remoteFS>
  <numExecutors>2</numExecutors>
  <mode>NORMAL</mode>
  <retentionStrategy class="hudson.slaves.RetentionStrategy$Always"/>
  <launcher class="hudson.plugins.sshslaves.SSHLauncher" plugin="ssh-slaves@1.31.2">
    <host>localhost</host>
    <port>22</port>
    <credentialsId>jenkins-agent-key</credentialsId>
    <launchTimeoutSeconds>60</launchTimeoutSeconds>
    <maxNumRetries>10</maxNumRetries>
    <retryWaitTime>15</retryWaitTime>
    <sshHostKeyVerificationStrategy class="hudson.plugins.sshslaves.verifiers.NonVerifyingKeyVerificationStrategy"/>
  </launcher>
  <label>linux agent-1</label>
  <nodeProperties/>
</slave>
EOF

# 👤 Set proper ownership
sudo chown -R jenkins:jenkins /var/lib/jenkins/nodes/

# 🔄 Restart Jenkins to recognize the new node
sudo systemctl restart jenkins

# ⏳ Wait for Jenkins to start
sleep 30
```

### 🧩 Subtask 2.7: Install Required Jenkins Plugins

Install the SSH Slaves plugin to enable SSH-based agent connections.

```bash
# 📁 Create plugins directory if it doesn't exist
sudo mkdir -p /var/lib/jenkins/plugins

# ⬇️ Download SSH Slaves plugin
cd /tmp
wget https://updates.jenkins.io/download/plugins/ssh-slaves/1.31.2/ssh-slaves.hpi
sudo mv ssh-slaves.hpi /var/lib/jenkins/plugins/

# ⬇️ Download dependencies
wget https://updates.jenkins.io/download/plugins/ssh-credentials/1.18.1/ssh-credentials.hpi
sudo mv ssh-credentials.hpi /var/lib/jenkins/plugins/

wget https://updates.jenkins.io/download/plugins/credentials/2.6.1/credentials.hpi
sudo mv credentials.hpi /var/lib/jenkins/plugins/

# 👤 Set proper ownership
sudo chown jenkins:jenkins /var/lib/jenkins/plugins/*.hpi

# 🔄 Restart Jenkins to load plugins
sudo systemctl restart jenkins
sleep 30
```

### 🧩 Subtask 2.8: Create SSH Credentials for Agent

Create SSH credentials that Jenkins can use to connect to the agent.

```bash
# 📁 Create credentials directory
sudo mkdir -p /var/lib/jenkins/credentials

# 📝 Create SSH credential configuration
sudo tee /var/lib/jenkins/credentials.xml > /dev/null << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<com.cloudbees.plugins.credentials.SystemCredentialsProvider plugin="credentials@2.6.1">
  <domainCredentialsMap class="hudson.util.CopyOnWriteMap$Hash">
    <entry>
      <com.cloudbees.plugins.credentials.domains.Domain>
        <specifications/>
      </com.cloudbees.plugins.credentials.domains.Domain>
      <java.util.concurrent.CopyOnWriteArrayList>
        <com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey plugin="ssh-credentials@1.18.1">
          <scope>GLOBAL</scope>
          <id>jenkins-agent-key</id>
          <description>SSH key for Jenkins agent</description>
          <username>jenkins-agent</username>
          <privateKeySource class="com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey$DirectEntryPrivateKeySource">
            <privateKey>$(sudo cat /var/lib/jenkins/.ssh/id_rsa)</privateKey>
          </privateKeySource>
        </com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey>
      </java.util.concurrent.CopyOnWriteArrayList>
    </entry>
  </domainCredentialsMap>
</com.cloudbees.plugins.credentials.SystemCredentialsProvider>
EOF

# 👤 Set proper ownership
sudo chown jenkins:jenkins /var/lib/jenkins/credentials.xml

# 🔄 Restart Jenkins
sudo systemctl restart jenkins
sleep 30
```

---

## 🔎 Task 3: Verify Distributed Build Setup

### 🧩 Subtask 3.1: Check Jenkins Master Status

Verify that Jenkins master is running properly and can see the configured agent.

```bash
# 📊 Check Jenkins service status
sudo systemctl status jenkins

# 📜 Check Jenkins logs for any errors
sudo tail -f /var/log/jenkins/jenkins.log &
sleep 5
pkill tail

# 🌐 Verify Jenkins is listening on port 8080
sudo netstat -tlnp | grep :8080
```

### 🧩 Subtask 3.2: Check Agent Connection

Verify that the agent can connect to the master.

```bash
# 📁 Check if agent directory exists and has proper permissions
ls -la /home/jenkins-agent/jenkins-agent/

# 🔌 Test manual agent connection (this will run in background)
sudo -u jenkins-agent java -jar /home/jenkins-agent/agent.jar -jnlpUrl http://localhost:8080/computer/agent-1/slave-agent.jnlp &

# ⏳ Wait a moment for connection attempt
sleep 10

# 🔍 Check if agent process is running
ps aux | grep agent.jar
```

### 🧩 Subtask 3.3: Create a Simple Test Job

Create a simple test job to verify the distributed setup works.

```bash
# 📁 Create jobs directory
sudo mkdir -p /var/lib/jenkins/jobs/test-distributed-build

# 📝 Create a simple test job configuration
sudo tee /var/lib/jenkins/jobs/test-distributed-build/config.xml > /dev/null << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<project>
  <actions/>
  <description>Test job for distributed build setup</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <scm class="hudson.scm.NullSCM"/>
  <assignedNode>agent-1</assignedNode>
  <canRoam>false</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers/>
  <concurrentBuild>false</concurrentBuild>
  <builders>
    <hudson.tasks.Shell>
      <command>
echo "=== Distributed Build Test ==="
echo "Running on node: $(hostname)"
echo "Current user: $(whoami)"
echo "Working directory: $(pwd)"
echo "Java version:"
java -version
echo "=== Test completed successfully ==="
      </command>
    </hudson.tasks.Shell>
  </builders>
  <publishers/>
  <buildWrappers/>
</project>
EOF

# 👤 Set proper ownership
sudo chown -R jenkins:jenkins /var/lib/jenkins/jobs/

# 🔄 Restart Jenkins to recognize the new job
sudo systemctl restart jenkins
sleep 30
```

### 🧩 Subtask 3.4: Verify Installation Summary

Create a summary script of what has been installed and configured.

```bash
# 📝 Create verification script
cat > /tmp/jenkins_verification.sh << 'EOF'
#!/bin/bash

echo "=== Jenkins Installation Verification ==="
echo

echo "1. Jenkins Master Status:"
sudo systemctl is-active jenkins
echo

echo "2. Jenkins Master Port:"
sudo netstat -tlnp | grep :8080 | head -1
echo

echo "3. Jenkins Version:"
java -jar /var/lib/jenkins/war/WEB-INF/jenkins-cli.jar -s http://localhost:8080/ version 2>/dev/null || echo "CLI not accessible (normal for new installation)"
echo

echo "4. Jenkins Users:"
ls -la /var/lib/jenkins/users/ 2>/dev/null || echo "Users directory not found"
echo

echo "5. Jenkins Agent User:"
id jenkins-agent 2>/dev/null || echo "Agent user not found"
echo

echo "6. SSH Key Setup:"
ls -la /var/lib/jenkins/.ssh/ 2>/dev/null || echo "SSH keys not found"
echo

echo "7. Agent Configuration:"
ls -la /var/lib/jenkins/nodes/ 2>/dev/null || echo "No agents configured"
echo

echo "8. Test Job:"
ls -la /var/lib/jenkins/jobs/ 2>/dev/null || echo "No jobs found"
echo

echo "9. Jenkins Plugins:"
ls -la /var/lib/jenkins/plugins/*.hpi 2>/dev/null | wc -l
echo

echo "10. Jenkins Logs (last 5 lines):"
sudo tail -5 /var/log/jenkins/jenkins.log 2>/dev/null || echo "Log file not accessible"
echo

echo "=== Verification Complete ==="
EOF

# ⚙️ Make script executable and run it
chmod +x /tmp/jenkins_verification.sh
/tmp/jenkins_verification.sh
```

### 🧩 Subtask 3.5: Access Information Summary

Generate a summary of how to access and use the Jenkins installation.

```bash
# 📝 Create access information file
cat > /tmp/jenkins_access_info.txt << 'EOF'
=== Jenkins Access Information ===

Jenkins Master:
- URL: http://localhost:8080
- Admin Username: admin
- Admin Password: admin123
- Service Status: sudo systemctl status jenkins
- Logs: sudo tail -f /var/log/jenkins/jenkins.log

Jenkins Agent:
- User: jenkins-agent
- Password: agent123
- Working Directory: /home/jenkins-agent/jenkins-agent
- Agent JAR: /home/jenkins-agent/agent.jar

Key Directories:
- Jenkins Home: /var/lib/jenkins
- Jenkins Logs: /var/log/jenkins
- Agent Home: /home/jenkins-agent

Useful Commands:
- Start Jenkins: sudo systemctl start jenkins
- Stop Jenkins: sudo systemctl stop jenkins
- Restart Jenkins: sudo systemctl restart jenkins
- Check Status: sudo systemctl status jenkins

Test Job:
- Name: test-distributed-build
- Assigned to: agent-1
- Purpose: Verify distributed build setup

Next Steps:
1. Access Jenkins web interface at http://localhost:8080
2. Login with admin/admin123
3. Navigate to "Manage Jenkins" > "Manage Nodes"
4. Verify agent-1 is connected
5. Run the test-distributed-build job
EOF

# 📄 Display the access information
cat /tmp/jenkins_access_info.txt
```

---

## 🔑 Key Concepts

| Concept | Description |
|---------|--------------|
| **Jenkins Master** | The central Jenkins server that orchestrates jobs, stores configuration, and schedules builds |
| **Jenkins Agent (Slave)** | A separate node/process that executes build work assigned by the master, enabling distributed builds |
| **SSH Launcher** | A Jenkins launch method that connects to agents over SSH using stored credentials |
| **JNLP Agent Connection** | An alternative agent connection method using a downloadable `agent.jar` and a JNLP URL |
| **Executors** | The number of concurrent build slots (`numExecutors`) an agent can run |
| **Node Label** | A tag assigned to an agent used to target jobs at specific nodes (`assignedNode`) |
| **Credentials Store** | Jenkins' mechanism (`credentials.xml`) for securely referencing SSH keys and secrets used by launchers |
| **Config-as-Code (XML)** | Directly editing Jenkins' underlying `config.xml` files to provision users, nodes, and jobs without the web UI |

---

## 🛠️ Troubleshooting Common Issues

<details>
<summary><strong>Issue 1: Jenkins Service Won't Start</strong></summary>

```bash
# 📊 Check Jenkins service status
sudo systemctl status jenkins

# 📜 Check Jenkins logs
sudo journalctl -u jenkins -f

# ☕ Common fix: Check Java installation
java -version

# 🔄 Restart Jenkins
sudo systemctl restart jenkins
```

</details>

<details>
<summary><strong>Issue 2: Agent Cannot Connect</strong></summary>

```bash
# 🔌 Check SSH connection manually
sudo -u jenkins ssh jenkins-agent@localhost

# 📜 Check agent logs
sudo -u jenkins-agent tail -f /home/jenkins-agent/jenkins-agent/remoting/logs/remoting.log

# 🔒 Verify SSH key permissions
ls -la /var/lib/jenkins/.ssh/
ls -la /home/jenkins-agent/.ssh/
```

</details>

<details>
<summary><strong>Issue 3: Port 8080 Already in Use</strong></summary>

```bash
# 🔍 Check what's using port 8080
sudo lsof -i :8080

# 🔧 Change Jenkins port (edit /etc/default/jenkins)
sudo sed -i 's/HTTP_PORT=8080/HTTP_PORT=8081/' /etc/default/jenkins
sudo systemctl restart jenkins
```

</details>

---

## 🎯 Conclusion

Congratulations! You have successfully completed the **Installing Jenkins** lab.

### ✅ Key Accomplishments

- Installed a Jenkins master node on a Linux system using package management
- Configured Jenkins initial setup with an admin user and security settings
- Created and configured a Jenkins agent node on the same machine
- Set up SSH-based communication between master and agent nodes
- Installed the necessary Jenkins plugins for distributed builds
- Created a test job to verify the distributed build setup
- Learned troubleshooting techniques for common Jenkins issues

### 💡 Why This Matters

This distributed Jenkins setup is fundamental for modern CI/CD pipelines. By having separate master and agent nodes, you can achieve:

- **Scalability** — Add more agents as your build requirements grow
- **Isolation** — Keep build environments separate from the master
- **Resource Management** — Distribute build loads across multiple machines
- **Security** — Isolate build processes from the Jenkins master
- **Flexibility** — Run different types of builds on specialized agents

### 🌍 Real-World Applications

- **Enterprise CI/CD** — Large organizations use distributed Jenkins setups to handle hundreds of builds simultaneously
- **Multi-Platform Builds** — Different agents can run different operating systems for cross-platform development
- **Resource Optimization** — CPU-intensive builds can run on powerful agent machines while the master handles orchestration
- **Geographic Distribution** — Agents can be located closer to development teams or deployment targets

You now have a solid foundation for building more complex Jenkins pipelines and can expand this setup by adding more agents, configuring different build environments, and implementing advanced CI/CD workflows. The skills gained in this lab are directly applicable to real-world DevOps scenarios and form the basis for more advanced Jenkins configurations and automation strategies.

---

<div align="center">

![Al Nafi](https://img.shields.io/badge/Al%20Nafi-Cybersecurity%20Training-blue?style=for-the-badge)

</div>
