
import { supabase } from "@/integrations/supabase/client";
import EmailTemplates from "./EmailTemplateService";
import { User } from "@/contexts/AuthContext";
import { Release } from "@/types/release";
import { Earning } from "@/types/earnings";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  
  // Send any email using the edge function
  async sendEmail({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: { to, subject, html, text },
      });
      
      if (error) {
        console.error("Error sending email:", error);
        return false;
      }
      
      console.log("Email sent successfully:", data);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  // Send a password reset email
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const subject = "Reset Your MalpinohDistro Password";
    const html = EmailTemplates.passwordReset(resetLink);
    
    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  // Send a welcome email
  async sendWelcomeEmail(user: { email: string; name: string }): Promise<boolean> {
    const subject = "Welcome to MalpinohDistro!";
    const html = EmailTemplates.welcome(user);
    
    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  // Send a release status update email
  async sendReleaseStatusEmail(user: { email: string }, release: Release): Promise<boolean> {
    const subject = `Release Update: ${release.title}`;
    const html = EmailTemplates.releaseStatusUpdate(release);
    
    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  // Send an earnings update email
  async sendEarningsUpdateEmail(user: User, earning: Earning): Promise<boolean> {
    const subject = "New Earnings Available";
    const html = EmailTemplates.earningsUpdate(earning, user);
    
    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  // Send an account status change email
  async sendAccountStatusEmail(user: User, status: string, reason?: string): Promise<boolean> {
    const subject = "Your Account Status Has Changed";
    const html = EmailTemplates.accountStatusChange(user, status, reason);
    
    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }
}

export default new EmailService();
