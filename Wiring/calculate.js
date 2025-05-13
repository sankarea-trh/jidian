// 解析上传的文本文件，支持多个项目
function parseProjectFile(fileContent) {
  // 使用分隔符分割多个项目
  const projectSections = fileContent.split(/\-{2,}/);
  const projects = [];

  projectSections.forEach(section => {
    if (section.trim() === '') return;

    const lines = section.trim().split('\n');
    const projectData = {
      name: '',
      type: 'pure', // 默认为纯电缆或纯架空
      typeText: '纯电缆或纯架空', // 显示用的类型文本
      items: {}
    };

    // 处理每一行数据
    let hasOverhead = false;
    let hasCable = false;
    lines.forEach((line, index) => {
      const parts = line.trim().split(/\s+/);
      if (line.includes('架空线路')) hasOverhead = true;
      if (line.includes('电缆')) hasCable = true;
      if (parts.length >= 2) {
        const key = parts[0];
        
        // 处理项目名称
        if (key === '项目名称') {
          projectData.name = parts.slice(1).join(' ');
          return;
        }
        
        // 处理项目类型 - 现在使用"项目类型"作为键
        if (key === '项目类型') {
          const typeText = parts.slice(1).join(' ');
          projectData.typeText = typeText; // 保存原始类型文本
          
          if (typeText.includes('有电缆有架空') || typeText.includes('有线缆有架空') || 
              typeText === '混合' || typeText === '混合类型') {
            projectData.type = 'mixed';
          } else if (typeText.includes('纯电缆') || typeText.includes('纯架空') || 
                    typeText.includes('纯线缆') || typeText.includes('纯电缆或纯架空')) {
            projectData.type = 'pure';
          }
          return;
        }
        
        // 处理具体项目 - 改进的部分，处理带有冒号和描述的项目名称
        if (parts.length >= 3) {
          // 获取完整的行内容，然后重新解析
          const fullLine = line.trim();
          
          // 使用辅助函数解析项目行
          const parsedItem = parseProjectLine(fullLine);
          
          if (parsedItem.name && parsedItem.type && !isNaN(parsedItem.value)) {
            if (!projectData.items[parsedItem.name]) {
              projectData.items[parsedItem.name] = {};
            }
            
            projectData.items[parsedItem.name][parsedItem.type] = parsedItem.value;
            console.log(`解析项目行: 名称=${parsedItem.name}, 类型=${parsedItem.type}, 值=${parsedItem.value}`);
          }
        }
      }
    });
    
    // 自动识别混合线路
    if (hasOverhead && hasCable) {
      projectData.type = 'mixed';
      projectData.typeText = '有电缆有架空';
    }
    
    console.log(`解析到项目: ${projectData.name}, 类型: ${projectData.typeText}`);
    projects.push(projectData);
  });
  
  return projects;
}

