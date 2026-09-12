import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendBookingEmail(user, bookingData) {
  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL || "BasttetTravel@outlook.com",
    cc: process.env.SENDGRID_ADMIN_EMAIL || "BasttetTravel@outlook.com",
    subject: "Your Basttet Travel booking confirmation",
    text: `
Dear ${user?.name || user?.user_metadata?.name || "Traveler"},

Your booking has been confirmed successfully.

Trip Details:
- Title: ${bookingData.title}
- Price: ${bookingData.price}
- Cities: ${bookingData.cities}
- Arrival Date: ${bookingData.arrivalDate}
- Departure Date: ${bookingData.departureDate}
- Number of Persons: ${bookingData.numPersons}
- Children: ${bookingData.hasChildren ? bookingData.numChildren : 0}
- Pets: ${bookingData.hasPets ? bookingData.petTypes.join(", ") : "None"}
- Guide Languages: ${bookingData.selectedLanguages.join(", ") || "None"}

For any assistance, please contact Basttet Travel:
- Phone: +20 110 050 7802
- Email: BasttetTravel@outlook.com

Best regards,
Basttet Travel Team
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error("Error sending email ❌", error);
  }
}
