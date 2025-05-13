// 数据配置
const benchmarks = {
    // 电气一次数据基准
    primaryElectrical: {
        '500kV配电装置设备': 5,
        '220/330kV配电装置设备': 4,
        '110kV配电装置设备': 3,
        '35/66kV配电装置设备': 2,
        '主变压器及油抗安装': 15,
        '管母安装': 15,
        '10/35kV开关柜接线及布置': 2,
        '站用变压器安装': 13,
        '站用电接线及布置': 5,
        '蓄电池安装': 3,
        '等电位网接地': 8,
        '建筑物接地': 5,
        '电缆构筑物': 5,
        '电缆': 5,
        '融冰装置': 50,
        '其他项目': 5
    },
    // 变电站等级系数
    stationLevels: {
        '500kV变电站': 1,
        '换流站': 1.3,
        '220kV变电站': 0.85,
        '110kV变电站': 0.65,
        '35kV变电站': 0.5
    },
    // 电气二次数据基准
    secondaryElectrical: {
        '220kV以上保护及测控': 3.0,
        '220kV以上母线保护及测控': 4.0,
        '110kV及以下保护及测控': 3.0,
        '主变压器保护测控': 5.0,
        '220kV以上间隔二次线': 3.0,
        '110kV以下间隔二次线': 2.0,
        '五防系统': 1.0,
        '安稳，故障录波，行波测距，PMU，谐波监测，电度表等': 0.3,
        '一体化电源': 1.0,
        '火灾消防及报警': 20.0,
        '全站通信部分': 1.0,
        '调度自动化': 1.0,
        '视频监控，智能项目，门禁等': 30.0,
        '其他': 5.0
    },
    // 土建数据基准
    civilEngineering: {
        '500KV及以上总图（含征地、总平面、竖向布置、挡墙、护坡、道路、电缆沟布置等）': 100,
        '220KV/330KV总图（含征地、总平面、竖向布置、挡墙、护坡、道路、电缆沟布置等）': 90,
        '110KV及以下总图（含征地、总平面、竖向布置、挡墙、护坡、道路、电缆沟布置等）': 80,
        '500KV（构）建筑物建筑图': 16.5,
        '220KV/330KV（构）筑物建筑图': 15,
        '110KV及以下（构）建筑物建筑图': 13.5,
        '500KV及以上（构）建筑物结构图（除电气设备结构外）': 16.5,
        '220KV/330KV（构）筑物结构图（除电气设备结构外）': 15,
        '110KV及以下（构）建筑物结构图（除电气设备结构外）': 13.5,
        '500KV及以上构架及基础': 16.5,
        '220KV/330KV构架及基础': 15,
        '110KV及以下构架及基础': 13.5,
        '配电装置设备支架及基础': 1.7,
        '站用变、主变及油坑基础': 15,
        '独立避雷针及基础': 15,
        '基坑支护、边坡治理': 25,
        '特殊地基处理（除换填外）': 20,
        '水工设备及主要材料清册': 20,
        '500KV给水排水': 16.5,
        '500KV泵房及水池': 16.5,
        '220KV/330KV给水排水': 15,
        '220KV/330KV泵房及水池': 15,
        '110KV及以下给水排水': 13.5,
        '110KV及以下泵房及水池': 13.5,
        '500KV水处理': 16.5,
        '220KV/330KV水处理': 15,
        '110KV及以下水处理': 13.5,
        '消防': 18,
        '暖通设备及主要材料清册': 15,
        '暖通': 15,
        '其他项目': 5
    },
    // 其他基准值
    other: {
        '初设绩点基准': 0.3,
        '可研绩点基准': 0.2,
        '校核绩点基准': 0.15,
        '设总绩点基准': 0.1
    },
    // 项目类型调整系数基准
    projectType: {
        '基建': 1.3,
        '技改': 1.0,
        '大修': 0.7
    }
};

