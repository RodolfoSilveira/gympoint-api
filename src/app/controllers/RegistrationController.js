import { startOfMonth, addMonths } from 'date-fns';
import * as Yup from 'yup';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';
import RegistrationMail from '../jobs/RegistrationMail';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const registration = await Registration.findAll();

    res.json(registration);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { student_id, plan_id } = req.body;

    const plan = await Plan.findOne({
      where: {
        id: plan_id,
      },
    });

    if (!plan) {
      return res.status(401).json({ error: 'plano não encontrado' });
    }

    const student = await Student.findOne({
      where: {
        id: student_id,
      },
    });

    if (!student) {
      return res.status(401).json({ error: 'aluno não encontrado' });
    }

    const registrationDate = startOfMonth(new Date());

    const finallyRegistration = addMonths(registrationDate, plan.duration);

    const value = plan.price * plan.duration;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: registrationDate,
      end_date: finallyRegistration,
      price: value,
    });

    await Queue.add(RegistrationMail.key, {
      registration,
      student,
      plan,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'matricula não encontrada!' });
    }

    const { student_id, plan_id } = req.body;

    const plan = await Plan.findOne({
      where: {
        id: plan_id,
      },
    });

    if (!plan) {
      return res.status(401).json({ error: 'plano não encontrado' });
    }

    const student = await Student.findOne({
      where: {
        id: student_id,
      },
    });

    if (!student) {
      return res.status(401).json({ error: 'aluno não encontrado' });
    }

    const registrationDate = startOfMonth(new Date());

    const finallyRegistration = addMonths(registrationDate, plan.duration);

    const value = plan.price * plan.duration;

    const data = await registration.update({
      student_id,
      plan_id,
      start_date: registrationDate,
      end_date: finallyRegistration,
      price: value,
    });

    await Queue.add(RegistrationMail.key, {
      registration: data,
      student,
      plan,
    });

    return res.json(data);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'matricula não encontrada!' });
    }

    const plan = await Plan.findOne({
      where: {
        id: registration.plan_id,
      },
    });

    if (!plan) {
      return res.status(401).json({ error: 'plano não encontrado' });
    }

    const student = await Student.findOne({
      where: {
        id: registration.student_id,
      },
    });

    if (!student) {
      return res.status(401).json({ error: 'aluno não encontrado' });
    }

    await Queue.add(CancellationMail.key, {
      registration,
      student,
      plan,
    });

    await registration.destroy();

    return res.status(204).json({ ok: 'ok' });
  }
}

export default new RegistrationController();
