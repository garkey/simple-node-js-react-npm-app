pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Installing NPM. Code Formatting & Client Unit test') { 
          try{
            steps {
                sh 'npm install' 
            }
          }catch (Exception e) {
            error "Npm tests & code formatting failed : $e"
          }

          try{
            steps {
                sh 'prettier --check ./src' 
            }
          }catch (Exception e) {
            error "Npm tests & code formatting failed : $e"
          }
        }
    }
}