// 默认空项目模板
const createEmptyProject = (name = '') => {
    return {
        name: name || '未命名项目',
        dataItems: {
            primaryElectricalStationItems: [
                { name: '500kV变电站', value: '' },
                { name: '换流站', value: '' },
                { name: '220kV变电站', value: '' },
                { name: '110kV变电站', value: '' },
                { name: '35kV变电站', value: '' }
            ],
            primaryElectricalItems: [
                { name: '500kV配电装置设备', value: '' },
                { name: '220/330kV配电装置设备', value: '' },
                { name: '110kV配电装置设备', value: '' },
                { name: '35/66kV配电装置设备', value: '' },
                { name: '主变压器及油抗安装', value: '' },
                { name: '管母安装', value: '' },
                { name: '10/35kV开关柜接线及布置', value: '' },
                { name: '站用变压器安装', value: '' },
                { name: '站用电接线及布置', value: '' },
                { name: '蓄电池安装', value: '' },
                { name: '等电位网接地', value: '' },
                { name: '建筑物接地', value: '' },
                { name: '电缆构筑物', value: '' },
                { name: '融冰装置', value: '' },
                { name: '其他项目', value: '' },
                { name: '电缆', value: '' }
            ],
            secondaryElectricalItems: [
                { name: '220kV以上保护及测控', value: '' },
                { name: '220kV以上母线保护及测控', value: '' },
                { name: '110kV及以下保护及测控', value: '' },
                { name: '主变压器保护测控', value: '' },
                { name: '220kV以上间隔二次线', value: '' },
                { name: '110kV以下间隔二次线', value: '' },
                { name: '五防系统', value: '' },
                { name: '安稳，故障录波，行波测距，PMU，谐波监测，电度表等', value: '' },
                { name: '一体化电源', value: '' },
                { name: '火灾消防及报警', value: '' },
                { name: '视频监控，智能项目，门禁等', value: '' },
                { name: '全站通信部分', value: '' },
                { name: '调度自动化', value: '' },
                { name: '其他', value: '' }
            ],
            civilEngineeringItems: [
                { name: '500KV及以上总图（含征地、总平面、竖向布置、挡墙、护坡、道路、电缆沟布置等）', value: '' },
                { name: '220KV/330KV总图（含征地、总平面、竖向布置、挡墙、护坡、道路、电缆沟布置等）', value: '' },
                { name: '110KV及以下总图（含征地、总平面、竖向布置、挡墙、护坡、道路、电缆沟布置等）', value: '' },
                { name: '500KV（构）建筑物建筑图', value: '' },
                { name: '220KV/330KV（构）筑物建筑图', value: '' },
                { name: '110KV及以下（构）建筑物建筑图', value: '' },
                { name: '500KV及以上（构）建筑物结构图（除电气设备结构外）', value: '' },
                { name: '220KV/330KV（构）筑物结构图（除电气设备结构外）', value: '' },
                { name: '110KV及以下（构）建筑物结构图（除电气设备结构外）', value: '' },
                { name: '500KV及以上构架及基础', value: '' },
                { name: '220KV/330KV构架及基础', value: '' },
                { name: '110KV及以下构架及基础', value: '' },
                { name: '配电装置设备支架及基础', value: '' },
                { name: '站用变、主变及油坑基础', value: '' },
                { name: '独立避雷针及基础', value: '' },
                { name: '基坑支护、边坡治理', value: '' },
                { name: '特殊地基处理（除换填外）', value: '' },
                { name: '水工设备及主要材料清册', value: '' },
                { name: '500KV给水排水', value: '' },
                { name: '500KV泵房及水池', value: '' },
                { name: '220KV/330KV给水排水', value: '' },
                { name: '220KV/330KV泵房及水池', value: '' },
                { name: '110KV及以下给水排水', value: '' },
                { name: '110KV及以下泵房及水池', value: '' },
                { name: '500KV水处理', value: '' },
                { name: '220KV/330KV水处理', value: '' },
                { name: '110KV及以下水处理', value: '' },
                { name: '消防', value: '' },
                { name: '暖通设备及主要材料清册', value: '' },
                { name: '暖通', value: '' },
                { name: '其他项目', value: '' }
            ],
            projectTypeItems: [
                { name: '基建', value: '' },
                { name: '技改', value: '' },
                { name: '大修', value: '' }
            ]
        },
        results: null
    };
};

// 全局项目列表和当前项目索引
let projects = [];
let currentProjectIndex = 0;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化界面
    showNoProjectsMessage();
});

