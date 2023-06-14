pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Code Formatting & Client Unit test') { 
            steps {
                sh 'npm install' 
            }
        }
    }
}
