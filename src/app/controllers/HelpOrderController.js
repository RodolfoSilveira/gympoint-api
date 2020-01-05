import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import HelpMail from '../jobs/HelpMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async index(req, res) {
    const helpOrder = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      res.status(401).json({ error: 'Student not found' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      student_id: req.params.id,
      question,
    });

    return res.json(helpOrder);
  }

  async show(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      res.status(401).json({ error: 'Student not found' });
    }

    const helpOrder = await HelpOrder.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(helpOrder);
  }

  async update(req, res) {
    const helpOrder = await HelpOrder.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(401).json({ error: 'Question not found' });
    }

    const parseDate = new Date();

    const data = await helpOrder.update({
      answer: req.body.answer,
      answer_at: parseDate,
    });

    await Queue.add(HelpMail.key, {
      student: helpOrder.student,
      helpOrder,
    });

    return res.json({
      data
    });
  }
}

export default new HelpOrderController();