// 辅助函数：去除标点符号
function normalizeName(str) {
    // 去除常见中英文标点符号
    return str.replace(/[\s,，。.;；:：'"""''\(\)（）\[\]【】{}《》]/g, '').toLowerCase();
}

// 显示"无项目"信息
function showNoProjectsMessage() {
    const tabsContent = document.querySelector('.tabs-content');
    tabsContent.innerHTML = '<div class="no-projects">请上传项目数据文件(txt格式)</div>';
}

// 处理文件上传
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        alert('请上传.txt文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        parseMultipleProjects(content);
        
        // 重置文件输入元素的值，使得相同文件可以再次触发onchange事件
        document.getElementById('fileInput').value = '';
    };
    reader.onerror = (e) => {
        alert('文件读取失败');
        // 重置文件输入元素的值
        document.getElementById('fileInput').value = '';
    };
    reader.readAsText(file);
}

// 解析多项目数据
function parseMultipleProjects(content) {
    try {
        // 按分隔符拆分多个项目
        const projectBlocks = content.split(/[-]{3,}/);
        
        // 清空当前项目列表
        projects = [];
        
        // 解析每个项目块
        projectBlocks.forEach(projectContent => {
            if (projectContent.trim() === '') return;
            
            const projectData = parseProjectContent(projectContent);
            if (projectData) {
                projects.push(projectData);
            }
        });
        
        // 显示项目
        if (projects.length > 0) {
            createProjectTabs();
            showProject(0); // 默认显示第一个项目
        } else {
            showNoProjectsMessage();
        }
        
    } catch (error) {
        console.error('解析文件内容时出错:', error);
        alert('解析文件内容时出错，请检查文件格式是否正确');
    }
}

// 解析单个项目数据
function parseProjectContent(content) {
    try {
        // 按行分割内容
        const lines = content.split('\n');
        let currentSection = '';
        let projectName = '未命名项目';
        let projectType = '';
        // 创建新项目
        const projectData = createEmptyProject();
        // 需要忽略的5个系数
        const ignoreStations = ['换流站', '500kV变电站', '220kV变电站', '110kV变电站', '35kV变电站'];
        // 遍历每一行
        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            if (line.includes('项目名称')) {
                // 支持使用冒号或空格分隔的项目名称
                // 支持中文冒号（：）和英文冒号（:）
                if (line.includes(':') || line.includes('：')) {
                    const parts = line.split(/[:：]/);  // 同时匹配中英文冒号
                    if (parts.length > 1) {
                        projectName = parts[1].trim();
                    }
                } else {
                    const nameParts = line.split(/\s+/);
                    if (nameParts.length > 1) {
                        projectName = nameParts.slice(1).join(' ');
                    }
                }
                projectData.name = projectName;
                return;
            }
            if (line.includes('项目类型')) {
                const typeParts = line.split(/\s+/);
                if (typeParts.length > 1) {
                    projectType = typeParts[1].trim();
                }
                return;
            }
            if (line.includes('电气一次数据')) {
                currentSection = '电气一次数据';
                return;
            } else if (line.includes('电气二次数据')) {
                currentSection = '电气二次数据';
                return;
            } else if (line.includes('土建数据')) {
                currentSection = '土建数据';
                return;
            }
            let name = '', value = '';
            if (line.includes(':') || line.includes('：')) {
                // 使用冒号分隔
                const parts = line.split(/[:：]/);
                name = parts[0].trim();
                value = parts[1].trim();
            } else {
                // 使用空格分隔
                const arr = line.split(/\s+/);
                name = arr.slice(0, arr.length - 1).join(' ');
                value = arr[arr.length - 1];
            }
            if (!name || !value) return;
            // 忽略5个系数的文件输入
            if (currentSection === '电气一次数据' && ignoreStations.includes(name)) {
                return;
            }
            switch (currentSection) {
                case '电气一次数据':
                    updateProjectItemValue(projectData, 'primaryElectricalItems', name, value);
                    break;
                case '电气二次数据':
                    updateProjectItemValue(projectData, 'secondaryElectricalItems', name, value);
                    break;
                case '土建数据':
                    updateProjectItemValue(projectData, 'civilEngineeringItems', name, value);
                    break;
            }
        });
        // 设置项目类型调整系数
        if (projectType) {
            projectData.dataItems.projectTypeItems.forEach(item => {
                item.value = '0';
            });
            const typeItem = projectData.dataItems.projectTypeItems.find(item => item.name === projectType);
            if (typeItem) {
                typeItem.value = '1';
            }
        }
        // 默认5个系数都为0
        projectData.dataItems.primaryElectricalStationItems.forEach(item => {
            item.value = '0';
        });
        return projectData;
    } catch (error) {
        console.error('解析项目内容时出错:', error);
        return null;
    }
}

// 更新项目数据项的值
function updateProjectItemValue(project, itemType, name, value) {
    const items = project.dataItems[itemType];
    if (!items) return;
    
    const normName = normalizeName(name);
    // 优先精确匹配
    let item = items.find(item => item.name === name);
    if (!item) {
        // 否则用去标点后的模糊匹配
        item = items.find(item => normalizeName(item.name) === normName);
    }
    if (item) {
        item.value = value;
    }
}

// 创建项目选项卡
function createProjectTabs() {
    const tabsHeader = document.querySelector('.tabs-header');
    const tabsContent = document.querySelector('.tabs-content');
    
    // 清空现有内容
    tabsHeader.innerHTML = '';
    tabsContent.innerHTML = '';
    
    // 为每个项目创建选项卡和内容区
    projects.forEach((project, index) => {
        // 创建选项卡
        const tab = document.createElement('div');
        tab.className = `project-tab ${index === 0 ? 'active' : ''}`;
        tab.dataset.index = index;
        tab.textContent = project.name;
        tab.onclick = () => showProject(index);
        tabsHeader.appendChild(tab);
        
        // 创建内容区
        const content = document.createElement('div');
        content.className = `tab-content ${index === 0 ? 'active' : ''}`;
        content.id = `project-${index}`;
        tabsContent.appendChild(content);
        
        // 生成项目内容（初始为空，将在showProject中填充）
    });
}

