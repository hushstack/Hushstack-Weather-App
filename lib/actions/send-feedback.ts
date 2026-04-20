"use server";

import nodemailer from "nodemailer";

interface FeedbackData {
  name: string;
  email: string;
  rating: number;
  message: string;
}

export async function sendFeedback(data: FeedbackData): Promise<{ success: boolean; error?: string }> {
  const { name, email, rating, message } = data;

  // Validation
  if (!name.trim() || !email.trim() || !message.trim()) {
    return { success: false, error: "Please fill in all required fields" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  if (rating < 1 || rating > 5) {
    return { success: false, error: "Please select a rating" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    const mailOptions = {
      from: {
        name: process.env.MAIL_FROM_NAME || "Weather App",
        address: process.env.MAIL_FROM_ADDRESS || "no-reply@example.com",
      },
      to: process.env.ADMIN_EMAIL,
      subject: `New Feedback from ${name} - ${stars}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
            Weather App Feedback
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Rating:</strong> ${stars} (${rating}/5)</p>
          </div>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #64748b;">Message:</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; text-align: center;">
            Sent from Weather App Feedback Form
          </p>
        </div>
      `,
      text: `
Weather App Feedback

Name: ${name}
Email: ${email}
Rating: ${stars} (${rating}/5)

Message:
${message}

Sent from Weather App Feedback Form
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("[Feedback Email Error]", error);
    return { success: false, error: "Failed to send feedback. Please try again later." };
  }
}
