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
                        error "Npm modules installation failed : $e"
                    }
                }
                script {
                    sh 'node --version'
                }
                script {
                    try {
                        sh 'CHECK=true node ./scripts/codeformatcheck.js'
                    } catch (Exception e) {
                        error "Detected files that have not been code formatted. Run  `npm run cf` to resolve: $e"
                    }
                }
                script {
                    try {
                        sh 'npm run test'
                    } catch (Exception e) {
                        error "Running NPM unit tests failed: $e"
                    }
                }
            }
        }
    }
}
