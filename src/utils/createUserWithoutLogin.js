// src/utils/createUserWithoutLogin.js
// Helper function để tạo user mới mà không ảnh hưởng đến session hiện tại

/**
 * Tạo user mới mà không làm mất session của người tạo
 * @param {Object} supabase - Supabase client
 * @param {Object} userData - Thông tin user cần tạo
 * @param {string} userData.email - Email
 * @param {string} userData.password - Mật khẩu (mặc định theo role)
 * @param {string} userData.full_name - Họ tên
 * @param {string} userData.role - Role: teacher, student, school_admin
 * @param {string} userData.phone - Số điện thoại
 * @param {string} userData.school_id - ID trường
 * @param {string} userData.department_id - ID bộ phận
 * @param {string} userData.class_id - ID lớp (cho học sinh)
 * @param {string} userData.parent_name - Tên phụ huynh
 * @param {string} userData.parent_phone - SĐT phụ huynh
 * @param {string} userData.parent_pin - PIN phụ huynh (đã hash)
 * @returns {Object} { success: boolean, user?: Object, error?: string }
 */
export async function createUserWithoutLogin(supabase, userData) {
  // Lưu session hiện tại TRƯỚC KHI làm bất cứ điều gì
  const { data: sessionData } = await supabase.auth.getSession();
  const currentSession = sessionData?.session;

  try {
    // Kiểm tra email đã tồn tại chưa
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userData.email.toLowerCase())
      .single();

    if (existingUser) {
      return {
        success: false,
        error: 'Email này đã được sử dụng. Vui lòng dùng email khác.'
      };
    }

    // Xác định mật khẩu mặc định theo role
    const defaultPasswords = {
      teacher: 'Teacher@123',
      student: 'Student@123',
      school_admin: 'School@123',
      admin: 'Admin@123',
    };
    const password = userData.password || defaultPasswords[userData.role] || 'Default@123';

    // Tạo user mới qua auth
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email: userData.email.toLowerCase(),
      password: password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
        },
      },
    });

    // QUAN TRỌNG: Khôi phục session cũ NGAY LẬP TỨC
    if (currentSession) {
      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      });
    }

    // Kiểm tra lỗi signUp
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        return {
          success: false,
          error: 'Email này đã được đăng ký trong hệ thống.'
        };
      }
      throw signUpError;
    }

    // Kiểm tra user được tạo
    if (!newUser?.user) {
      return {
        success: false,
        error: 'Không thể tạo tài khoản. Vui lòng thử lại.'
      };
    }

    // Tạo/cập nhật profile
    const profileData = {
      id: newUser.user.id,
      email: userData.email.toLowerCase(),
      full_name: userData.full_name,
      role: userData.role,
      phone: userData.phone || null,
      school_id: userData.school_id || null,
      department_id: userData.department_id || null,
      class_id: userData.class_id || null,
      parent_name: userData.parent_name || null,
      parent_phone: userData.parent_phone || null,
      parent_pin: userData.parent_pin || null,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Xóa các field null/undefined
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === null || profileData[key] === undefined) {
        delete profileData[key];
      }
    });

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (profileError) {
      console.error('Profile error:', profileError);
      // Không throw vì user đã được tạo trong auth
    }

    return {
      success: true,
      user: newUser.user,
      password: password,
    };

  } catch (error) {
    // Nếu có lỗi, vẫn khôi phục session cũ
    if (currentSession) {
      try {
        await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
        });
      } catch (e) {
        console.error('Restore session error:', e);
      }
    }

    return {
      success: false,
      error: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
    };
  }
}

export default createUserWithoutLogin;
