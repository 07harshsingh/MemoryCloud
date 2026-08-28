const sendVerificationEmail = async (email, verificationCode) => {

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",

            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },

            body: JSON.stringify({
                sender: {
                    name: "MemoryCloud",
                    email: process.env.BREVO_SENDER_EMAIL
                },

                to: [
                    {
                        email: email
                    }
                ],

                subject: "MemoryCloud Email Verification",

                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
                        <h2>MemoryCloud Email Verification</h2>

                        <p>Your verification code is:</p>

                        <h1 style="letter-spacing: 5px;">
                            ${verificationCode}
                        </h1>

                        <p>This code will expire in 10 minutes.</p>

                        <p>
                            If you did not create a MemoryCloud account,
                            you can safely ignore this email.
                        </p>
                    </div>
                `
            })
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo email failed: ${errorData}`);
    }

    return await response.json();
};

module.exports = sendVerificationEmail;