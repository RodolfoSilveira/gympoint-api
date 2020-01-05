import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { registration, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula cancelada',
      template: 'cancellation',
      context: {
        student: student.name,
        plan: plan.title,
        duration: plan.duration,
        total: registration.price,
        start: registration.start_date,
        end: registration.end_date,
      },
    });
  }
}

export default new CancellationMail();
