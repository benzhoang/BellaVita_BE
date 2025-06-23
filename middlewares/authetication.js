const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
// const AIPackage = require('../models/aiPackageModel');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware kiểm tra quyền (ví dụ: chỉ cho admin)
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.sendStatus(403);
    next();
  };
}

// Middleware kiểm tra gói AI - TẠM THỜI DISABLE
async function checkAIPackage(req, res, next) {
  // TODO: Implement khi có AI backend
  console.log('🤖 AI Package check - TẠM THỜI DISABLE');
  console.log('📝 Cần tích hợp AI backend trước khi enable');
  
  // Tạm thời cho phép tất cả user đã đăng nhập
  next();
  
  /* 
  // Code gốc - sẽ enable sau khi có AI backend
  try {
    console.log('🔍 Kiểm tra gói AI cho user:', req.user.user_id);
    
    // Lấy thông tin user từ database
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Kiểm tra user có gói AI không
    if (!user.ai_package_id) {
      return res.status(403).json({ 
        success: false, 
        error: 'AI package required. Please purchase an AI package to use this feature.' 
      });
    }

    // Kiểm tra gói AI có tồn tại và active không
    const aiPackage = await AIPackage.findByPk(user.ai_package_id);
    if (!aiPackage || !aiPackage.status) {
      return res.status(403).json({ 
        success: false, 
        error: 'Your AI package is not available. Please contact support.' 
      });
    }

    // Kiểm tra gói AI có hết hạn không
    if (user.ai_package_expires_at && new Date() > user.ai_package_expires_at) {
      return res.status(403).json({ 
        success: false, 
        error: 'Your AI package has expired. Please renew your subscription.' 
      });
    }

    // Kiểm tra số lần sử dụng có vượt quá giới hạn không
    if (aiPackage.max_usage && user.ai_usage_count >= aiPackage.max_usage) {
      return res.status(403).json({ 
        success: false, 
        error: `You have reached the maximum usage limit (${aiPackage.max_usage} times). Please upgrade your package.` 
      });
    }

    // Lưu thông tin gói AI vào request để sử dụng sau
    req.userAIPackage = aiPackage;
    req.userAIUsage = user.ai_usage_count;
    
    console.log('✅ User có gói AI hợp lệ:', aiPackage.name);
    next();
    
  } catch (error) {
    console.error('❌ Lỗi kiểm tra gói AI:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error checking AI package. Please try again.' 
    });
  }
  */
}

module.exports = { authenticateToken, authorizeRole, checkAIPackage };