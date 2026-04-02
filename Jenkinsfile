pipeline {
  agent any

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
        sh 'mkdir -p smart-report'
        sh 'npx playwright test'
      }
    }

    stage('Generate Allure Report') {
      when {
        expression { fileExists('allure-results') }
      }
      steps {
        sh 'npx allure generate allure-results --clean -o allure-report'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'smart-report/**', fingerprint: true, allowEmptyArchive: true
      archiveArtifacts artifacts: 'allure-results/**', fingerprint: true, allowEmptyArchive: true
      archiveArtifacts artifacts: 'allure-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}

