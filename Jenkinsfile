pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Installing NPM. Code Formatting & Client Unit test') {
            steps {
                script {
                    try {
                        sh 'npm install'
                    } catch (Exception e) {
                        error "Npm tests & code formatting failed : $e"
                    }
                }
            }
        }
    }
}
