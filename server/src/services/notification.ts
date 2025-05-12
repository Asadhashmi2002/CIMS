import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send WhatsApp notification for absence
export const sendAbsenceWhatsAppMessage = async (
  phoneNumber: string,
  studentName: string,
  batchName: string,
  date: Date
): Promise<boolean> => {
  try {
    // Format date to readable string
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Prepare message
    const message = `Hello, this is to inform you that ${studentName} was absent from ${batchName} class on ${formattedDate}. Please ensure regular attendance for better academic performance.`;

    // Send message via Twilio WhatsApp
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
      body: message,
    });

    return true;
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return false;
  }
};

// Send monthly attendance report via email
export const sendMonthlyAttendanceEmail = async (
  email: string,
  studentName: string,
  attendanceData: {
    month: string;
    year: number;
    totalClasses: number;
    attended: number;
    percentage: number;
    batchDetails: Array<{
      batchName: string;
      totalClasses: number;
      attended: number;
      percentage: number;
    }>;
  }
): Promise<boolean> => {
  try {
    // Generate HTML for batch details
    const batchDetailsHTML = attendanceData.batchDetails
      .map(
        (batch) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${batch.batchName}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${batch.totalClasses}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${batch.attended}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${batch.percentage}%</td>
        </tr>
      `
      )
      .join('');

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Monthly Attendance Report - ${attendanceData.month} ${attendanceData.year}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Monthly Attendance Report</h2>
          <p>Dear Parent,</p>
          <p>Please find below the attendance report for <strong>${studentName}</strong> for the month of <strong>${attendanceData.month} ${attendanceData.year}</strong>:</p>
          
          <div style="margin: 20px 0;">
            <p><strong>Overall Attendance:</strong> ${attendanceData.attended}/${attendanceData.totalClasses} classes (${attendanceData.percentage}%)</p>
          </div>
          
          <h3 style="color: #555;">Batch-wise Attendance</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd;">Batch Name</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Total Classes</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Attended</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${batchDetailsHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 30px;">
            <p>Please ensure regular attendance for better academic performance.</p>
            <p>Thank you,<br>Admin Team</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
};

// Send fee receipt via email
export const sendFeeReceiptEmail = async (
  email: string,
  studentName: string,
  feeDetails: {
    receiptNumber: string;
    amount: number;
    paidDate: Date;
    batchName: string;
    month: string;
    year: number;
    paymentMethod: string;
    transactionId?: string;
  }
): Promise<boolean> => {
  try {
    // Format date to readable string
    const formattedDate = feeDetails.paidDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Fee Receipt - ${feeDetails.receiptNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Fee Receipt</h2>
            <p style="color: #777; font-size: 14px;">Receipt # ${feeDetails.receiptNumber}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p><strong>Student Name:</strong> ${studentName}</p>
            <p><strong>Batch Name:</strong> ${feeDetails.batchName}</p>
            <p><strong>Period:</strong> ${feeDetails.month} ${feeDetails.year}</p>
            <p><strong>Amount Paid:</strong> ₹${feeDetails.amount.toFixed(2)}</p>
            <p><strong>Payment Date:</strong> ${formattedDate}</p>
            <p><strong>Payment Method:</strong> ${feeDetails.paymentMethod}</p>
            ${feeDetails.transactionId ? `<p><strong>Transaction ID:</strong> ${feeDetails.transactionId}</p>` : ''}
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777;">
            <p>This is an electronically generated receipt and does not require a signature.</p>
            <p>Thank you for your payment!</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Fee receipt email error:', error);
    return false;
  }
}; 