-- =====================================================
-- PAYMENT SYSTEM SCHEMA
-- Version: 1.0.0
-- =====================================================

-- 1. ENUM cho payment status
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'trial');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('momo', 'vnpay', 'bank_transfer', 'free');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Bảng PLANS (Các gói dịch vụ)
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- free, basic, premium
  role user_role NOT NULL, -- admin, teacher, parent, student
  price_monthly INTEGER DEFAULT 0, -- VND
  price_yearly INTEGER DEFAULT 0, -- VND
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plans_role ON public.plans(role);
CREATE INDEX IF NOT EXISTS idx_plans_slug ON public.plans(slug);

-- 3. Bảng SUBSCRIPTIONS (Đăng ký gói)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status subscription_status DEFAULT 'trial',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON public.subscriptions(end_date);

-- 4. Bảng PAYMENTS (Lịch sử thanh toán)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  plan_id UUID REFERENCES public.plans(id),
  amount INTEGER NOT NULL, -- VND
  original_amount INTEGER, -- Giá gốc trước giảm
  discount_amount INTEGER DEFAULT 0,
  promo_code_id UUID,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id TEXT, -- Mã giao dịch từ cổng thanh toán
  bank_transaction_id TEXT, -- Mã giao dịch ngân hàng (cho chuyển khoản)
  payment_data JSONB DEFAULT '{}'::jsonb, -- Dữ liệu thêm từ cổng thanh toán
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON public.payments(transaction_id);

-- 5. Bảng PROMO_CODES (Mã giảm giá)
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_percent INTEGER DEFAULT 0, -- % giảm giá (0-100)
  discount_amount INTEGER DEFAULT 0, -- Số tiền giảm cố định (VND)
  min_amount INTEGER DEFAULT 0, -- Đơn hàng tối thiểu
  max_discount INTEGER, -- Giảm tối đa
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  max_uses INTEGER, -- Số lần sử dụng tối đa
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  applicable_plans UUID[], -- Áp dụng cho plans nào
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_valid ON public.promo_codes(valid_from, valid_to);

-- 6. Bảng PROMO_CODE_USES (Lịch sử sử dụng mã)
CREATE TABLE IF NOT EXISTS public.promo_code_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  payment_id UUID REFERENCES public.payments(id),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id)
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_uses ENABLE ROW LEVEL SECURITY;

-- Plans: Ai cũng có thể xem
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage plans" ON public.plans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.rbac_users WHERE id = auth.uid() AND role = 'admin')
  );

-- Subscriptions: User xem của mình, Admin xem tất cả
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.rbac_users WHERE id = auth.uid() AND role = 'admin')
  );

-- Payments: User xem của mình, Admin xem tất cả
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can manage all payments" ON public.payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.rbac_users WHERE id = auth.uid() AND role = 'admin')
  );

-- Promo codes: Ai cũng có thể xem active codes
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes
  FOR SELECT USING (is_active = true AND (valid_to IS NULL OR valid_to > NOW()));

CREATE POLICY "Admin can manage promo codes" ON public.promo_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.rbac_users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Kiểm tra và áp dụng mã giảm giá
CREATE OR REPLACE FUNCTION public.validate_promo_code(p_code TEXT, p_plan_id UUID, p_amount INTEGER)
RETURNS JSON AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_discount INTEGER;
  v_result JSON;
