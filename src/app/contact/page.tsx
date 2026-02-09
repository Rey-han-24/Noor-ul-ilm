/**
 * Contact Page
 * 
 * Contact form and information for Noor ul Ilm
 * Styled with royal black & gold theme
 * 
 * @module app/contact
 */

import { Metadata } from 'next';
import Header from '@/frontend/components/Header';
import Footer from '@/frontend/components/Footer';

export const metadata: Metadata = {
  title: 'Contact Us | Noor ul Ilm',
  description: 'Get in touch with the Noor ul Ilm team. We welcome your questions, feedback, and suggestions about our Quran and Hadith resources.',
  openGraph: {
    title: 'Contact Us | Noor ul Ilm',
    description: 'Get in touch with the Noor ul Ilm team.',
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-[var(--gold)]/5 to-transparent">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-4 py-1 bg-[var(--gold)]/10 rounded-full border border-[var(--gold)]/20 mb-6">
                <span className="text-[var(--gold)] text-sm font-medium">Get In Touch</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
                Contact <span className="text-[var(--gold)]">Noor ul Ilm</span>
              </h1>
              <p className="text-lg text-[var(--foreground-muted)]">
                We value your feedback and are here to assist you on your journey of Islamic knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <span className="text-[var(--gold)]">✦</span> Send a Message
                </h2>
                
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="content">Content Suggestion</option>
                      <option value="technical">Technical Issue</option>
                      <option value="donation">Donation Question</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black font-bold rounded-lg hover:from-amber-500 hover:to-[var(--gold)] transition-all duration-300 shadow-lg shadow-[var(--gold)]/20"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Quick Contact */}
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                    <span className="text-[var(--gold)]">✦</span> Quick Contact
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] flex-shrink-0">
                        📧
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--foreground)]">Email</h3>
                        <p className="text-[var(--foreground-muted)]">contact@noorulilm.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] flex-shrink-0">
                        🌐
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--foreground)]">Social Media</h3>
                        <p className="text-[var(--foreground-muted)]">Follow us for updates</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                    <span className="text-[var(--gold)]">✦</span> FAQ
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="border-b border-[var(--card-border)] pb-4">
                      <h3 className="font-medium text-[var(--foreground)] mb-2">
                        How can I report an error in the content?
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Use the contact form above and select &quot;Content Suggestion&quot; as the subject. Include the specific reference.
                      </p>
                    </div>
                    
                    <div className="border-b border-[var(--card-border)] pb-4">
                      <h3 className="font-medium text-[var(--foreground)] mb-2">
                        Can I request new features?
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Absolutely! We welcome all suggestions. Send us your ideas through the contact form.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-[var(--foreground)] mb-2">
                        How can I contribute to the project?
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Visit our <a href="/donate" className="text-[var(--gold)] hover:underline">Donate page</a> or reach out about volunteer opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Islamic Quote */}
                <div className="bg-gradient-to-br from-[var(--gold)]/10 to-transparent rounded-2xl border border-[var(--gold)]/20 p-6 text-center">
                  <p className="text-lg text-[var(--foreground)] italic mb-3">
                    &quot;Whoever follows a path in pursuit of knowledge, Allah will make a path to Paradise easy for him.&quot;
                  </p>
                  <p className="text-sm text-[var(--gold)]">— Sahih Muslim</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
