-- =====================================================
-- FIX HỆ THỐNG ĐĂNG NHẬP VÀ PHÂN QUYỀN
-- Version: 3.6.1
-- Date: 2026-01-23
-- =====================================================

-- =====================================================
-- 1. FIX RLS POLICIES CHO RBAC_USERS
-- =====================================================

-- Xóa tất cả policies cũ
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'rbac_users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON rbac_users', pol.policyname);
    END LOOP;
END $$;

-- Bật RLS
ALTER TABLE rbac_users ENABLE ROW LEVEL SECURITY;

-- Policy: User có thể đọc profile của chính mình
CREATE POLICY "rbac_users_select_own" ON rbac_users
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

-- Policy: User có thể update profile của chính mình
CREATE POLICY "rbac_users_update_own" ON rbac_users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Cho phép insert khi tạo profile mới (id phải = auth.uid)
CREATE POLICY "rbac_users_insert_own" ON rbac_users
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Policy: Admin có thể đọc tất cả users (dùng subquery an toàn)
CREATE POLICY "rbac_users_admin_read_all" ON rbac_users
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM rbac_users ru
            WHERE ru.id = auth.uid() AND ru.role = 'admin'
        )
    );

-- Policy: Admin có thể update tất cả users
CREATE POLICY "rbac_users_admin_update_all" ON rbac_users
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM rbac_users ru
            WHERE ru.id = auth.uid() AND ru.role = 'admin'
        )
    );

-- Policy: Service role bypass (cho triggers và admin functions)
ALTER TABLE rbac_users FORCE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON rbac_users TO authenticated;
GRANT ALL ON rbac_users TO service_role;
GRANT ALL ON rbac_users TO anon;

-- =====================================================
-- 2. TẠO TRIGGER TỰ ĐỘNG TẠO RBAC_USERS KHI ĐĂNG KÝ
-- =====================================================

-- Function tạo rbac_users profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Tạo record trong rbac_users
    INSERT INTO rbac_users (id, email, name, role, is_active, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, rbac_users.name),
        updated_at = NOW();

    -- Tạo record trong accounts (cho parent flow)
    INSERT INTO accounts (id, user_id, email, name, parent_pin, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        '1234',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Xóa trigger cũ nếu có
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Tạo trigger mới
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 3. FUNCTION TẠO PROFILE NẾU CHƯA CÓ (cho code gọi)
-- =====================================================

CREATE OR REPLACE FUNCTION ensure_user_profile(p_user_id UUID)
RETURNS rbac_users AS $$
DECLARE
    v_profile rbac_users;
    v_user auth.users;
BEGIN
    -- Kiểm tra profile đã tồn tại chưa
    SELECT * INTO v_profile FROM rbac_users WHERE id = p_user_id;

    IF v_profile.id IS NOT NULL THEN
        RETURN v_profile;
    END IF;

    -- Lấy thông tin từ auth.users
    SELECT * INTO v_user FROM auth.users WHERE id = p_user_id;

    IF v_user.id IS NULL THEN
        RAISE EXCEPTION 'User not found in auth.users';
    END IF;

    -- Tạo profile mới
    INSERT INTO rbac_users (id, email, name, role, is_active, created_at, updated_at)
    VALUES (
        v_user.id,
        v_user.email,
        COALESCE(v_user.raw_user_meta_data->>'name', split_part(v_user.email, '@', 1)),
        COALESCE(v_user.raw_user_meta_data->>'role', 'student'),
        true,
        NOW(),
        NOW()
    )
    RETURNING * INTO v_profile;

    RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. ĐỒNG BỘ DỮ LIỆU HIỆN TẠI
-- =====================================================

-- Đồng bộ tất cả auth.users vào rbac_users
INSERT INTO rbac_users (id, email, name, role, is_active, created_at, updated_at)
SELECT
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
    COALESCE(u.raw_user_meta_data->>'role', 'student'),
    true,
    COALESCE(u.created_at, NOW()),
    NOW()
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM rbac_users r WHERE r.id = u.id)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Đồng bộ tất cả auth.users vào accounts
INSERT INTO accounts (id, user_id, email, name, parent_pin, created_at, updated_at)
SELECT
    u.id,
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
    '1234',
    COALESCE(u.created_at, NOW()),
    NOW()
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM accounts a WHERE a.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- Cập nhật role cho admin và teacher đã tạo
UPDATE rbac_users SET role = 'admin' WHERE email = 'admin@gdtm.vn';
UPDATE rbac_users SET role = 'teacher' WHERE email = 'teacher@gdtm.vn';

-- =====================================================
-- 5. FIX RLS CHO ACCOUNTS
-- =====================================================

-- Xóa policies cũ
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'accounts'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON accounts', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accounts_select_own" ON accounts
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR id = auth.uid());

CREATE POLICY "accounts_update_own" ON accounts
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid() OR id = auth.uid());

CREATE POLICY "accounts_insert_own" ON accounts
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid() OR id = auth.uid());

GRANT ALL ON accounts TO authenticated;

-- =====================================================
-- 6. KIỂM TRA KẾT QUẢ
-- =====================================================

-- Hiển thị policies đã tạo
SELECT tablename, policyname, cmd FROM pg_policies
WHERE tablename IN ('rbac_users', 'accounts')
ORDER BY tablename, policyname;

-- Hiển thị users đã đồng bộ
SELECT r.id, r.email, r.role, a.id as account_id
FROM rbac_users r
LEFT JOIN accounts a ON a.id = r.id
LIMIT 10;
