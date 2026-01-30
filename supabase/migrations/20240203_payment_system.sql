-- Migration: Payment System for SchoolHub
-- Date: 2024-02-03

-- Bang don hang thanh toan
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, expired
  payment_method TEXT DEFAULT 'bank_transfer', -- bank_transfer, momo, vnpay
  bank_transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  expired_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bang lich su thanh toan
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES payment_orders(id),
  amount INTEGER NOT NULL,
  type TEXT DEFAULT 'payment', -- payment, refund
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_code ON payment_orders(order_code);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_id);

-- Tat RLS de don gian
ALTER TABLE payment_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history DISABLE ROW LEVEL SECURITY;

-- Them cot vao profiles neu chua co
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
    ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'free';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_end_date') THEN
    ALTER TABLE profiles ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Them cot vao plans neu chua co
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'duration_days') THEN
    ALTER TABLE plans ADD COLUMN duration_days INTEGER DEFAULT 30;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'price_yearly') THEN
    ALTER TABLE plans ADD COLUMN price_yearly INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'is_featured') THEN
    ALTER TABLE plans ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Cap nhat plans voi gia nam va duration
UPDATE plans SET
  duration_days = 30,
  price_yearly = COALESCE(price_monthly, 0) * 10 -- Giam 20% cho goi nam
WHERE duration_days IS NULL;

-- Function tu dong het han don hang sau 30 phut
CREATE OR REPLACE FUNCTION expire_old_payment_orders()
RETURNS void AS $$
BEGIN
  UPDATE payment_orders
  SET status = 'expired'
  WHERE status = 'pending'
    AND expired_at < NOW();
END;
$$ LANGUAGE plpgsql;
