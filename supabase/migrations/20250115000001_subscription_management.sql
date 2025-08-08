-- Subscription Management Migration
-- This ensures the subscriptions table has the correct structure and adds sample data

-- Check if subscriptions table exists and has correct structure
DO $$ 
BEGIN
    -- Create subscriptions table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
        CREATE TABLE public.subscriptions (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            plan TEXT NOT NULL CHECK (plan IN ('free', 'premium', 'professional')),
            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'incomplete')),
            current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
            current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
            cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Users can view own subscription" ON public.subscriptions
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can update own subscription" ON public.subscriptions
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own subscription" ON public.subscriptions
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

        -- Create trigger for updated_at
        CREATE TRIGGER update_subscriptions_updated_at
            BEFORE UPDATE ON public.subscriptions
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Migration completed successfully
SELECT 'Subscription management migration completed successfully!' as status;
