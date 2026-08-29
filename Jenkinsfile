pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        APP_NAME = 'jenkins-demo-app'
        BUILD_NUMBER_ENV = "${BUILD_NUMBER}"
        DEPLOY_ENV = 'staging'
    }
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['staging', 'production'],
            description: 'Select deployment environment'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                sh 'ls -la'
                sh 'echo "Building for environment: ${ENVIRONMENT}"'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm install'
                sh 'echo "Build completed for ${APP_NAME}"'
            }
        }
        
        stage('Test') {
            when {
                not { params.SKIP_TESTS }
            }
            steps {
                echo 'Running tests...'
                script {
                    sh 'nohup npm start > app.log 2>&1 &'
                    sh 'sleep 5'
                    sh 'npm test'
                    sh 'pkill -f "node app.js" || true'
                }
            }
            post {
                always {
                    sh 'pkill -f "node app.js" || true'
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                expression { params.ENVIRONMENT == 'staging' }
            }
            steps {
                echo 'Deploying to staging environment...'
                sh 'mkdir -p /tmp/staging-deployment'
                sh 'cp -r * /tmp/staging-deployment/ || true'
                sh 'echo "Deployed to staging"'
            }
        }
        
        stage('Deploy to Production') {
            when {
                expression { params.ENVIRONMENT == 'production' }
            }
            steps {
                echo 'Deploying to production environment...'
                sh 'mkdir -p /tmp/production-deployment'
                sh 'cp -r * /tmp/production-deployment/ || true'
                sh 'echo "Deployed to production"'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed!'
            sh 'echo "Build: ${BUILD_NUMBER_ENV}, Environment: ${ENVIRONMENT}"'
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}
