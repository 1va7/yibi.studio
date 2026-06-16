CREATE TYPE "CreditBucket" AS ENUM ('subscription', 'paid');
CREATE TYPE "SubscriptionPlan" AS ENUM ('monthly', 'yearly');
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'expired');
CREATE TYPE "BillingItemType" AS ENUM ('monthly_subscription', 'yearly_subscription', 'credit_pack');
CREATE TYPE "BillingOrderStatus" AS ENUM ('pending', 'paid', 'completed', 'failed', 'canceled');

ALTER TABLE "CreditAccount"
  ADD COLUMN "paidBalance" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "subscriptionBalance" INTEGER NOT NULL DEFAULT 0;

UPDATE "CreditAccount"
SET "paidBalance" = "balance"
WHERE "paidBalance" = 0 AND "balance" <> 0;

ALTER TABLE "CreditLedger"
  ADD COLUMN "bucket" "CreditBucket" NOT NULL DEFAULT 'paid';

DROP INDEX "CreditLedger_userId_moduleKey_actionKey_idempotencyKey_key";
CREATE UNIQUE INDEX "CreditLedger_userId_moduleKey_actionKey_idempotencyKey_bucket_key" ON "CreditLedger"("userId", "moduleKey", "actionKey", "idempotencyKey", "bucket");
CREATE INDEX "CreditLedger_userId_moduleKey_actionKey_idempotencyKey_idx" ON "CreditLedger"("userId", "moduleKey", "actionKey", "idempotencyKey");

CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" "SubscriptionPlan" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "entitlementEnd" TIMESTAMP(3) NOT NULL,
  "nextRefreshAt" TIMESTAMP(3) NOT NULL,
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "canceledAt" TIMESTAMP(3),
  "lastRefreshedPeriod" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BillingOrder" (
  "id" TEXT NOT NULL,
  "orderNo" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "itemType" "BillingItemType" NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "originalAmountFen" INTEGER NOT NULL,
  "discountAmountFen" INTEGER NOT NULL DEFAULT 0,
  "payableAmountFen" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'CNY',
  "status" "BillingOrderStatus" NOT NULL DEFAULT 'pending',
  "entitlement" JSONB NOT NULL,
  "discountCodeId" TEXT,
  "subscriptionId" TEXT,
  "gateway" TEXT,
  "gatewayTradeNo" TEXT,
  "paidAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BillingOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DiscountCode" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "amountOffFen" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "redeemedAt" TIMESTAMP(3),
  "redeemedByUserId" TEXT,
  "redeemedOrderId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BillingOrder_orderNo_key" ON "BillingOrder"("orderNo");
CREATE INDEX "BillingOrder_userId_createdAt_idx" ON "BillingOrder"("userId", "createdAt");
CREATE INDEX "BillingOrder_status_idx" ON "BillingOrder"("status");
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");
CREATE INDEX "DiscountCode_active_idx" ON "DiscountCode"("active");
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");
CREATE INDEX "Subscription_nextRefreshAt_idx" ON "Subscription"("nextRefreshAt");

ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BillingOrder" ADD CONSTRAINT "BillingOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BillingOrder" ADD CONSTRAINT "BillingOrder_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BillingOrder" ADD CONSTRAINT "BillingOrder_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DiscountCode" ADD CONSTRAINT "DiscountCode_redeemedByUserId_fkey" FOREIGN KEY ("redeemedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
