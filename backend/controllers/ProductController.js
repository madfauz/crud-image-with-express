import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    // mengambil semua data di database
    const response = await Product.findAll();
    // mengirim response berupa json
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    // mengambil data sesuai id request
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveProduct = (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
  const name = req.body.title;
  const file = req.files.file;
  const fileSize = file.data.length;
  // mengambil extension dari file yang akan di upload
  const ext = path.extname(file.name);
  // mengconvert nama file yang akan di upload menjadi md5
  const fileName = file.md5 + ext;
  // membuat url yang akan disimpan ke database
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  // membuat type data file yang diizinkan
  const allowedType = [".png", ".jpg", ".jpeg"];

  // kondisi jika extension tidak sesuai
  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid type data image" });
  // kondisi jika size file terlalu besar (disini max 5 MB dalam bit)
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

  // menyimpan file images kedalam folder ./public/images
  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      // menyimpan data inputan beserta file image ke database
      await Product.create({ name: name, image: fileName, url: url });
      res.status(201).json({ msg: "Product Creates Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No Data Found" });
  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    // mengambil extension dari file yang akan di upload
    const ext = path.extname(file.name);
    // mengconvert nama file yang akan di upload menjadi md5
    fileName = file.md5 + ext;

    const allowedType = [".png", ".jpg", ".jpeg"];
    // kondisi jika extension tidak sesuai
    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid type data image" });
    // kondisi jika size file terlalu besar (disini max 5 MB dalam bit)
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${product.image}`;
    // menghapus image lama sesuai id dari directory public/images
    fs.unlinkSync(filepath);

    // menyimpan file images baru kedalam folder ./public/images
    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const name = req.body.title;
  // membuat url yang akan disimpan ke database
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  try {
    // mengupdate data di database berdasarkan id
    await Product.update(
      { name: name, image: fileName, url: url },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({ msg: "Product Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No Data Found" });
  try {
    const filepath = `./public/images/${product.image}`;
    // menghapus image sesuai id dari directory public/images
    fs.unlinkSync(filepath);
    // menghapus data sesuai id dari database
    await Product.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ msg: "Product Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
