-- Wallet Module Schema

-- 1. Wallets Table
CREATE TABLE wallets (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance DECIMAL(12,2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wallet Top-up Requests Table
CREATE TABLE wallet_topups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  phone_number TEXT NOT NULL,
  receipt_image TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL, -- 'topup', 'payment', 'transfer', 'withdrawal'
  description TEXT,
  reference_id UUID, -- Link to order_id or topup_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS Policies
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_topups ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Wallets Policies
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);

-- Topups Policies
CREATE POLICY "Users can view own topups" ON wallet_topups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create topups" ON wallet_topups FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- 5. Admin Trigger for Wallet Balance
-- When a topup is approved, update the wallet balance and create a transaction record
CREATE OR REPLACE FUNCTION handle_topup_approval()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Update wallet balance
    INSERT INTO wallets (user_id, balance)
    VALUES (NEW.user_id, NEW.amount)
    ON CONFLICT (user_id) DO UPDATE
    SET balance = wallets.balance + NEW.amount,
        updated_at = NOW();
    
    -- Create transaction record
    INSERT INTO transactions (user_id, amount, type, description, reference_id)
    VALUES (NEW.user_id, NEW.amount, 'topup', 'شحن رصيد محفظة', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_topup_approved
  AFTER UPDATE ON wallet_topups
  FOR EACH ROW EXECUTE FUNCTION handle_topup_approval();
