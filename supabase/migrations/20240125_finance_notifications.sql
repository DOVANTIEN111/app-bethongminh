-- Finance, Promotions & Notifications Tables for Admin
-- Run this in Supabase SQL Editor

-- 1. TRANSACTIONS TABLE (Giao dịch)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  original_amount DECIMAL(12, 2),
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  promotion_id UUID,
  payment_method VARCHAR(50) DEFAULT 'bank_transfer',
  payment_provider VARCHAR(100),
  transaction_code VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROMOTIONS TABLE (Khuyến mãi)
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(12, 2) NOT NULL,
  min_amount DECIMAL(12, 2) DEFAULT 0,
  max_discount DECIMAL(12, 2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  applicable_plans UUID[],
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for promotion_id in transactions
ALTER TABLE transactions
  ADD CONSTRAINT fk_transactions_promotion
  FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL;

-- 3. PROMOTION_USAGE TABLE (Lịch sử sử dụng mã)
CREATE TABLE IF NOT EXISTS promotion_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  discount_amount DECIMAL(12, 2),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NOTIFICATIONS TABLE (Thông báo)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'promotion', 'system', 'reminder', 'announcement')),
  target_type VARCHAR(50) DEFAULT 'all' CHECK (target_type IN ('all', 'role', 'school', 'user')),
  target_roles TEXT[],
  target_schools UUID[],
  target_users UUID[],
  image_url TEXT,
  action_url TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  is_sent BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER_NOTIFICATIONS TABLE (Thông báo của user)
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notification_id, user_id)
);

-- 6. USER_ACTIVITY TABLE (Hoạt động user - cho analytics)
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB DEFAULT '{}',
  lesson_id UUID,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_sent ON notifications(is_sent);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity(created_at);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all transactions" ON transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin')
    )
  );

-- RLS Policies for promotions
CREATE POLICY "Public can view active promotions" ON promotions
  FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date > NOW()));

CREATE POLICY "Admin can manage promotions" ON promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- RLS Policies for promotion_usage
CREATE POLICY "Users can view own promotion usage" ON promotion_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage promotion usage" ON promotion_usage
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Admin can manage notifications" ON notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin')
    )
  );

-- RLS Policies for user_notifications
CREATE POLICY "Users can view own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage user notifications" ON user_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin')
    )
  );

-- RLS Policies for user_activity
CREATE POLICY "Users can insert own activity" ON user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all activity" ON user_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin')
    )
  );

-- Insert sample promotions
INSERT INTO promotions (code, name, description, discount_type, discount_value, usage_limit, end_date, is_active) VALUES
  ('WELCOME10', 'Chào mừng thành viên mới', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10, 1000, NOW() + INTERVAL '1 year', true),
  ('TET2024', 'Khuyến mãi Tết 2024', 'Giảm 50,000đ cho mọi gói cước', 'fixed', 50000, 500, NOW() + INTERVAL '3 months', true),
  ('SCHOOL30', 'Ưu đãi trường học', 'Giảm 30% cho đăng ký theo trường', 'percentage', 30, NULL, NULL, true)
ON CONFLICT DO NOTHING;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update promotion used_count
CREATE OR REPLACE FUNCTION update_promotion_used_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE promotions
  SET used_count = used_count + 1
  WHERE id = NEW.promotion_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_promotion_count ON promotion_usage;
CREATE TRIGGER trigger_update_promotion_count
  AFTER INSERT ON promotion_usage
  FOR EACH ROW EXECUTE FUNCTION update_promotion_used_count();

-- View for revenue statistics
CREATE OR REPLACE VIEW revenue_stats AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as transaction_count,
  SUM(amount) as total_revenue,
  SUM(discount_amount) as total_discount,
  payment_method
FROM transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at), payment_method
ORDER BY date DESC;

-- View for daily active users
CREATE OR REPLACE VIEW daily_active_users AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT user_id) as active_users
FROM user_activity
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
