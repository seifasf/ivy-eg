import emailjs from '@emailjs/browser'

/*
 * EMAIL SETUP INSTRUCTIONS:
 * 
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Add Gmail service with your store email (configured in Admin Settings)
 * 3. Create an email template with these variables:
 *    - {{customer_name}}
 *    - {{customer_email}}
 *    - {{customer_phone}}
 *    - {{governorate}}
 *    - {{city}}
 *    - {{address}}
 *    - {{order_items}}
 *    - {{order_total}}
 *    - {{order_date}}
 * 
 * 4. Replace the values below with your EmailJS credentials
 */

// EmailJS Configuration - Will be loaded from database
let EMAILJS_CONFIG = {
  serviceId: '',        
  templateId: '',      
  publicKey: ''         
}

// Load EmailJS config from localStorage or use defaults
const loadEmailConfig = () => {
  try {
    const saved = localStorage.getItem('emailSettings')
    if (saved) {
      const parsed = JSON.parse(saved)
      EMAILJS_CONFIG = {
        serviceId: parsed.serviceId || '',
        templateId: parsed.templateId || '',
        publicKey: parsed.publicKey || ''
      }
      if (EMAILJS_CONFIG.publicKey) {
        emailjs.init(EMAILJS_CONFIG.publicKey)
      }
    }
  } catch (error) {
    console.error('Error loading email config:', error)
  }
}

// Initialize on load
loadEmailConfig()

// Function to update config (called when settings are saved)
export const updateEmailConfig = (config) => {
  EMAILJS_CONFIG = {
    serviceId: config.serviceId || '',
    templateId: config.templateId || '',
    publicKey: config.publicKey || ''
  }
  if (EMAILJS_CONFIG.publicKey) {
    emailjs.init(EMAILJS_CONFIG.publicKey)
  }
  localStorage.setItem('emailSettings', JSON.stringify(EMAILJS_CONFIG))
}

/**
 * Send order confirmation email to customer
 */
export const sendOrderConfirmation = async (orderData) => {
  try {
    // Format order items for email
    const orderItemsText = orderData.items
      .map(item => `${item.name} x${item.quantity} - ${item.price}`)
      .join('\n')

    // Prepare email parameters
    const templateParams = {
      customer_name: orderData.customer.fullName,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      governorate: orderData.customer.governorate,
      city: orderData.customer.city,
      address: orderData.customer.address,
      order_items: orderItemsText,
      order_total: `${orderData.total.toLocaleString()} EGP`,
      order_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      notes: orderData.customer.notes || 'No additional notes'
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    )

    console.log('Email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

/**
 * Example Email Template for EmailJS:
 * 
 * Subject: Order Confirmation - IVY #{{order_date}}
 * 
 * Body:
 * 
 * Hello {{customer_name}},
 * 
 * Thank you for your order! We're excited to get your products to you.
 * 
 * ORDER DETAILS:
 * Date: {{order_date}}
 * 
 * ITEMS:
 * {{order_items}}
 * 
 * TOTAL: {{order_total}}
 * 
 * DELIVERY ADDRESS:
 * {{customer_name}}
 * {{address}}
 * {{city}}, {{governorate}}
 * Phone: {{customer_phone}}
 * 
 * Additional Notes: {{notes}}
 * 
 * YOUR ORDER STATUS:
 * Your order is being processed and will be shipped as fast as possible!
 * We'll contact you shortly to confirm delivery details.
 * 
 * CONTACT US:
 * If you have any questions, please don't hesitate to reach out.
 * Contact information is available on our website.
 * 
 * Thank you for choosing IVY!
 * 
 * Best regards,
 * The IVY Team
 */

