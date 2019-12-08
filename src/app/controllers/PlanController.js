import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plain = await Plan.findAll();
    return res.status(200).json(plain);
  }

  async store(req, res) {
    const plain = await Plan.create(req.body);
    return res.status(201).json(plain);
  }

  async update(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'plan not found!' });
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.status(201).json({
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json({ error: 'plan not found!' });
    }
    await plan.destroy();
    return res.status(204).json({ ok: 'ok' });
  }
}

export default new PlanController();
