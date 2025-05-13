// --- DOM Elements ---
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const progressBar = document.getElementById('progressBar');
const resultsSection = document.getElementById('resultsSection');
const resultsHeader = document.getElementById('resultsHeader');
const resultsContent = document.getElementById('resultsContent');
const resultsOutput = document.getElementById('resultsOutput');
const toggleIcon = document.getElementById('toggleIcon');
const errorMessage = document.getElementById('errorMessage');
const formatGuideHeader = document.getElementById('formatGuideHeader');
const formatGuideContent = document.getElementById('formatGuideContent');
const formatToggleIcon = document.getElementById('formatToggleIcon');
const designPhase = document.getElementById('designPhase');
const projectType = document.getElementById('projectType');
const designPhaseCustom = document.getElementById('designPhaseCustom');
const projectTypeCustom = document.getElementById('projectTypeCustom');

// --- Global Variables ---
let uploadedFile = null;
let projectData = [];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 直接检查 findQuota 函数
    if (typeof findQuota !== 'function') {
        console.error('[script.js] Error: findQuota function not found. Ensure quotaFinder.js loaded before script.js and exposed findQuota globally.');
        showError('计算功能加载失败，请检查 quotaFinder.js 文件。');
        calculateBtn.disabled = true; // Disable calculation
    } else {
        console.log('[script.js] findQuota function found.');
        // Set initial UI state
        updateFileStatus(null);
    }

    // --- Bind Event Listeners (Only once) ---
    uploadArea.addEventListener('click', handleUploadAreaClick);
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileInputChange);
    calculateBtn.addEventListener('click', handleCalculation);
    clearBtn.addEventListener('click', clearAll);
    resultsHeader.addEventListener('click', toggleResultsExpansion);
    formatGuideHeader.addEventListener('click', toggleFormatGuideExpansion);

    // 添加系数选择的事件监听
    designPhase.addEventListener('change', handleCoefficientChange);
    projectType.addEventListener('change', handleCoefficientChange);
    designPhaseCustom.addEventListener('input', handleCustomCoefficient);
    projectTypeCustom.addEventListener('input', handleCustomCoefficient);
});

// --- Event Handlers (New UI Logic) ---

