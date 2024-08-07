pipeline {
    agent any
  
    tools {nodejs "nodejsv22.3.0"}

    
    environment {
        NODE_ENV = 'production' // Set NODE_ENV to appropriate value (e.g., 'production' for production.)
        APP_ENV = 'Dev' // Example of a custom environment variable for Dev awsMicro
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    def gitCreds = [
                        [$class: 'UsernamePasswordMultiBinding', credentialsId: 'github-token', usernameVariable: 'DevGreensturn', passwordVariable: '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']
                    ]
                    withCredentials(gitCreds) {
                        sh 'git config --global url."https://${DevGreensturn}:${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}@github.com/".insteadOf "https://github.com/"'
                        checkout([$class: 'GitSCM', branches: [[name: 'main']], userRemoteConfigs: [[url: 'https://github.com/DevGreensturn/aws-microservices.git']]])
                    }
                }
            }
        }
        
        stage('Install dependencies') {
            steps {
                // Install Next.js dependencies and fixed vulnerability
                sh ' npm install'
                sh ' npm i'
                sh 'npm audit fix'
            }
        }
   
        stage('Deploy Locally') {
            steps {
                // Install PM2 globally and deploy the application
                sh 'npm install pm2 -g' // Install PM2 globally if not already installed
                script {
                    try {
                        sh 'pm2 start npm --name awsMicro -- run start -- -p 3003' // Start the app
                        sh 'pm2 save'
                        sh 'pm2 restart awsMicro'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Local deployment failed: ${e.message}"
                    }
                }
            }
        }
    
    stage('Deploy to Dev Server') {
            steps {
                    sh """
                    la -al
                    scp -r ./* ./.??* ubuntu@35.154.130.173:/home/ubuntu/aws-microservices/
                    ssh ubuntu@35.154.130.173 -C "
                    source ~/.nvm/nvm.sh && \
                    nvm use node && \
                    cd /home/ubuntu/aws-microservices/ && \
                    /home/ubuntu/.nvm/versions/node/v20.14.0/bin/pm2 start awsMicro || true && \
                    /home/ubuntu/.nvm/versions/node/v20.14.0/bin/pm2 restart awsMicro
                     "
                    """
                    }
                }
            }

    post {
        success {
            // Notification on success (optional)
            echo 'Deployment successful!'
        }
        failure {
            // Send email notification on failure
            emailext (
                subject: "Failed: Deployment of UAT of Aws",
                body: "Deployment of Aws Dev failed. Please check Jenkins for details.",
                to: "dev1@greensturn.com, pradeep@greensturn.com, pragya@greensturn.com, prachi@greensturn.com, nikita@greensturn.com, shashi@greensturn.com, ", // List of email recipients
            )
        }
    }
}
