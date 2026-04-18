pipeline {
    agent any

    stages {

        stage('Build Backend Image') {
            steps {
                dir('Personal_Web/backend') {
                    sh 'docker build -t personal-backend:latest .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('Personal_Web/frontend') {
                    sh 'docker build -t personal-frontend:latest .'
                }
            }
        }

    }
}
