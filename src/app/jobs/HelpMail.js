import Mail from '../../lib/Mail';

class HelpMail {
  get key() {
    return 'HelpMail';
  }

  async handle({ data }) {
    const {
      student,
      helpOrder: { question, answer, answer_at },
    } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Ajuda',
      template: 'help',
      context: {
        student: student.name,
        question,
        answer,
        answer_at,
      },
    });
  }
}

export default new HelpMail();
