pipeline {
    agent any

    parameters {
        string(name: 'REPO_URL', defaultValue: 'https://github.com/williamromero-web/devsecops_GuanteraFront.git', description: 'URL de tu repositorio')
        string(name: 'GIT_CREDENTIALS', defaultValue: 'github-token', description: 'ID de la credencial en Jenkins')
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Rama a escanear')
    }

    environment {
        REPORT_DIR = "devsecops-reports-output"
        SONAR_HOST_URL_LOCAL = "http://sonarqube:9000"
        SONAR_TOKEN = credentials('sonar-token')
        NVD_API_KEY = credentials('NVD-API-Key')
    }

    stages {
        stage('🧹 Limpiar y Checkout Parametrizado') {
            steps {
                cleanWs()
                script {
                    echo "🚀 Iniciando escaneo para el repositorio: ${params.REPO_URL} (Rama: ${params.BRANCH_NAME})"
                    git branch: params.BRANCH_NAME, credentialsId: params.GIT_CREDENTIALS, url: params.REPO_URL
                    sh 'git fetch --prune --unshallow || true'
                }
                sh "mkdir -p ${REPORT_DIR}/sonarqube ${REPORT_DIR}/security ${REPORT_DIR}/dependency-check ${REPORT_DIR}/govulncheck"
                
                // 🛠️ Descargamos jq aquí para que todos los Quality Gates puedan analizar los JSON
                sh '''
                    echo "📥 Preparando jq para los Quality Gates..."
                    curl -sL -o jq https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux-amd64
                    chmod +x ./jq
                '''
            }
        }
        
        // --- 1. SEGURIDAD ESPECÍFICA DE GO (GOVULNCHECK) ---
        stage('🐹 Go Vulnerability Check') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh '''
                        # 1. Usar una versión de Go más moderna (1.22.0+) para compatibilidad
                        if [ ! -d "$HOME/go-env/go" ]; then
                            echo "📥 Instalando Go localmente..."
                            curl -sL -o go.tar.gz https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
                            mkdir -p $HOME/go-env
                            tar -C $HOME/go-env -xzf go.tar.gz
                            rm go.tar.gz
                        fi
                        
                        # 2. Configurar variables de entorno estrictas
                        export GOROOT=$HOME/go-env/go
                        export GOPATH=$HOME/go-workspace
                        export PATH=$GOROOT/bin:$GOPATH/bin:$PATH
                        
                        echo "📥 Instalando govulncheck..."
                        go install golang.org/x/vuln/cmd/govulncheck@latest
                        
                        # 3. Definir rutas de reporte
                        mkdir -p ./${REPORT_DIR}/govulncheck
                        ABS_REPORT_PATH="$(pwd)/${REPORT_DIR}/govulncheck/results.txt"
                        
                        echo "--- REPORTE DE VULNERABILIDADES GO ---" > "$ABS_REPORT_PATH"
                        
                        # 4. Buscador Universal
                        find . -name "go.mod" -not -path "*/vendor/*" | while read modfile; do
                            dir=$(dirname "$modfile")
                            echo "🔎 Analizando módulo en: $dir" | tee -a "$ABS_REPORT_PATH"
                            cd "$dir"
                            # Ejecutamos usando el binario recién instalado
                            govulncheck ./... >> "$ABS_REPORT_PATH" 2>&1 || true
                            cd - > /dev/null
                            echo "---------------------------------------" >> "$ABS_REPORT_PATH"
                        done
                        
                        echo "✅ Análisis de Go finalizado. Resultados en: ${ABS_REPORT_PATH}"
                    '''
                }
            }
        }

        // --- 2. SEGURIDAD DE INFRAESTRUCTURA (KICS) ---
        stage('🏗️ KICS Analysis') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh '''
                        echo "⚙️ Ejecutando KICS en contenedor totalmente aislado..."
                        # EXCLUSIÓN: devsecops y Jenkinsfile
                        CONTAINER_ID=$(docker create -w /workspace checkmarx/kics:latest scan \
                            -p /workspace/src \
                            --exclude-paths "/workspace/src/devsecops,/workspace/src/Jenkinsfile" \
                            -o /workspace/src/${REPORT_DIR}/security \
                            --output-name kics-report --report-formats html,json)
                        docker cp . $CONTAINER_ID:/workspace/src
                        docker start -a $CONTAINER_ID || true
                        docker cp $CONTAINER_ID:/workspace/src/${REPORT_DIR}/security/kics-report.html ./${REPORT_DIR}/security/ || true
                        docker cp $CONTAINER_ID:/workspace/src/${REPORT_DIR}/security/kics-report.json ./${REPORT_DIR}/security/ || true
                        docker rm -v $CONTAINER_ID
                    '''
                }
            }
        }

        stage('⚖️️ KICS Quality gate check') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    script {
                        def jsonPath = "${REPORT_DIR}/security/kics-report.json"

                        // 1. Una sola ejecución de sh. Extrae los 5 valores de golpe separados por espacio.
                        def metrics = sh(script: "if [ -s ${jsonPath} ]; then ./jq -r '[(.severity_counters.CRITICAL // 0), (.severity_counters.HIGH // 0), (.severity_counters.MEDIUM // 0), (.severity_counters.LOW // 0), (.severity_counters.INFO // 0)] | join(\" \")' ${jsonPath}; else echo '0 0 0 0 0'; fi", returnStdout: true).trim()
                        
                        // 2. Dividir la cadena de texto en variables independientes
                        def values = metrics.split(" ")
                        def critVulns = values[0].toInteger()
                        def highVulns = values[1].toInteger()
                        def medVulns  = values[2].toInteger()
                        def lowVulns  = values[3].toInteger()
                        def infoVulns = values[4].toInteger()
                        def totalVulns = critVulns + highVulns + medVulns + lowVulns + infoVulns

                        // 3. Un solo print multilínea para mantener la interfaz de Jenkins limpia
                        echo """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         📊 RESUMEN DE HALLAZGOS KICS (IaC)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         🔴 CRÍTICAS : ${critVulns}
         🟠 ALTAS    : ${highVulns}
         🟡 MEDIAS   : ${medVulns}
         🟢 BAJAS    : ${lowVulns}
         🔵 INFO     : ${infoVulns}
         ---------------------------------------
         📋 TOTAL    : ${totalVulns}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""

                        // 4. Regla del Quality Gate
                        if (critVulns > 0 || highVulns > 0) {
                            unstable("🚨 KICS Quality Gate: Se encontraron vulnerabilidades Críticas (${critVulns}) y Altas (${highVulns}) en la infraestructura.")
                        } else {
                            echo "✅ KICS Quality Gate Aprobado."
                        }
                    }
                }
            }
        }

        // --- 3. SEGURIDAD DE SECRETOS (GITLEAKS) ---
        stage('🔑 Gitleaks Analysis') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh '''
                        if [ ! -f "gitleaks" ]; then
                            echo "📥 Descargando Gitleaks..."
                            curl -sL -o gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.18.2/gitleaks_8.18.2_linux_x64.tar.gz
                            tar -xzf gitleaks.tar.gz gitleaks
                            rm gitleaks.tar.gz
                        fi
                        
                        echo "🥷 Ocultando archivos temporalmente..."
                        mv devsecops /tmp/devsecops_${BUILD_NUMBER} || true
                        mv Jenkinsfile /tmp/Jenkinsfile_${BUILD_NUMBER} || true

                        echo "⚙️ Ejecutando Gitleaks (Modo Exhaustivo)..."
                        # Agregamos --verbose para forzar salida detallada de cada ocurrencia individual
                        ./gitleaks detect --source="." --no-git --verbose \
                            --report-path="${REPORT_DIR}/security/gitleaks-report.json" \
                            --report-format=json || true

                        echo "🪄 Restaurando archivos..."
                        mv /tmp/devsecops_${BUILD_NUMBER} devsecops || true
                        mv /tmp/Jenkinsfile_${BUILD_NUMBER} Jenkinsfile || true
                    '''
                }
            }
        }

        stage('🛡 Gitleaks Quality gate check') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    script {
                        // Regla: 0 secretos expuestos
                        def secretsFound = sh(script: "if [ -s ${REPORT_DIR}/security/gitleaks-report.json ]; then ./jq '. | length' ${REPORT_DIR}/security/gitleaks-report.json; else echo '0'; fi", returnStdout: true).trim()
                        echo "📊 Gitleaks - Secretos detectados: ${secretsFound}"
                        if (secretsFound != "0" && secretsFound.toInteger() > 0) {
                            unstable("🚨 Gitleaks Quality Gate: Se detectaron ${secretsFound} posibles credenciales/secretos expuestos.")
                        } else {
                            echo "✅ Gitleaks Quality Gate Aprobado."
                        }
                    }
                }
            }
        }

        // --- 4. ANÁLISIS DE DEPENDECIAS (OWASP) ---
        stage('📦 OWASP Dependency Check') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    // Usamos comillas simples '' para que Jenkins pase las variables de entorno de forma segura
                    sh '''
                        REPO_NAME=$(basename -s .git ${REPO_URL})
                        
                        echo "🚀 Iniciando OWASP SCA..."
                        
                        # Creamos el volumen si no existe
                        docker volume create owasp_db_data || true
                        
                        # Ejecutamos usando la variable de entorno directamente (sin interpolación de Groovy)
                        CONTAINER_ID=$(docker create \
                            --name "owasp_check_${BUILD_NUMBER}" \
                            -v owasp_db_data:/usr/share/dependency-check/data \
                            owasp/dependency-check:latest \
                            --scan /tmp/src \
                            --exclude "/tmp/src/devsecops/**" \
                            --exclude "/tmp/src/Jenkinsfile" \
                            --format HTML --format JSON \
                            --out /tmp \
                            --project "${REPO_NAME}" \
                            --nvdApiKey "${NVD_API_KEY}" \
                            --nvdMaxRetryCount 10 \
                            --nvdApiDelay 4000)

                        docker cp . $CONTAINER_ID:/tmp/src
                        docker start -a $CONTAINER_ID || true
                        
                        mkdir -p ./${REPORT_DIR}/dependency-check
                        docker cp $CONTAINER_ID:/tmp/dependency-check-report.html ./${REPORT_DIR}/dependency-check/ || true
                        docker cp $CONTAINER_ID:/tmp/dependency-check-report.json ./${REPORT_DIR}/dependency-check/ || true
                        
                        docker rm -v $CONTAINER_ID
                    '''
                }
            }
        }

        stage('🚦 OWASP Quality gate check') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    script {
                        def jsonPath = "${REPORT_DIR}/dependency-check/dependency-check-report.json"

                        // 1. Una sola ejecución de jq con filtros avanzados para agrupar por rangos CVSS
                        def metrics = sh(script: """
                            if [ -s ${jsonPath} ]; then
                                ./jq -r '
                                    def get_score: .cvssv3.baseScore // .cvssv2.score // 0;
                                    def all_vulns: [.dependencies[]?.vulnerabilities[]?];
                                    [
                                        (.dependencies // [] | length),
                                        ([.dependencies[]? | select(.vulnerabilities != null)] | length),
                                        (all_vulns | length),
                                        (all_vulns | map(get_score | select(. >= 9.0)) | length),
                                        (all_vulns | map(get_score | select(. >= 7.0 and . < 9.0)) | length),
                                        (all_vulns | map(get_score | select(. >= 4.0 and . < 7.0)) | length),
                                        (all_vulns | map(get_score | select(. > 0 and . < 4.0)) | length)
                                    ] | join(" ")' ${jsonPath}
                            else
                                echo "0 0 0 0 0 0 0"
                            fi
                        """, returnStdout: true).trim()

                        // 2. Dividir la cadena de texto en variables independientes
                        def values = metrics.split(" ")
                        def totalDeps  = values[0].toInteger()
                        def vulnDeps   = values[1].toInteger()
                        def totalVulns = values[2].toInteger()
                        def critVulns  = values[3].toInteger()
                        def highVulns  = values[4].toInteger()
                        def medVulns   = values[5].toInteger()
                        def lowVulns   = values[6].toInteger()

                        // 3. Un solo print multilínea para mantener la consola limpia
                        echo """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        📦 RESUMEN DE DEPENDENCIAS (OWASP SCA)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        📦 Dependencias Escaneadas : ${totalDeps}
        ⚠️  Dependencias Vulnerables: ${vulnDeps}
        ---------------------------------------
        🔴 Críticas (≥9.0) : ${critVulns}
        🟠 Altas    (≥7.0) : ${highVulns}
        🟡 Medias   (≥4.0) : ${medVulns}
        🟢 Bajas    (<4.0) : ${lowVulns}
        ---------------------------------------
        📋 Total Vulnerabilidades  : ${totalVulns}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""

                        // 4. Regla del Quality Gate: CVSS >= 4.0 (Medio, Alto o Crítico)
                        def vulnsAboveThreshold = critVulns + highVulns + medVulns
                        if (vulnsAboveThreshold > 0) {
                            unstable("🚨 OWASP Quality Gate: Se encontraron ${vulnsAboveThreshold} vulnerabilidades con riesgo CVSS >= 4.0 (Medias, Altas o Críticas).")
                        } else {
                            echo "✅ OWASP Quality Gate Aprobado."
                        }
                    }
                }
            }
        }

        // --- 5. SONARQUBE SCAN & REPORTE PDF ---
        stage('🎯 SonarQube Scan') {
            steps {
                sh '''
                    if [ ! -d "$HOME/.sonar/sonar-scanner" ]; then
                        echo "📥 Descargando Sonar Scanner..."
                        mkdir -p $HOME/.sonar
                        curl -sL -o sonar-scanner-cli.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                        unzip -q sonar-scanner-cli.zip
                        mv sonar-scanner-5.0.1.3006-linux $HOME/.sonar/sonar-scanner
                        rm sonar-scanner-cli.zip
                    fi
                    export PATH="$PATH:$HOME/.sonar/sonar-scanner/bin"
                    REPO_NAME=$(basename -s .git ${REPO_URL})
                    
                    # Fíjate en el '\\' al final de la línea de exclusions
                    sonar-scanner \
                        -Dsonar.projectKey=${REPO_NAME} \
                        -Dsonar.projectName="${REPO_NAME}" \
                        -Dsonar.projectVersion=${BUILD_NUMBER} \
                        -Dsonar.host.url="${SONAR_HOST_URL_LOCAL}" \
                        -Dsonar.token="${SONAR_TOKEN}" \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions="devsecops/**,Jenkinsfile,${REPORT_DIR}/**" \
                        -Dsonar.sourceEncoding=UTF-8
                '''
            }
        }

        stage('⏳ SonarQube Quality Gate Check') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh '''
                        if [ ! -f ".scannerwork/report-task.txt" ]; then
                            echo "❌ Error: Archivo report-task.txt no encontrado."
                            exit 1
                        fi
                        TASK_URL=$(grep ceTaskUrl .scannerwork/report-task.txt | cut -d '=' -f 2-)
                        STATUS="PENDING"
                        while [ "$STATUS" != "SUCCESS" ] && [ "$STATUS" != "FAILED" ] && [ "$STATUS" != "CANCELED" ]; do
                            sleep 5
                            RESPONSE=$(curl -s -u "${SONAR_TOKEN}:" "$TASK_URL")
                            STATUS=$(echo $RESPONSE | ./jq -r '.task.status')
                        done
                        ANALYSIS_ID=$(curl -s -u "${SONAR_TOKEN}:" "$TASK_URL" | ./jq -r '.task.analysisId')
                        QG_URL="${SONAR_HOST_URL_LOCAL}/api/qualitygates/project_status?analysisId=${ANALYSIS_ID}"
                        QG_STATUS=$(curl -s -u "${SONAR_TOKEN}:" "$QG_URL" | ./jq -r '.projectStatus.status')
                        
                        echo "📊 Estado Final SonarQube: $QG_STATUS"
                        
                        if [ "$QG_STATUS" != "OK" ]; then
                            exit 1
                        fi
                    '''
                }
            }
        }

        // ========== NUEVA ETAPA INTEGRADA AQUÍ ==========
        stage('🗂 Generación de Reportes PDF') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh '''
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo " ORQUESTANDO REPORTES PDF (KICS, OWASP, GITLEAKS, SONAR)"
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        
                        # Se asegura la librería con un solo comando pip install
                        python3 -m pip install reportlab Pillow --quiet --break-system-packages

                        chmod +x devsecops/*.py
                        cd devsecops/
                        
                        # Obtener el nombre del proyecto dinámicamente
                        REPO_NAME=$(basename -s .git ${REPO_URL})
                        
                        # NUEVO: Pasamos los 4 argumentos requeridos por el nuevo main del batch
                        # 1: Directorio, 2: URL Sonar, 3: Token Sonar, 4: Key Proyecto
                        python3 batch_generate_reports.py "../${REPORT_DIR}" "${SONAR_HOST_URL_LOCAL}" "${SONAR_TOKEN}" "${REPO_NAME}"
                        
                        cd ../
                    '''
                }
            }
        }

        stage('📄 Generar docx hallazgos de SonarQube') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh '''
                        REPO_NAME=$(basename -s .git ${REPO_URL})
                        
                        # 1. Descargar Java 21 si no está presente (necesario para CNES 5.0.3)
                        if [ ! -d "jdk-21" ]; then
                            echo "📥 Descargando Java 21 para compatibilidad con CNES..."
                            curl -sL -o openjdk21.tar.gz https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz
                            mkdir -p jdk-21
                            tar -xzf openjdk21.tar.gz -C jdk-21 --strip-components=1
                            rm openjdk21.tar.gz
                        fi
                        
                        JAVA_21_BIN="$(pwd)/jdk-21/bin/java"
            
                        # 2. Descargar CNES Report v5.0.3
                        echo "📥 Descargando CNES Report v5.0.3..."
                        if [ ! -f "cnes-report.jar" ]; then
                            curl -sL -o cnes-report.jar https://github.com/cnescatlab/sonar-cnes-report/releases/download/5.0.3/sonar-cnes-report-5.0.3.jar
                        fi
            
                        # 3. Ejecutar usando el binario de Java 21
                        echo "⚙️ Generando reporte PDF con Java 21..."
                        $JAVA_21_BIN -jar cnes-report.jar \
                            -s ${SONAR_HOST_URL_LOCAL} \
                            -t ${SONAR_TOKEN} \
                            -p ${REPO_NAME} \
                            -o "${REPORT_DIR}/sonarqube" \
                            -f pdf
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "${REPORT_DIR}/**/*", allowEmptyArchive: true
        }
    }
}