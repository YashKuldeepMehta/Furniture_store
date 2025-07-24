const nodemailer = require("nodemailer")
require("dotenv").config()

const SendOrderConfirmationMail = async(to, order) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    try {
        const itemlist = order.cartItems.map(item => (
            `<li>${item.name}  (x${item.quantity})  -  Rs.${item.quantity * item.price}</li>`
        )).join('')

       const htmlContent = `
<div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
      <h1>MyFurlenco</h1>
      <h2>Order Confirmation</h2>
    </div>
    <div style="padding: 20px;">
      <p>Hi <strong>${order.name}</strong>,</p>
      <p>Thank you for your order! Here’s what you ordered:</p>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 2px solid #eee;">Item</th>
            <th style="text-align: right; padding: 8px; border-bottom: 2px solid #eee;">Qty</th>
            <th style="text-align: right; padding: 8px; border-bottom: 2px solid #eee;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.cartItems.map(item => `
            <tr>
              <td style="padding: 8px 0;">${item.name}</td>
              <td style="text-align: right;">${item.quantity}</td>
              <td style="text-align: right;">₹${item.quantity * item.price}</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align: right; padding-top: 10px;"><strong>Total:</strong></td>
            <td style="text-align: right; padding-top: 10px;"><strong>₹${order.totalamount}</strong></td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top: 30px;"><strong>Shipping Address:</strong><br>
        ${order.address.line1}, ${order.address.line2}<br>
        ${order.address.city}, ${order.address.state} - ${order.address.pincode}
      </p>

      <p>If you have any questions, contact us at <a href="mailto:support@myfurlenco.com">support@myfurlenco.com</a>.</p>

      <p style="color: #888;">We’ll notify you once your order is shipped.</p>
      <p style="margin-top: 40px;">Regards,<br>Team MyFurlenco</p>
    </div>
    <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px;">
      © ${new Date().getFullYear()} MyFurlenco. All rights reserved.
    </div>
  </div>
</div>
`

        await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to,
            subject : "Order Confirmation - Your order has been placed.",
            html : htmlContent
        })
        console.log(`Email sent to ${order.email}`)
    } catch (err) {
        console.log(err)
    }
}

module.exports = SendOrderConfirmationMail