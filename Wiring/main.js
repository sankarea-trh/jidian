// 文档加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsContainer = document.getElementById('results-container');
    
    // 折叠/展开调整系数设置区域
    const adjustmentSection = document.querySelector('.adjustment-section');
    const adjustmentContent = document.getElementById('adjustment-content');
    const toggleBtn = document.getElementById('toggle-adjustment-btn');
    const toggleIcon = document.getElementById('toggle-adjustment-icon');
    if (toggleBtn && adjustmentContent && toggleIcon) {
        toggleBtn.addEventListener('click', function() {
            const collapsed = adjustmentContent.classList.toggle('collapsed');
            toggleBtn.setAttribute('aria-expanded', !collapsed);
            toggleIcon.textContent = collapsed ? '▲' : '▼';
        });
    }
    
    // 文件上传事件监听
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            calculateBtn.disabled = false;
            
            // 读取文件内容并生成调整系数设置区域
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileContent = e.target.result;
                try {
                    const projects = parseProjectFile(fileContent);
                    if (projects.length > 0) {
                        generateAdjustmentSettings(projects);
                    } else {
                        showError('无法解析项目数据，请检查格式是否正确');
                    }
                } catch (error) {
                    console.error('解析项目数据时出错:', error);
                    showError(`解析数据时出错: ${error.message}`);
                }
            };
            reader.onerror = function() {
                showError('读取文件时出错');
            };
            reader.readAsText(file);
        } else {
            fileName.textContent = '未选择文件';
            calculateBtn.disabled = true;
            // 清空调整系数设置区域
            document.getElementById('adjustment-content').innerHTML = '<p class="no-adjustments">上传文件后，将显示项目调整系数设置</p>';
        }
    });
    
    // 计算文件按钮点击事件
    calculateBtn.addEventListener('click', function() {
        const file = fileInput.files[0];
        if (!file) return;
        
        // 可选：添加计算中状态
        calculateBtn.disabled = true;
        calculateBtn.innerHTML = '<span class="loading-spinner"></span> 计算中...'; // 简单的加载提示
        resultsContainer.innerHTML = '<p class="no-results">正在计算...</p>';

        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            // 模拟一点延迟，以便看到加载状态
            setTimeout(() => {
                processProjectData(fileContent);
                // 恢复按钮状态
                calculateBtn.disabled = false;
                calculateBtn.innerHTML = '计算绩点'; 
            }, 300);
        };
        reader.onerror = function() {
             // 处理读取错误
            showError('读取文件时出错');
            calculateBtn.disabled = false;
            calculateBtn.innerHTML = '计算绩点'; 
        };
        reader.readAsText(file);
    });
    
    // 处理项目数据
    function processProjectData(content) {
        try {
            // 清空现有的控制台输出，用于调试
            console.clear();
            
            // 解析项目数据
            const projects = parseProjectFile(content);
            
            if (projects.length === 0) {
                showError('无法解析项目数据，请检查格式是否正确');
                return;
            }
            
            // 计算项目绩点
            const results = calculateProjectPoints(projects);
            
            // 显示结果
            displayResults(results);
            
        } catch (error) {
            console.error('处理项目数据时出错:', error);
            showError(`处理数据时出错: ${error.message}`);
        }
    }
    
    // 生成调整系数设置区域
    function generateAdjustmentSettings(projects) {
        const adjustmentContent = document.getElementById('adjustment-content');
        adjustmentContent.innerHTML = ''; // 清空现有内容
        
        projects.forEach(project => {
            const projectId = project.name.replace(/\s+/g, '_');
            const projectSettings = document.createElement('div');
            projectSettings.className = 'project-settings';
            projectSettings.innerHTML = `
                <h3 class="project-title">${project.name}</h3>
                <div class="adjustment-group">
                    <label>项目类型：</label>
                    <select id="projectType_${projectId}">
                        <option value="纯电缆">纯电缆</option>
                        <option value="纯架空">纯架空</option>
                        <option value="有电缆有架空">有电缆有架空</option>
                    </select>
                </div>
                
                <div class="adjustment-group">
                    <label>国网工程调整系数：</label>
                    <select id="stateGridAdjustment_${projectId}">
                        <option value="1.0">非国网工程(1.0)</option>
                        <option value="1.1">国网工程(1.1)</option>
                    </select>
                </div>
                
                <div class="adjustment-group">
                    <label>电压等级调整系数：</label>
                    <select id="voltageLevelAdjustment_${projectId}">
                        <option value="1.0">500kV以下(1.0)</option>
                        <option value="1.2">500kV及以上(1.2)</option>
                    </select>
                </div>
                
                <div class="adjustment-group">
                    <label>山地调整系数：</label>
                    <select id="mountainAdjustment_${projectId}">
                        <option value="1.0">其他(1.0)</option>
                        <option value="1.1">山地占50%以上(1.1)</option>
                        <option value="1.2">高山占30%以上(1.2)</option>
                    </select>
                </div>
                
                <div class="adjustment-group">
                    <label>海拔调整系数：</label>
                    <select id="altitudeAdjustment_${projectId}">
                        <option value="1.0">3000米以下(1.0)</option>
                        <option value="1.2">3000米-4000米(含3000米)(1.2)</option>
                        <option value="1.3">4000米及以上(1.3)</option>
                    </select>
                </div>
                
                <div class="adjustment-group">
                    <label>架空公里数(km)：</label>
                    <input type="number" id="overheadLength_${projectId}" min="0" step="0.1" value="20">
                </div>
                
                <div class="adjustment-group">
                    <label>电缆公里数(km)：</label>
                    <input type="number" id="cableLength_${projectId}" min="0" step="0.1" value="2">
                </div>
                <div class="adjustment-group">
                    <label>项目难度系数：</label>
                    <select id="difficultyCoef_${projectId}">
                        <option value="1.3">边坡防护采用抗滑桩、格构类(1.3)</option>
                        <option value="1.3">电缆通道采用电缆隧道(1.3)</option>
                        <option value="1.1">架空双回路设计(1.1)</option>
                        <option value="1.3">大修技改国网超高压项目（报外省审查）(1.3)</option>
                        <option value="1" selected>其他(1.0)</option>
                    </select>
                </div>
            `;
            adjustmentContent.appendChild(projectSettings);
        });
    }
    
    // 显示计算结果
    function displayResults(results) {
        // 先清空结果容器并移除动画类 (如果存在)
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('fade-in-up');
        
        if (results.length === 0) {
            showError('没有有效的计算结果');
            return;
        }
        
        // 添加总结信息 (只显示项目数量)
        const summaryCard = document.createElement('div');
        summaryCard.className = 'result-card';
        summaryCard.innerHTML = `
            <h3 class="result-title">计算结果总结</h3>
            <p>共计算了 <strong>${results.length}</strong> 个项目</p>
        `;
        resultsContainer.appendChild(summaryCard);
        
        // 为每个项目创建结果卡片
        results.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            
            resultCard.innerHTML = `
                <h3 class="result-title">${result.name || '未命名项目'}</h3>
                <p class="result-points">项目绩点: <strong>${result.points.toFixed(2)}</strong></p>
            `;
            
            resultsContainer.appendChild(resultCard);
        });

        // 强制回流以确保动画效果
        // void resultsContainer.offsetWidth;
        
        // 添加动画类以触发动画
        resultsContainer.classList.add('fade-in-up');
        
        // 滚动到结果区域
        // document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' }); 
        // 平滑滚动有时会干扰动画效果，可以考虑注释掉或延迟执行
        setTimeout(() => {
             document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // 延迟一点执行滚动

    }
    
    // 显示错误信息
    function showError(message) {
        resultsContainer.innerHTML = `<p class="error-message">${message}</p>`;
        // 确保移除动画类，以防错误信息也带有动画
        resultsContainer.classList.remove('fade-in-up');
    }
}); 