// 计算单个项目的绩点
function calculateSingleProjectPoints(projectData) {
  const { items } = projectData;
  // 优先使用页面选择的类型
  const projectId = projectData.name.replace(/\s+/g, '_');
  const typeFromUI = document.getElementById(`projectType_${projectId}`).value;
  let type = typeFromUI === '有电缆有架空' ? 'mixed' : 'pure';
  let typeText = typeFromUI;
  
  // 计算基础项目绩点
  let basePoints = 0;
  let basePointsFormula = [];
  
  for (const itemName in items) {
    for (const itemType in items[itemName]) {
      const itemValue = items[itemName][itemType];
      
      // 查找对应的基准值
      let baseValue = 0;
      if (basePointData[itemName] && basePointData[itemName][itemType]) {
        baseValue = basePointData[itemName][itemType];
      }
      
      console.log(`项目: ${itemName}, 类型: ${itemType}, 数量: ${itemValue}, 基准值: ${baseValue}, 小计: ${itemValue * baseValue}`);
      basePoints += itemValue * baseValue;
      
      // 添加到公式中
      if (itemValue && baseValue) {
        basePointsFormula.push(`${itemValue} × ${baseValue}`);
      }
    }
  }
  console.log(`基础项目绩点: ${basePoints}`);
  
  // 从界面上获取项目特定的调整系数
  const stateGridCoef = parseFloat(document.getElementById(`stateGridAdjustment_${projectId}`).value);
  const voltageCoef = parseFloat(document.getElementById(`voltageLevelAdjustment_${projectId}`).value);
  const mountainCoef = parseFloat(document.getElementById(`mountainAdjustment_${projectId}`).value);
  const altitudeCoef = parseFloat(document.getElementById(`altitudeAdjustment_${projectId}`).value);
  
  // 计算架空和电缆公里数调整系数
  const overheadLength = parseFloat(document.getElementById(`overheadLength_${projectId}`).value);
  const cableLength = parseFloat(document.getElementById(`cableLength_${projectId}`).value);
  
  const overheadCoef = 1 + ((overheadLength - 20) / 5) * 0.05;
  const cableCoef = 1 + ((cableLength - 2) / 0.5) * 0.05;
  
  // 不同类型项目难度系数
  const difficultyCoef = parseFloat(document.getElementById(`difficultyCoef_${projectId}`).value);
  
  console.log(`项目类型: ${typeText}, 计算类型: ${type}`);
  console.log(`调整系数:
  国网工程调整系数: ${stateGridCoef}
  电压等级调整系数: ${voltageCoef}
  山地调整系数: ${mountainCoef}
  海拔调整系数: ${altitudeCoef}
  架空公里数调整系数: ${overheadCoef}
  电缆公里数调整系数: ${cableCoef}
  不同类型项目难度系数: ${difficultyCoef}`);
  
  // 判断项目类型并计算总绩点
  let totalPoints = 0;
  let formula = '';
  
  if (type === 'pure') {
    // 纯电缆或纯架空
    // 如果overheadCoef或cableCoef其中一个为0，使用另一个作为系数值
    const lineCoef = (overheadLength === 0) ? cableCoef : overheadCoef;
    totalPoints = stateGridCoef * voltageCoef * mountainCoef * altitudeCoef * lineCoef * difficultyCoef * basePoints;
    
    formula = `${stateGridCoef} × ${voltageCoef} × ${mountainCoef} × ${altitudeCoef} × ${lineCoef} × ${difficultyCoef} × (${basePointsFormula.join(' + ')})`;
    
    console.log(`纯电缆或纯架空公式: ${stateGridCoef} * ${voltageCoef} * ${mountainCoef} * ${altitudeCoef} * ${lineCoef} * ${difficultyCoef} * ${basePoints} = ${totalPoints}`);
  } else if (type === 'mixed') {
    // 有架空有电缆 - 修正公式
    // 使用精确计算方法处理系数相加
    const sumCoef = preciseAdd(overheadCoef, cableCoef);
    
    // 记录原始的计算，便于分析
    console.log(`架空系数: ${overheadCoef}, 电缆系数: ${cableCoef}, 精确和: ${sumCoef}`);
    
    // 计算总绩点
    totalPoints = stateGridCoef * voltageCoef * mountainCoef * altitudeCoef * sumCoef * 0.6 * difficultyCoef * basePoints;
    
    // 在公式展示中使用精确值
    formula = `${stateGridCoef} × ${voltageCoef} × ${mountainCoef} × ${altitudeCoef} × ${sumCoef} × 0.6 × ${difficultyCoef} × (${basePointsFormula.join(' + ')})`;
    
    console.log(`有电缆有架空公式: ${stateGridCoef} * ${voltageCoef} * ${mountainCoef} * ${altitudeCoef} * ${sumCoef} * 0.6 * ${difficultyCoef} * ${basePoints} = ${totalPoints}`);
  }
  
  return {
    name: projectData.name,
    type: typeText, // 使用原始类型文本
    points: totalPoints,
    formula: formula // 添加计算公式
  };
}

// 计算项目总绩点 - 支持批量计算
function calculateProjectPoints(projectsData) {
  // 如果是单个项目数据，封装成数组
  if (!Array.isArray(projectsData)) {
    const singleProject = calculateSingleProjectPoints(projectsData);
    return [singleProject];
  }
  
  // 批量计算多个项目
  const results = projectsData.map(project => {
    console.log(`\n计算项目: ${project.name}`);
    return calculateSingleProjectPoints(project);
  });
  
  return results;
}

