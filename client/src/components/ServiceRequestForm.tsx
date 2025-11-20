import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { submitServiceRequest } from '@/services/api';

// Define the form schema with Zod
const formSchema = z.object({
  contactName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email address' }),
  contactPhone: z.string().min(1, { message: 'Phone number is required' }),
  currentCustomer: z.enum(['yes', 'no']),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  problem: z.string().min(10, { message: 'Please describe your problem in at least 10 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceRequestFormProps {
  onSuccess: () => void;
}

export function ServiceRequestForm({ onSuccess }: ServiceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      currentCustomer: 'no',
      subject: '',
      problem: '',
    },
  });

  // Load reCAPTCHA v2 script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaLoaded(true);
      document.body.appendChild(script);

      return () => document.body.removeChild(script);
    } else {
      setRecaptchaLoaded(true);
    }
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await submitServiceRequest({
        ...data,
        recaptchaToken,
      });

      if (response.success) {
        toast.success('Service request submitted successfully!');
        reset();
        setRecaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        onSuccess();
      } else {
        throw new Error(response.message || 'Failed to submit service request');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formInputClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const formLabelClasses = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClasses = 'mt-1 text-sm text-red-600';

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Service Request</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className={formLabelClasses}>Full Name *</label>
            <input id="contactName" type="text" className={`${formInputClasses} ${errors.contactName ? 'border-red-500' : ''}`} {...register('contactName')} disabled={isSubmitting} />
            {errors.contactName && <p className={errorClasses}>{errors.contactName.message}</p>}
          </div>

          <div>
            <label htmlFor="contactEmail" className={formLabelClasses}>Email *</label>
            <input id="contactEmail" type="email" className={`${formInputClasses} ${errors.contactEmail ? 'border-red-500' : ''}`} {...register('contactEmail')} disabled={isSubmitting} />
            {errors.contactEmail && <p className={errorClasses}>{errors.contactEmail.message}</p>}
          </div>

          <div>
            <label htmlFor="contactPhone" className={formLabelClasses}>Phone Number *</label>
            <input id="contactPhone" type="tel" className={`${formInputClasses} ${errors.contactPhone ? 'border-red-500' : ''}`} {...register('contactPhone')} disabled={isSubmitting} />
            {errors.contactPhone && <p className={errorClasses}>{errors.contactPhone.message}</p>}
          </div>

          <div>
            <p className={formLabelClasses}>Are you an existing customer? *</p>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center space-x-2">
                <input type="radio" value="yes" {...register('currentCustomer')} disabled={isSubmitting} />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" value="no" {...register('currentCustomer')} disabled={isSubmitting} />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="subject" className={formLabelClasses}>Subject *</label>
          <input id="subject" type="text" className={`${formInputClasses} ${errors.subject ? 'border-red-500' : ''}`} {...register('subject')} disabled={isSubmitting} />
          {errors.subject && <p className={errorClasses}>{errors.subject.message}</p>}
        </div>

        <div>
          <label htmlFor="problem" className={formLabelClasses}>Message *</label>
          <textarea id="problem" className={`${formInputClasses} min-h-[120px] ${errors.problem ? 'border-red-500' : ''}`} {...register('problem')} disabled={isSubmitting} />
          {errors.problem && <p className={errorClasses}>{errors.problem.message}</p>}
        </div>

        {/* reCAPTCHA v2 */}
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
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
