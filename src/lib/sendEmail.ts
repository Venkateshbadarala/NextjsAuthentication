import User from '@/app/Database/models/user';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

interface Iprop {
  emailAddress: string;
  emailtype: 'forgotPassword' | 'emailvalidation' | 'updateUser';
  userId: string;
}

const sendEmail = async ({ emailAddress, emailtype, userId }: Iprop) => {
  try {
    const convertedId = userId.toString();
    const hashedToken = await bcrypt.hash(convertedId, 10);
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 5);


 const updateUserInformation = emailtype === "emailvalidation"?{
     verifyToken: hashedToken,
    verifyTokenExpiry: tokenExpiry,
  } : {
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenExpiry: tokenExpiry,
  };

await User.updateOne({ _id: userId }, { $set: updateUserInformation });

    console.log("User information updated");


const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "venkateshbadarala98@gmail.com",
        pass: "ocfw rllo cztw ndmj",
      },
    });

    const tokenLink = `${process.env.NEXTAUTH_URL}/api/users/verify?type=${emailtype}&token=${hashedToken}`;

    const mailOptions = await transporter.sendMail({
      from: 'venkateshbadarala98@gmail.com',
      to: emailAddress,
      subject: 'Validation Email',
      html: `<b>Verify this link ${tokenLink}</b>`,
    });

    console.log(mailOptions);
    return mailOptions;

  } catch (error: any) {
    console.error("Error:", error);
    return false;
  }
}

export default sendEmail;
