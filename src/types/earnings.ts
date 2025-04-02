
// Earnings Types
export interface Earning {
  id: string;
  artist_id: string;
  amount: number;
  status: "Pending" | "Paid";
  date: string;
}

// Withdrawal Types
export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  processedAt?: string;
  accountName: string;
  accountNumber: string;
}

export interface WithdrawalFormValues {
  amount: number;
  accountName: string;
  accountNumber: string;
}

// System Settings Types
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}