// 显示指定的项目
function showProject(index) {
    if (index < 0 || index >= projects.length) return;
    
    // 更新当前项目索引
    currentProjectIndex = index;
    
    // 更新选项卡激活状态
    document.querySelectorAll('.project-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    // 更新内容区激活状态
    document.querySelectorAll('.tab-content').forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
    
    // 获取当前项目和其内容区
    const project = projects[index];
    const contentElement = document.getElementById(`project-${index}`);
    
    // 如果内容区已经有内容，不重复生成UI
    if (contentElement.children.length > 0) {
        // 如果已有计算结果，更新显示
        if (project.results) {
            const resultsElement = document.getElementById(`project-${index}-results`);
            if (resultsElement) {
                displayProjectResults(project, contentElement);
            }
        }
        return;
    }
    
    // 生成项目内容
    generateProjectUI(project, contentElement);
    
    // 如果有计算结果，显示结果
    if (project.results) {
        displayProjectResults(project, contentElement);
    }
}

// 生成项目UI
function generateProjectUI(project, containerElement) {
    // 项目标题和项目类型选择
    const header = document.createElement('div');
    header.className = 'project-header';
    
    // 创建项目名称和类型选择的容器
    const projectInfo = document.createElement('div');
    projectInfo.className = 'project-info';
    
    // 项目名称
    const projectName = document.createElement('div');
    projectName.className = 'project-name';
    projectName.textContent = project.name;
    
    // 项目类型选择
    const typeSelect = document.createElement('select');
    typeSelect.className = 'project-type-select';
    typeSelect.dataset.project = currentProjectIndex;
    
    // 添加选项
    const types = ['技改', '大修', '基建'];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        // 如果项目已有类型，则选中对应选项
        if (project.dataItems.projectTypeItems.find(item => item.name === type && item.value === '1')) {
            option.selected = true;
        }
        typeSelect.appendChild(option);
    });
    
    // 添加类型变更事件监听
    typeSelect.addEventListener('change', function() {
        const projectIndex = parseInt(this.dataset.project);
        const selectedType = this.value;
        
        // 更新项目类型
        projects[projectIndex].dataItems.projectTypeItems.forEach(item => {
            item.value = item.name === selectedType ? '1' : '0';
        });
        
        // 如果项目已有计算结果，重新计算
        if (projects[projectIndex].results) {
            calculateProjectPoints(projectIndex);
            displayProjectResults(projects[projectIndex], containerElement);
        }
    });
    
    // 组装项目信息
    projectInfo.appendChild(projectName);
    projectInfo.appendChild(typeSelect);
    
    // 5个系数
    const stationNames = ['换流站', '500kV变电站', '220kV变电站', '110kV变电站', '35kV变电站'];
    let checkboxesHTML = '';
    project.dataItems.primaryElectricalStationItems.forEach((item, idx) => {
        if (stationNames.includes(item.name)) {
            checkboxesHTML += `<label style='margin-right:10px;'><input type='checkbox' class='station-checkbox' data-project='${currentProjectIndex}' data-index='${idx}' ${item.value==='1'?'checked':''}>${item.name}</label>`;
        }
    });
    
    header.appendChild(projectInfo);
    header.innerHTML += `<div style='margin-top:10px;'>${checkboxesHTML}</div>`;
    containerElement.appendChild(header);
    
    // 监听checkbox事件
    setTimeout(() => {
        containerElement.querySelectorAll('.station-checkbox').forEach(cb => {
            cb.addEventListener('change', handleStationCheckboxChange);
        });
    }, 0);
    
    // 创建输入区容器
    const inputSections = document.createElement('div');
    inputSections.className = 'input-sections';
    containerElement.appendChild(inputSections);
    
    // 生成电气一次数据部分
    const primaryElectricalSection = createSection('primaryElectrical', '电气一次数据', inputSections);
    
    // 初始状态为收起
    const primaryContent = primaryElectricalSection.querySelector('.section-content');
    primaryContent.classList.add('hidden');
    const primaryToggle = primaryElectricalSection.querySelector('.toggle-icon');
    primaryToggle.textContent = '▶';
    
    // 一次设备站点调整系数
    const stationHeader = document.createElement('h3');
    stationHeader.textContent = '一次设备站点调整系数';
    primaryContent.appendChild(stationHeader);
    
    const stationItems = document.createElement('div');
    stationItems.className = 'item-list';
    stationItems.id = `project-${currentProjectIndex}-primaryElectricalStationItems`;
    primaryContent.appendChild(stationItems);
    
    // 生成一次设备站点调整系数数据项
    project.dataItems.primaryElectricalStationItems.forEach((item, itemIndex) => {
        createInputItem(item, itemIndex, stationItems, 'primaryElectricalStationItems');
    });
    
    // 一次设备
    const primaryHeader = document.createElement('h3');
    primaryHeader.textContent = '一次设备';
    primaryContent.appendChild(primaryHeader);
    
    const primaryItems = document.createElement('div');
    primaryItems.className = 'item-list';
    primaryItems.id = `project-${currentProjectIndex}-primaryElectricalItems`;
    primaryContent.appendChild(primaryItems);
    
    // 生成一次设备数据项
    project.dataItems.primaryElectricalItems.forEach((item, itemIndex) => {
        createInputItem(item, itemIndex, primaryItems, 'primaryElectricalItems');
    });
    
    // 生成电气二次数据部分
    const secondaryElectricalSection = createSection('secondaryElectrical', '电气二次数据', inputSections);
    
    // 初始状态为收起
    const secondaryContent = secondaryElectricalSection.querySelector('.section-content');
    secondaryContent.classList.add('hidden');
    const secondaryToggle = secondaryElectricalSection.querySelector('.toggle-icon');
    secondaryToggle.textContent = '▶';
    
    const secondaryItems = document.createElement('div');
    secondaryItems.className = 'item-list';
    secondaryItems.id = `project-${currentProjectIndex}-secondaryElectricalItems`;
    secondaryContent.appendChild(secondaryItems);
    
    // 生成二次设备数据项
    project.dataItems.secondaryElectricalItems.forEach((item, itemIndex) => {
        createInputItem(item, itemIndex, secondaryItems, 'secondaryElectricalItems');
    });
    
    // 生成土建数据部分
    const civilEngineeringSection = createSection('civilEngineering', '土建数据', inputSections);
    
    // 初始状态为收起
    const civilContent = civilEngineeringSection.querySelector('.section-content');
    civilContent.classList.add('hidden');
    const civilToggle = civilEngineeringSection.querySelector('.toggle-icon');
    civilToggle.textContent = '▶';
    
    const civilItems = document.createElement('div');
    civilItems.className = 'item-list';
    civilItems.id = `project-${currentProjectIndex}-civilEngineeringItems`;
    civilContent.appendChild(civilItems);
    
    // 生成土建数据项
    project.dataItems.civilEngineeringItems.forEach((item, itemIndex) => {
        createInputItem(item, itemIndex, civilItems, 'civilEngineeringItems');
    });
    
    // 创建结果区
    const resultsSection = document.createElement('div');
    resultsSection.className = 'results';
    resultsSection.id = `project-${currentProjectIndex}-results`;
    containerElement.appendChild(resultsSection);
}