BEGIN
  -- Tìm promo code
  SELECT * INTO v_promo FROM promo_codes
  WHERE code = UPPER(p_code)
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_to IS NULL OR valid_to > NOW())
    AND (max_uses IS NULL OR used_count < max_uses);

  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Mã giảm giá không hợp lệ hoặc đã hết hạn');
  END IF;

  -- Kiểm tra đơn hàng tối thiểu
  IF p_amount < v_promo.min_amount THEN
    RETURN json_build_object('valid', false, 'error', 'Đơn hàng chưa đạt giá trị tối thiểu');
  END IF;

  -- Kiểm tra plan áp dụng
  IF v_promo.applicable_plans IS NOT NULL AND NOT (p_plan_id = ANY(v_promo.applicable_plans)) THEN
    RETURN json_build_object('valid', false, 'error', 'Mã không áp dụng cho gói này');
  END IF;

  -- Tính giảm giá
  IF v_promo.discount_percent > 0 THEN
    v_discount := (p_amount * v_promo.discount_percent / 100);
  ELSE
    v_discount := v_promo.discount_amount;
  END IF;

  -- Áp dụng giảm tối đa
  IF v_promo.max_discount IS NOT NULL AND v_discount > v_promo.max_discount THEN
    v_discount := v_promo.max_discount;
  END IF;

  RETURN json_build_object(
    'valid', true,
    'promo_id', v_promo.id,
    'discount', v_discount,
    'final_amount', GREATEST(p_amount - v_discount, 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Tạo subscription mới
CREATE OR REPLACE FUNCTION public.create_subscription(
  p_user_id UUID,
  p_plan_id UUID,
  p_months INTEGER DEFAULT 1
)
RETURNS JSON AS $$
DECLARE
  v_plan plans%ROWTYPE;
  v_subscription subscriptions%ROWTYPE;
  v_end_date TIMESTAMPTZ;
BEGIN
  -- Lấy thông tin plan
  SELECT * INTO v_plan FROM plans WHERE id = p_plan_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Gói không tồn tại');
  END IF;

  -- Tính ngày hết hạn
  v_end_date := NOW() + (p_months || ' months')::interval;

  -- Hủy subscription cũ nếu có
  UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW()
  WHERE user_id = p_user_id AND status IN ('active', 'trial');

  -- Tạo subscription mới
  INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date)
  VALUES (p_user_id, p_plan_id, 'active', NOW(), v_end_date)
  RETURNING * INTO v_subscription;

  RETURN json_build_object(
    'success', true,
    'subscription_id', v_subscription.id,
    'end_date', v_subscription.end_date
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Kiểm tra quyền theo subscription
CREATE OR REPLACE FUNCTION public.check_feature_access(p_user_id UUID, p_feature TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_features JSONB;
BEGIN
  SELECT p.features INTO v_features
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.user_id = p_user_id
    AND s.status = 'active'
    AND (s.end_date IS NULL OR s.end_date > NOW())
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF v_features IS NULL THEN
    RETURN false;
  END IF;

  RETURN v_features ? p_feature;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lấy subscription hiện tại của user
CREATE OR REPLACE FUNCTION public.get_user_subscription(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'subscription_id', s.id,
    'plan_id', p.id,
    'plan_name', p.name,
    'plan_slug', p.slug,
    'status', s.status,
    'features', p.features,
    'limits', p.limits,
    'start_date', s.start_date,
    'end_date', s.end_date,
    'auto_renew', s.auto_renew,
    'days_remaining', EXTRACT(DAY FROM (s.end_date - NOW()))::INTEGER
  ) INTO v_result
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trial')
    AND (s.end_date IS NULL OR s.end_date > NOW())
  ORDER BY s.created_at DESC
  LIMIT 1;

  RETURN COALESCE(v_result, json_build_object('plan_slug', 'free', 'status', 'none'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Thống kê thanh toán cho Admin
CREATE OR REPLACE FUNCTION public.get_payment_stats()
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_revenue', COALESCE(SUM(amount) FILTER (WHERE status = 'success'), 0),
    'total_payments', COUNT(*) FILTER (WHERE status = 'success'),
    'pending_payments', COUNT(*) FILTER (WHERE status = 'pending'),
    'this_month_revenue', COALESCE(SUM(amount) FILTER (WHERE status = 'success' AND created_at >= date_trunc('month', NOW())), 0),
    'active_subscriptions', (SELECT COUNT(*) FROM subscriptions WHERE status = 'active')
  ) INTO v_result FROM payments;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SEED DATA: Các gói mặc định
-- =====================================================

-- Gói cho Học sinh
INSERT INTO plans (name, slug, role, price_monthly, price_yearly, features, limits, sort_order) VALUES
('Miễn phí', 'student-free', 'student', 0, 0,
  '["Truy cập 5 bài học/ngày", "Game học tập cơ bản", "Theo dõi tiến độ"]'::jsonb,
  '{"lessons_per_day": 5, "games_per_day": 3}'::jsonb, 1),
('Cơ bản', 'student-basic', 'student', 49000, 470000,
  '["Truy cập 20 bài học/ngày", "Tất cả game học tập", "Báo cáo chi tiết", "Không quảng cáo"]'::jsonb,
  '{"lessons_per_day": 20, "games_per_day": 10}'::jsonb, 2),
('Premium', 'student-premium', 'student', 99000, 950000,
  '["Truy cập không giới hạn", "Tất cả tính năng", "Học offline", "Hỗ trợ ưu tiên", "Chứng chỉ hoàn thành"]'::jsonb,
  '{"lessons_per_day": -1, "games_per_day": -1}'::jsonb, 3)
ON CONFLICT (slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;

-- Gói cho Phụ huynh
INSERT INTO plans (name, slug, role, price_monthly, price_yearly, features, limits, sort_order) VALUES
('Miễn phí', 'parent-free', 'parent', 0, 0,
  '["Theo dõi 1 con", "Xem tiến độ cơ bản", "Thông báo email"]'::jsonb,
  '{"max_children": 1}'::jsonb, 1),
('Gia đình', 'parent-basic', 'parent', 79000, 760000,
  '["Theo dõi đến 3 con", "Báo cáo chi tiết", "Đặt giới hạn thời gian", "Thông báo real-time"]'::jsonb,
  '{"max_children": 3}'::jsonb, 2),
('Premium', 'parent-premium', 'parent', 149000, 1430000,
  '["Theo dõi không giới hạn", "Tất cả tính năng", "Tư vấn học tập", "Hỗ trợ ưu tiên"]'::jsonb,
  '{"max_children": -1}'::jsonb, 3)
ON CONFLICT (slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;

-- Gói cho Giáo viên
INSERT INTO plans (name, slug, role, price_monthly, price_yearly, features, limits, sort_order) VALUES
('Miễn phí', 'teacher-free', 'teacher', 0, 0,
  '["Quản lý 1 lớp", "Tối đa 20 học sinh", "Giao bài tập cơ bản"]'::jsonb,
  '{"max_classes": 1, "max_students": 20}'::jsonb, 1),
('Chuyên nghiệp', 'teacher-basic', 'teacher', 199000, 1910000,
  '["Quản lý 5 lớp", "Tối đa 150 học sinh", "Báo cáo nâng cao", "Tạo bài tập tùy chỉnh"]'::jsonb,
  '{"max_classes": 5, "max_students": 150}'::jsonb, 2),
('Trường học', 'teacher-premium', 'teacher', 499000, 4790000,
  '["Không giới hạn lớp", "Không giới hạn học sinh", "API tích hợp", "Hỗ trợ dedicated"]'::jsonb,
  '{"max_classes": -1, "max_students": -1}'::jsonb, 3)
ON CONFLICT (slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;

-- Mã giảm giá mẫu
INSERT INTO promo_codes (code, description, discount_percent, valid_to, max_uses) VALUES
('WELCOME20', 'Giảm 20% cho người dùng mới', 20, NOW() + interval '1 year', 1000),
('NEWYEAR2024', 'Khuyến mãi năm mới 2024', 30, '2024-02-29', 500)
ON CONFLICT (code) DO NOTHING;
