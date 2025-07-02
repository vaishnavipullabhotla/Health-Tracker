import React, { useState } from 'react';
import '../../styles/components/contact.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ firstName: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-header">
        <h1>Contact Us</h1>
      </div>
      <div className="contact-content">
        <div className="contact-form-wrapper">
          <div className="contact-image-container">
            <img src="/assets/images/contact.jpg" alt="Contact Illustration" className="contact-illustration" />
          </div>
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <div className="input-wrapper">
                
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="contact-form-group">
                <div className="input-wrapper">
                
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Type email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="contact-form-group">
                <div className="input-wrapper">
                 
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="contact-btn-primary">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;