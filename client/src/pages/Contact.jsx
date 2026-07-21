import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-20">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-tafach-dark">Contact Us</h1>
        <p className="text-lg text-tafach-muted">
          Have a question, feedback, or a recipe request? We'd love to hear from you.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-3">
        {/* Contact Info Sidebar */}
        <div className="flex flex-col gap-8 rounded-2xl bg-tafach-light p-8 lg:col-span-1 border border-tafach-border">
          <div>
            <h3 className="mb-2 text-lg font-bold text-tafach-dark">Email Us</h3>
            <p className="text-tafach-muted">support@recipelogo.com</p>
            <p className="text-tafach-muted">hello@recipelogo.com</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-bold text-tafach-dark">Follow Us</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-tafach-orange hover:underline">Instagram</a>
              <a href="#" className="text-tafach-orange hover:underline">Twitter / X</a>
              <a href="#" className="text-tafach-orange hover:underline">Pinterest</a>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-bold text-tafach-dark">Mailing Address</h3>
            <p className="text-tafach-muted">
              123 Culinary Lane<br />
              Food City, FC 90210
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-tafach-dark">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="tafach-input rounded-md border border-tafach-border px-4 py-2 text-sm focus:border-tafach-orange focus:outline-none"
                  placeholder="Chef Gordon"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-tafach-dark">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="tafach-input rounded-md border border-tafach-border px-4 py-2 text-sm focus:border-tafach-orange focus:outline-none"
                  placeholder="gordon@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm font-semibold text-tafach-dark">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="tafach-input rounded-md border border-tafach-border px-4 py-2 text-sm focus:border-tafach-orange focus:outline-none"
                placeholder="How do I submit my own recipe?"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-semibold text-tafach-dark">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="tafach-input resize-y rounded-md border border-tafach-border px-4 py-2 text-sm focus:border-tafach-orange focus:outline-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto self-start rounded-md bg-tafach-orange px-8 py-3 font-semibold text-white transition hover:bg-tafach-orange/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <div className="mt-2 rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200">
                Thank you! Your message has been sent successfully. We will get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}