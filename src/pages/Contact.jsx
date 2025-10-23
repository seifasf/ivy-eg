import React, { useState } from 'react'
import { HiUser, HiMail, HiPencil, HiPhone, HiLocationMarker, HiClock, HiCheckCircle } from 'react-icons/hi'
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Here you would typically send the form data to a server
      console.log('Form submitted:', formData)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }, 4000)
    }
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="contact-main">
        <div className="contact-grid">
          <div className="contact-info-section">
            <h2 className="info-section-title">Contact Information</h2>
            <p className="info-section-text">
              Have questions or want to work together? We're here to help and answer any questions you might have.
            </p>

            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="info-icon-wrapper">
                  <HiMail size={24} />
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <a href="mailto:ivyforhelp@gmail.com">ivyforhelp@gmail.com</a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon-wrapper">
                  <HiPhone size={24} />
                </div>
                <div className="info-content">
                  <h4>Phone</h4>
                  <a href="tel:+201012345678">+20 (10) 1234-5678</a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon-wrapper">
                  <HiLocationMarker size={24} />
                </div>
                <div className="info-content">
                  <h4>Location</h4>
                  <p>Cairo, Egypt</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon-wrapper">
                  <HiClock size={24} />
                </div>
                <div className="info-content">
                  <h4>Business Hours</h4>
                  <p>Sun - Thu: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="social-section">
              <h4 className="social-title">Follow Us</h4>
              <div className="social-links-grid">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link-item">
                  <FaInstagram size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link-item">
                  <FaTwitter size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link-item">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            {submitted ? (
              <div className="success-notification">
                <div className="success-icon-wrapper">
                  <HiCheckCircle size={60} />
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="contact-form-modern" onSubmit={handleSubmit}>
                <h3 className="form-title">Send Us a Message</h3>

                <div className="form-group-modern">
                  <label htmlFor="name" className="form-label-modern">
                    <HiUser size={18} />
                    <span>Your Name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input-modern ${errors.name ? 'error' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group-modern">
                  <label htmlFor="email" className="form-label-modern">
                    <HiMail size={18} />
                    <span>Your Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input-modern ${errors.email ? 'error' : ''}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group-modern">
                  <label htmlFor="subject" className="form-label-modern">
                    <HiPencil size={18} />
                    <span>Subject</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`form-input-modern ${errors.subject ? 'error' : ''}`}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>

                <div className="form-group-modern">
                  <label htmlFor="message" className="form-label-modern">
                    <HiPencil size={18} />
                    <span>Message</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-textarea-modern ${errors.message ? 'error' : ''}`}
                    placeholder="Tell us more about your inquiry..."
                    rows="5"
                  ></textarea>
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <button type="submit" className="submit-button-modern">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
