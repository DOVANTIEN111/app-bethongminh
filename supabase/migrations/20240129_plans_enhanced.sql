-- Migration: Enhanced Plans Table
-- Thêm các cột mới cho bảng plans để hỗ trợ quản lý gói cước nâng cao

-- Kiểm tra và tạo bảng plans nếu chưa có
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER DEFAULT 0, -- Giá theo tháng (VND)
    duration_days INTEGER DEFAULT 30,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thêm các cột mới (nếu chưa có)

-- Giá theo năm
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'price_yearly') THEN
        ALTER TABLE public.plans ADD COLUMN price_yearly INTEGER DEFAULT 0;
    END IF;
END $$;

-- Badge text (VD: "Phổ biến nhất", "Hot", "Tiết kiệm")
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'badge') THEN
        ALTER TABLE public.plans ADD COLUMN badge TEXT;
    END IF;
END $$;

-- Badge color (VD: "blue", "green", "orange")
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'badge_color') THEN
        ALTER TABLE public.plans ADD COLUMN badge_color TEXT DEFAULT 'blue';
    END IF;
END $$;

-- Thứ tự hiển thị
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'display_order') THEN
        ALTER TABLE public.plans ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Target audience (student, teacher, school, family)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'target_audience') THEN
        ALTER TABLE public.plans ADD COLUMN target_audience TEXT DEFAULT 'student';
    END IF;
END $$;

-- Icon name
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'icon') THEN
        ALTER TABLE public.plans ADD COLUMN icon TEXT DEFAULT 'star';
    END IF;
END $$;

-- Số người dùng hiện tại (cached count)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'user_count') THEN
        ALTER TABLE public.plans ADD COLUMN user_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Button text
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'button_text') THEN
        ALTER TABLE public.plans ADD COLUMN button_text TEXT DEFAULT 'Đăng ký ngay';
    END IF;
END $$;

-- Button link
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'button_link') THEN
        ALTER TABLE public.plans ADD COLUMN button_link TEXT DEFAULT '/register';
    END IF;
END $$;

-- Highlight (featured plan)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'plans' AND column_name = 'is_highlighted') THEN
        ALTER TABLE public.plans ADD COLUMN is_highlighted BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON public.plans(is_active);
CREATE INDEX IF NOT EXISTS idx_plans_display_order ON public.plans(display_order);
CREATE INDEX IF NOT EXISTS idx_plans_target_audience ON public.plans(target_audience);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active plans (for landing page)
DROP POLICY IF EXISTS "Anyone can read active plans" ON public.plans;
CREATE POLICY "Anyone can read active plans"
    ON public.plans FOR SELECT
    USING (is_active = true);

-- Policy: Super admin can do everything
DROP POLICY IF EXISTS "Super admin can manage plans" ON public.plans;
CREATE POLICY "Super admin can manage plans"
    ON public.plans FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- Insert default plans if table is empty
INSERT INTO public.plans (name, description, price, price_yearly, duration_days, features, is_active, display_order, badge, badge_color, target_audience, icon, button_text, button_link, is_highlighted)
SELECT * FROM (VALUES
    (
        'Miễn phí',
        'Cho học sinh mới bắt đầu',
        0,
        0,
        30,
        '[{"name": "3 bài học/môn", "included": true}, {"name": "Trò chơi giáo dục cơ bản", "included": true}, {"name": "Theo dõi tiến độ", "included": true}, {"name": "Có quảng cáo", "included": true}, {"name": "Tất cả bài học", "included": false}, {"name": "Không quảng cáo", "included": false}]'::jsonb,
        true,
        1,
        NULL,
        'gray',
        'student',
        'star',
        'Bắt đầu miễn phí',
        '/register',
        false
    ),
    (
        'Học sinh Premium',
        'Cho học sinh muốn học tập toàn diện',
        49000,
        490000,
        30,
        '[{"name": "Tất cả 500+ bài học", "included": true}, {"name": "Trò chơi giáo dục đầy đủ", "included": true}, {"name": "Theo dõi tiến độ chi tiết", "included": true}, {"name": "Không quảng cáo", "included": true}, {"name": "Hỗ trợ 24/7", "included": true}, {"name": "Phần thưởng độc quyền", "included": true}]'::jsonb,
        true,
        2,
        'Phổ biến nhất',
        'blue',
        'student',
        'zap',
        'Dùng thử 30 ngày',
        '/register',
        true
    ),
    (
        'Giáo viên Pro',
        'Cho giáo viên quản lý lớp học',
        199000,
        1990000,
        30,
        '[{"name": "Tạo bài giảng không giới hạn", "included": true}, {"name": "Quản lý đến 100 học sinh", "included": true}, {"name": "Tạo bài kiểm tra online", "included": true}, {"name": "Chấm điểm tự động", "included": true}, {"name": "Báo cáo chi tiết", "included": true}, {"name": "Hỗ trợ ưu tiên", "included": true}]'::jsonb,
        true,
        3,
        NULL,
        'purple',
        'teacher',
        'building-2',
        'Đăng ký ngay',
        '/register/teacher',
        false
    ),
    (
        'Trường học',
        'Giải pháp toàn diện cho nhà trường',
        0,
        0,
        365,
        '[{"name": "Không giới hạn giáo viên", "included": true}, {"name": "Không giới hạn học sinh", "included": true}, {"name": "Quản lý bộ phận, lớp học", "included": true}, {"name": "Tích hợp hệ thống có sẵn", "included": true}, {"name": "Hỗ trợ triển khai riêng", "included": true}, {"name": "Account Manager riêng", "included": true}]'::jsonb,
        true,
        4,
        'Doanh nghiệp',
        'indigo',
        'school',
        'phone',
        'Liên hệ tư vấn',
        '/register/school',
        false
    )
) AS v(name, description, price, price_yearly, duration_days, features, is_active, display_order, badge, badge_color, target_audience, icon, button_text, button_link, is_highlighted)
WHERE NOT EXISTS (SELECT 1 FROM public.plans LIMIT 1);

-- Comment on columns
COMMENT ON COLUMN public.plans.price IS 'Giá theo tháng (VND)';
COMMENT ON COLUMN public.plans.price_yearly IS 'Giá theo năm (VND)';
COMMENT ON COLUMN public.plans.features IS 'Danh sách tính năng dạng JSON: [{name: string, included: boolean}]';
COMMENT ON COLUMN public.plans.badge IS 'Badge hiển thị (VD: Phổ biến nhất, Hot)';
COMMENT ON COLUMN public.plans.badge_color IS 'Màu badge (blue, green, orange, purple, indigo)';
COMMENT ON COLUMN public.plans.display_order IS 'Thứ tự hiển thị trên trang';
COMMENT ON COLUMN public.plans.target_audience IS 'Đối tượng: student, teacher, school, family';
COMMENT ON COLUMN public.plans.is_highlighted IS 'Gói được highlight (scale lớn hơn)';
