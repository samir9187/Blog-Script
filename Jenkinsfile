pipeline {
    agent any

    environment {
        // DOCKERHUB_USER = 'samirkunwar9187'
        // DOCKERHUB_PASS = 'Samir9187@'
        CLIENT_IMAGE = 'samirkunwar9187/blog-script-client'
        SERVER_IMAGE = 'samirkunwar9187/blog-script-server'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${env.CLIENT_IMAGE}:latest", "./client")
                    docker.build("${env.SERVER_IMAGE}:latest", "./server")
                }
            }
        }
        stage('Test') {
            steps {
                sh 'docker run --rm ${env.SERVER_IMAGE}:latest npm test || true'
                sh 'docker run --rm ${env.CLIENT_IMAGE}:latest npm test || true'
            }
        }
        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials') {
                        docker.image("${env.CLIENT_IMAGE}:latest").push()
                        docker.image("${env.SERVER_IMAGE}:latest").push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
        stage('Deploy to AWS EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@ec2-15-206-91-105.ap-south-1.compute.amazonaws.com '
                            mkdir -p ~/blog-script &&
                            cd ~/blog-script &&
                            rm -rf client server docker-compose.yml
                        '
                        scp -o StrictHostKeyChecking=no -r client ubuntu@ec2-15-206-91-105.ap-south-1.compute.amazonaws.com:~/blog-script/
                        scp -o StrictHostKeyChecking=no -r server ubuntu@ec2-15-206-91-105.ap-south-1.compute.amazonaws.com:~/blog-script/
                        scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@ec2-15-206-91-105.ap-south-1.compute.amazonaws.com:~/blog-script/
                        ssh -o StrictHostKeyChecking=no ubuntu@ec2-15-206-91-105.ap-south-1.compute.amazonaws.com '
                            cd ~/blog-script &&
                            sudo docker-compose down &&
                            sudo docker-compose up -d --build
                        '
                    """
                }
            }
        }
    }
}