// 创建区块
function createSection(id, title, parentElement) {
    const section = document.createElement('div');
    section.className = 'section';
    
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.onclick = () => toggleSection(`project-${currentProjectIndex}-${id}`);
    header.innerHTML = `${title} <span class="toggle-icon" id="project-${currentProjectIndex}-${id}Toggle">▼</span>`;
    
    const content = document.createElement('div');
    content.className = 'section-content';
    content.id = `project-${currentProjectIndex}-${id}Content`;
    
    section.appendChild(header);
    section.appendChild(content);
    parentElement.appendChild(section);
    
    return section;
}

// 创建输入项
function createInputItem(item, index, containerElement, itemType) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'input-item';
    
    const label = document.createElement('span');
    label.className = 'item-label';
    label.textContent = item.name;
    
    const input = document.createElement('input');
    input.className = 'item-input';
    input.type = 'number';
    input.min = '0';
    input.step = '0.01';
    input.placeholder = '0';
    input.value = item.value;
    input.dataset.project = currentProjectIndex;
    input.dataset.type = itemType;
    input.dataset.index = index;
    input.addEventListener('input', handleProjectInput);
    
    itemDiv.appendChild(label);
    itemDiv.appendChild(input);
    containerElement.appendChild(itemDiv);
}

// 处理输入变化
function handleProjectInput(event) {
    const { project, type, index } = event.target.dataset;
    const value = event.target.value;
    const projectIndex = parseInt(project);
    
    // 更新项目数据
    projects[projectIndex].dataItems[type][index].value = value;
}

