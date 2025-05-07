const fs = require('fs');
const path = require('path');
const Superhero = require('../models/superhero.model');

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const superheroes = await Superhero.find().skip(skip).limit(limit);
    const totalSuperheroes = await Superhero.countDocuments();
    res.json({
      superheroes,
      totalPages: Math.ceil(totalSuperheroes / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const superhero = await Superhero.findById(req.params.id);
    if (!superhero) {
      return res.status(404).json({ message: 'Superhero not found' });
    }
    res.json(superhero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  const { nickname, real_name, origin_description, superpowers, catch_phrase } = req.body;
  const images = req.files?.map(file => `http://localhost:5000/uploads/${file.filename}`) || [];

  const superhero = new Superhero({
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images,
  });

  try {
    const newSuperhero = await superhero.save();
    res.status(201).json(newSuperhero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: "Not found" });

    Object.assign(hero, req.body);
    if (req.files && req.files.length > 0) {
      hero.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    }

    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const superhero = await Superhero.findByIdAndDelete(req.params.id);
    if (!superhero) {
      return res.status(404).json({ message: 'Superhero not found' });
    }

    res.json({ message: 'Superhero deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addImages = async (req, res) => {
  try {
    const superhero = await Superhero.findById(req.params.id);
    if (!superhero) return res.status(404).json({ message: "Superhero not found" });

    const newImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    superhero.images.push(...newImages);
    await superhero.save();

    res.json(superhero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const superhero = await Superhero.findById(req.params.id);
    if (!superhero) return res.status(404).json({ message: "Superhero not found" });

    superhero.images = superhero.images.filter(img => img !== imageUrl);
    await superhero.save();

    const filename = imageUrl.split('/uploads/')[1];
    if (filename) {
      const filePath = path.join(__dirname, '..', 'uploads', filename);

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          console.error("File not found:", filePath);
          return res.status(404).json({ message: "File not found" });
        }

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
            return res.status(500).json({ message: "Failed to delete image" });
          }

          res.json(superhero);
        });
      });
    } else {
      return res.status(400).json({ message: "Invalid image URL" });
    }
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  addImages,
  deleteImage
};