function handleUploadAreaClick() {
    fileInput.click();
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave() {
    uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    processSelectedFile(file);
}

function handleFileInputChange(event) {
    const file = event.target.files[0];
    processSelectedFile(file);
}

function toggleResultsExpansion() {
    resultsContent.classList.toggle('expanded');
    toggleIcon.textContent = resultsContent.classList.contains('expanded') ? '▲' : '▼';
}

function toggleFormatGuideExpansion() {
    formatGuideContent.classList.toggle('expanded');
    formatToggleIcon.textContent = formatGuideContent.classList.contains('expanded') ? '▲' : '▼';
}

// --- Core Logic Functions (New UI Logic) ---

function processSelectedFile(file) {
    if (file && file.name.endsWith('.txt')) {
        uploadedFile = file;
        updateFileStatus(uploadedFile);
        clearError();
        // 清除之前的结果，但保留当前文件
        resultsOutput.innerHTML = '';
        resultsSection.style.display = 'none';
        resultsContent.classList.remove('expanded');
        toggleIcon.textContent = '▼';
        
        // 读取并解析文件内容
        readFileContent(file).then(content => {
            projectData = parseFileContent(content);
            if (projectData && projectData.length > 0) {
                // 显示项目列表和系数设置
                displayProjectList();
            } else {
                showError('无法解析文件内容。请检查文件格式是否符合说明。');
            }
        }).catch(error => {
            console.error('File reading error:', error);
            showError('读取文件时出错');
        });
    } else {
        uploadedFile = null;
        updateFileStatus(null);
        if (file) {
            showError('请选择或拖拽有效的 .txt 文件。');
        }
    }
}

// 显示项目列表和系数设置
function displayProjectList() {
    // 创建项目列表和系数选择区域
    let projectListHTML = '<div class="project-list">';
    projectData.forEach((project, index) => {
        projectListHTML += `
            <div class="project-item">
                <h3>${escapeHTML(project.projectName)}</h3>
                ${createCoefficientSelectors(index, project.projectName, {
                    design: project.designFactor,
                    type: project.typeFactor
                })}
            </div>
        `;
    });
    projectListHTML += '</div><div id="resultsArea"></div>';

    // 显示项目列表
    resultsContent.innerHTML = projectListHTML;
    resultsSection.style.display = 'block';
    if (!resultsContent.classList.contains('expanded')) {
        resultsContent.classList.add('expanded');
        toggleIcon.textContent = '▲';
    }

    // 添加事件监听
    document.querySelectorAll('.coefficient-select').forEach(select => {
        select.addEventListener('change', handleCoefficientChange);
    });
    document.querySelectorAll('.coefficient-input').forEach(input => {
        input.addEventListener('input', handleCustomCoefficient);
    });
}

// 修改 handleCalculation 只更新 #resultsArea
async function handleCalculation() {
    if (!uploadedFile) {
        showError('请先上传文件。');
        return;
    }
    if (typeof findQuota !== 'function') {
        showError('计算功能不可用，请检查脚本是否正确加载。');
        return;
    }

    showLoading(true);
    clearError();

    try {
        updateProjectCoefficients();
        // 计算每个项目的绩点
        projectData.forEach((project, index) => {
            let projectTotalQuota = 0;
            project.items.forEach(item => {
                let quota = 0;
                try {
                    quota = findQuota(item.type, item.quantity);
                } catch (e) {
                    quota = 0;
                }
                quota = typeof quota === 'number' ? quota : 0;
                const itemQuota = quota * item.quantity;
                projectTotalQuota += itemQuota;
            });
            const adjustedProjectQuota = projectTotalQuota * project.designFactor * project.typeFactor * project.adjustFactor;
            // 显示到对应项目标题旁
            const projectItem = document.querySelectorAll('.project-item')[index];
            const h3 = projectItem.querySelector('h3');
            // 移除旧的绩点显示
            h3.querySelector('.project-score')?.remove();
            // 添加新的绩点显示
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'project-score highlight-success';
            scoreSpan.style.marginLeft = '1em';
            scoreSpan.textContent = `绩点: ${adjustedProjectQuota.toFixed(2)}`;
            h3.appendChild(scoreSpan);
        });
        progressBar.value = 100;
    } catch (error) {
        console.error('Calculation process error:', error);
        showError(`计算过程中发生错误: ${error.message || '未知错误'}`);
    } finally {
        showLoading(false);
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => {
            console.error("File reading error:", error);
            reject(new Error("读取文件时出错"));
        };
        reader.readAsText(file, 'UTF-8');
    });
}