// 处理折叠面板展开/收起
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}Content`);
    const icon = document.getElementById(`${sectionId}Toggle`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.textContent = '▼';
    } else {
        content.classList.add('hidden');
        icon.textContent = '▶';
    }
}

// 计算所有项目绩点
function calculateAllProjects() {
    // 检查项目数量
    if (projects.length === 0) {
        alert('请先上传项目数据文件');
        return;
    }
    
    // 遍历每个项目并计算
    projects.forEach((project, index) => {
        calculateProjectPoints(index);
        
        // 为已生成UI的项目即时更新结果显示
        const projectContainer = document.getElementById(`project-${index}`);
        if (projectContainer && projectContainer.children.length > 0) {
            const resultsElement = document.getElementById(`project-${index}-results`);
            if (resultsElement) {
                // 保存当前索引
                const savedIndex = currentProjectIndex;
                // 临时设置当前索引为循环中的索引
                currentProjectIndex = index;
                // 显示该项目结果
                displayProjectResults(project, projectContainer);
                // 恢复当前索引
                currentProjectIndex = savedIndex;
            }
        }
    });
    
    // 显示当前项目
    showProject(currentProjectIndex);
    
    // 确保结果可见，更新显示
    const project = projects[currentProjectIndex];
    const containerElement = document.getElementById(`project-${currentProjectIndex}`);
    
    if (containerElement && project.results) {
        displayProjectResults(project, containerElement);
        
        // 确保滚动到结果区域
        const resultsElement = document.getElementById(`project-${currentProjectIndex}-results`);
        if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// 计算并显示当前项目绩点
function calculateAndDisplayProjectPoints(projectIndex) {
    // 计算项目绩点
    calculateProjectPoints(projectIndex);
    
    // 显示结果
    const project = projects[projectIndex];
    const containerElement = document.getElementById(`project-${projectIndex}`);
    displayProjectResults(project, containerElement);
}

// 计算项目绩点
function calculateProjectPoints(projectIndex) {
    const project = projects[projectIndex];
    
    // 计算电气一次数据绩点
    let primaryElectricalStatisticalPoints = 0;
    let processedItems = new Set();
    
    project.dataItems.primaryElectricalItems.forEach(item => {
        if (item.value && benchmarks.primaryElectrical[item.name] && !processedItems.has(item.name)) {
            primaryElectricalStatisticalPoints += parseFloat(item.value) * benchmarks.primaryElectrical[item.name];
            processedItems.add(item.name);
        }
    });

    // 计算施设绩点
    let stationCoefficientSum = 0;
    let hasAnyStation = false;
    
    // 计算变电站系数总和
    for (const stationItem of project.dataItems.primaryElectricalStationItems) {
        if (stationItem.value && benchmarks.stationLevels[stationItem.name]) {
            const stationValue = parseFloat(stationItem.value);
            if (!isNaN(stationValue) && stationValue > 0) {
                stationCoefficientSum += stationValue * benchmarks.stationLevels[stationItem.name];
                hasAnyStation = true;
            }
        }
    }

    // 计算施设绩点 = 统计绩点 × 变电站系数总和
    let primaryElectricalConstructionPoints = primaryElectricalStatisticalPoints * stationCoefficientSum;

    // 如果没有设置任何变电站，使用默认系数0
    if (!hasAnyStation) {
        primaryElectricalConstructionPoints = 0;
    }

    // 计算电气一次数据其他绩点
    const primaryElectricalPreliminaryPoints = primaryElectricalConstructionPoints * benchmarks.other['初设绩点基准'];
    const primaryElectricalResearchPoints = primaryElectricalConstructionPoints * benchmarks.other['可研绩点基准'];
    const primaryElectricalReviewPoints = (primaryElectricalResearchPoints + primaryElectricalPreliminaryPoints + primaryElectricalConstructionPoints) * benchmarks.other['校核绩点基准'];
    const primaryElectricalChiefPoints = (primaryElectricalResearchPoints + primaryElectricalPreliminaryPoints + primaryElectricalConstructionPoints) * benchmarks.other['设总绩点基准'];
    const primaryElectricalTotalPoints = primaryElectricalResearchPoints + primaryElectricalPreliminaryPoints + primaryElectricalConstructionPoints + primaryElectricalReviewPoints + primaryElectricalChiefPoints;

    // 计算电气二次数据施设绩点
    let secondaryElectricalConstructionPoints = 0;
    project.dataItems.secondaryElectricalItems.forEach(item => {
        if (item.value && benchmarks.secondaryElectrical[item.name]) {
            const value = parseFloat(item.value);
            if (!isNaN(value)) {
                secondaryElectricalConstructionPoints += value * benchmarks.secondaryElectrical[item.name];
            }
        }
    });

    // 计算电气二次数据各项绩点
    const secondaryElectricalPreliminaryPoints = secondaryElectricalConstructionPoints * benchmarks.other['初设绩点基准'];
    const secondaryElectricalResearchPoints = secondaryElectricalConstructionPoints * benchmarks.other['可研绩点基准'];
    const secondaryElectricalReviewPoints = (secondaryElectricalResearchPoints + secondaryElectricalPreliminaryPoints + secondaryElectricalConstructionPoints) * benchmarks.other['校核绩点基准'];
    const secondaryElectricalChiefPoints = (secondaryElectricalResearchPoints + secondaryElectricalPreliminaryPoints + secondaryElectricalConstructionPoints) * benchmarks.other['设总绩点基准'];
    const secondaryElectricalTotalPoints = secondaryElectricalResearchPoints + secondaryElectricalPreliminaryPoints + secondaryElectricalConstructionPoints + secondaryElectricalReviewPoints + secondaryElectricalChiefPoints;

    // 计算土建数据施设绩点
    let civilEngineeringConstructionPoints = 0;
    project.dataItems.civilEngineeringItems.forEach(item => {
        if (item.value && benchmarks.civilEngineering[item.name]) {
            const value = parseFloat(item.value);
            if (!isNaN(value)) {
                civilEngineeringConstructionPoints += value * benchmarks.civilEngineering[item.name];
            }
        }
    });

    // 计算土建数据各项绩点
    const civilEngineeringPreliminaryPoints = civilEngineeringConstructionPoints * benchmarks.other['初设绩点基准'];
    const civilEngineeringResearchPoints = civilEngineeringConstructionPoints * benchmarks.other['可研绩点基准'];
    const civilEngineeringReviewPoints = (civilEngineeringResearchPoints + civilEngineeringPreliminaryPoints + civilEngineeringConstructionPoints) * benchmarks.other['校核绩点基准'];
    const civilEngineeringChiefPoints = (civilEngineeringResearchPoints + civilEngineeringPreliminaryPoints + civilEngineeringConstructionPoints) * benchmarks.other['设总绩点基准'];
    const civilEngineeringTotalPoints = civilEngineeringResearchPoints + civilEngineeringPreliminaryPoints + civilEngineeringConstructionPoints + civilEngineeringReviewPoints + civilEngineeringChiefPoints;

    // --- 修改项目类型调整系数计算逻辑 ---
    let projectTypeMultiplier = 1.0; // 默认系数为1.0
    let projectTypeName = '技改'; // 默认类型为技改

    // 获取用户选择的项目类型
    const typeSelect = document.querySelector(`.project-type-select[data-project="${projectIndex}"]`);
    if (typeSelect) {
        const selectedType = typeSelect.value;
        projectTypeName = selectedType;
        // 根据选择的类型设置系数
        projectTypeMultiplier = benchmarks.projectType[selectedType] || 1.0;
    }

    // 计算可研绩点汇总
    const researchTotalPoints = (
        primaryElectricalResearchPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        secondaryElectricalResearchPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        civilEngineeringResearchPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准'])
    ) * projectTypeMultiplier;

    // 计算初设绩点汇总
    const preliminaryTotalPoints = (
        primaryElectricalPreliminaryPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        secondaryElectricalPreliminaryPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        civilEngineeringPreliminaryPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准'])
    ) * projectTypeMultiplier;

    // 计算施设绩点汇总
    const constructionTotalPoints = (
        primaryElectricalConstructionPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        secondaryElectricalConstructionPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        civilEngineeringConstructionPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准'])
    ) * projectTypeMultiplier;

    // 计算项目总绩点
    const projectTotalPoints = researchTotalPoints + preliminaryTotalPoints + constructionTotalPoints;

    // 计算调整后的总绩点 (使用累加后的 projectTypeMultiplier)
    const adjustedTotalPoints = (primaryElectricalTotalPoints + secondaryElectricalTotalPoints + civilEngineeringTotalPoints) * projectTypeMultiplier;

    // 重新计算调整后的 可研/初设/施设 汇总绩点 (用于显示)
    const adjustedResearchTotalPoints = (
        primaryElectricalResearchPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        secondaryElectricalResearchPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        civilEngineeringResearchPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准'])
    ) * projectTypeMultiplier;

    const adjustedPreliminaryTotalPoints = (
        primaryElectricalPreliminaryPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        secondaryElectricalPreliminaryPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        civilEngineeringPreliminaryPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准'])
    ) * projectTypeMultiplier;

    const adjustedConstructionTotalPoints = (
        primaryElectricalConstructionPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        secondaryElectricalConstructionPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准']) +
        civilEngineeringConstructionPoints * (1 + benchmarks.other['校核绩点基准'] + benchmarks.other['设总绩点基准'])
    ) * projectTypeMultiplier;

    // 整理最终结果对象，确保键名与 displayProjectResults 匹配
    const results = {
        primary: {
            统计绩点: primaryElectricalStatisticalPoints,
            施设绩点: primaryElectricalConstructionPoints,
            初设绩点: primaryElectricalPreliminaryPoints,
            可研绩点: primaryElectricalResearchPoints,
            校核绩点: primaryElectricalReviewPoints,
            设总绩点: primaryElectricalChiefPoints,
            汇总绩点: primaryElectricalTotalPoints
        },
        secondary: {
            施设绩点: secondaryElectricalConstructionPoints,
            初设绩点: secondaryElectricalPreliminaryPoints,
            可研绩点: secondaryElectricalResearchPoints,
            校核绩点: secondaryElectricalReviewPoints,
            设总绩点: secondaryElectricalChiefPoints,
            汇总绩点: secondaryElectricalTotalPoints
        },
        civil: {
            施设绩点: civilEngineeringConstructionPoints,
            初设绩点: civilEngineeringPreliminaryPoints,
            可研绩点: civilEngineeringResearchPoints,
            校核绩点: civilEngineeringReviewPoints,
            设总绩点: civilEngineeringChiefPoints,
            汇总绩点: civilEngineeringTotalPoints
        },
        projectType: projectTypeName, // 项目类型名称
        projectTypeMultiplier: projectTypeMultiplier, // 项目类型系数
        // 添加调整后的阶段汇总绩点
        adjustedResearchTotal: adjustedResearchTotalPoints,
        adjustedPreliminaryTotal: adjustedPreliminaryTotalPoints,
        adjustedConstructionTotal: adjustedConstructionTotalPoints,
        adjustedTotalPoints: adjustedTotalPoints // 调整后的总绩点 (理论上等于上面三个之和)
    };

    // 保存计算结果
    project.results = results;
}

// 显示项目计算结果
function displayProjectResults(project, containerElement) {
    const results = project.results;
    if (!results) return;

    let resultHTML = `<h3>${project.name} 计算结果：</h3>`;

    const formatNumber = (num) => {
        // 保留最多4位小数，并移除末尾多余的0
        return parseFloat(num.toFixed(4));
    };

    // 电气一次数据
    resultHTML += `
        <details class="result-section">
            <summary>电气一次数据</summary>
            <div>
                <p>统计绩点: ${formatNumber(results.primary.统计绩点)}</p>
                <p>施设绩点: ${formatNumber(results.primary.施设绩点)}</p>
                <p>初设绩点: ${formatNumber(results.primary.初设绩点)}</p>
                <p>可研绩点: ${formatNumber(results.primary.可研绩点)}</p>
                <p>校核绩点: ${formatNumber(results.primary.校核绩点)}</p>
                <p>设总绩点: ${formatNumber(results.primary.设总绩点)}</p>
                <p><strong>一次专业汇总绩点: ${formatNumber(results.primary.汇总绩点)}</strong></p>
            </div>
        </details>
    `;

    // 电气二次数据
    resultHTML += `
        <details class="result-section">
            <summary>电气二次数据</summary>
            <div>
                <p>施设绩点: ${formatNumber(results.secondary.施设绩点)}</p>
                <p>初设绩点: ${formatNumber(results.secondary.初设绩点)}</p>
                <p>可研绩点: ${formatNumber(results.secondary.可研绩点)}</p>
                <p>校核绩点: ${formatNumber(results.secondary.校核绩点)}</p>
                <p>设总绩点: ${formatNumber(results.secondary.设总绩点)}</p>
                <p><strong>二次专业汇总绩点: ${formatNumber(results.secondary.汇总绩点)}</strong></p>
            </div>
        </details>
    `;

    // 土建数据
    resultHTML += `
        <details class="result-section">
            <summary>土建数据</summary>
            <div>
                <p>施设绩点: ${formatNumber(results.civil.施设绩点)}</p>
                <p>初设绩点: ${formatNumber(results.civil.初设绩点)}</p>
                <p>可研绩点: ${formatNumber(results.civil.可研绩点)}</p>
                <p>校核绩点: ${formatNumber(results.civil.校核绩点)}</p>
                <p>设总绩点: ${formatNumber(results.civil.设总绩点)}</p>
                <p><strong>土建专业汇总绩点: ${formatNumber(results.civil.汇总绩点)}</strong></p>
            </div>
        </details>
    `;

    // 项目汇总
    resultHTML += `
        <details class="result-section">
            <summary>项目汇总</summary>
            <div>
                <p>可研绩点汇总: ${formatNumber(results.adjustedResearchTotal)}</p>
                <p>初设绩点汇总: ${formatNumber(results.adjustedPreliminaryTotal)}</p>
                <p>施设绩点汇总: ${formatNumber(results.adjustedConstructionTotal)}</p>
            </div>
        </details>
    `;

    // 在所有 details 结束后，添加始终可见的调整后总绩点
    resultHTML += `
        <div class="final-adjusted-total">
            <strong>项目总绩点: ${formatNumber(results.adjustedTotalPoints)}</strong>
        </div>
    `;

    const resultDiv = document.createElement('div');
    resultDiv.className = 'project-results';
    resultDiv.innerHTML = resultHTML;

    // 移除旧的结果显示（如果存在）
    const existingResult = containerElement.querySelector('.project-results');
    if (existingResult) {
        containerElement.removeChild(existingResult);
    }

    // 添加新的结果显示
    containerElement.appendChild(resultDiv);
}

// 新增checkbox事件处理函数
function handleStationCheckboxChange(event) {
    const { project, index } = event.target.dataset;
    const projectIndex = parseInt(project);
    const value = event.target.checked ? '1' : '0';
    
    // 更新项目数据
    projects[projectIndex].dataItems.primaryElectricalStationItems[index].value = value;
} 