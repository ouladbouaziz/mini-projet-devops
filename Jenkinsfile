pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ouladbouaziz/mini-projet-devops.git'
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t mini-projet-backend ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t mini-projet-frontend ./frontend'
            }
        }
    }
}