// --- File Parsing Logic (Keep this logic) ---
function parseFileContent(content) {
    // 添加类型规范化函数
    function normalizeType(type) {
        // 移除首尾空格
        type = type.trim();
        // 规范化括号
        type = type.replace(/\(/g, '（').replace(/\)/g, '）');
        // 特殊类型匹配规则
        if (type === '箱变/超充堆' || type === '超充堆') {
            return '箱变';
        }
        return type;
    }

    const parsedProjects = [];
    console.log('开始解析文件内容...');
    const projectSeparatorRegex = /\n\s*[-=*_]{3,}\s*\n/;
    let sections = content.split(projectSeparatorRegex);
    sections = sections.filter(section => section.trim().length > 0);
    console.log(`过滤空段落后剩下 ${sections.length} 个项目`);

    sections.forEach((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length === 0) return;

        let projectName = `项目 ${index + 1}`;
        let nameLineIndex = -1;
        const nameKeywords = ['项目名称', '工程名称'];
        for (let i = 0; i < Math.min(3, lines.length); i++) {
             const lowerLine = lines[i].toLowerCase();
             if (nameKeywords.some(keyword => lowerLine.includes(keyword))) {
                  projectName = lines[i].replace(/项目名称\s*[:：]?\s*|工程名称\s*[:：]?\s*/i, '').trim();
                  nameLineIndex = i;
                  break;
             }
        }
         if (nameLineIndex === -1 && lines.length > 0) {
             const firstLineParts = lines[0].split(/[\s\t]+/).filter(part => part.trim());
             if (firstLineParts.length < 2 || isNaN(parseFloat(firstLineParts[firstLineParts.length - 1]))) {
                 projectName = lines[0].trim();
                 nameLineIndex = 0;
             }
         }

        const project = {
            projectName: projectName || `项目 ${index + 1}`,
            items: [],
            designFactor: 1,
            typeFactor: 1,
            adjustFactor: 1,
            factorsFound: { design: false, type: false, adjust: false }
        };

        for (let i = 0; i < lines.length; i++) {
            if (i === nameLineIndex) continue;
            const line = lines[i].trim();
            if (!line) continue;
            
            // 首先尝试使用冒号（包括全角冒号）分割
            let parts = line.split(/[:：]/).map(part => part.trim());
            
            // 如果没有冒号，则使用空格分割
            if (parts.length === 1) {
                parts = line.split(/\s+/);
            }
            
            // 如果最后一部分包含空格，继续分割以获取数值
            if (parts.length > 0) {
                const lastPart = parts[parts.length - 1].trim().split(/\s+/);
                if (lastPart.length > 1) {
                    // 将最后一部分的最后一个数字作为数量
                    const possibleNumber = lastPart[lastPart.length - 1];
                    if (!isNaN(parseFloat(possibleNumber))) {
                        parts = [...parts.slice(0, -1), ...lastPart];
                    }
                }
            }
            
            if (parts.length < 2) continue;
            
            // 获取最后一个部分作为数量
            const valueText = parts[parts.length - 1];
            const value = parseFloat(valueText) || 0;
            
            // 合并除最后一个部分外的所有部分作为类型
            let type = parts.slice(0, -1).join(' ').trim();
            
            if (!type) continue;

            // 使用规范化函数处理类型
            type = normalizeType(type);

            const lowerType = type.toLowerCase();
            if (lowerType.includes('设计阶段') || lowerType.includes('项目阶段')) {
                project.designFactor = value || 1;
                project.factorsFound.design = true;
            } else if (lowerType.includes('项目类型')) {
                project.typeFactor = value || 1;
                project.factorsFound.type = true;
            } else if (lowerType.includes('综合调整')) {
                project.adjustFactor = value || 1;
                project.factorsFound.adjust = true;
            } else {
                 project.items.push({ type: type, quantity: value });
            }
        }
        console.log(`项目 ${index + 1} 系数: 设计=${project.factorsFound.design ? project.designFactor : '1 (默认)'}, 类型=${project.factorsFound.type ? project.typeFactor : '1 (默认)'}, 综合=${project.factorsFound.adjust ? project.adjustFactor : '1 (默认)'}`);
        parsedProjects.push(project);
    });

    if (parsedProjects.length === 0 && content && content.trim() !== '') {
        console.warn('Parsing finished, but no projects were extracted. Check separator lines and format.');
        // Optionally throw an error to be caught by handleCalculation
        // throw new Error("未能从文件中解析出任何项目数据。");
    }
    console.log(`成功解析 ${parsedProjects.length} 个项目`);
    return parsedProjects;
}

// --- Calculation Logic (Keep this logic, depends on findQuota) ---
function calculateAllProjectsQuota(currentProjectData) {
    if (typeof findQuota !== 'function') {
        console.error("findQuota not available for calculation");
        return '<span class="highlight-error">错误: 计算函数不可用</span>';
    }
    let totalQuotaSum = 0;
    let resultString = '';
    currentProjectData.forEach((project, index) => {
        let projectTotalQuota = 0;
        let projectResult = `项目 ${index + 1}: ${escapeHTML(project.projectName || '未命名项目')}\n`;

        project.items.forEach(item => {
            let quota = 0;
            try {
                 quota = findQuota(item.type, item.quantity);
            } catch (e) {
                 console.error(`Error calling findQuota for type "${item.type}":`, e);
                 quota = 0;
            }
             quota = typeof quota === 'number' ? quota : 0;
            const itemQuota = quota * item.quantity;
            projectTotalQuota += itemQuota;
        });

        const adjustedProjectQuota = projectTotalQuota * project.designFactor * project.typeFactor * project.adjustFactor;
        totalQuotaSum += adjustedProjectQuota;

        projectResult += `<span class="highlight-success">项目绩点: ${adjustedProjectQuota.toFixed(2)}</span>\n`;
        resultString += projectResult + '\n';
    });

    // resultString += `\n<strong class="highlight-success">所有项目总绩点: ${totalQuotaSum.toFixed(2)}</strong>`; // Commented out this line
    return resultString;
}

