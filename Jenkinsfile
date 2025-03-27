pipeline {
    agent any

    environment {
        NODE_VERSION = '20.x'
        ANDROID_SDK_ROOT = "/opt/android-sdk"
        BUILD_DIR = "android/app/build/outputs/apk/release"
        APP_NAME = "project08"
        FIREBASE_APP_ID = "1:1056209811373:android:fb3140b3b9f70096ea9324"
        EC2_IP = "13.202.85.195"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/patildinu/react-native.git'
            }
        }

        stage('Set Up Node.js') {
            steps {
                sh '''
                    echo "Setting up Node.js..."
                    nvm install $NODE_VERSION
                    nvm use $NODE_VERSION
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm install
                '''
            }
        }

        stage('Build Android APK') {
            steps {
                sh '''
                    echo "Building Android APK..."
                    cd android
                    chmod +x gradlew
                    ./gradlew assembleRelease
                '''
            }
        }

        stage('Upload APK to Firebase') {
            steps {
                withCredentials([file(credentialsId: 'FIREBASE_CREDENTIALS', variable: 'FIREBASE_KEY')]) {
                    sh '''
                        echo "Authenticating Firebase CLI..."
                        export GOOGLE_APPLICATION_CREDENTIALS=$FIREBASE_KEY
                        firebase appdistribution:distribute $BUILD_DIR/app-release.apk \
                            --app $FIREBASE_APP_ID \
                            --groups testers \
                            --release-notes "New build from Jenkins"
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'EC2_SSH_KEY', keyFileVariable: 'SSH_KEY_PATH', usernameVariable: 'EC2_USER')]) {
                    sh '''
                        echo "Deploying APK to EC2..."
                        scp -o StrictHostKeyChecking=no -i ${SSH_KEY_PATH} $BUILD_DIR/app-release.apk ${EC2_USER}@${EC2_IP}:/var/www/html/
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Build and deployment successful!"
        }
        failure {
            echo "Build failed. Check the logs for errors."
        }
    }
}
