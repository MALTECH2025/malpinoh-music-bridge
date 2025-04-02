
// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Form Values Types
export interface ResetPasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
