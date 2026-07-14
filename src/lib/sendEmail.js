// import nodemailer from 'nodemailer';

// export const sendVerificationEmail = async (email, token) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER, // Your Gmail
//       pass: process.env.EMAIL_PASS, // Your App Password
//     },
//   });

//   const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

//   await transporter.sendMail({
//     from: '"Real Estate Team" <your-email@gmail.com>',
//     to: email,
//     subject: "Verify your Agent Account",
//     html: `<h1>Welcome!</h1><p>Please click the link below to verify your email:</p>
//            <a href="${verificationUrl}">${verificationUrl}</a>`,
//   });
// };