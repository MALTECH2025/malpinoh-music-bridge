
import { User } from "@/contexts/AuthContext";
import { Release } from "@/types/release";
import { Earning } from "@/types/earnings";

// Base HTML email template
const createBaseEmailTemplate = (content: string, title: string = "MalpinohDistro Notification") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .email-header {
          background: linear-gradient(to right, #e52d27, #b31217);
          padding: 20px;
          text-align: center;
        }
        .logo {
          max-width: 180px;
          height: auto;
        }
        .email-body {
          padding: 30px;
        }
        .email-footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .button {
          display: inline-block;
          background-color: #e52d27;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: bold;
          margin: 20px 0;
        }
        .social-icons {
          margin-top: 20px;
        }
        .social-icon {
          display: inline-block;
          margin: 0 10px;
        }
        h1 {
          color: #333;
          margin-top: 0;
        }
        h2 {
          color: #555;
        }
        .divider {
          height: 1px;
          background-color: #eee;
          margin: 20px 0;
        }
        .text-muted {
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <img src="https://4ac041fb-9d25-45d2-82b1-8fa0a3b5c6f9.lovableproject.com/lovable-uploads/73d53c0c-7084-4da6-b01e-36e78e3ad480.png" alt="MalpinohDistro" class="logo">
        </div>
        <div class="email-body">
          ${content}
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} MalpinohDistro. All rights reserved.</p>
          <div class="social-icons">
            <a href="https://instagram.com/malpinohdistro" class="social-icon" target="_blank">
              <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-512.png" alt="Instagram" width="32" height="32">
            </a>
          </div>
          <p class="text-muted">You're receiving this email because you have an account with MalpinohDistro.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email templates for different types of notifications
export const EmailTemplates = {
  
  // Password Reset Email
  passwordReset: (resetLink: string) => {
    const content = `
      <h1>Reset Your Password</h1>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    `;
    
    return createBaseEmailTemplate(content, "Reset Your Password");
  },
  
  // Welcome Email
  welcome: (user: { name: string }) => {
    const content = `
      <h1>Welcome to MalpinohDistro!</h1>
      <p>Hello ${user.name},</p>
      <p>Thank you for joining MalpinohDistro! We're excited to help you distribute your music to global audiences.</p>
      <h2>What's Next?</h2>
      <p>To get started:</p>
      <ol>
        <li>Complete your artist profile</li>
        <li>Upload your first release</li>
        <li>Track your earnings and performance</li>
      </ol>
      <div style="text-align: center;">
        <a href="https://malpinoh-distro.com/dashboard" class="button">Go to Your Dashboard</a>
      </div>
    `;
    
    return createBaseEmailTemplate(content, "Welcome to MalpinohDistro");
  },
  
  // Release Status Update
  releaseStatusUpdate: (release: Release) => {
    const statusMap = {
      'pending': {
        title: 'Your Release is Being Reviewed',
        message: 'Your release has been submitted successfully and is currently under review. We'll notify you once it's approved.',
        color: '#f5a623'
      },
      'approved': {
        title: 'Your Release Has Been Approved!',
        message: 'Great news! Your release has been approved and is being distributed to our partner platforms. This process may take a few days to complete.',
        color: '#7cb342'
      },
      'rejected': {
        title: 'Your Release Needs Attention',
        message: `We couldn't approve your release in its current form. Please check your dashboard for specific feedback and make the necessary changes.`,
        color: '#e53935'
      },
      'live': {
        title: 'Your Release is Now Live!',
        message: 'Congratulations! Your release is now live on our partner platforms. Start sharing with your fans!',
        color: '#43a047'
      }
    };
    
    const status = release.status.toLowerCase() as keyof typeof statusMap;
    const statusDetails = statusMap[status] || statusMap.pending;
    
    const content = `
      <h1>${statusDetails.title}</h1>
      <p>Hello,</p>
      <p>${statusDetails.message}</p>
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid ${statusDetails.color}; background-color: #f9f9f9;">
        <h2>${release.title}</h2>
        <p><strong>Artist:</strong> ${release.artist}</p>
        <p><strong>Status:</strong> <span style="color: ${statusDetails.color};">${release.status}</span></p>
        ${release.feedback ? `<p><strong>Feedback:</strong> ${release.feedback}</p>` : ''}
      </div>
      <div style="text-align: center;">
        <a href="https://malpinoh-distro.com/releases" class="button">View Release Details</a>
      </div>
    `;
    
    return createBaseEmailTemplate(content, `Release Update: ${release.title}`);
  },
  
  // Earnings Update
  earningsUpdate: (earning: Earning, user: User) => {
    const content = `
      <h1>New Earnings Update</h1>
      <p>Hello ${user.name},</p>
      <p>We have great news! Your music has generated new earnings.</p>
      <div style="margin: 20px 0; padding: 20px; background-color: #f0f8ff; border-radius: 6px; text-align: center;">
        <h2 style="color: #0056b3; margin-top: 0;">$${earning.amount.toFixed(2)}</h2>
        <p class="text-muted">Added to your balance on ${new Date(earning.date).toLocaleDateString()}</p>
      </div>
      <p>Your current balance is now <strong>$${user.balance.toFixed(2)}</strong>.</p>
      <p>Keep creating amazing music! Remember that you can request a withdrawal once your balance reaches the minimum threshold.</p>
      <div style="text-align: center;">
        <a href="https://malpinoh-distro.com/earnings" class="button">View Earnings Details</a>
      </div>
    `;
    
    return createBaseEmailTemplate(content, "New Earnings Available");
  },
  
  // Account Status Change
  accountStatusChange: (user: User, status: string, reason?: string) => {
    const statusMap = {
      'active': {
        title: 'Your Account is Now Active',
        message: 'Your account has been activated. You now have full access to all features of MalpinohDistro.',
        color: '#4caf50'
      },
      'paused': {
        title: 'Your Account Has Been Paused',
        message: 'Your account has been temporarily paused. During this time, some features might be limited.',
        color: '#ff9800'
      },
      'banned': {
        title: 'Your Account Has Been Suspended',
        message: 'Your account has been suspended. Please contact our support team for more information.',
        color: '#f44336'
      }
    };
    
    const statusKey = status.toLowerCase() as keyof typeof statusMap;
    const statusDetails = statusMap[statusKey] || statusMap.active;
    
    const content = `
      <h1>${statusDetails.title}</h1>
      <p>Hello ${user.name},</p>
      <p>${statusDetails.message}</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid ${statusDetails.color}; background-color: #f9f9f9;">
        <p><strong>Status:</strong> <span style="color: ${statusDetails.color};">${status}</span></p>
        <p><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>If you have any questions or need assistance, please contact our support team.</p>
      <div style="text-align: center;">
        <a href="mailto:support@malpinoh-distro.com" class="button">Contact Support</a>
      </div>
    `;
    
    return createBaseEmailTemplate(content, `Account Status Update`);
  }
};

export default EmailTemplates;
