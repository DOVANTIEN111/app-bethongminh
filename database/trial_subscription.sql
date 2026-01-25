-- =====================================================
-- SCHOOLHUB - HỆ THỐNG ĐĂNG KÝ DÙNG THỬ
-- =====================================================

-- 1. Thêm cột duration_days vào bảng plans
ALTER TABLE plans ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT FALSE;

-- 2. Thêm cột is_trial vào bảng subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT FALSE;

-- 3. Tạo gói Dùng thử (Trial)
INSERT INTO plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  features,
  max_students,
  is_active,
  is_trial,
  duration_days,
  created_at
) VALUES (
  gen_random_uuid(),
  'Dùng thử',
  'trial',
  'Dùng thử miễn phí 30 ngày - Trải nghiệm tất cả tính năng',
  0,
  0,
  '["Tất cả bài học", "30 ngày miễn phí", "Không cần thẻ tín dụng", "Hỗ trợ 24/7"]',
  1,
  true,
  true,
  30,
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  is_trial = EXCLUDED.is_trial,
  duration_days = EXCLUDED.duration_days;

-- 4. Tạo gói Miễn phí (Free)
INSERT INTO plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  features,
  max_students,
  is_active,
  is_trial,
  duration_days,
  created_at
) VALUES (
  gen_random_uuid(),
  'Miễn phí',
  'free',
  'Gói miễn phí - 3 bài học mỗi môn',
  0,
  0,
  '["3 bài học mỗi môn", "Miễn phí mãi mãi", "Hỗ trợ cơ bản"]',
  1,
  true,
  false,
  0,
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  features = EXCLUDED.features;

-- 5. Tạo gói Premium Tháng
INSERT INTO plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  features,
  max_students,
  is_active,
  is_trial,
  duration_days,
  created_at
) VALUES (
  gen_random_uuid(),
  'Học sinh Premium',
  'student-premium-monthly',
  'Gói Premium hàng tháng - Mở khóa tất cả bài học',
  49000,
  0,
  '["Tất cả bài học", "Học không giới hạn", "Hỗ trợ ưu tiên", "Chứng chỉ hoàn thành"]',
  1,
  true,
  false,
  30,
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  features = EXCLUDED.features;

-- 6. Tạo gói Premium Năm
INSERT INTO plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  features,
  max_students,
  is_active,
  is_trial,
  duration_days,
  created_at
) VALUES (
  gen_random_uuid(),
  'Học sinh Premium Năm',
  'student-premium-yearly',
  'Gói Premium hàng năm - Tiết kiệm 17%',
  0,
  490000,
  '["Tất cả bài học", "Học không giới hạn", "Hỗ trợ ưu tiên", "Chứng chỉ hoàn thành", "Tiết kiệm 17%"]',
  1,
  true,
  false,
  365,
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  duration_days = EXCLUDED.duration_days;

-- 7. Tạo function kiểm tra subscription hết hạn
CREATE OR REPLACE FUNCTION check_subscription_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu end_date < ngày hiện tại và status vẫn là active
  IF NEW.end_date < CURRENT_DATE AND NEW.status = 'active' THEN
    NEW.status := 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Tạo trigger tự động kiểm tra hết hạn
DROP TRIGGER IF EXISTS trigger_check_subscription_expiry ON subscriptions;
CREATE TRIGGER trigger_check_subscription_expiry
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION check_subscription_expiry();

-- 9. Function tạo subscription dùng thử cho user mới
CREATE OR REPLACE FUNCTION create_trial_subscription(user_id UUID)
RETURNS UUID AS $$
DECLARE
  trial_plan_id UUID;
  new_subscription_id UUID;
BEGIN
  -- Lấy ID của gói trial
  SELECT id INTO trial_plan_id FROM plans WHERE slug = 'trial' LIMIT 1;

  IF trial_plan_id IS NULL THEN
    RAISE EXCEPTION 'Trial plan not found';
  END IF;

  -- Tạo subscription mới
  INSERT INTO subscriptions (
    id,
    user_id,
    plan_id,
    status,
    start_date,
    end_date,
    is_trial,
    created_at
  ) VALUES (
    gen_random_uuid(),
    user_id,
    trial_plan_id,
    'active',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    true,
    NOW()
  )
  RETURNING id INTO new_subscription_id;

  RETURN new_subscription_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Tạo view để lấy subscription info dễ dàng
CREATE OR REPLACE VIEW user_subscription_view AS
SELECT
  s.user_id,
  s.id as subscription_id,
  s.status,
  s.start_date,
  s.end_date,
  s.is_trial,
  p.name as plan_name,
  p.slug as plan_slug,
  p.features,
  p.price_monthly,
  p.price_yearly,
  CASE
    WHEN s.end_date IS NULL THEN NULL
    ELSE (s.end_date - CURRENT_DATE)::INTEGER
  END as days_remaining,
  CASE
    WHEN s.end_date < CURRENT_DATE THEN true
    ELSE false
  END as is_expired
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
WHERE s.status IN ('active', 'expired');

-- 11. Thêm RLS policy cho subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 12. Grant permissions
GRANT SELECT ON user_subscription_view TO authenticated;
GRANT SELECT ON plans TO authenticated;
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
