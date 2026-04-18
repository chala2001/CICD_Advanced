pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/chala2001/CICD_Advanced.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('Personal_Web/backend') {
                    sh 'docker build -t personal-backend .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('Personal_Web/frontend') {
                    sh 'docker build -t personal-frontend .'
                }
            }
        }

    }
}
