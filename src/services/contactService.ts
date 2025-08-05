import axios from 'axios';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(form: ContactForm) {
  const response = await axios.post('/api/contact', form);
  return response.data;
} 