// --- UI Update Functions (Keep these) ---
function updateFileStatus(file) {
    clearError();
    if (file) {
        fileStatus.innerHTML = `<span class="icon-success">✔️</span> 文件已选择: ${escapeHTML(file.name)}`;
        calculateBtn.disabled = false;
    } else {
        fileStatus.innerHTML = '';
        calculateBtn.disabled = true;
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.style.display = 'block';
        progressBar.value = 0;
        calculateBtn.disabled = true;
        clearBtn.disabled = true;
         uploadArea.style.pointerEvents = 'none';
         uploadArea.style.opacity = '0.6';
    } else {
        loadingIndicator.style.display = 'none';
        calculateBtn.disabled = !uploadedFile;
        clearBtn.disabled = false;
         uploadArea.style.pointerEvents = 'auto';
         uploadArea.style.opacity = '1';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    fileStatus.innerHTML = '<span class="icon-error">❌</span> 处理失败';
    resultsSection.style.display = 'none';
    resultsContent.classList.remove('expanded');
    toggleIcon.textContent = '▼';
     if (loadingIndicator.style.display === 'block') {
        showLoading(false);
     }
     calculateBtn.disabled = true;
}

function clearError() {
     errorMessage.textContent = '';
     errorMessage.style.display = 'none';
}

// 创建系数选择HTML
function createCoefficientSelectors(projectIndex, projectName, currentFactors) {
    return `
        <div class="coefficient-section" data-project-index="${projectIndex}">
            <h4>${projectName} 的调整系数：</h4>
            <div class="coefficient-group">
                <label>设计阶段调整系数：</label>
                <select class="coefficient-select design-phase" data-project-index="${projectIndex}">
                    <option value="0.2" ${currentFactors.design === 0.2 ? 'selected' : ''}>前期 (0.2)</option>
                    <option value="0.2" ${currentFactors.design === 0.2 ? 'selected' : ''}>可研 (0.2)</option>
                    <option value="0.2" ${currentFactors.design === 0.2 ? 'selected' : ''}>初步设计 (0.2)</option>
                    <option value="0.8" ${currentFactors.design === 0.8 ? 'selected' : ''}>施工图设计 (0.8)</option>
                    <option value="0.9" ${currentFactors.design === 0.9 ? 'selected' : ''}>初施设 (0.9)</option>
                    <option value="0.2" ${currentFactors.design === 0.2 ? 'selected' : ''}>竣工图 (0.2)</option>
                    <option value="1.0" ${currentFactors.design === 1.0 ? 'selected' : ''}>可研设计一体化 (1.0)</option>
                    <option value="0.2" ${currentFactors.design === 0.2 ? 'selected' : ''}>工代 (0.2)</option>
                    <option value="0.075" ${currentFactors.design === 0.075 ? 'selected' : ''}>归档 (0.075)</option>
                </select>
                <input type="number" class="coefficient-input design-phase-custom" 
                    data-project-index="${projectIndex}" 
                    placeholder="自定义系数" 
                    step="0.001" 
                    min="0"
                    value="${currentFactors.design !== 1 && !['0.2', '0.8', '0.9', '1.0', '0.075'].includes(currentFactors.design.toString()) ? currentFactors.design : ''}">
            </div>
            <div class="coefficient-group">
                <label>项目类型调整系数：</label>
                <select class="coefficient-select project-type" data-project-index="${projectIndex}">
                    <option value="1" ${currentFactors.type === 1 ? 'selected' : ''}>默认 (1.0)</option>
                    <option value="0.725" ${currentFactors.type === 0.725 ? 'selected' : ''}>技改 (0.725)</option>
                    <option value="0.65" ${currentFactors.type === 0.65 ? 'selected' : ''}>大修 (0.65)</option>
                    <option value="0.9" ${currentFactors.type === 0.9 ? 'selected' : ''}>基建 (0.9)</option>
                    <option value="0.75" ${currentFactors.type === 0.75 ? 'selected' : ''}>用户 (0.75)</option>
                </select>
                <input type="number" class="coefficient-input project-type-custom" 
                    data-project-index="${projectIndex}" 
                    placeholder="自定义系数" 
                    step="0.001" 
                    min="0"
                    value="${currentFactors.type !== 1 && !['0.725', '0.65', '0.9', '0.75'].includes(currentFactors.type.toString()) ? currentFactors.type : ''}">
            </div>
            <div class="coefficient-group">
                <label>综合调整系数：</label>
                <input type="number" class="coefficient-input adjust-factor-custom" 
                    data-project-index="${projectIndex}" 
                    placeholder="默认1，可自定义" 
                    step="0.001" 
                    min="0"
                    value="${typeof currentFactors.adjust === 'number' ? currentFactors.adjust : 1}">
            </div>
        </div>
    `;
}

// 更新项目系数
function updateProjectCoefficients() {
    const coefficientSections = document.querySelectorAll('.coefficient-section');
    coefficientSections.forEach(section => {
        const projectIndex = parseInt(section.dataset.projectIndex);
        const designSelect = section.querySelector('.design-phase');
        const designCustom = section.querySelector('.design-phase-custom');
        const typeSelect = section.querySelector('.project-type');
        const typeCustom = section.querySelector('.project-type-custom');
        const adjustCustom = section.querySelector('.adjust-factor-custom');

        // 更新设计阶段系数
        if (designCustom.value) {
            projectData[projectIndex].designFactor = parseFloat(designCustom.value);
            designSelect.value = '1';
        } else {
            projectData[projectIndex].designFactor = parseFloat(designSelect.value);
        }

        // 更新项目类型系数
        if (typeCustom.value) {
            projectData[projectIndex].typeFactor = parseFloat(typeCustom.value);
            typeSelect.value = '1';
        } else {
            projectData[projectIndex].typeFactor = parseFloat(typeSelect.value);
        }

        // 更新综合调整系数
        projectData[projectIndex].adjustFactor = adjustCustom.value ? parseFloat(adjustCustom.value) : 1;
    });
}

// 处理系数选择变化
function handleCoefficientChange(event) {
    const select = event.target;
    const customInput = select.classList.contains('design-phase') 
        ? select.parentElement.querySelector('.design-phase-custom')
        : select.parentElement.querySelector('.project-type-custom');
    
    if (select.value === '1') {
        customInput.value = '';
    }
}

// 处理自定义系数输入
function handleCustomCoefficient(event) {
    const input = event.target;
    const select = input.classList.contains('design-phase-custom')
        ? input.parentElement.querySelector('.design-phase')
        : input.parentElement.querySelector('.project-type');
    
    if (input.value !== '') {
        // 让下拉框无选中项
        select.selectedIndex = -1;
    } else {
        // 如果自定义输入被清空，恢复为默认
        select.value = '1';
    }
}

// 修改 clearAll 函数
function clearAll() {
    uploadedFile = null;
    projectData = [];
    fileInput.value = '';
    updateFileStatus(null);
    clearError();
    resultsOutput.innerHTML = '';
    resultsContent.innerHTML = '';
    resultsSection.style.display = 'none';
    resultsContent.classList.remove('expanded');
    toggleIcon.textContent = '▼';
    console.log('UI and data cleared.');
}

// --- Utility Functions (Keep this) ---
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return match;
        }
    });
}

// 获取当前系数值
function getCurrentCoefficients() {
    return {
        designFactor: designPhaseCustom.value ? parseFloat(designPhaseCustom.value) : parseFloat(designPhase.value),
        typeFactor: projectTypeCustom.value ? parseFloat(projectTypeCustom.value) : parseFloat(projectType.value),
        adjustFactor: 1 // 综合调整系数保持为1
    };
} 