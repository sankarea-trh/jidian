// 定额查找器
// 用于根据项目类型和数量查找对应的定额值

// 注意：不再在顶层尝试加载 quotaData，findQuota 函数内部会直接访问 window.quotaData

/**
 * 查找定额值
 * @param {string} type 项目类型
 * @param {number} quantity 数量
 * @returns {number} 定额值
 */
function findQuota(type, quantity) {
    // 在函数内部获取最新的 quotaData
    const quotaData = (typeof window !== 'undefined' && window.quotaData) ? window.quotaData : [];

    // 转换为数字
    const numQuantity = parseFloat(quantity) || 0;

    // 如果定额数据未加载或为空
    if (!quotaData || !quotaData.length) {
        console.warn(`[findQuota] 定额数据 (window.quotaData) 为空或未加载，无法查找类型 '${type}' 的定额，返回 0`);
        return 0;
    }

    // 查找匹配的记录 (精准匹配 type 和 quantity)
    // 注意：这里假设 quotaData 里的 type 字符串与传入的 type 精确匹配
    // 如果需要模糊匹配或规范化，需要在此处添加逻辑
    const matchingRecords = quotaData.filter(item =>
        item.type === type && typeof item.quantity === 'number' && Math.abs(item.quantity - numQuantity) < 0.0001 // 比较浮点数
    );

    // 如果找到精确匹配，返回对应的定额值
    if (matchingRecords.length > 0) {
        // console.log(`[findQuota] 精确匹配: ${type}, ${numQuantity} -> ${matchingRecords[0].quota}`);
        return matchingRecords[0].quota;
    }

    // 如果没有精确匹配，查找该类型的所有记录以进行插值
    const typeRecords = quotaData.filter(item => item.type === type);
    if (typeRecords.length === 0) {
        console.warn(`[findQuota] 未找到类型为 '${type}' 的任何记录，返回 0`);
        return 0;
    }

    // 按数量排序
    typeRecords.sort((a, b) => a.quantity - b.quantity);

    // 如果数量小于最小记录，使用最小记录的定额值
    if (numQuantity <= typeRecords[0].quantity) {
        // console.log(`[findQuota] 小于最小: ${type}, ${numQuantity} <= ${typeRecords[0].quantity} -> ${typeRecords[0].quota}`);
        return typeRecords[0].quota;
    }

    // 如果数量大于最大记录，使用最大记录的定额值
    const lastRecord = typeRecords[typeRecords.length - 1];
    if (numQuantity >= lastRecord.quantity) {
        // console.log(`[findQuota] 大于最大: ${type}, ${numQuantity} >= ${lastRecord.quantity} -> ${lastRecord.quota}`);
        return lastRecord.quota;
    }

    // 否则找到最接近的两条记录进行插值
    for (let i = 0; i < typeRecords.length - 1; i++) {
        const lowerRecord = typeRecords[i];
        const upperRecord = typeRecords[i + 1];
        if (numQuantity >= lowerRecord.quantity && numQuantity <= upperRecord.quantity) {
            // 避免除以零
            const quantityDiff = upperRecord.quantity - lowerRecord.quantity;
            if (Math.abs(quantityDiff) < 0.0001) {
                // console.log(`[findQuota] 插值区间相同: ${type}, ${numQuantity} -> ${lowerRecord.quota}`);
                return lowerRecord.quota; // 区间相同，返回下限值
            }
            const ratio = (numQuantity - lowerRecord.quantity) / quantityDiff;
            const interpolatedQuota = lowerRecord.quota + ratio * (upperRecord.quota - lowerRecord.quota);
            // console.log(`[findQuota] 插值: ${type}, ${numQuantity} between ${lowerRecord.quantity} and ${upperRecord.quantity} -> ${interpolatedQuota}`);
            return interpolatedQuota;
        }
    }

    // Fallback if interpolation logic fails (should not happen with sorted data)
    console.warn(`[findQuota] 插值失败，返回类型 '${type}' 的第一条记录定额`);
    return typeRecords[0].quota;
}

// 如果在浏览器环境中，将函数暴露到全局
if (typeof window !== 'undefined') {
    console.log('[quotaFinder.js] Assigning findQuota to window.');
    window.findQuota = findQuota;
    console.log('[quotaFinder.js] window.findQuota type:', typeof window.findQuota);
} else {
    console.log('[quotaFinder.js] Not in a browser environment? Skipping window assignment.');
}

// 移除 Node.js 特有的导出方式
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = { findQuota };
// } 