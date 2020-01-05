import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async show(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      res.status(401).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      res.status(401).json({ error: 'Student not found' });
    }

    const parsedDate = new Date();

    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [subDays(parsedDate, 7), parsedDate],
        },
      },
    });

    if (checkins.length > 5) {
      return res.status(400).json({ error: 'Too much checkins' });
    }

    const checkin = await Checkin.create({ student_id: req.params.id });

    return res.json(checkin);
  }
}

export default new CheckinController();
