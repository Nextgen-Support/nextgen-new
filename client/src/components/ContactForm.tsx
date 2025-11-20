import { Send } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from 'sonner';
import { submitContactForm, type ContactFormData } from '@/services/api';

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  /* ---------------------- Load & Render reCAPTCHA v2 ---------------------- */
  useEffect(() => {
    const scriptId = "recaptcha-v2-script";

    // Define global callback first
    (window as any).onRecaptchaLoad = () => {
      if (window.grecaptcha && recaptchaRef.current) {
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
          callback: (token: string) => setRecaptchaToken(token),
          "expired-callback": () => setRecaptchaToken(null),
        });
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // If script already exists, manually call the callback
      (window as any).onRecaptchaLoad();
    }
  }, []);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent any parent form submission or navigation
    if (e && e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }

    if (!form.current) {
      toast.error('Form reference is missing');
      return false;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate the form
      if (!form.current.checkValidity()) {
        form.current.reportValidity();
        return;
      }

      const formData = new FormData(form.current);
      
      // Prepare form data according to API requirements
      const formValues: ContactFormData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        _subject: "New contact form submission",
        _autoresponse: "Thank you for contacting us! We will get back to you soon.",
        recaptchaToken, 
      };
      
      // Send form data to our API
      const result = await submitContactForm(formValues);
      
      // if (!result.success) {
      //   throw new Error(result.message || 'Failed to send message');
      // }

      if (result.success) {
        toast.success('Message sent successfully!');
        setRecaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        // onSuccess();
        // toast.success('Message sent successfully!');
        form.current?.reset();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }

      

      // Reset reCAPTCHA after success
      setRecaptchaToken(null);
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full px-4 sm:px-6">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
          <form 
            ref={form}
            onSubmit={sendEmail}
            className="space-y-6 w-full"
            noValidate
          >
            <input type="hidden" name="_captcha" value="false" />
            {/* Contact Information */}
            <div className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="w-full">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 text-base bg-gray-700 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 text-base bg-gray-700 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 text-base bg-gray-700 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="w-full">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 text-base bg-gray-700 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                required
                placeholder="Enter subject"
              />
            </div>

            {/* Message */}
            <div className="w-full">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-6 py-5 text-base bg-gray-700 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                required
                placeholder="Please enter your message..."
              ></textarea>
            </div>

            {/* reCAPTCHA v2
            <div className="mb-4">
              {recaptchaLoaded ? (
                <div
                  ref={recaptchaRef}
                  className="g-recaptcha"
                  data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  data-callback={(token: string) => setRecaptchaToken(token)}
                  data-expired-callback={() => setRecaptchaToken(null)}
                />
              ) : (
                <p className="text-sm text-yellow-600">Loading reCAPTCHA...</p>
              )}
            </div> */}
            {/* reCAPTCHA v2 */}
            <div className="w-full max-w-4xl mx-auto mb-4">
              <div ref={recaptchaRef}></div>
              {recaptchaToken && <p className="text-green-500 mt-2">reCAPTCHA verified!</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-start pt-2 w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-medium rounded-md flex items-center justify-center space-x-2 transition-colors text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
