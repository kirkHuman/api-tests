pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.49.0-jammy'
      args '-u root:root'
    }
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci || npm install'
      }
    }

    stage('Run Playwright API tests') {
      steps {
        sh 'npx playwright install --with-deps'
        sh 'mkdir -p smart-report'
        sh 'npx playwright test'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'smart-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}