// 辅助函数：解析项目行
function parseProjectLine(line) {
  const fullLine = line.trim();
  let itemName, itemType, itemValue;
  
  // 尝试根据特征模式匹配项目行
  // 识别"项目名称（可能含冒号等）类型 值"格式
  const linePattern = /^(.+?)(?:\s+|：|:)(?:.+\s+)?(\S+)\s+(\d+\.?\d*)$/;
  const match = fullLine.match(linePattern);
  
  if (match) {
    const [_, possibleName, possibleType, possibleValue] = match;
    
    // 确认值部分是数字
    const value = parseFloat(possibleValue);
    if (!isNaN(value)) {
      itemValue = value;
      itemType = possibleType;
      
      // 移除所有标点符号以便比较
      const cleanFullLine = fullLine.replace(/[：:（）()、，,.\[\]【】""''\-\/]/g, '');
      
      // 提取关键信息
      const voltageLevel = extractVoltageLevel(cleanFullLine);
      const lineType = extractLineType(cleanFullLine);
      const terrainType = extractTerrainType(cleanFullLine);
      
      // 构建匹配候选项数组
      let candidates = [];
      
      for (const baseName in basePointData) {
        // 检查是否有对应项目类型的基准数据
        if (basePointData[baseName][itemType]) {
          const cleanBaseName = baseName.replace(/[：:（）()、，,.\[\]【】""''\-\/]/g, '');
          
          // 计算相似度评分
          let score = 0;
          
          // 1. 电压等级匹配（最高优先级）
          if (voltageLevel) {
            const baseVoltageLevel = extractVoltageLevel(cleanBaseName);
            if (baseVoltageLevel === voltageLevel) {
              score += 100; // 电压等级完全匹配
            } else if (baseVoltageLevel && voltageLevel) {
              score -= 50; // 电压等级不匹配，严重扣分
            }
          }
          
          // 2. 线路类型匹配
          if (lineType) {
            const baseLineType = extractLineType(cleanBaseName);
            if (baseLineType === lineType) {
              score += 50; // 线路类型完全匹配
            }
          }
          
          // 3. 地形类型匹配
          if (terrainType) {
            const baseTerrainType = extractTerrainType(cleanBaseName);
            if (baseTerrainType === terrainType) {
              score += 30; // 地形类型完全匹配
            }
          }
          
          // 4. 文本相似度
          if (cleanFullLine.includes(cleanBaseName)) {
            score += cleanBaseName.length * 2;
          } 
          else if (cleanBaseName.includes(cleanFullLine)) {
            score += cleanFullLine.length * 1.5;
          }
          else {
            // 计算共同字符数
            for (let i = 0; i < cleanBaseName.length; i++) {
              if (cleanFullLine.includes(cleanBaseName[i])) {
                score += 1;
              }
            }
          }
          
          // 增加候选项
          if (score > 0) {
            candidates.push({
              name: baseName,
              score: score,
              voltageMatch: voltageLevel && extractVoltageLevel(cleanBaseName) === voltageLevel,
              lineTypeMatch: lineType && extractLineType(cleanBaseName) === lineType
            });
          }
        }
      }
      
      // 按分数排序并选择最佳匹配
      if (candidates.length > 0) {
        candidates.sort((a, b) => {
          // 优先考虑电压等级和线路类型完全匹配的项
          if (a.voltageMatch && !b.voltageMatch) return -1;
          if (!a.voltageMatch && b.voltageMatch) return 1;
          if (a.lineTypeMatch && !b.lineTypeMatch) return -1;
          if (!a.lineTypeMatch && b.lineTypeMatch) return 1;
          // 其次考虑总分
          return b.score - a.score;
        });
        
        itemName = candidates[0].name;
        console.log(`匹配结果: "${fullLine}" => "${itemName}", 得分: ${candidates[0].score}`);
      } 
      else {
        // 如果没有找到任何匹配，使用原始名称
        itemName = possibleName;
      }
    }
  }
  
  // 调试信息
  console.log(`解析行: "${fullLine}" => 名称="${itemName}", 类型="${itemType}", 值=${itemValue}`);
  
  return {
    name: itemName,
    type: itemType,
    value: itemValue
  };
}

// 辅助函数：提取电压等级
function extractVoltageLevel(text) {
  const voltagePatterns = [
    { pattern: /500kV/, value: '500kV' },
    { pattern: /220kV/, value: '220kV' },
    { pattern: /110kV/, value: '110kV' },
    { pattern: /35kV/, value: '35kV' },
    { pattern: /10kV/, value: '10kV' }
  ];
  
  for (const { pattern, value } of voltagePatterns) {
    if (pattern.test(text)) {
      return value;
    }
  }
  return null;
}

// 辅助函数：提取线路类型
function extractLineType(text) {
  if (text.includes('架空线路')) return '架空';
  if (text.includes('电缆')) return '电缆';
  return null;
}

// 辅助函数：提取地形类型
function extractTerrainType(text) {
  if (text.includes('山地')) return '山地';
  if (text.includes('丘陵')) return '丘陵';
  if (text.includes('平原')) return '平原';
  return null;
}

// 辅助函数：精确计算小数相加，避免浮点数精度问题
function preciseAdd(num1, num2) {
  // 将数字转为字符串
  const str1 = num1.toString();
  const str2 = num2.toString();
  
  // 获取小数位数
  const decimalPlaces1 = str1.includes('.') ? str1.split('.')[1].length : 0;
  const decimalPlaces2 = str2.includes('.') ? str2.split('.')[1].length : 0;
  
  // 取最大小数位数
  const maxDecimalPlaces = Math.max(decimalPlaces1, decimalPlaces2);
  
  // 计算整数相加
  const int1 = parseInt(str1.replace('.', '')) * Math.pow(10, maxDecimalPlaces - decimalPlaces1);
  const int2 = parseInt(str2.replace('.', '')) * Math.pow(10, maxDecimalPlaces - decimalPlaces2);
  
  // 直接使用原始计算值，不截断或四舍五入
  const result = (int1 + int2) / Math.pow(10, maxDecimalPlaces);
  
  // 添加调试日志
  console.log(`精确相加: ${num1} + ${num2} = ${result}`);
  
  return result;
} 