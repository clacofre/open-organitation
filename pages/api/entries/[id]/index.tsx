import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { db } from "../../../../database";
import { Entry, IEntry } from "../../../../models";

type Data = { message: string;} | IEntry ;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  switch (req.method) {
    case "GET":
      return getEntryByID(req, res);
    case "PUT":
      return updateEntry(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
/* ACA TENGO EJEMPLOS DE COMO MANEJAR SOLICITUDES CON DIFERENTES METODOS */
const getEntryByID = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  db.connect();
  Entry.findById(id)
    .then((entry) => {
      if (!entry) {
        res.status(404).json({ message: "Entry not found" });
      } else {
        res.status(200).json(entry);
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    })
    .finally(() => db.disconnect());
}


const updateEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  await db.connect();
  const entryToUpdate = await Entry.findById(id);
  if (!entryToUpdate) {
    await db.disconnect();
    return res.status(404).json({ message: "Entry not found" });
  }
  const {
    description = entryToUpdate.description,
    status = entryToUpdate.status,
  } = req.body;
  try {
    const updatedEntry = await Entry.findByIdAndUpdate( id, {description, status}, {runValidators: true, new: true});
    res.status(200).json(updatedEntry!);
  } catch (error) {
    await db.disconnect();
    res.status(400).json({ message: JSON.stringify(`Bad request ${error}`) });
  }
   
};
