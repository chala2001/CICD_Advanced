pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'chalasamijaya'
        KUBECONFIG = '/var/jenkins_home/.kube/config'
    }

    stages {

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('Personal_Web/backend') {
                    sh 'docker build -t $DOCKERHUB_USERNAME/personal-backend:latest .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('Personal_Web/frontend') {
                    sh 'docker build -t $DOCKERHUB_USERNAME/personal-frontend:latest .'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $DOCKERHUB_USERNAME/personal-backend:latest
                docker push $DOCKERHUB_USERNAME/personal-frontend:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/

                kubectl rollout restart deployment backend
                kubectl rollout restart deployment frontend
                '''
            }
        }

    }
}
