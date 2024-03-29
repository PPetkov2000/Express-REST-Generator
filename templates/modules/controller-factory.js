module.exports = `module.exports = function (model) {
  function getAll(req, res, next) {
    return model
      .find()
      .then((docs) => res.json(docs))
      .catch(next);
  }

  function getOne(req, res, next) {
    return model
      .findById(req.params.id || req.user._id)
      .then((doc) => res.json(doc))
      .catch(next);
  }

  function createOne(req, res, next) {
    return model
      .create(req.body)
      .then((doc) => res.status(201).json(doc))
      .catch(next);
  }

  function updateOne(req, res, next) {
    return model
      .updateOne({ _id: req.params.id || req.user._id }, req.body, { runValidators: true })
      .then(() => res.status(200).json({ message: "Updated successfully!" }))
      .catch(next);
  }

  function deleteOne(req, res, next) {
    return model
      .findOneAndDelete({ _id: req.params.id })
      .then(() => res.json({ message: "Deleted successfully!" }))
      .catch(next);
  }

  function createOneWithRelations(relationModel, relationDoc) {
    return function (req, res, next) {
      model
        .create({ ...req.body, creatorId: req.user._id })
        .then((createdDoc) => {
          return Promise.all([
            createdDoc,
            relationModel.updateOne(
              { _id: req.user._id },
              { $push: { [relationDoc]: createdDoc._id } }
              { runValidators: true }
            ),
          ]);
        })
        .then(([createdDoc, _]) => res.status(201).json(createdDoc))
        .catch(next);
    };
  }

  function deleteOneWithRelations(relationModel, relationDoc) {
    return function (req, res, next) {
      model
        .deleteOne({ _id: req.params.id })
        .then(() => {
          return relationModel.updateOne(
            { _id: req.user._id },
            { $pull: { [relationDoc]: req.params.id } }
            { runValidators: true }
          );
        })
        .then(() => res.json({ message: "Deleted successfully!" }))
        .catch(next);
    };
  }

  function getAllDocuments(options = {}) {
    return function (req, res, next) {
      model
        .find()
        .populate(options.populate || null)
        .sort(options.sort || null)
        .limit(options.limit || null)
        .then((doc) => res.json(doc))
        .catch(next);
    };
  }

  function getOneDocument(options = {}) {
    return function (req, res, next) {
      model
        .findById(req.params.id || req.user._id)
        .populate(options.populate || null)
        .select(options.select || null)
        .then((doc) => res.json(doc))
        .catch(next);
    };
  }

  return {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    createOneWithRelations,
    deleteOneWithRelations,
    getAllDocuments,
    getOneDocument,
  };
};
`
