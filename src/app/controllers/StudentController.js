import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .max(100),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    try {
      const student = await Student.create(req.body);

      return res.status(201).json(student);
    } catch (err) {
      return res.status(400).json({ error: 'dont create student' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .max(100),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) {
        return res.status(400).json({ error: 'user not found!' });
      }

      const { name, email, age, weight, height } = await student.update(
        req.body
      );

      return res.status(201).json({
        name,
        email,
        age,
        weight,
        height,
      });
    } catch (error) {
      return res.status(400).json({ error: 'Dont update user!' });
    }
  }
}

export default new StudentController();
